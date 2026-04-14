from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RDS Monitor API"
    environment: str = "development"
    database_url: str = "postgresql+psycopg2://postgres:postgres@db:5432/rds"
    encryption_key: str = "dev-encryption-key-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    polling_interval_seconds: int = 30

    admin_username: str = "admin"
    admin_password: str = "admin123"
    user_username: str = "viewer"
    user_password: str = "viewer123"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


settings = Settings()
