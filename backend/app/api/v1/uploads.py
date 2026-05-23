from fastapi import APIRouter, UploadFile, File, HTTPException
from app.api.deps import CurrentUser
from app.services.storage import upload_bytes

router = APIRouter(prefix="/uploads", tags=["uploads"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = 5


@router.post("/proof")
async def upload_proof(file: UploadFile = File(...), current_user: CurrentUser = None) -> dict:  # type: ignore[assignment]
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Type non supporté : {file.content_type}")
    content = await file.read()
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Fichier trop volumineux (max {MAX_SIZE_MB}MB)")
    url = await upload_bytes(content, file.filename or "proof.jpg", file.content_type)
    return {"url": url}


@router.post("/product")
async def upload_product_image(file: UploadFile = File(...), current_user: CurrentUser = None) -> dict:  # type: ignore[assignment]
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Type non supporté : {file.content_type}")
    content = await file.read()
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Fichier trop volumineux (max {MAX_SIZE_MB}MB)")
    url = await upload_bytes(content, file.filename or "product.jpg", file.content_type)
    return {"url": url}
