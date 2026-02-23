import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    AUTH_MODE: str = os.getenv("AUTH_MODE", "login")
    JWT_PUBLIC_KEY_PATH: Optional[str] = os.getenv("JWT_PUBLIC_KEY_PATH", None)
    JWT_ISSUER: Optional[str] = os.getenv("JWT_ISSUER", None)
    JWT_AUDIENCE: Optional[str] = os.getenv("JWT_AUDIENCE", None)
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "RS256")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-key-for-login-mode")

    class Config:
        env_file = ".env"

settings = Settings()
