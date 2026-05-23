from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter
from sqlalchemy import select, update

from app.api.deps import DB, CurrentUser
from app.models.notification import Notification

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/")
async def list_notifications(db: DB, current_user: CurrentUser) -> list[dict]:
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
    )
    notifs = result.scalars().all()
    return [
        {
            "id": str(n.id),
            "type": n.type.value,
            "title": n.title,
            "body": n.body,
            "payload": n.payload,
            "read_at": n.read_at.isoformat() if n.read_at else None,
            "created_at": n.created_at.isoformat(),
        }
        for n in notifs
    ]


@router.patch("/{notification_id}/read")
async def mark_read(notification_id: UUID, db: DB, current_user: CurrentUser) -> dict:
    await db.execute(
        update(Notification)
        .where(Notification.id == notification_id, Notification.user_id == current_user.id)
        .values(read_at=datetime.now(timezone.utc))
    )
    return {"ok": True}


@router.post("/read-all")
async def mark_all_read(db: DB, current_user: CurrentUser) -> dict:
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id, Notification.read_at.is_(None))
        .values(read_at=datetime.now(timezone.utc))
    )
    return {"ok": True}
