from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class ServerBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    host: str = Field(min_length=2, max_length=255)
    port: int = Field(ge=1, le=65535)
    username: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=1, max_length=255)


class ServerCreate(ServerBase):
    pass


class ServerUpdate(ServerBase):
    pass


class ServerResponse(ServerBase):
    id: int
    status: str
    last_error: Optional[str] = None
    last_checked_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HealthResponse(BaseModel):
    server_id: int
    host: str
    port: int
    reachable: bool
    status: str
    message: str
    checked_at: datetime
