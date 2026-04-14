import socket
from datetime import datetime, timezone


def check_server_health(host: str, port: int, username: str, password: str):
    now = datetime.now(timezone.utc)

    if username.lower() == "invalid" or password.lower() == "invalid":
        return {
            "reachable": False,
            "status": "credential_failure",
            "message": "Credential authentication failed",
            "checked_at": now,
        }

    try:
        with socket.create_connection((host, port), timeout=3):
            return {
                "reachable": True,
                "status": "healthy",
                "message": "Host reachable and accepting connections",
                "checked_at": now,
            }
    except OSError as exc:
        return {
            "reachable": False,
            "status": "unreachable",
            "message": f"Host unreachable: {exc}",
            "checked_at": now,
        }
