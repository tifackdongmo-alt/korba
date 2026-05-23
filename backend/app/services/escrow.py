"""
Escrow payments — Orange Money & Wave.
Fonds bloqués à la commande, libérés après validation client.
"""
import httpx
from uuid import UUID

from app.config import settings
from app.models.payment import Payment, PaymentProvider, PaymentStatus


class PaymentError(Exception):
    pass


async def initiate_orange_money(order_id: UUID, amount_centimes: int, phone: str) -> dict:
    """Retourne {escrow_ref, redirect_url}."""
    amount_xof = amount_centimes / 100  # centimes → FCFA
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{settings.ORANGE_MONEY_API_URL}/webpay/v2",
            json={
                "merchant_key": settings.ORANGE_MONEY_MERCHANT_KEY,
                "currency": "OUV",  # Orange Unified Value
                "order_id": str(order_id),
                "amount": int(amount_xof),
                "return_url": f"https://korba.app/orders/{order_id}/callback",
                "cancel_url": f"https://korba.app/orders/{order_id}/cancel",
                "notif_url": f"https://api.korba.app/v1/payments/webhook/orange",
                "lang": "fr",
                "reference": str(order_id),
            },
            headers={"Authorization": f"Bearer {settings.ORANGE_MONEY_MERCHANT_KEY}"},
        )
        if resp.status_code != 200:
            raise PaymentError(f"Orange Money error: {resp.status_code}")
        data = resp.json()
        return {"escrow_ref": data.get("pay_token"), "redirect_url": data.get("payment_url")}


async def initiate_wave(order_id: UUID, amount_centimes: int, phone: str) -> dict:
    amount_xof = amount_centimes / 100
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{settings.WAVE_API_URL}/checkout/sessions",
            json={
                "amount": str(int(amount_xof)),
                "currency": "XOF",
                "error_url": f"https://korba.app/orders/{order_id}/cancel",
                "success_url": f"https://korba.app/orders/{order_id}/callback",
                "client_reference": str(order_id),
            },
            headers={"Authorization": f"Bearer {settings.WAVE_API_KEY}"},
        )
        if resp.status_code != 200:
            raise PaymentError(f"Wave error: {resp.status_code}")
        data = resp.json()
        return {"escrow_ref": data.get("id"), "redirect_url": data.get("wave_launch_url")}


async def release_escrow(payment: Payment) -> bool:
    """Libère les fonds vers le vendeur après validation commande."""
    if payment.provider == PaymentProvider.ORANGE_MONEY:
        # Orange Money : appel de confirmation
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{settings.ORANGE_MONEY_API_URL}/webpay/v2/release",
                json={"pay_token": payment.escrow_ref},
                headers={"Authorization": f"Bearer {settings.ORANGE_MONEY_MERCHANT_KEY}"},
            )
            return resp.status_code == 200
    elif payment.provider == PaymentProvider.WAVE:
        # Wave : capture du paiement
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{settings.WAVE_API_URL}/checkout/sessions/{payment.escrow_ref}/capture",
                headers={"Authorization": f"Bearer {settings.WAVE_API_KEY}"},
            )
            return resp.status_code == 200
    return False
