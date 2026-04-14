from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_admin
from ..models import Server
from ..schemas import HealthResponse, ServerCreate, ServerResponse, ServerUpdate
from ..services.health_check import check_server_health

router = APIRouter(prefix="/api/servers", tags=["servers"])


@router.get("", response_model=list[ServerResponse], dependencies=[Depends(get_current_user)])
def list_servers(db: Session = Depends(get_db)):
    return db.query(Server).order_by(Server.id.asc()).all()


@router.post("", response_model=ServerResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_server(payload: ServerCreate, db: Session = Depends(get_db)):
    server = Server(**payload.model_dump())
    db.add(server)
    db.commit()
    db.refresh(server)
    return server


@router.put("/{server_id}", response_model=ServerResponse, dependencies=[Depends(require_admin)])
def update_server(server_id: int, payload: ServerUpdate, db: Session = Depends(get_db)):
    server = db.query(Server).filter(Server.id == server_id).first()
    if not server:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Server not found")

    for key, value in payload.model_dump().items():
        setattr(server, key, value)

    db.commit()
    db.refresh(server)
    return server


@router.delete("/{server_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_server(server_id: int, db: Session = Depends(get_db)):
    server = db.query(Server).filter(Server.id == server_id).first()
    if not server:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Server not found")

    db.delete(server)
    db.commit()


@router.get("/{server_id}/health", response_model=HealthResponse, dependencies=[Depends(get_current_user)])
def get_server_health(server_id: int, db: Session = Depends(get_db)):
    server = db.query(Server).filter(Server.id == server_id).first()
    if not server:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Server not found")

    result = check_server_health(server.host, server.port, server.username, server.password)
    server.status = result["status"]
    server.last_error = None if result["reachable"] else result["message"]
    server.last_checked_at = result["checked_at"]

    db.commit()

    return HealthResponse(
        server_id=server.id,
        host=server.host,
        port=server.port,
        reachable=result["reachable"],
        status=result["status"],
        message=result["message"],
        checked_at=result["checked_at"],
    )
