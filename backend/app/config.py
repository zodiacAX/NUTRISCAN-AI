from typing import List, Literal, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "NutriScan AI Backend"
    APP_VERSION: str = "1.0.0"
    ENV: str = "development"
    DEBUG: bool = False

    # Gemma 4 / Vision Model Configuration
    GEMMA_MODEL: str = "gemma-4-27b-it"
    GEMMA_PROVIDER: Literal["demo", "google_ai_studio", "ollama", "custom"] = "demo"
    GEMMA_API_KEY: Optional[str] = None
    GEMMA_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta"
    GEMMA_TIMEOUT_SECONDS: int = 25

    # File Upload & Security Limits
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp"]

    # External Nutrition Databases (Public APIs)
    OPENFOODFACTS_BASE_URL: str = "https://world.openfoodfacts.net"
    OPENFOODFACTS_FALLBACK_URL: str = "https://us.openfoodfacts.org"
    OPENFOODFACTS_TIMEOUT_SECONDS: int = 8
    USDA_BASE_URL: str = "https://api.nal.usda.gov/fdc/v1"
    USDA_API_KEY: str = "DEMO_KEY"
    FRUITYVICE_BASE_URL: str = "https://www.fruityvice.com/api"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
