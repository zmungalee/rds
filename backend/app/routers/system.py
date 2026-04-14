from datetime import datetime, timezone

from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

from ..config import settings

router = APIRouter(tags=["system"])

REQUEST_METRICS = {
    "health_checks_total": 0,
    "login_attempts_total": 0,
}


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
        "time": datetime.now(timezone.utc),
    }


@router.get("/metrics", response_class=PlainTextResponse)
def metrics():
    lines = [
        f"app_polling_interval_seconds {settings.polling_interval_seconds}",
        f"health_checks_total {REQUEST_METRICS['health_checks_total']}",
        f"login_attempts_total {REQUEST_METRICS['login_attempts_total']}",
    ]
    return "\n".join(lines)
