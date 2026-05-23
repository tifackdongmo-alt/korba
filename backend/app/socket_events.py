"""
Serveur Socket.io avec Redis pub/sub pour le temps réel.
Événements:
  - location:update  → broadcast position livreur
  - order:status_changed → notifier client/vendeur
  - assignment:new   → notifier livreur (TTL 12s)
  - notification:new → notifier utilisateur
"""
import asyncio
import json
import redis.asyncio as aioredis
import socketio
from app.config import settings

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=settings.ALLOWED_ORIGINS,
    logger=False,
    engineio_logger=False,
)


@sio.event
async def connect(sid: str, environ: dict, auth: dict | None = None) -> None:
    user_id = (auth or {}).get("user_id")
    if user_id:
        await sio.save_session(sid, {"user_id": user_id})
        await sio.enter_room(sid, f"user:{user_id}")


@sio.event
async def disconnect(sid: str) -> None:
    pass


@sio.event
async def join_order(sid: str, data: dict) -> None:
    order_id = data.get("order_id")
    if order_id:
        await sio.enter_room(sid, f"order:{order_id}")


@sio.event
async def leave_order(sid: str, data: dict) -> None:
    order_id = data.get("order_id")
    if order_id:
        await sio.leave_room(sid, f"order:{order_id}")


@sio.event
async def location_ping(sid: str, data: dict) -> None:
    session = await sio.get_session(sid)
    user_id = session.get("user_id")
    if not user_id:
        return
    # Relayer la position aux rooms des commandes actives du livreur
    payload = {**data, "courier_id": user_id}
    await sio.emit("location:update", payload, skip_sid=sid)


async def redis_subscriber() -> None:
    """Écoute les channels Redis et pousse aux clients Socket.io."""
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    pubsub = redis_client.pubsub()
    # Patterns pour tous les événements
    await pubsub.psubscribe("order:*", "assignment:*", "location:*", "notification:*", "no_courier_available")

    async for message in pubsub.listen():
        if message["type"] not in ("pmessage", "message"):
            continue
        channel: str = message.get("channel", "")
        data_str: str = message.get("data", "")

        try:
            payload = json.loads(data_str)
        except (json.JSONDecodeError, TypeError):
            payload = data_str

        if channel.startswith("order:"):
            order_id = channel.split(":", 1)[1]
            await sio.emit("order:status_changed", payload, room=f"order:{order_id}")
        elif channel.startswith("assignment:"):
            courier_id = channel.split(":", 1)[1]
            await sio.emit("assignment:new", payload, room=f"user:{courier_id}")
        elif channel.startswith("location:"):
            # Broadcast aux rooms des commandes actives (géré côté client)
            await sio.emit("location:update", payload)
        elif channel.startswith("notification:"):
            user_id = channel.split(":", 1)[1]
            await sio.emit("notification:new", payload, room=f"user:{user_id}")
        elif channel == "no_courier_available":
            await sio.emit("assignment:no_courier", {"delivery_id": payload})


async def start_redis_subscriber() -> None:
    asyncio.ensure_future(redis_subscriber())
