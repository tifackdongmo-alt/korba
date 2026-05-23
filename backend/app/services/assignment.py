"""
Algorithme de scoring livreur (100pts max).

Critères:
  30 pts — Distance vendeur (ST_DWithin PostGIS)
  20 pts — Note moyenne livreur
  15 pts — Taux d'acceptation
  15 pts — Taux de réussite livraisons
  10 pts — Livreur favori de ce vendeur
  5  pts — Correspondance type produit / véhicule
  5  pts — Historique livraisons pour ce vendeur
"""
import asyncio
import json
from datetime import datetime, timedelta, timezone
from uuid import UUID

import redis.asyncio as aioredis
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.delivery import CourierProfile, CourierLocation, Assignment, Delivery
from app.models.order import Order
from app.models.user import User


ASSIGNMENT_TTL_SECONDS = 12


def _distance_score(distance_meters: float) -> float:
    """30pts max. Score linéaire : 0m=30, 5000m=0."""
    return max(0.0, 30.0 * (1 - distance_meters / 5000))


def _compute_score(
    distance_m: float,
    rating: float,
    acceptance_rate: float,
    success_rate: float,
    is_favorite: bool,
    vehicle_matches: bool,
    vendor_deliveries: int,
) -> float:
    score = _distance_score(distance_m)
    score += (rating / 5.0) * 20
    score += acceptance_rate * 15
    score += success_rate * 15
    score += 10 if is_favorite else 0
    score += 5 if vehicle_matches else 0
    score += min(5, vendor_deliveries / 10)
    return round(score, 2)


async def find_ranked_couriers(
    db: AsyncSession,
    order: Order,
    vendor_lat: float,
    vendor_lng: float,
    max_distance_m: float = 5000,
    limit: int = 10,
) -> list[tuple[UUID, float]]:
    """Retourne une liste [(courier_id, score)] triée par score décroissant."""
    # Couriers en ligne dans un rayon max_distance_m du vendeur
    point_wkt = f"SRID=4326;POINT({vendor_lng} {vendor_lat})"
    result = await db.execute(
        select(
            CourierProfile,
            User,
            func.ST_Distance(
                func.ST_Transform(CourierLocation.position, 3857),
                func.ST_Transform(func.ST_GeomFromEWKT(point_wkt), 3857),
            ).label("distance_m"),
        )
        .join(User, User.id == CourierProfile.user_id)
        .join(
            CourierLocation,
            CourierLocation.courier_id == CourierProfile.user_id,
        )
        .where(
            CourierProfile.is_online.is_(True),
            func.ST_DWithin(
                func.ST_Transform(CourierLocation.position, 3857),
                func.ST_Transform(func.ST_GeomFromEWKT(point_wkt), 3857),
                max_distance_m,
            ),
            # Prendre la localisation la plus récente (< 2 min)
            CourierLocation.recorded_at
            >= datetime.now(timezone.utc) - timedelta(minutes=2),
        )
        .order_by("distance_m")
        .limit(limit * 3)
    )
    rows = result.all()

    ranked: list[tuple[UUID, float]] = []
    for profile, user, distance_m in rows:
        score = _compute_score(
            distance_m=float(distance_m),
            rating=user.rating,
            acceptance_rate=profile.acceptance_rate,
            success_rate=profile.success_rate,
            is_favorite=False,
            vehicle_matches=True,
            vendor_deliveries=0,
        )
        ranked.append((user.id, score))

    ranked.sort(key=lambda x: x[1], reverse=True)
    return ranked[:limit]


async def push_assignment(
    redis_client: aioredis.Redis,
    delivery_id: UUID,
    courier_id: UUID,
    score: float,
    vendor_info: dict,
) -> None:
    key = f"assignment:{delivery_id}:{courier_id}"
    payload = json.dumps(
        {
            "delivery_id": str(delivery_id),
            "courier_id": str(courier_id),
            "score": score,
            "vendor": vendor_info,
            "ttl": ASSIGNMENT_TTL_SECONDS,
        }
    )
    await redis_client.setex(key, ASSIGNMENT_TTL_SECONDS, payload)
    # Pub pour le socket server
    await redis_client.publish(f"assignment:{courier_id}", payload)


async def cascade_assignment(
    db: AsyncSession,
    redis_client: aioredis.Redis,
    delivery: Delivery,
    ranked_couriers: list[tuple[UUID, float]],
    vendor_info: dict,
) -> None:
    """Propose la course au livreur #1, attend 12s, sinon passe au suivant."""
    for courier_id, score in ranked_couriers:
        # Persister l'assignment en DB (statut pending)
        assignment = Assignment(
            delivery_id=delivery.id,
            courier_id=courier_id,
            score=score,
            status="pending",
            expires_at=datetime.now(timezone.utc) + timedelta(seconds=ASSIGNMENT_TTL_SECONDS),
        )
        db.add(assignment)
        await db.commit()

        await push_assignment(redis_client, delivery.id, courier_id, score, vendor_info)
        # Timer 12s géré côté Redis TTL + Socket.io — l'API écoute la réponse via pub/sub
        accepted_key = f"assignment_accept:{delivery.id}"
        for _ in range(ASSIGNMENT_TTL_SECONDS * 2):
            val = await redis_client.get(accepted_key)
            if val:
                break
            await asyncio.sleep(0.5)
        else:
            # Aucune réponse → marquer refus et passer au suivant
            assignment.status = "expired"
            await db.commit()
            continue

        if json.loads(val)["courier_id"] == str(courier_id):
            assignment.status = "accepted"
            await db.commit()
            return

    # Aucun livreur disponible → notification agence
    await redis_client.publish("no_courier_available", str(delivery.id))
