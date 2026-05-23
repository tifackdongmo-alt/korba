from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import DB, Redis, CurrentUser
from app.models.user import User, UserRole
from app.schemas.auth import SendOTPRequest, VerifyOTPRequest, TokenResponse, RefreshRequest
from app.services.auth import (
    send_otp, verify_otp, create_access_token,
    create_refresh_token, verify_refresh_token, revoke_refresh_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/send-otp", status_code=status.HTTP_204_NO_CONTENT)
async def send_otp_route(body: SendOTPRequest, db: DB, redis: Redis) -> None:
    await send_otp(redis, body.phone)


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp_route(body: VerifyOTPRequest, db: DB, redis: Redis) -> TokenResponse:
    valid = await verify_otp(redis, body.phone, body.otp)
    if not valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP invalide ou expiré")

    # Trouver ou créer l'utilisateur
    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()
    if not user:
        if not body.name:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Nom requis pour la première inscription",
            )
        user = User(phone=body.phone, role=UserRole.CLIENT, name=body.name)
        db.add(user)
        await db.flush()

    access = create_access_token(user.id, user.role.value)
    refresh = await create_refresh_token(redis, user.id)
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        user_id=str(user.id),
        role=user.role.value,
        name=user.name,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest, db: DB, redis: Redis) -> TokenResponse:
    user_id = await verify_refresh_token(redis, body.refresh_token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expiré")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur introuvable")

    await revoke_refresh_token(redis, body.refresh_token)
    new_access = create_access_token(user.id, user.role.value)
    new_refresh = await create_refresh_token(redis, user.id)
    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        user_id=str(user.id),
        role=user.role.value,
        name=user.name,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(body: RefreshRequest, redis: Redis) -> None:
    await revoke_refresh_token(redis, body.refresh_token)


@router.get("/me")
async def me(current_user: CurrentUser) -> dict:
    return {
        "id": str(current_user.id),
        "phone": current_user.phone,
        "name": current_user.name,
        "role": current_user.role.value,
        "avatar_url": current_user.avatar_url,
        "rating": current_user.rating,
        "city": current_user.city,
    }
