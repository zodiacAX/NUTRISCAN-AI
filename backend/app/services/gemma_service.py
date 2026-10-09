import json
import base64
import re
import datetime
from typing import Optional, Dict, Any, Tuple
import httpx
from pydantic import ValidationError

from ..config import settings
from ..schemas.nutrition import FoodScanResult, ProvenanceType
from .openfoodfacts_service import openfoodfacts_client

# Curated synthetic demo records for deterministic testing and instant hackathon evaluation
DEMO_DATABASE: Dict[str, Dict[str, Any]] = {
    "granola": {
        "id": "demo-nature-valley",
        "name": "Nature Valley Crunchy Granola Bars",
        "brand": "Nature Valley",
        "category": "Snack & Granola Bars",
        "scan_type": "packaged",
        "timestamp": "2026-10-09T10:15:00Z",
        "image_url": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
        "status": "analyzed",
        "confidence_score": 0.96,
        "serving_basis": "per 2 bars (42 g)",
        "serving_size_grams": 42.0,
        "servings_per_container": 6.0,
        "is_demo_sample": True,
        "nutrition": {
            "calories": {
                "value": 190.0,
                "unit": "kcal",
                "provenance": "extracted_from_image",
                "confidence": 0.98,
                "daily_value_percentage": 10.0,
                "source_note": "Extracted from Nutrition Facts panel row 1"
            },
            "protein": {
                "value": 3.0,
                "unit": "g",
                "provenance": "extracted_from_image",
                "confidence": 0.95,
                "daily_value_percentage": 6.0,
                "source_note": "Extracted: Protein 3g"
            },
            "carbohydrates": {
                "value": 29.0,
                "unit": "g",
                "provenance": "extracted_from_image",
                "confidence": 0.98,
                "daily_value_percentage": 11.0,
                "source_note": "Extracted: Total Carbohydrate 29g"
            },
            "total_sugar": {
                "value": 11.0,
                "unit": "g",
                "provenance": "extracted_from_image",
                "confidence": 0.97,
                "daily_value_percentage": 22.0,
                "source_note": "Extracted: Total Sugars 11g (Includes 11g Added Sugars, 22% DV)"
            },
            "added_sugar": {
                "value": 11.0,
                "unit": "g",
                "provenance": "extracted_from_image",
                "confidence": 0.97,
                "daily_value_percentage": 22.0,
                "source_note": "Extracted: Includes 11g Added Sugars"
            },
            "total_fat": {
                "value": 7.0,
                "unit": "g",
                "provenance": "extracted_from_image",
                "confidence": 0.96,
                "daily_value_percentage": 9.0,
                "source_note": "Extracted: Total Fat 7g"
            },
            "saturated_fat": {
                "value": 1.0,
                "unit": "g",
                "provenance": "extracted_from_image",
                "confidence": 0.94,
                "daily_value_percentage": 5.0,
                "source_note": "Extracted: Saturated Fat 1g"
            },
            "dietary_fiber": {
                "value": 2.0,
                "unit": "g",
                "provenance": "extracted_from_image",
                "confidence": 0.93,
                "daily_value_percentage": 7.0,
                "source_note": "Extracted: Dietary Fiber 2g"
            },
            "sodium": {
                "value": 140.0,
                "unit": "mg",
                "provenance": "extracted_from_image",
                "confidence": 0.97,
                "daily_value_percentage": 6.0,
                "source_note": "Extracted: Sodium 140mg"
            }
        },
        "interpretation": {
            "key_takeaways": [
                {
                    "title": "High Added Sugar Density",
                    "description": "11g of sugar per 42g serving represents over 26% of this bar by weight. Delivers 22% of daily recommended added sugar in one snack.",
                    "sentiment": "warning",
                    "metric_tag": "11g Sugar (22% DV)"
                },
                {
                    "title": "Low Saturated Fat & Moderate Sodium",
                    "description": "Contains only 1g saturated fat and 140mg sodium, which is modest for commercial packaged baked snacks.",
                    "sentiment": "positive",
                    "metric_tag": "1g Sat Fat / 140mg Na"
                }
            ],
            "processing_level": {
                "nova_group": 4,
                "label": "Ultra-Processed Food (Nova 4)",
                "explanation": "Formulated with industrially extracted ingredients including canola oil, soy lecithin, and refined sugar syrups alongside whole rolled oats.",
                "markers": ["Canola Oil", "Soy Lecithin", "Refined Sugar Syrup", "Baking Soda"]
            },
            "dietary_suitability": {
                "vegetarian": True,
                "vegan": False,
                "gluten_free": False,
                "dairy_free": True
            }
        },
        "ingredients_analysis": {
            "raw_extracted_text": "WHOLE GRAIN OATS, SUGAR, CANOLA OIL, RICE FLOUR, HONEY, BROWN SUGAR SYRUP, SALT, BAKING SODA, SOY LECITHIN, NATURAL FLAVOR. CONTAINS SOY; MAY CONTAIN ALMOND, PEANUT AND PECAN INGREDIENTS.",
            "extracted_ingredients": [
                {"name": "Whole Grain Oats", "purpose": "Primary grain base", "is_additive": False, "risk_level": "safe", "description": "Unrefined oats providing complex carbohydrates and beta-glucan fiber."},
                {"name": "Sugar", "purpose": "Sweetener", "is_additive": False, "risk_level": "caution", "description": "Refined caloric sweetener."},
                {"name": "Canola Oil", "purpose": "Fat source", "is_additive": False, "risk_level": "safe", "description": "Vegetable oil rich in monounsaturated fats."},
                {"name": "Soy Lecithin", "purpose": "Emulsifier", "is_additive": True, "risk_level": "safe", "description": "Phospholipid (E322) facilitating oil and moisture dispersion.", "source_e_code": "E322"}
            ],
            "declared_allergens": ["Soy"],
            "cross_contamination_warnings": ["Almonds", "Peanuts", "Pecans"],
            "allergen_caution_message": "Always verify the original packaging. AI extraction may miss allergens."
        },
        "food_safety": {
            "date_type": "best_before",
            "date_extracted": "18 NOV 2026",
            "date_raw_snippet": "BB 18NOV26 04:12 CT2",
            "is_date_ambiguous": False,
            "storage_instructions": "Store in a cool, dry pantry away from direct sunlight.",
            "packaging_integrity_notes": "Individually sealed dual-bar pouch intact.",
            "recall_status": {
                "checked": True,
                "has_recalls": False,
                "details": "No active recalls registered for Nature Valley Oats 'n Honey batch CT2."
            },
            "safety_disclaimer": "Photographs alone cannot determine microbiological safety or contamination."
        },
        "evidence_items": [
            {
                "id": "ev-1",
                "claim": "Calories: 190 kcal per 42g serving",
                "provenance": "extracted_from_image",
                "extracted_snippet": "Nutrition Facts | Serving size 2 bars (42g) | Calories 190",
                "location_on_package": "Back panel, Nutrition Facts table header",
                "external_source": {"name": "Open Food Facts", "referenceId": "0016000264648"}
            }
        ],
        "recommendations": [
            {
                "id": "rec-1",
                "title": "Account for 2-Bar Portions",
                "action": "Each pouch contains 2 bars totaling 190 calories and 11g sugar. If you only eat 1 bar, divide values by two.",
                "rationale": "Many consumers assume the label represents 1 bar.",
                "icon_type": "portion"
            }
        ],
        "suggested_questions": [
            "Why is this classified as Nova 4 Ultra-processed?",
            "How much sugar is in just one bar?",
            "Is this snack suitable for someone with a peanut allergy?"
        ]
    },
    "cooked_meal": {
        "id": "demo-pasta-plate",
        "name": "Artisan Tomato Basil Pasta & Garden Salad",
        "brand": "Cooked Meal (Plated Bistro / Home)",
        "category": "Fresh Cooked Meals",
        "scan_type": "cooked_meal",
        "timestamp": "2026-10-09T08:30:00Z",
        "image_url": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
        "status": "estimated",
        "confidence_score": 0.88,
        "serving_basis": "estimated portion (350 g)",
        "serving_size_grams": 350.0,
        "is_demo_sample": True,
        "nutrition": {
            "calories": {
                "value": 520.0,
                "unit": "kcal",
                "provenance": "estimated_from_meal",
                "confidence": 0.86,
                "daily_value_percentage": 26.0,
                "source_note": "Estimated from computer vision volumetric segmentation of pasta and dressing"
            },
            "protein": {
                "value": 22.0,
                "unit": "g",
                "provenance": "estimated_from_meal",
                "confidence": 0.84,
                "daily_value_percentage": 44.0,
                "source_note": "Estimated based on lean ground beef ragù and parmesan topping"
            },
            "carbohydrates": {
                "value": 64.0,
                "unit": "g",
                "provenance": "estimated_from_meal",
                "confidence": 0.87,
                "daily_value_percentage": 23.0,
                "source_note": "Estimated based on ~180g cooked semolina spaghetti"
            },
            "total_sugar": {
                "value": 7.0,
                "unit": "g",
                "provenance": "estimated_from_meal",
                "confidence": 0.82,
                "daily_value_percentage": 14.0,
                "source_note": "Naturally occurring sugars from cooked crushed tomatoes and carrots"
            },
            "total_fat": {
                "value": 18.0,
                "unit": "g",
                "provenance": "estimated_from_meal",
                "confidence": 0.81,
                "daily_value_percentage": 23.0,
                "source_note": "Derived from olive oil dressing, cheese, and lean meat blend"
            },
            "saturated_fat": {
                "value": 5.5,
                "unit": "g",
                "provenance": "estimated_from_meal",
                "confidence": 0.79,
                "daily_value_percentage": 28.0,
                "source_note": "Derived from grated aged cheese and beef content"
            },
            "dietary_fiber": {
                "value": 5.0,
                "unit": "g",
                "provenance": "estimated_from_meal",
                "confidence": 0.83,
                "daily_value_percentage": 18.0,
                "source_note": "Estimated from arugula, spinach, cherry tomatoes, and basil"
            },
            "sodium": {
                "value": 620.0,
                "unit": "mg",
                "provenance": "estimated_from_meal",
                "confidence": 0.75,
                "daily_value_percentage": 27.0,
                "source_note": "Estimated based on typical restaurant pasta water and salted sauce"
            }
        },
        "interpretation": {
            "key_takeaways": [
                {
                    "title": "Balanced Macronutrient Distribution",
                    "description": "Features a balanced 50% carb / 22% protein / 28% fat energy ratio with meaningful dietary fiber from fresh leafy greens.",
                    "sentiment": "positive",
                    "metric_tag": "22g Protein / 5g Fiber"
                },
                {
                    "title": "Computer Vision Volume Estimation",
                    "description": "Portion size is estimated from 2D plate perspective at ~350g total weight. Exact values vary depending on oil and sauce volume.",
                    "sentiment": "neutral",
                    "metric_tag": "~350g Estimated Plate"
                }
            ],
            "processing_level": {
                "nova_group": 2,
                "label": "Culinary Preparation (Nova 2)",
                "explanation": "Hand-cooked meal combining minimally processed foods (pasta, vegetables, beef) with culinary ingredients (olive oil, salt, spices).",
                "markers": ["Semolina Pasta", "Fresh Leaf Greens", "Tomato Ragù", "Olive Oil", "Aged Cheese"]
            },
            "dietary_suitability": {
                "vegetarian": False,
                "vegan": False,
                "gluten_free": False,
                "dairy_free": False
            }
        },
        "ingredients_analysis": {
            "raw_extracted_text": "VISUALLY IDENTIFIED COMPONENTS: Cooked semolina spaghetti, slow-simmered tomato ragù with minced beef, fresh basil leaves, shaved parmesan cheese, side garden salad with baby spinach, arugula, cherry tomatoes, and olive oil vinaigrette.",
            "extracted_ingredients": [
                {"name": "Semolina Spaghetti", "purpose": "Carbohydrate base", "is_additive": False, "risk_level": "safe", "description": "Enriched durum wheat semolina pasta."},
                {"name": "Crushed Tomatoes & Basil", "purpose": "Sauce base", "is_additive": False, "risk_level": "safe", "description": "Rich source of lycopene antioxidant and vitamin C."},
                {"name": "Minced Beef Ragù", "purpose": "Protein source", "is_additive": False, "risk_level": "safe", "description": "Provides bioavailable iron and protein."}
            ],
            "declared_allergens": ["Wheat (Gluten)", "Milk / Dairy"],
            "cross_contamination_warnings": [],
            "allergen_caution_message": "Always verify the original packaging. AI extraction may miss allergens."
        },
        "food_safety": {
            "date_type": "not_detected",
            "date_extracted": None,
            "is_date_ambiguous": False,
            "storage_instructions": "Freshly cooked meal. Refrigerate leftovers in an airtight container within 2 hours at below 4°C.",
            "recall_status": {"checked": False, "has_recalls": False, "details": "Not applicable to fresh plated meals."},
            "safety_disclaimer": "Photographs alone cannot determine microbiological safety or contamination."
        },
        "evidence_items": [
            {
                "id": "ev-p1",
                "claim": "Carbohydrates & Calories derived from visual pasta volume",
                "provenance": "estimated_from_meal",
                "extracted_snippet": "Spaghetti segmented area: ~180g cooked mass. Caloric range: 500-560 kcal.",
                "location_on_package": "Plate center quadrant",
                "external_source": {"name": "USDA Standard Reference Pasta, cooked", "referenceId": "FDC ID 168936"}
            }
        ],
        "recommendations": [
            {
                "id": "rec-p1",
                "title": "Adjust for Hidden Cooking Oils",
                "action": "If cooked in a restaurant, sodium and added oils may be 20-30% higher than baseline home recipes.",
                "rationale": "Commercial kitchens often use higher butter and salt concentrations.",
                "icon_type": "portion"
            }
        ],
        "suggested_questions": [
            "How accurate are AI calorie estimates for cooked meals?",
            "Can Gemma 4 detect how much oil was used in the sauce?",
            "Is the protein content high enough for post-workout recovery?"
        ]
    }
}


