import uuid
import enum
from sqlalchemy import String, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDModel


class DisputeStatus(str, enum.Enum):
    OUVERT = "ouvert"
    EN_COURS = "en_cours"
    RESOLU = "resolu"
    FERME = "ferme"


class DisputeReason(str, enum.Enum):
    ARTICLE_MANQUANT = "article_manquant"
    ARTICLE_ENDOMMAGE = "article_endommage"
    MAUVAISE_LIVRAISON = "mauvaise_livraison"
    NON_LIVREE = "non_livree"
    AUTRE = "autre"


class Dispute(UUIDModel):
    __tablename__ = "disputes"

    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False, unique=True)
    opened_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    reason: Mapped[DisputeReason] = mapped_column(SAEnum(DisputeReason), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[DisputeStatus] = mapped_column(
        SAEnum(DisputeStatus), default=DisputeStatus.OUVERT, nullable=False
    )
    resolved_by_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    resolution: Mapped[str | None] = mapped_column(Text)

    order: Mapped["Order"] = relationship(back_populates="dispute")  # noqa: F821
    opened_by = relationship("User", foreign_keys=[opened_by_id])
    resolved_by = relationship("User", foreign_keys=[resolved_by_id])


class Rating(UUIDModel):
    __tablename__ = "ratings"

    from_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    to_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False)
    score: Mapped[int] = mapped_column(nullable=False)
    comment: Mapped[str | None] = mapped_column(String(500))

    from_user = relationship("User", foreign_keys=[from_user_id])
    to_user = relationship("User", foreign_keys=[to_user_id])
