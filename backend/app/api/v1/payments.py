"""
Webhooks paiements + endpoint delivery confirmé par livreur.
Orange Money et Wave appellent ces URLs après confirmation côté opérateur.
"""
from uuid import UUID

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.api.deps import DB, Redis, CurrentUser
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus
from app.models.delivery import Delivery
from app.services.state_machine import transition

router = APIRouter(prefix="/payments", tags=["payments"])


class DeliveredRequest(BaseModel):
    otp: str
    proof_photo_url: str | None = None


@router.post("/webhook/orange")
async def orange_money_webhook(request: Request, db: DB, redis: Redis) -> dict:
    body = await request.json()
    # Le webhook Orange envoie {status, txnid, order_id, ...}
    order_id = body.get("order_id") or body.get("reference")
    status_ext = body.get("status", "").upper()

    result = await db.execute(
        select(Payment).options(joinedload(Payment.order)).where(Payment.escrow_ref == body.get("pay_token"))
    )
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Paiement introuvable")

    if status_ext == "SUCCESS":
        payment.status = PaymentStatus.IN_ESCROW
        payment.provider_ref = body.get("txnid")
        await redis.publish(f"order:{payment.order_id}", "payment:in_escrow")
    elif status_ext == "FAILED":
        payment.status = PaymentStatus.FAILED
        await redis.publish(f"order:{payment.order_id}", "payment:failed")

    return {"ok": True}


@router.post("/webhook/wave")
async def wave_webhook(request: Request, db: DB, redis: Redis) -> dict:
    body = await request.json()
    session_id = body.get("data", {}).get("id") or body.get("session_id")
    event_type = body.get("type", "")

    result = await db.execute(select(Payment).where(Payment.escrow_ref == session_id))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Paiement introuvable")

    if event_type == "checkout.session.completed":
        payment.status = PaymentStatus.IN_ESCROW
        await redis.publish(f"order:{payment.order_id}", "payment:in_escrow")
    elif event_type == "checkout.session.payment_failed":
        payment.status = PaymentStatus.FAILED
        await redis.publish(f"order:{payment.order_id}", "payment:failed")

    return {"ok": True}


# Livreur marque la commande comme livrée (avec OTP + photo)
@router.post("/orders/{order_id}/delivered")
async def mark_delivered(
    order_id: UUID, body: DeliveredRequest, db: DB, redis: Redis, current_user: CurrentUser
) -> dict:
    from datetime import datetime, timezone

    result = await db.execute(
        select(Order).options(joinedload(Order.delivery)).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    if not order.delivery or order.delivery.courier_id != current_user.id:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas le livreur assigné")

    # Vérifier l'OTP (en mode mock pour le dev)
    if order.delivery.otp and order.delivery.otp != body.otp:
        raise HTTPException(status_code=400, detail="Code OTP invalide")

    order.delivery.delivered_at = datetime.now(timezone.utc)
    order.delivery.proof_photo_url = body.proof_photo_url

    await transition(order, OrderStatus.LIVREE)
    await redis.publish(f"order:{order_id}", f"status:{OrderStatus.LIVREE.value}")

    return {"status": order.status.value}
