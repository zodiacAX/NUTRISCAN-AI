from fastapi import APIRouter, HTTPException, status
from ..schemas.nutrition import ComparisonRequest, ComparisonResponse
from ..services.comparison_service import compare_products_service
from ..services.gemma_service import DEMO_DATABASE
from ..schemas.nutrition import FoodScanResult

router = APIRouter(prefix="/api", tags=["compare"])


@router.post("/compare", response_model=ComparisonResponse)
async def compare_endpoint(req: ComparisonRequest):
    """
    Compares two products with 100g unit normalization and neutral observations.
    Accepts full FoodScanResult payloads or demo IDs ('granola', 'cooked_meal').
    """
    prod_a = req.product_a
    prod_b = req.product_b

    if not prod_a and req.product_a_id:
        if req.product_a_id in DEMO_DATABASE:
            prod_a = FoodScanResult(**DEMO_DATABASE[req.product_a_id])
    if not prod_b and req.product_b_id:
        if req.product_b_id in DEMO_DATABASE:
            prod_b = FoodScanResult(**DEMO_DATABASE[req.product_b_id])

    if not prod_a or not prod_b:
        # Fallback to default demo pair if missing
        prod_a = prod_a or FoodScanResult(**DEMO_DATABASE["granola"])
        prod_b = prod_b or FoodScanResult(**DEMO_DATABASE["cooked_meal"])

    return compare_products_service(prod_a, prod_b, normalized_per_100g=req.normalized_per_100g)
