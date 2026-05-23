import enum
from sqlalchemy import String, Boolean, Float, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDModel


class UserRole(str, enum.Enum):
    CLIENT = "client"
    VENDOR = "vendor"
    AGENCY = "agency"
    DRIVER = "driver"
    ADMIN = "admin"


class User(UUIDModel):
    __tablename__ = "users"

    phone: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    rating_count: Mapped[int] = mapped_column(default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    city: Mapped[str | None] = mapped_column(String(60))

    courier_profile: Mapped["CourierProfile | None"] = relationship(  # noqa: F821
        back_populates="user", uselist=False, lazy="select"
    )
