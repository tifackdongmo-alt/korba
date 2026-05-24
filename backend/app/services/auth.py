import secrets
import string
from datetime import datetime, timedelta, timezone
from uuid import UUID

import redis.asyncio as aioredis
from jose import jwt, JWTError

from app.config import settings


OTP_LENGTH = 6
OTP_PREFIX = "otp:"
REFRESH_PREFIX = "refresh:"


def _make_otp() -> str:
    return "".join(secrets.choice(string.digits) for _ in range(OTP_LENGTH))


DEV_OTP = "000000"


async def send_otp(redis_client: aioredis.Redis, phone: str) -> str:
    if settings.DEV_MODE:
        # En mode dev : OTP fixe, pas de SMS
        return DEV_OTP

    otp = _make_otp()
    key = f"{OTP_PREFIX}{phone}"
    await redis_client.setex(key, settings.OTP_EXPIRE_MINUTES * 60, otp)

    if settings.AFRICAS_TALKING_API_KEY:
        import africas_talking  # type: ignore[import]
        africas_talking.initialize(settings.AFRICAS_TALKING_USERNAME, settings.AFRICAS_TALKING_API_KEY)
        sms = africas_talking.SMS
        sms.send(f"[Korba] Votre code de vérification : {otp}", [phone])

    return otp


async def verify_otp(redis_client: aioredis.Redis, phone: str, otp: str) -> bool:
    if settings.DEV_MODE:
        return otp == DEV_OTP

    key = f"{OTP_PREFIX}{phone}"
    stored = await redis_client.get(key)
    if stored and stored.decode() == otp:
        await redis_client.delete(key)
        return True
    return False


def create_access_token(user_id: UUID, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "role": role, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


async def create_refresh_token(redis_client: aioredis.Redis, user_id: UUID) -> str:
    token = secrets.token_urlsafe(48)
    key = f"{REFRESH_PREFIX}{token}"
    ttl = settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 86400
    await redis_client.setex(key, ttl, str(user_id))
    return token


async def verify_refresh_token(redis_client: aioredis.Redis, token: str) -> UUID | None:
    key = f"{REFRESH_PREFIX}{token}"
    val = await redis_client.get(key)
    if val:
        return UUID(val.decode())
    return None


async def revoke_refresh_token(redis_client: aioredis.Redis, token: str) -> None:
    await redis_client.delete(f"{REFRESH_PREFIX}{token}")


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise JWTError("Not an access token")
        return payload
    except JWTError as e:
        raise ValueError(str(e)) from e
