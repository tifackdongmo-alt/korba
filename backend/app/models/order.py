import uuid
import enum
from sqlalchemy import String, Integer, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDModel


class OrderStatus(str, enum.Enum):
    EN_ATTENTE = "en_attente"
    A_PREPARER = "a_preparer"
    EN_PREPARATION = "en_preparation"
    PRETE = "prete"
    LIVREUR_ASSIGNE = "livreur_assigne"
    EN_ROUTE_VERS_VENDEUR = "en_route_vers_vendeur"
    EN_ROUTE_VERS_CLIENT = "en_route_vers_client"
    LIVREE = "livree"
    VALIDEE = "validee"
    TERMINEE = "terminee"
    LITIGE = "litige"
    REMBOURSEE = "remboursee"
    ANNULEE = "annulee"


VALID_TRANSITIONS: dict[OrderStatus, list[OrderStatus]] = {
    OrderStatus.EN_ATTENTE: [OrderStatus.A_PREPARER, OrderStatus.ANNULEE],
    OrderStatus.A_PREPARER: [OrderStatus.EN_PREPARATION, OrderStatus.LIVREUR_ASSIGNE],
    OrderStatus.EN_PREPARATION: [OrderStatus.PRETE],
    OrderStatus.PRETE: [OrderStatus.LIVREUR_ASSIGNE],
    OrderStatus.LIVREUR_ASSIGNE: [OrderStatus.EN_ROUTE_VERS_VENDEUR],
    OrderStatus.EN_ROUTE_VERS_VENDEUR: [OrderStatus.EN_ROUTE_VERS_CLIENT],
    OrderStatus.EN_ROUTE_VERS_CLIENT: [OrderStatus.LIVREE],
    OrderStatus.LIVREE: [OrderStatus.VALIDEE, OrderStatus.LITIGE],
    OrderStatus.VALIDEE: [OrderStatus.TERMINEE],
    OrderStatus.LITIGE: [OrderStatus.TERMINEE, OrderStatus.REMBOURSEE],
    OrderStatus.TERMINEE: [],
    OrderStatus.REMBOURSEE: [],
    OrderStatus.ANNULEE: [],
}


class Order(UUIDModel):
    __tablename__ = "orders"

    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    vendor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("vendors.id"), nullable=False, index=True)
    status: Mapped[OrderStatus] = mapped_column(
        SAEnum(OrderStatus), default=OrderStatus.EN_ATTENTE, nullable=False, index=True
    )
    total_centimes: Mapped[int] = mapped_column(Integer, nullable=False)
    delivery_fee_centimes: Mapped[int] = mapped_column(Integer, default=50000, nullable=False)
    service_fee_centimes: Mapped[int] = mapped_column(Integer, default=20000, nullable=False)
    escrow_ref: Mapped[str | None] = mapped_column(String(200))
    delivery_address: Mapped[str] = mapped_column(String(400), nullable=False)
    notes: Mapped[str | None] = mapped_column(String(500))

    client = relationship("User", foreign_keys=[client_id])
    vendor: Mapped["Vendor"] = relationship()  # noqa: F821
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    delivery: Mapped["Delivery | None"] = relationship(back_populates="order", uselist=False)  # noqa: F821
    payment: Mapped["Payment | None"] = relationship(back_populates="order", uselist=False)  # noqa: F821
    dispute: Mapped["Dispute | None"] = relationship(back_populates="order", uselist=False)  # noqa: F821


class OrderItem(UUIDModel):
    __tablename__ = "order_items"

    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False, index=True)
    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price_centimes: Mapped[int] = mapped_column(Integer, nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)  # snapshot

    order: Mapped["Order"] = relationship(back_populates="items")
    product = relationship("Product")
