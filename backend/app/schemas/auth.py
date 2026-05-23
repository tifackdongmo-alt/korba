from pydantic import BaseModel, field_validator
import re


class SendOTPRequest(BaseModel):
    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip().replace(" ", "")
        if not re.match(r"^\+?[1-9]\d{7,14}$", v):
            raise ValueError("Numéro de téléphone invalide")
        return v


class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    name: str | None = None

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 6:
            raise ValueError("OTP doit être 6 chiffres")
        return v


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    name: str


class RefreshRequest(BaseModel):
    refresh_token: str
