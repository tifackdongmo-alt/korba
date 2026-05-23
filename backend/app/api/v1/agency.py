from fastapi import APIRouter, HTTPException
from sqlalchemy import select, func

from app.api.deps import DB, CurrentUser
from app.models.agency import Agency
from app.models.delivery import CourierProfile, Assignment
from app.models.order import Order, OrderStatus
from app.models.user import UserRole

router = APIRouter(prefix="/agency", tags=["agency"])


@router.get("/stats")
async def agency_stats(db: DB, current_user: CurrentUser) -> dict:
    if current_user.role not in (UserRole.AGENCY, UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Réservé aux agences")

    # Trouver l'agence de cet utilisateur
    result = await db.execute(select(Agency).where(Agency.owner_id == current_user.id))
    agency = result.scalar_one_or_none()
    if not agency:
        return {"deliveries_today": 0, "success_rate": 0.0, "couriers_online": 0, "couriers_total": 0}

    # Livreurs de l'agence
    couriers_result = await db.execute(
        select(func.count(CourierProfile.id)).where(CourierProfile.agency_id == agency.id)
    )
    couriers_total = int(couriers_result.scalar() or 0)

    online_result = await db.execute(
        select(func.count(CourierProfile.id)).where(
            CourierProfile.agency_id == agency.id,
            CourierProfile.is_online.is_(True),
        )
    )
    couriers_online = int(online_result.scalar() or 0)

    # Livraisons du jour (simplifiée)
    deliveries_result = await db.execute(
        select(func.count(Assignment.id)).where(Assignment.status == "accepted")
    )
    deliveries_today = int(deliveries_result.scalar() or 0)

    # Taux de succès
    success_result = await db.execute(
        select(func.count(Order.id)).where(Order.status == OrderStatus.TERMINEE)
    )
    total_result = await db.execute(
        select(func.count(Order.id)).where(
            Order.status.in_([OrderStatus.TERMINEE, OrderStatus.LITIGE, OrderStatus.REMBOURSEE])
        )
    )
    success = int(success_result.scalar() or 0)
    total = int(total_result.scalar() or 1)
    success_rate = round(success / total * 100, 1)

    return {
        "deliveries_today": deliveries_today,
        "success_rate": success_rate,
        "couriers_online": couriers_online,
        "couriers_total": couriers_total,
    }


@router.get("/couriers")
async def list_couriers(db: DB, current_user: CurrentUser) -> list[dict]:
    if current_user.role not in (UserRole.AGENCY, UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Réservé aux agences")

    result = await db.execute(select(Agency).where(Agency.owner_id == current_user.id))
    agency = result.scalar_one_or_none()
    if not agency:
        return []

    profiles = await db.execute(
        select(CourierProfile).where(CourierProfile.agency_id == agency.id)
    )
    return [
        {
            "user_id": str(p.user_id),
            "vehicle_type": p.vehicle_type,
            "is_online": p.is_online,
            "acceptance_rate": p.acceptance_rate,
            "success_rate": p.success_rate,
            "total_deliveries": p.total_deliveries,
        }
        for p in profiles.scalars().all()
    ]
