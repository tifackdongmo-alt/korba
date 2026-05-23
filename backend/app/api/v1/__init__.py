from fastapi import APIRouter
from app.api.v1 import (
    auth, products, orders, couriers, disputes,
    notifications, ratings, agency, vendors,
    payments, uploads,
)

router = APIRouter(prefix="/v1")
router.include_router(auth.router)
router.include_router(products.router)
router.include_router(orders.router)
router.include_router(couriers.router)
router.include_router(disputes.router)
router.include_router(notifications.router)
router.include_router(ratings.router)
router.include_router(agency.router)
router.include_router(vendors.router)
router.include_router(payments.router)
router.include_router(uploads.router)
