import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SolveSphere Core API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = ""
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./solvesphere.db"
    )
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "solvesphere_super_secret_jwt_key_2026_default")
    JWT_REFRESH_SECRET: str = os.getenv("JWT_REFRESH_SECRET", "solvesphere_refresh_secret_jwt_key_2026_default")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    AI_SERVICE_URL: str = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
    
    class Config:
        case_sensitive = True

settings = Settings()
