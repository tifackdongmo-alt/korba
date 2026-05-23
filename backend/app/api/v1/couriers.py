from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select

from app.api.deps import DB, Redis, CurrentUser
from app.models.delivery import CourierProfile, CourierLocation
from app.models.user import UserRole

router = APIRouter(prefix="/couriers", tags=["couriers"])


class LocationUpdate(BaseModel):
    lat: float
    lng: float
    bearing: float | None = None
    speed_kmh: float | None = None


class AssignmentResponse(BaseModel):
    delivery_id: str
    accept: bool


@router.patch("/location")
async def update_location(body: LocationUpdate, db: DB, redis: Redis, current_user: CurrentUser) -> dict:
    if current_user.role != UserRole.DRIVER:
        raise HTTPException(status_code=403, detail="Réservé aux livreurs")

    location = CourierLocation(
        courier_id=current_user.id,
        position=f"SRID=4326;POINT({body.lng} {body.lat})",
        bearing=body.bearing,
        speed_kmh=body.speed_kmh,
        recorded_at=datetime.now(timezone.utc),
    )
    db.add(location)

    # Publier sur Redis pour Socket.io
    import json
    payload = json.dumps(
        {"courier_id": str(current_user.id), "lat": body.lat, "lng": body.lng, "bearing": body.bearing}
    )
    await redis.publish(f"location:{current_user.id}", payload)
    return {"ok": True}


@router.post("/online")
async def go_online(db: DB, current_user: CurrentUser) -> dict:
    if current_user.role != UserRole.DRIVER:
        raise HTTPException(status_code=403, detail="Réservé aux livreurs")
    result = await db.execute(select(CourierProfile).where(CourierProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        profile = CourierProfile(user_id=current_user.id)
        db.add(profile)
    profile.is_online = True
    return {"online": True}


@router.post("/offline")
async def go_offline(db: DB, current_user: CurrentUser) -> dict:
    result = await db.execute(select(CourierProfile).where(CourierProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if profile:
        profile.is_online = False
    return {"online": False}


@router.post("/assignments/respond")
async def respond_assignment(body: AssignmentResponse, redis: Redis, current_user: CurrentUser) -> dict:
    import json
    payload = json.dumps({"courier_id": str(current_user.id), "accept": body.accept})
    if body.accept:
        await redis.set(f"assignment_accept:{body.delivery_id}", payload, ex=30)
    return {"ok": True}
