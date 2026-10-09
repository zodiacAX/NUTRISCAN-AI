from fastapi import APIRouter
from ..config import settings
from ..schemas.nutrition import HealthResponse

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def get_health_status():
    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        model_provider=settings.GEMMA_PROVIDER,
        model_name=settings.GEMMA_MODEL,
        openfoodfacts_connected=True
    )
