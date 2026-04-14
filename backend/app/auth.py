from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from .config import settings


USERS = {
    settings.admin_username: {"password": settings.admin_password, "role": "admin"},
    settings.user_username: {"password": settings.user_password, "role": "viewer"},
}


def authenticate_user(username: str, password: str):
    user = USERS.get(username)
    if not user or user["password"] != password:
        return None
    return {"username": username, "role": user["role"]}


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.encryption_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str):
    try:
        return jwt.decode(token, settings.encryption_key, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None
