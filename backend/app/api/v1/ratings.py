from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy import select, func

from app.api.deps import DB, CurrentUser
from app.models.dispute import Rating
from app.models.order import Order, OrderStatus
from app.models.user import User

router = APIRouter(prefix="/ratings", tags=["ratings"])


class RatingCreate(BaseModel):
    order_id: UUID
    to_user_id: UUID
    score: int
    comment: str | None = None

    @field_validator("score")
    @classmethod
    def validate_score(cls, v: int) -> int:
        if not 1 <= v <= 5:
            raise ValueError("Score doit être entre 1 et 5")
        return v


@router.post("/")
async def create_rating(body: RatingCreate, db: DB, current_user: CurrentUser) -> dict:
    # Vérifier que la commande est terminée
    result = await db.execute(select(Order).where(Order.id == body.order_id))
    order = result.scalar_one_or_none()
    if not order or order.status != OrderStatus.TERMINEE:
        raise HTTPException(status_code=400, detail="Notation disponible uniquement après livraison confirmée")

    # Vérifier pas de double notation
    existing = await db.execute(
        select(Rating).where(
            Rating.order_id == body.order_id,
            Rating.from_user_id == current_user.id,
            Rating.to_user_id == body.to_user_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Notation déjà soumise")

    rating = Rating(
        from_user_id=current_user.id,
        to_user_id=body.to_user_id,
        order_id=body.order_id,
        score=body.score,
        comment=body.comment,
    )
    db.add(rating)
    await db.flush()

    # Mettre à jour la note moyenne de l'utilisateur noté
    avg_result = await db.execute(
        select(func.avg(Rating.score)).where(Rating.to_user_id == body.to_user_id)
    )
    new_avg = float(avg_result.scalar() or 5.0)
    count_result = await db.execute(
        select(func.count(Rating.id)).where(Rating.to_user_id == body.to_user_id)
    )
    new_count = int(count_result.scalar() or 0)

    user_result = await db.execute(select(User).where(User.id == body.to_user_id))
    user = user_result.scalar_one_or_none()
    if user:
        user.rating = round(new_avg, 2)
        user.rating_count = new_count

    return {"id": str(rating.id), "score": rating.score}
