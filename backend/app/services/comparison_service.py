from typing import Optional
from ..schemas.nutrition import (
    FoodScanResult,
    ComparisonResponse,
    ComparisonMetricComparison
)


def normalize_to_100g(val: Optional[float], serving_size_grams: Optional[float]) -> Optional[float]:
    if val is None or serving_size_grams is None or serving_size_grams <= 0:
        return None
    return round((val / serving_size_grams) * 100.0, 1)


def compare_products_service(
    food_a: FoodScanResult,
    food_b: FoodScanResult,
    normalized_per_100g: bool = True
) -> ComparisonResponse:
    grams_a = food_a.serving_size_grams or 100.0
    grams_b = food_b.serving_size_grams or 100.0

    def make_metric(
        key: str,
        label: str,
        unit: str,
        val_a: Optional[float],
        val_b: Optional[float],
        note_a: str,
        note_b: str
    ) -> ComparisonMetricComparison:
        norm_a = normalize_to_100g(val_a, food_a.serving_size_grams)
        norm_b = normalize_to_100g(val_b, food_b.serving_size_grams)

        obs = "Comparable values across both products."
        if norm_a is not None and norm_b is not None:
            diff = abs(norm_a - norm_b)
            if diff > 0.1:
                if norm_a < norm_b:
                    ratio = (norm_b / max(norm_a, 0.1))
                    obs = f"{food_a.name} contains {diff:.1f} {unit} lower {label.lower()} per 100g ({ratio:.1f}x less)."
                else:
                    ratio = (norm_a / max(norm_b, 0.1))
                    obs = f"{food_b.name} contains {diff:.1f} {unit} lower {label.lower()} per 100g ({ratio:.1f}x less)."
            else:
                obs = f"Virtually equivalent {label.lower()} concentration per 100g."
        elif val_a is not None and val_b is not None:
            if val_a < val_b:
                obs = f"{food_a.name} is lower per stated package portion ({val_a} vs {val_b} {unit})."
            elif val_a > val_b:
                obs = f"{food_b.name} is lower per stated package portion ({val_b} vs {val_a} {unit})."

        return ComparisonMetricComparison(
            key=key,
            label=label,
            unit=unit,
            product_a_value=val_a,
            product_b_value=val_b,
            product_a_normalized_100g=norm_a,
            product_b_normalized_100g=norm_b,
            neutral_observation=obs,
            source_note_a=note_a,
            source_note_b=note_b
        )

    n_a = food_a.nutrition
    n_b = food_b.nutrition

    metrics = [
        make_metric('calories', 'Calories', 'kcal', n_a.calories.value, n_b.calories.value, n_a.calories.provenance, n_b.calories.provenance),
        make_metric('total_sugar', 'Total Sugar', 'g', n_a.total_sugar.value, n_b.total_sugar.value, n_a.total_sugar.provenance, n_b.total_sugar.provenance),
        make_metric('protein', 'Protein', 'g', n_a.protein.value, n_b.protein.value, n_a.protein.provenance, n_b.protein.provenance),
        make_metric('total_fat', 'Total Fat', 'g', n_a.total_fat.value, n_b.total_fat.value, n_a.total_fat.provenance, n_b.total_fat.provenance),
        make_metric('saturated_fat', 'Saturated Fat', 'g', n_a.saturated_fat.value, n_b.saturated_fat.value, n_a.saturated_fat.provenance, n_b.saturated_fat.provenance),
        make_metric('sodium', 'Sodium', 'mg', n_a.sodium.value, n_b.sodium.value, n_a.sodium.provenance, n_b.sodium.provenance)
    ]

    sugar_norm_a = normalize_to_100g(n_a.total_sugar.value, grams_a) or 0
    sugar_norm_b = normalize_to_100g(n_b.total_sugar.value, grams_b) or 0
    sodium_norm_a = normalize_to_100g(n_a.sodium.value, grams_a) or 0
    sodium_norm_b = normalize_to_100g(n_b.sodium.value, grams_b) or 0

    takeaway = f"Comparing {food_a.name} and {food_b.name} on a standardized 100g basis reveals distinct trade-offs: "
    if sugar_norm_a < sugar_norm_b and sodium_norm_a > sodium_norm_b:
        takeaway += f"{food_a.name} offers lower sugar density, while {food_b.name} offers lower sodium density per 100g."
    elif sugar_norm_a > sugar_norm_b and sodium_norm_a < sodium_norm_b:
        takeaway += f"{food_b.name} offers lower sugar density, while {food_a.name} offers lower sodium density per 100g."
    else:
        takeaway += f"Consider your personal dietary priorities and stated serving sizes ({food_a.serving_basis} vs {food_b.serving_basis})."

    return ComparisonResponse(
        product_a=food_a,
        product_b=food_b,
        metrics=metrics,
        allergens_a=food_a.ingredients_analysis.declared_allergens,
        allergens_b=food_b.ingredients_analysis.declared_allergens,
        nova_group_a=food_a.interpretation.processing_level.nova_group,
        nova_group_b=food_b.interpretation.processing_level.nova_group,
        general_takeaway=takeaway
    )