def sanitize_user_input(text: str) -> str:
    """
    Prevents prompt injection by stripping control sequences and common injection patterns.
    """
    if not text:
        return ""
    # Strip attempts to break instruction delimiters or impersonate system role
    forbidden_patterns = [
        r"(?i)ignore\s+(all\s+)?previous\s+instructions",
        r"(?i)system\s*:\s*",
        r"(?i)assistant\s*:\s*",
        r"(?i)developer\s*:\s*",
        r"(?i)<\s*system\s*>",
        r"(?i)override\s+safety\s+guidelines"
    ]
    cleaned = text
    for pattern in forbidden_patterns:
        cleaned = re.sub(pattern, "[sanitized]", cleaned)
    # Limit length to 300 characters
    return cleaned[:300].strip()


class GemmaInferenceService:
    def __init__(self):
        self.provider = settings.GEMMA_PROVIDER
        self.model = settings.GEMMA_MODEL
        self.api_key = settings.GEMMA_API_KEY
        self.base_url = settings.GEMMA_BASE_URL
        self.timeout = settings.GEMMA_TIMEOUT_SECONDS

    async def analyze_food_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        filename: str,
        food_type: str = "packaged",
        user_context: str = ""
    ) -> FoodScanResult:
        """
        Executes multimodal analysis with Gemma 4 or configured provider.
        Distinguishes model extraction from database verification.
        Falls back to explicitly labeled Demo Adapter if provider is 'demo' or API key is absent.
        """
        sanitized_context = sanitize_user_input(user_context)

        # 1. Live Provider execution (Google AI Studio / Gemma Gateway)
        if self.provider in ["google_ai_studio", "custom"] and self.api_key:
            return await self._call_google_ai_studio(image_bytes, mime_type, food_type, sanitized_context)

        # 2. Local Ollama Gemma 4 execution
        if self.provider == "ollama":
            return await self._call_ollama(image_bytes, mime_type, food_type, sanitized_context)

        # 3. Explicitly labeled Demo Adapter Mode
        return await self._execute_demo_adapter(filename, food_type, sanitized_context)

    async def _call_google_ai_studio(
        self,
        image_bytes: bytes,
        mime_type: str,
        food_type: str,
        user_context: str
    ) -> FoodScanResult:
        base64_img = base64.b64encode(image_bytes).decode("utf-8")
        prompt = f"""
You are Gemma 4 Multimodal Food Intelligence for NutriScan AI.
Analyze this food photograph.
Food Type Target: {food_type}
User Context Note: {user_context}

Extract:
1. Product name, brand, category, stated serving basis.
2. Nutrition Facts per serving (Calories, Protein, Carbs, Total Sugar, Added Sugar, Total Fat, Saturated Fat, Sodium).
3. Complete extracted ingredients and declared allergens.
4. Food processing Nova Group (1, 2, 3, or 4).
5. Expiry or best-before stamp.
6. Evidence snippets and actionable recommendations.

Respond ONLY with valid JSON conforming strictly to the NutriScan AI FoodScanResult schema. Do not include markdown code block backticks.
"""
        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": base64_img
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.1
            }
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.post(url, json=payload)
                if res.status_code != 200:
                    raise RuntimeError(f"Gemma inference provider returned status {res.status_code}: {res.text}")

                data = res.json()
                candidates = data.get("candidates", [])
                if not candidates:
                    raise ValueError("Model returned empty candidates list.")

                raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if not raw_text.strip():
                    raise ValueError("Empty model response text received.")

                clean_json = raw_text.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:-3].strip()
                elif clean_json.startswith("```"):
                    clean_json = clean_json[3:-3].strip()

                parsed = json.loads(clean_json)
                result = FoodScanResult(**parsed)

                # Enrich with Open Food Facts if packaged
                if result.scan_type == "packaged" and result.name:
                    db_match = await openfoodfacts_client.match_product(result.name, result.brand)
                    if db_match:
                        result.database_matched = db_match

                return result
        except httpx.TimeoutException:
            raise TimeoutError(f"Gemma 4 model request timed out after {self.timeout} seconds.")
        except json.JSONDecodeError as err:
            raise ValueError(f"Malformed JSON returned by model: {str(err)}")
        except ValidationError as err:
            raise ValueError(f"Model output schema validation failed: {str(err)}")

    async def _call_ollama(
        self,
        image_bytes: bytes,
        mime_type: str,
        food_type: str,
        user_context: str
    ) -> FoodScanResult:
        base64_img = base64.b64encode(image_bytes).decode("utf-8")
        url = f"{self.base_url}/api/generate"
        prompt = f"Analyze this {food_type} image for NutriScan AI and return structured nutrition facts in JSON."
        payload = {
            "model": self.model,
            "prompt": prompt,
            "images": [base64_img],
            "stream": False,
            "format": "json"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.post(url, json=payload)
                if res.status_code != 200:
                    raise RuntimeError(f"Ollama returned HTTP {res.status_code}")
                data = res.json()
                raw_text = data.get("response", "")
                parsed = json.loads(raw_text)
                return FoodScanResult(**parsed)
        except Exception as err:
            raise RuntimeError(f"Ollama Gemma 4 error: {str(err)}")

    async def _execute_demo_adapter(
        self,
        filename: str,
        food_type: str,
        user_context: str
    ) -> FoodScanResult:
        """
        Deterministic, verified Demo Adapter.
        Explicitly flags `is_demo_sample: True` to ensure transparency.
        """
        lower_name = filename.lower()
        if food_type == "cooked_meal" or "pasta" in lower_name or "meal" in lower_name:
            template = DEMO_DATABASE["cooked_meal"].copy()
            if user_context:
                template["food_safety"]["storage_instructions"] = f"User note: '{user_context}'. Refrigerate within 2 hours."
        else:
            template = DEMO_DATABASE["granola"].copy()

        template["id"] = f"scan-{int(datetime.datetime.now().timestamp())}"
        template["timestamp"] = datetime.datetime.now().isoformat()
        template["is_demo_sample"] = True

        result = FoodScanResult(**template)

        # Attempt real Open Food Facts matching
        db_match = await openfoodfacts_client.match_product(result.name, result.brand)
        if db_match:
            result.database_matched = db_match

        return result


gemma_service = GemmaInferenceService()
