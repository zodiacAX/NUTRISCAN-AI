import httpx
from typing import Optional, Dict, Any, List
from ..config import settings


class OpenFoodFactsService:
    def __init__(self):
        self.base_url = settings.OPENFOODFACTS_BASE_URL
        self.timeout = settings.OPENFOODFACTS_TIMEOUT_SECONDS
        self.headers = {
            "User-Agent": "NutriScanAI-MLH-Hackathon/1.0 (https://github.com/nutriscan-ai)"
        }

    async def search_product_by_name(self, query: str) -> List[Dict[str, Any]]:
        """
        Queries Open Food Facts for products matching the given name query.
        Returns up to 5 matching products or empty list on failure/timeout.
        """
        if not query or len(query.strip()) < 2:
            return []

        search_url = f"{self.base_url}/cgi/search.pl"
        params = {
            "search_terms": query.strip(),
            "search_simple": "1",
            "action": "process",
            "json": "1",
            "page_size": "5",
            "fields": "code,product_name,brands,nutriments,ingredients_text,allergens,nova_group,image_url"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(search_url, params=params, headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    products = data.get("products", [])
                    return [self._format_product_summary(p) for p in products if p.get("product_name")]
        except (httpx.TimeoutException, httpx.RequestError, Exception):
            # Graceful fallback on timeout or offline state
            pass

        return []

    async def match_product(self, product_name: str, brand: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Attempts to match an extracted product name to an official Open Food Facts record.
        """
        query = f"{brand} {product_name}".strip() if brand else product_name
        results = await self.search_product_by_name(query)
        if results:
            return results[0]
        return None

    def _format_product_summary(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        code = raw.get("code", "")
        nutriments = raw.get("nutriments", {})
        
        return {
            "code": code,
            "product_name": raw.get("product_name", "Unknown Product"),
            "brand": raw.get("brands", ""),
            "url": f"{self.base_url}/product/{code}" if code else None,
            "nova_group": raw.get("nova_group"),
            "allergens": [a.strip() for a in raw.get("allergens", "").split(",") if a.strip()],
            "nutriments_100g": {
                "calories_kcal": nutriments.get("energy-kcal_100g"),
                "protein_g": nutriments.get("proteins_100g"),
                "carbohydrates_g": nutriments.get("carbohydrates_100g"),
                "total_sugar_g": nutriments.get("sugars_100g"),
                "total_fat_g": nutriments.get("fat_100g"),
                "saturated_fat_g": nutriments.get("saturated-fat_100g"),
                "sodium_mg": round(nutriments.get("sodium_100g", 0) * 1000, 1) if nutriments.get("sodium_100g") is not None else None,
                "fiber_g": nutriments.get("fiber_100g")
            }
        }


openfoodfacts_client = OpenFoodFactsService()
