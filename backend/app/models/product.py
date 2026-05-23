import uuid
import enum
from sqlalchemy import String, Integer, Boolean, ForeignKey, Text, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDModel


class ProductCategory(str, enum.Enum):
    ALIMENTATION = "alimentation"
    ELECTRONIQUE = "electronique"
    MODE = "mode"
    BEAUTE = "beaute"
    MAISON = "maison"
    SANTE = "sante"
    SPORT = "sport"
    LIVRES = "livres"
    AUTRE = "autre"


class Product(UUIDModel):
    __tablename__ = "products"

    vendor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("vendors.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    price_centimes: Mapped[int] = mapped_column(Integer, nullable=False)  # ex: 850000 = 8500 FCFA
    category: Mapped[ProductCategory] = mapped_column(default=ProductCategory.AUTRE, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    images: Mapped[list[str]] = mapped_column(ARRAY(String(500)), default=list, nullable=False)
    weight_grams: Mapped[int | None] = mapped_column(Integer)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    vendor: Mapped["Vendor"] = relationship(back_populates="products")  # noqa: F821
