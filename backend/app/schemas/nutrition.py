from typing import List, Literal, Optional, Dict, Any
from pydantic import BaseModel, Field

ProvenanceType = Literal[
    'extracted_from_image',
    'retrieved_from_database',
    'estimated_from_meal',
    'unknown',
    'conflicting'
]

ScanType = Literal['packaged', 'cooked_meal']
AnalysisStatus = Literal['analyzed', 'partially_verified', 'estimated', 'needs_verification']


class NutritionMetric(BaseModel):
    value: Optional[float] = None
    unit: str = "g"
    provenance: ProvenanceType = "unknown"
    confidence: float = 0.0
    daily_value_percentage: Optional[float] = None
    source_note: Optional[str] = None


class NutritionOverview(BaseModel):
    calories: NutritionMetric
    protein: NutritionMetric
    carbohydrates: NutritionMetric
    total_sugar: NutritionMetric
    added_sugar: Optional[NutritionMetric] = None
    total_fat: NutritionMetric
    saturated_fat: NutritionMetric
    trans_fat: Optional[NutritionMetric] = None
    dietary_fiber: Optional[NutritionMetric] = None
    sodium: NutritionMetric
    potassium: Optional[NutritionMetric] = None
    calcium: Optional[NutritionMetric] = None
    iron: Optional[NutritionMetric] = None


class ExtractedIngredient(BaseModel):
    name: str
    purpose: Optional[str] = None
    is_additive: bool = False
    risk_level: Optional[Literal['safe', 'caution', 'moderate']] = 'safe'
    description: Optional[str] = None
    source_e_code: Optional[str] = None


class IngredientsAnalysis(BaseModel):
    raw_extracted_text: str = ""
    extracted_ingredients: List[ExtractedIngredient] = []
    declared_allergens: List[str] = []
    cross_contamination_warnings: List[str] = []
    allergen_caution_message: str = "Always verify the original packaging. AI extraction may miss allergens."
    unreadable_sections: Optional[List[str]] = []


class FoodSafetyInfo(BaseModel):
    date_type: Literal['best_before', 'use_by', 'expiry', 'not_detected'] = 'not_detected'
    date_extracted: Optional[str] = None
    date_raw_snippet: Optional[str] = None
    is_date_ambiguous: bool = False
    storage_instructions: Optional[str] = None
    packaging_integrity_notes: Optional[str] = None
    recall_status: Dict[str, Any] = {
        "checked": True,
        "has_recalls": False,
        "details": "No active recalls registered."
    }
    safety_disclaimer: str = "Photographs alone cannot determine microbiological safety or contamination."


class EvidenceItem(BaseModel):
    id: str
    claim: str
    provenance: ProvenanceType
    extracted_snippet: str
    location_on_package: Optional[str] = None
    external_source: Optional[Dict[str, Any]] = None


class KeyTakeaway(BaseModel):
    title: str
    description: str
    sentiment: Literal['neutral', 'positive', 'warning'] = 'neutral'
    metric_tag: Optional[str] = None


class ProcessingLevel(BaseModel):
    nova_group: Literal[1, 2, 3, 4] = 4
    label: str
    explanation: str
    markers: List[str] = []


class DietarySuitability(BaseModel):
    vegetarian: Optional[bool] = None
    vegan: Optional[bool] = None
    gluten_free: Optional[bool] = None
    dairy_free: Optional[bool] = None
    keto_friendly: Optional[bool] = None


class NutritionInterpretation(BaseModel):
    key_takeaways: List[KeyTakeaway] = []
    processing_level: ProcessingLevel
    dietary_suitability: DietarySuitability = DietarySuitability()


class Recommendation(BaseModel):
    id: str
    title: str
    action: str
    rationale: str
    icon_type: Literal['compare', 'portion', 'check', 'alternative'] = 'portion'


class FoodScanResult(BaseModel):
    id: str
    name: str
    brand: Optional[str] = None
    category: str = "General Food"
    scan_type: ScanType = "packaged"
    timestamp: str
    image_url: str = ""
    status: AnalysisStatus = "analyzed"
    confidence_score: float = 0.95
    serving_basis: str = "per serving"
    serving_size_grams: Optional[float] = None
    servings_per_container: Optional[float] = None
    nutrition: NutritionOverview
    interpretation: NutritionInterpretation
    ingredients_analysis: IngredientsAnalysis
    food_safety: FoodSafetyInfo
    evidence_items: List[EvidenceItem] = []
    recommendations: List[Recommendation] = []
    suggested_questions: List[str] = []
    is_demo_sample: bool = False
    database_matched: Optional[Dict[str, Any]] = None


# Comparison Request and Response
class ComparisonRequest(BaseModel):
    product_a_id: Optional[str] = None
    product_b_id: Optional[str] = None
    product_a: Optional[FoodScanResult] = None
    product_b: Optional[FoodScanResult] = None
    normalized_per_100g: bool = True


class ComparisonMetricComparison(BaseModel):
    key: str
    label: str
    unit: str
    product_a_value: Optional[float] = None
    product_b_value: Optional[float] = None
    product_a_normalized_100g: Optional[float] = None
    product_b_normalized_100g: Optional[float] = None
    neutral_observation: str
    source_note_a: str
    source_note_b: str


class ComparisonResponse(BaseModel):
    product_a: FoodScanResult
    product_b: FoodScanResult
    metrics: List[ComparisonMetricComparison]
    allergens_a: List[str]
    allergens_b: List[str]
    nova_group_a: int
    nova_group_b: int
    general_takeaway: str


# Chat Q&A Request and Response
class AskQuestionRequest(BaseModel):
    question: str
    food_result: FoodScanResult


class AskQuestionResponse(BaseModel):
    id: str
    sender: Literal['assistant'] = 'assistant'
    text: str
    timestamp: str
    citations: List[str] = []
    unsupported_query_warning: bool = False


# Health Response
class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    model_provider: str
    model_name: str
    openfoodfacts_connected: bool
