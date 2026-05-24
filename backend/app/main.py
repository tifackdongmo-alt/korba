from contextlib import asynccontextmanager

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1 import router as api_v1_router
from app.socket_events import sio, start_redis_subscriber


@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore[type-arg]
    if settings.DEV_MODE:
        # Créer toutes les tables SQLite si elles n'existent pas
        from app.database import engine
        from app.models import base  # noqa: F401 — importe tous les modèles
        import app.models.user, app.models.agency, app.models.vendor  # noqa: F401
        import app.models.product, app.models.order, app.models.delivery  # noqa: F401
        import app.models.payment, app.models.notification  # noqa: F401
        import app.models.dispute  # noqa: F401
        from sqlalchemy import text
        async with engine.begin() as conn:
            # SQLite ne supporte pas GEOMETRY — on patch les colonnes géo
            await conn.run_sync(lambda sync_conn: _create_tables_safe(sync_conn))
    else:
        await start_redis_subscriber()
    yield


def _create_tables_safe(conn):  # type: ignore[no-untyped-def]
    from app.database import Base
    from sqlalchemy import String, JSON, Text
    # Remplacer tous les types PostgreSQL incompatibles avec SQLite
    _pg_types = {"Geometry", "Geography", "JSONB", "ARRAY"}
    for table in Base.metadata.tables.values():
        for col in list(table.columns):
            type_name = type(col.type).__name__
            if type_name in ("Geometry", "Geography"):
                col.type = String(255)
            elif type_name in ("JSONB", "ARRAY"):
                col.type = JSON()
    Base.metadata.create_all(conn)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs" if (settings.DEBUG or settings.DEV_MODE) else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "version": settings.APP_VERSION}


# Monter Socket.io sur /ws
socket_app = socketio.ASGIApp(sio, app)
