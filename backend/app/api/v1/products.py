from uuid import UUID
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.api.deps import DB, CurrentUser
from app.models.product import Product, ProductCategory
from app.models.user import UserRole

router = APIRouter(prefix="/products", tags=["products"])


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price_centimes: int
    category: ProductCategory = ProductCategory.AUTRE
    stock: int = 0
    images: list[str] = []
    weight_grams: int | None = None


class ProductResponse(BaseModel):
    id: str
    vendor_id: str
    name: str
    description: str | None
    price_centimes: int
    category: str
    stock: int
    images: list[str]
    is_active: bool

    model_config = {"from_attributes": True}


@router.get("/", response_model=list[ProductResponse])
async def list_products(
    db: DB,
    city: str | None = Query(None),
    category: ProductCategory | None = Query(None),
    vendor_id: UUID | None = Query(None),
    q: str | None = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
) -> list[ProductResponse]:
    stmt = (
        select(Product)
        .options(joinedload(Product.vendor))
        .where(Product.is_active.is_(True))
    )
    if vendor_id:
        stmt = stmt.where(Product.vendor_id == vendor_id)
    if category:
        stmt = stmt.where(Product.category == category)
    if q:
        stmt = stmt.where(Product.name.ilike(f"%{q}%"))

    result = await db.execute(stmt.limit(limit).offset(offset))
    products = result.scalars().unique().all()
    return [ProductResponse.model_validate(p) for p in products]


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(body: ProductCreate, db: DB, current_user: CurrentUser) -> ProductResponse:
    if current_user.role != UserRole.VENDOR:
        raise HTTPException(status_code=403, detail="Réservé aux vendeurs")

    # Trouver le vendor lié à cet utilisateur
    from app.models.vendor import Vendor
    from sqlalchemy import select as sel

    result = await db.execute(sel(Vendor).where(Vendor.owner_id == current_user.id))
    vendor = result.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Profil vendeur introuvable")

    product = Product(vendor_id=vendor.id, **body.model_dump())
    db.add(product)
    await db.flush()
    return ProductResponse.model_validate(product)


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID, body: ProductCreate, db: DB, current_user: CurrentUser
) -> ProductResponse:
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Produit introuvable")

    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(product, field, val)
    return ProductResponse.model_validate(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: UUID, db: DB, current_user: CurrentUser) -> None:
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if product:
        product.is_active = False
