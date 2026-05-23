"""
Création automatique de notifications sur changements d'état commande.
"""
import json
from uuid import UUID

import redis.asyncio as aioredis
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification, NotificationType
from app.models.order import OrderStatus


# Messages par statut → templates ciblés par rôle
STATUS_MESSAGES: dict[OrderStatus, dict[str, tuple[str, str]]] = {
    OrderStatus.A_PREPARER: {
        "vendor": ("Nouvelle commande", "Vous avez une commande à préparer"),
        "client": ("Paiement reçu", "Votre commande est confirmée"),
    },
    OrderStatus.LIVREUR_ASSIGNE: {
        "client": ("Livreur assigné", "Un livreur a pris en charge votre commande"),
        "vendor": ("Livreur en route", "Le livreur vient récupérer la commande"),
    },
    OrderStatus.EN_ROUTE_VERS_CLIENT: {
        "client": ("Livraison en cours", "Le livreur arrive bientôt"),
    },
    OrderStatus.LIVREE: {
        "client": ("Livraison effectuée", "Validez la réception pour finaliser"),
        "vendor": ("Commande livrée", "La commande a été livrée au client"),
    },
    OrderStatus.TERMINEE: {
        "vendor": ("Paiement libéré", "Les fonds ont été transférés à votre compte"),
        "driver": ("Livraison complétée", "Bravo, la course est terminée"),
    },
    OrderStatus.LITIGE: {
        "vendor": ("Litige ouvert", "Le client a signalé un problème"),
        "driver": ("Litige ouvert", "Le client a signalé un problème"),
    },
}


async def create_notification(
    db: AsyncSession,
    redis_client: aioredis.Redis,
    user_id: UUID,
    notif_type: NotificationType,
    title: str,
    body: str,
    payload: dict | None = None,
) -> Notification:
    notif = Notification(
        user_id=user_id,
        type=notif_type,
        title=title,
        body=body,
        payload=payload,
    )
    db.add(notif)
    await db.flush()

    # Push temps réel via Redis pub/sub → Socket.io
    await redis_client.publish(
        f"notification:{user_id}",
        json.dumps({"id": str(notif.id), "type": notif_type.value, "title": title, "body": body, "payload": payload}),
    )
    return notif


async def notify_status_change(
    db: AsyncSession,
    redis_client: aioredis.Redis,
    status: OrderStatus,
    client_id: UUID,
    vendor_owner_id: UUID,
    driver_id: UUID | None = None,
    order_id: UUID | None = None,
) -> None:
    messages = STATUS_MESSAGES.get(status, {})
    payload = {"order_id": str(order_id), "status": status.value} if order_id else None

    if "client" in messages:
        title, body = messages["client"]
        await create_notification(db, redis_client, client_id, NotificationType.ORDER_STATUS, title, body, payload)

    if "vendor" in messages:
        title, body = messages["vendor"]
        await create_notification(db, redis_client, vendor_owner_id, NotificationType.ORDER_STATUS, title, body, payload)

    if "driver" in messages and driver_id:
        title, body = messages["driver"]
        await create_notification(db, redis_client, driver_id, NotificationType.ORDER_STATUS, title, body, payload)
