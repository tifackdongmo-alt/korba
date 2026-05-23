import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.models.base import UUIDModel


class Agency(UUIDModel):
    __tablename__ = "agencies"

    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    city: Mapped[str] = mapped_column(String(60), nullable=False)
    zone: Mapped[object | None] = mapped_column(Geometry("POLYGON", srid=4326))
    logo_url: Mapped[str | None] = mapped_column(String(500))
    description: Mapped[str | None] = mapped_column(String(1000))

    owner = relationship("User", foreign_keys=[owner_id])
    vendors: Mapped[list["Vendor"]] = relationship(back_populates="agency")  # noqa: F821
    courier_profiles: Mapped[list["CourierProfile"]] = relationship(back_populates="agency")  # noqa: F821
