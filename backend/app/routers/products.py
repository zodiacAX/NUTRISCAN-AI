from fastapi import APIRouter, Query, HTTPException, status
from typing import List, Dict, Any
from ..services.openfoodfacts_service import openfoodfacts_client
from ..schemas.nutrition import FoodScanResult

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/search", response_model=List[Dict[str, Any]])
async def search_products_endpoint(
    q: str = Query(..., min_length=2, description="Food or brand name query")
):
    """
    Real-time live search across public food APIs (Open Food Facts, USDA FoodData Central, Fruityvice).
    """
    results = await openfoodfacts_client.search_product_by_name(q)
    return results


@router.get("/barcode/{barcode}", response_model=FoodScanResult)
async def get_product_by_barcode_endpoint(barcode: str):
    """
    Instant real-time product lookup by barcode from Open Food Facts API,
    converted directly to a full FoodScanResult.
    """
    result = await openfoodfacts_client.fetch_by_barcode(barcode)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with barcode '{barcode}' was not found in the public Open Food Facts database."
        )
    return result


@router.post("/convert", response_model=FoodScanResult)
async def convert_product_summary_endpoint(summary: Dict[str, Any]):
    """
    Converts a real-time public food database search record into a full FoodScanResult
    for analysis, comparison, and follow-up AI Q&A.
    """
    return openfoodfacts_client.convert_summary_to_scan_result(summary)
