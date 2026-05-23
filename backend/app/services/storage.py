"""
Upload S3-compatible (Scaleway, MinIO, AWS).
Génère un nom unique et retourne l'URL publique.
"""
import uuid
from pathlib import Path

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.config import settings


_s3_client = None


def get_s3_client():
    global _s3_client
    if _s3_client is None and settings.S3_ENDPOINT:
        _s3_client = boto3.client(
            "s3",
            endpoint_url=settings.S3_ENDPOINT,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            region_name=settings.S3_REGION,
        )
    return _s3_client


async def upload_bytes(content: bytes, filename: str, content_type: str = "image/jpeg") -> str:
    """Upload des bytes vers S3 et retourne l'URL publique."""
    ext = Path(filename).suffix.lower() or ".jpg"
    key = f"{uuid.uuid4().hex}{ext}"

    client = get_s3_client()
    if not client:
        # Mode dev : sauvegarder en local
        local_dir = Path("uploads")
        local_dir.mkdir(exist_ok=True)
        (local_dir / key).write_bytes(content)
        return f"/uploads/{key}"

    try:
        client.put_object(
            Bucket=settings.S3_BUCKET,
            Key=key,
            Body=content,
            ContentType=content_type,
            ACL="public-read",
        )
        return f"{settings.S3_ENDPOINT}/{settings.S3_BUCKET}/{key}"
    except (BotoCoreError, ClientError) as e:
        raise RuntimeError(f"Upload S3 échoué : {e}") from e
