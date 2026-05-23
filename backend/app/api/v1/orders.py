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
from app.services.escrow import initiate_orange_money, initiate_wave, release_escrow

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


class StatusUpdate(BaseModel):
    status: str


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_order(body: OrderCreate, db: DB, current_user: CurrentUser) -> dict:
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
        total += product.price_centimes * item_in.quantity
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

    return {"id": str(order.id), "status": order.status.value, "total_centimes": order.total_centimes}


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

    # Transition vers A_PREPARER
    await transition(order, OrderStatus.A_PREPARER)
    await redis.publish(f"order:{order_id}", f"status:{OrderStatus.A_PREPARER.value}")

    return {"redirect_url": pay_data.get("redirect_url"), "escrow_ref": pay_data["escrow_ref"]}


@router.post("/{order_id}/status")
async def update_order_status(order_id: UUID, body: StatusUpdate, db: DB, redis: Redis, current_user: CurrentUser) -> dict:
    from app.models.vendor import Vendor
    from app.services.notifications import notify_status_change

    result = await db.execute(
        select(Order).options(joinedload(Order.delivery), joinedload(Order.vendor)).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")

    try:
        new_status = OrderStatus(body.status)
        await transition(order, new_status)
    except (ValueError, InvalidTransitionError) as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Récupérer l'owner du vendor pour notifier
    vendor_owner_id = order.vendor.owner_id if order.vendor else None
    driver_id = order.delivery.courier_id if order.delivery else None

    if vendor_owner_id:
        await notify_status_change(
            db, redis, new_status,
            client_id=order.client_id,
            vendor_owner_id=vendor_owner_id,
            driver_id=driver_id,
            order_id=order.id,
        )

    await redis.publish(f"order:{order_id}", f"status:{new_status.value}")
    return {"status": order.status.value}


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

    if order.payment:
        await release_escrow(order.payment)
        order.payment.status = PaymentStatus.RELEASED

    await transition(order, OrderStatus.TERMINEE)
    await redis.publish(f"order:{order_id}", f"status:{OrderStatus.TERMINEE.value}")
    return {"status": order.status.value}


@router.get("/{order_id}")
async def get_order(order_id: UUID, db: DB, current_user: CurrentUser) -> dict:
    result = await db.execute(
        select(Order).options(joinedload(Order.items)).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    return {
        "id": str(order.id),
        "status": order.status.value,
        "total_centimes": order.total_centimes,
        "delivery_fee_centimes": order.delivery_fee_centimes,
        "service_fee_centimes": order.service_fee_centimes,
        "delivery_address": order.delivery_address,
        "notes": order.notes,
        "items": [
            {"product_name": i.product_name, "quantity": i.quantity, "unit_price_centimes": i.unit_price_centimes}
            for i in order.items
        ],
    }


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
    return [
        {"id": str(o.id), "status": o.status.value, "total_centimes": o.total_centimes, "created_at": o.created_at.isoformat()}
        for o in result.scalars().all()
    ]
