from fastapi import APIRouter, Query
from typing import List, Dict, Any
from ..services.openfoodfacts_service import openfoodfacts_client

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/search", response_model=List[Dict[str, Any]])
async def search_products_endpoint(
    q: str = Query(..., min_length=2, description="Food or brand name query")
):
    """
    Search Open Food Facts database for matched products.
    """
    results = await openfoodfacts_client.search_product_by_name(q)
    return results
