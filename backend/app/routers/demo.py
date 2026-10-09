from fastapi import APIRouter
from typing import List
from ..schemas.nutrition import FoodScanResult
from ..services.gemma_service import DEMO_DATABASE

router = APIRouter(prefix="/api", tags=["demo"])


@router.get("/demo", response_model=List[FoodScanResult])
async def get_demo_foods():
    """
    Returns curated, verified synthetic demo items for 90-second deterministic evaluations.
    """
    return [FoodScanResult(**item) for item in DEMO_DATABASE.values()]
