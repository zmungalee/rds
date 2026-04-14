# RDS Monitoring Starter (Backend + Frontend)

## Project structure

- `backend/`: FastAPI API with auth, server inventory, health, and metrics modules.
- `frontend/`: React admin dashboard (login, inventory, add/edit form, live health).
- `infra/`: Infrastructure notes and future IaC.
- `sql/`: DB bootstrap SQL.

## Backend endpoints

- `POST /api/auth/login`
- `GET /api/servers`
- `POST /api/servers` (admin only)
- `PUT /api/servers/{id}` (admin only)
- `DELETE /api/servers/{id}` (admin only)
- `GET /api/servers/{id}/health`
- `GET /health`
- `GET /metrics`

## Run locally

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8000/docs`

## Default users

- Admin: `admin / admin123`
- Viewer: `viewer / viewer123`
