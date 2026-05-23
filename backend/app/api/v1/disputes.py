from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select

from app.api.deps import DB, CurrentUser
from app.models.dispute import Dispute, DisputeReason, DisputeStatus
from app.models.order import Order, OrderStatus
from app.services.state_machine import transition

router = APIRouter(prefix="/disputes", tags=["disputes"])


class DisputeCreate(BaseModel):
    order_id: UUID
    reason: DisputeReason
    description: str


class DisputeResolve(BaseModel):
    resolution: str
    refund: bool = False


@router.post("/", status_code=status.HTTP_201_CREATED)
async def open_dispute(body: DisputeCreate, db: DB, current_user: CurrentUser) -> dict:
    result = await db.execute(select(Order).where(Order.id == body.order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès refusé")

    try:
        await transition(order, OrderStatus.LITIGE)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    dispute = Dispute(
        order_id=body.order_id,
        opened_by_id=current_user.id,
        reason=body.reason,
        description=body.description,
    )
    db.add(dispute)
    await db.flush()
    return {"id": str(dispute.id), "status": dispute.status.value}


@router.post("/{dispute_id}/resolve")
async def resolve_dispute(dispute_id: UUID, body: DisputeResolve, db: DB, current_user: CurrentUser) -> dict:
    from app.models.user import UserRole
    if current_user.role not in (UserRole.AGENCY, UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Réservé aux agences et admins")

    result = await db.execute(
        select(Dispute).where(Dispute.id == dispute_id)
    )
    dispute = result.scalar_one_or_none()
    if not dispute:
        raise HTTPException(status_code=404, detail="Litige introuvable")

    dispute.status = DisputeStatus.RESOLU
    dispute.resolved_by_id = current_user.id
    dispute.resolution = body.resolution

    order_result = await db.execute(select(Order).where(Order.id == dispute.order_id))
    order = order_result.scalar_one()
    target = OrderStatus.REMBOURSEE if body.refund else OrderStatus.TERMINEE
    await transition(order, target)

    return {"status": dispute.status.value, "order_status": order.status.value}
