from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select

from app.api.deps import DB, CurrentUser
from app.models.vendor import Vendor
from app.models.user import UserRole

router = APIRouter(prefix="/vendors", tags=["vendors"])


class VendorCreate(BaseModel):
    name: str
    address: str
    city: str
    description: str | None = None


class VendorResponse(BaseModel):
    id: str
    name: str
    address: str
    city: str
    description: str | None
    logo_url: str | None
    rating: float
    rating_count: int

    model_config = {"from_attributes": True}


@router.get("/")
async def list_vendors(db: DB, city: str | None = None) -> list[dict]:
    stmt = select(Vendor).where(Vendor.is_active.is_(True))
    if city:
        stmt = stmt.where(Vendor.city.ilike(f"%{city}%"))
    result = await db.execute(stmt.limit(50))
    vendors = result.scalars().all()
    return [
        {
            "id": str(v.id),
            "name": v.name,
            "city": v.city,
            "address": v.address,
            "rating": v.rating,
            "rating_count": v.rating_count,
            "logo_url": v.logo_url,
        }
        for v in vendors
    ]


@router.get("/{vendor_id}")
async def get_vendor(vendor_id: UUID, db: DB) -> dict:
    result = await db.execute(select(Vendor).where(Vendor.id == vendor_id))
    vendor = result.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendeur introuvable")
    return {
        "id": str(vendor.id),
        "name": vendor.name,
        "city": vendor.city,
        "address": vendor.address,
        "rating": vendor.rating,
        "rating_count": vendor.rating_count,
        "logo_url": vendor.logo_url,
        "description": vendor.description,
    }


@router.post("/", status_code=201)
async def create_vendor(body: VendorCreate, db: DB, current_user: CurrentUser) -> dict:
    if current_user.role != UserRole.VENDOR:
        raise HTTPException(status_code=403, detail="Réservé aux vendeurs")
    vendor = Vendor(owner_id=current_user.id, **body.model_dump())
    db.add(vendor)
    await db.flush()
    return {"id": str(vendor.id), "name": vendor.name}


@router.patch("/{vendor_id}/status")
async def update_order_status(
    vendor_id: UUID,
    body: dict,
    db: DB,
    current_user: CurrentUser,
) -> dict:
    """Vendeur marque la commande comme prête."""
    from app.models.order import Order, OrderStatus
    from app.services.state_machine import transition, InvalidTransitionError
    from sqlalchemy import select as sel
    import redis.asyncio as aioredis
    from app.config import settings

    order_id = body.get("order_id")
    if not order_id:
        raise HTTPException(status_code=400, detail="order_id requis")

    result = await db.execute(sel(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")

    try:
        await transition(order, OrderStatus.PRETE)
    except InvalidTransitionError as e:
        raise HTTPException(status_code=400, detail=str(e))

    redis_client = aioredis.from_url(settings.REDIS_URL)
    await redis_client.publish(f"order:{order_id}", f"status:{OrderStatus.PRETE.value}")
    await redis_client.aclose()

    return {"status": order.status.value}
