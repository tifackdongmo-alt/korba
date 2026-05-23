import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDModel


class Delivery(UUIDModel):
    __tablename__ = "deliveries"

    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False, unique=True)
    courier_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), index=True)
    pickup_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    otp: Mapped[str | None] = mapped_column(String(6))
    proof_photo_url: Mapped[str | None] = mapped_column(String(500))

    order: Mapped["Order"] = relationship(back_populates="delivery")  # noqa: F821
    courier = relationship("User", foreign_keys=[courier_id])
    assignments: Mapped[list["Assignment"]] = relationship(back_populates="delivery")


class CourierProfile(UUIDModel):
    __tablename__ = "courier_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True)
    agency_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agencies.id"))
    vehicle_type: Mapped[str] = mapped_column(String(30), default="moto", nullable=False)
    acceptance_rate: Mapped[float] = mapped_column(default=1.0, nullable=False)
    success_rate: Mapped[float] = mapped_column(default=1.0, nullable=False)
    total_deliveries: Mapped[int] = mapped_column(default=0, nullable=False)
    is_online: Mapped[bool] = mapped_column(default=False, nullable=False)

    user: Mapped["User"] = relationship(back_populates="courier_profile")  # noqa: F821
    agency = relationship("Agency", back_populates="courier_profiles")


class CourierLocation(UUIDModel):
    __tablename__ = "courier_locations"

    courier_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    position: Mapped[object] = mapped_column(
        __import__("geoalchemy2").Geometry("POINT", srid=4326), nullable=False
    )
    bearing: Mapped[float | None] = mapped_column()
    speed_kmh: Mapped[float | None] = mapped_column()
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class Assignment(UUIDModel):
    __tablename__ = "assignments"

    delivery_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("deliveries.id"), nullable=False, index=True)
    courier_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    score: Mapped[float] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    delivery: Mapped["Delivery"] = relationship(back_populates="assignments")
    courier = relationship("User", foreign_keys=[courier_id])
