import uuid
from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.models.base import UUIDModel


class Vendor(UUIDModel):
    __tablename__ = "vendors"

    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    agency_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agencies.id"))
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    address: Mapped[str] = mapped_column(String(300), nullable=False)
    location: Mapped[object | None] = mapped_column(Geometry("POINT", srid=4326))
    city: Mapped[str] = mapped_column(String(60), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    logo_url: Mapped[str | None] = mapped_column(String(500))
    banner_url: Mapped[str | None] = mapped_column(String(500))
    rating: Mapped[float] = mapped_column(default=5.0, nullable=False)
    rating_count: Mapped[int] = mapped_column(default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    owner = relationship("User", foreign_keys=[owner_id])
    agency: Mapped["Agency | None"] = relationship(back_populates="vendors")  # noqa: F821
    products: Mapped[list["Product"]] = relationship(back_populates="vendor")  # noqa: F821
