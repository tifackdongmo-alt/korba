from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    APP_NAME: str = "Korba API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    DEV_MODE: bool = True  # SQLite + in-memory Redis + OTP fixe
    SECRET_KEY: str = "change-me-in-production"
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:3003", "http://localhost:3004", "http://localhost:3005",
        "http://localhost:3006", "http://localhost:5173",
    ]

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./korba_dev.db"
    DATABASE_URL_SYNC: str = "sqlite:///./korba_dev.db"

    # Redis (ignoré en DEV_MODE)
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    JWT_ALGORITHM: str = "HS256"

    # OTP
    AFRICAS_TALKING_API_KEY: str = ""
    AFRICAS_TALKING_USERNAME: str = "sandbox"
    OTP_EXPIRE_MINUTES: int = 10

    # Storage (S3-compatible)
    S3_ENDPOINT: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET: str = "korba"
    S3_REGION: str = "eu-central-1"

    # Payments
    ORANGE_MONEY_API_URL: str = "https://api.orange.com/orange-money-webpay"
    ORANGE_MONEY_MERCHANT_KEY: str = ""
    WAVE_API_URL: str = "https://api.wave.com/v1"
    WAVE_API_KEY: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
