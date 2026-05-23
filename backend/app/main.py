from contextlib import asynccontextmanager

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1 import router as api_v1_router
from app.socket_events import sio, start_redis_subscriber


@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore[type-arg]
    await start_redis_subscriber()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
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
