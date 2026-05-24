"""In-memory Redis stub for DEV_MODE (no Redis server needed)."""
import asyncio
import time
from typing import Any


class InMemoryRedis:
    def __init__(self) -> None:
        self._store: dict[str, tuple[Any, float | None]] = {}
        self._subs: list[Any] = []

    def _get_raw(self, key: str) -> Any | None:
        entry = self._store.get(key)
        if entry is None:
            return None
        value, expires_at = entry
        if expires_at and time.monotonic() > expires_at:
            del self._store[key]
            return None
        return value

    async def setex(self, key: str, seconds: int, value: Any) -> None:
        self._store[key] = (value, time.monotonic() + seconds)

    async def set(self, key: str, value: Any, ex: int | None = None) -> None:
        expires_at = (time.monotonic() + ex) if ex else None
        self._store[key] = (value, expires_at)

    async def get(self, key: str) -> bytes | None:
        val = self._get_raw(key)
        if val is None:
            return None
        if isinstance(val, bytes):
            return val
        return str(val).encode()

    async def delete(self, *keys: str) -> int:
        count = 0
        for k in keys:
            if k in self._store:
                del self._store[k]
                count += 1
        return count

    async def publish(self, channel: str, message: Any) -> int:
        return 0

    async def aclose(self) -> None:
        pass

    async def ping(self) -> bool:
        return True

    # pubsub stub (unused in dev but needed for socket_events import)
    def pubsub(self) -> "InMemoryRedis":
        return self

    async def psubscribe(self, *patterns: str) -> None:
        pass

    async def listen(self):  # type: ignore[return]
        await asyncio.sleep(86400)  # never yields in dev
        return
        yield  # make it an async generator


_instance = InMemoryRedis()


def get_dev_redis() -> InMemoryRedis:
    return _instance
