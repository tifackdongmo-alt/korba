import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch

from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_send_otp(client: AsyncClient):
    with patch("app.api.v1.auth.send_otp", new_callable=AsyncMock) as mock_otp:
        mock_otp.return_value = "123456"
        resp = await client.post("/v1/auth/send-otp", json={"phone": "+221774128903"})
        assert resp.status_code == 204
        mock_otp.assert_called_once()


@pytest.mark.asyncio
async def test_send_otp_invalid_phone(client: AsyncClient):
    resp = await client.post("/v1/auth/send-otp", json={"phone": "abc"})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_verify_otp_invalid(client: AsyncClient):
    with patch("app.api.v1.auth.verify_otp", new_callable=AsyncMock) as mock_verify:
        mock_verify.return_value = False
        resp = await client.post(
            "/v1/auth/verify-otp", json={"phone": "+221774128903", "otp": "000000", "name": "Test"}
        )
        assert resp.status_code == 400


@pytest.mark.asyncio
async def test_me_unauthenticated(client: AsyncClient):
    resp = await client.get("/v1/auth/me")
    # HTTPBearer renvoie 403 quand pas de header, 401 si token invalide
    assert resp.status_code in (401, 403)
