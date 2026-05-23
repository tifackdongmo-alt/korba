import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDModel


class PaymentProvider(str, enum.Enum):
    ORANGE_MONEY = "orange_money"
    WAVE = "wave"
    CASH = "cash"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    IN_ESCROW = "in_escrow"
    RELEASED = "released"
    REFUNDED = "refunded"
    FAILED = "failed"


class Payment(UUIDModel):
    __tablename__ = "payments"

    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False, unique=True)
    provider: Mapped[PaymentProvider] = mapped_column(SAEnum(PaymentProvider), nullable=False)
    amount_centimes: Mapped[int] = mapped_column(Integer, nullable=False)
    escrow_ref: Mapped[str | None] = mapped_column(String(200))
    provider_ref: Mapped[str | None] = mapped_column(String(200))
    status: Mapped[PaymentStatus] = mapped_column(
        SAEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False
    )
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    order: Mapped["Order"] = relationship(back_populates="payment")  # noqa: F821
