from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.api.deps import DB, Redis, CurrentUser
from app.models.order import Order, OrderItem, OrderStatus
from app.models.payment import Payment, PaymentProvider, PaymentStatus
from app.models.product import Product
from app.services.state_machine import transition, InvalidTransitionError
from app.services.escrow import initiate_orange_money, initiate_wave

router = APIRouter(prefix="/orders", tags=["orders"])


class OrderItemInput(BaseModel):
    product_id: UUID
    quantity: int


class OrderCreate(BaseModel):
    vendor_id: UUID
    items: list[OrderItemInput]
    delivery_address: str
    notes: str | None = None


class PayRequest(BaseModel):
    provider: PaymentProvider
    phone: str


class OrderResponse(BaseModel):
    id: str
    status: str
    total_centimes: int
    delivery_fee_centimes: int
    service_fee_centimes: int
    delivery_address: str
    notes: str | None

    model_config = {"from_attributes": True}


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(body: OrderCreate, db: DB, current_user: CurrentUser) -> OrderResponse:
    # Charger les produits
    product_ids = [i.product_id for i in body.items]
    result = await db.execute(select(Product).where(Product.id.in_(product_ids)))
    products = {p.id: p for p in result.scalars().all()}

    total = 0
    items = []
    for item_in in body.items:
        product = products.get(item_in.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Produit {item_in.product_id} introuvable")
        if product.stock < item_in.quantity:
            raise HTTPException(status_code=400, detail=f"Stock insuffisant pour {product.name}")
        subtotal = product.price_centimes * item_in.quantity
        total += subtotal
        items.append(
            OrderItem(
                product_id=product.id,
                quantity=item_in.quantity,
                unit_price_centimes=product.price_centimes,
                product_name=product.name,
            )
        )
        product.stock -= item_in.quantity

    order = Order(
        client_id=current_user.id,
        vendor_id=body.vendor_id,
        total_centimes=total,
        delivery_address=body.delivery_address,
        notes=body.notes,
    )
    db.add(order)
    await db.flush()
    for it in items:
        it.order_id = order.id
        db.add(it)

    return OrderResponse.model_validate(order)


@router.post("/{order_id}/pay")
async def pay_order(order_id: UUID, body: PayRequest, db: DB, redis: Redis, current_user: CurrentUser) -> dict:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès refusé")

    amount = order.total_centimes + order.delivery_fee_centimes + order.service_fee_centimes
    if body.provider == PaymentProvider.ORANGE_MONEY:
        pay_data = await initiate_orange_money(order.id, amount, body.phone)
    else:
        pay_data = await initiate_wave(order.id, amount, body.phone)

    payment = Payment(
        order_id=order.id,
        provider=body.provider,
        amount_centimes=amount,
        escrow_ref=pay_data["escrow_ref"],
        status=PaymentStatus.PENDING,
    )
    db.add(payment)
    order.escrow_ref = pay_data["escrow_ref"]

    return {"redirect_url": pay_data["redirect_url"], "escrow_ref": pay_data["escrow_ref"]}


@router.post("/{order_id}/validate")
async def validate_order(order_id: UUID, db: DB, redis: Redis, current_user: CurrentUser) -> dict:
    result = await db.execute(
        select(Order).options(joinedload(Order.payment)).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès refusé")

    try:
        await transition(order, OrderStatus.VALIDEE)
    except InvalidTransitionError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Libérer l'escrow
    if order.payment:
        from app.services.escrow import release_escrow
        await release_escrow(order.payment)
        order.payment.status = PaymentStatus.RELEASED

    await redis.publish(f"order:{order_id}", f"status:{OrderStatus.VALIDEE.value}")
    return {"status": order.status.value}


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: UUID, db: DB, current_user: CurrentUser) -> OrderResponse:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    return OrderResponse.model_validate(order)


@router.get("/")
async def list_orders(db: DB, current_user: CurrentUser) -> list[dict]:
    stmt = select(Order)
    from app.models.user import UserRole
    if current_user.role == UserRole.CLIENT:
        stmt = stmt.where(Order.client_id == current_user.id)
    elif current_user.role == UserRole.VENDOR:
        from app.models.vendor import Vendor
        vr = await db.execute(select(Vendor).where(Vendor.owner_id == current_user.id))
        vendor = vr.scalar_one_or_none()
        if vendor:
            stmt = stmt.where(Order.vendor_id == vendor.id)

    result = await db.execute(stmt.order_by(Order.created_at.desc()).limit(50))
    orders = result.scalars().all()
    return [{"id": str(o.id), "status": o.status.value, "total_centimes": o.total_centimes} for o in orders]
