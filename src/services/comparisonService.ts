import type { FoodScanResult } from '../types/nutrition';

export interface ComparisonMetricComparison {
  key: string;
  label: string;
  unit: string;
  productAValue: number | null;
  productBValue: number | null;
  productANormalized100g: number | null;
  productBNormalized100g: number | null;
  neutralObservation: string;
  sourceNoteA: string;
  sourceNoteB: string;
}

export interface ProductComparisonSummary {
  productA: FoodScanResult;
  productB: FoodScanResult;
  metrics: ComparisonMetricComparison[];
  allergensA: string[];
  allergensB: string[];
  novaGroupA: number;
  novaGroupB: number;
  generalTakeaway: string;
}

function normalizeTo100g(value: number | null, servingSizeGrams?: number): number | null {
  if (value === null || !servingSizeGrams || servingSizeGrams <= 0) return null;
  return Number(((value / servingSizeGrams) * 100).toFixed(1));
}

export function compareTwoProducts(
  foodA: FoodScanResult,
  foodB: FoodScanResult
): ProductComparisonSummary {
  const gramsA = foodA.servingSizeGrams || 100;
  const gramsB = foodB.servingSizeGrams || 100;

  const compareMetric = (
    key: string,
    label: string,
    unit: string,
    valA: number | null,
    valB: number | null,
    noteA: string,
    noteB: string
  ): ComparisonMetricComparison => {
    const normA = normalizeTo100g(valA, foodA.servingSizeGrams);
    const normB = normalizeTo100g(valB, foodB.servingSizeGrams);

    let observation = "Values comparable across products.";
    if (normA !== null && normB !== null) {
      const diff = Math.abs(normA - normB);
      if (diff > 0.1) {
        if (normA < normB) {
          const ratio = (normB / Math.max(normA, 0.1)).toFixed(1);
          observation = `${foodA.name} has ${diff} ${unit} lower ${label.toLowerCase()} per 100g (${ratio}x less).`;
        } else {
          const ratio = (normA / Math.max(normB, 0.1)).toFixed(1);
          observation = `${foodB.name} has ${diff} ${unit} lower ${label.toLowerCase()} per 100g (${ratio}x less).`;
        }
      } else {
        observation = `Virtually identical ${label.toLowerCase()} per 100g.`;
      }
    } else if (valA !== null && valB !== null) {
      if (valA < valB) {
        observation = `${foodA.name} is lower per stated package portion (${valA} vs ${valB} ${unit}).`;
      } else if (valA > valB) {
        observation = `${foodB.name} is lower per stated package portion (${valB} vs ${valA} ${unit}).`;
      }
    } else {
      observation = "Incomplete numerical data in one or both labels.";
    }

    return {
      key,
      label,
      unit,
      productAValue: valA,
      productBValue: valB,
      productANormalized100g: normA,
      productBNormalized100g: normB,
      neutralObservation: observation,
      sourceNoteA: noteA,
      sourceNoteB: noteB
    };
  };

  const metrics: ComparisonMetricComparison[] = [
    compareMetric(
      'calories',
      'Calories',
      'kcal',
      foodA.nutrition.calories.value,
      foodB.nutrition.calories.value,
      foodA.nutrition.calories.provenance,
      foodB.nutrition.calories.provenance
    ),
    compareMetric(
      'totalSugar',
      'Total Sugars',
      'g',
      foodA.nutrition.totalSugar.value,
      foodB.nutrition.totalSugar.value,
      foodA.nutrition.totalSugar.provenance,
      foodB.nutrition.totalSugar.provenance
    ),
    compareMetric(
      'sodium',
      'Sodium',
      'mg',
      foodA.nutrition.sodium.value,
      foodB.nutrition.sodium.value,
      foodA.nutrition.sodium.provenance,
      foodB.nutrition.sodium.provenance
    ),
    compareMetric(
      'protein',
      'Protein',
      'g',
      foodA.nutrition.protein.value,
      foodB.nutrition.protein.value,
      foodA.nutrition.protein.provenance,
      foodB.nutrition.protein.provenance
    ),
    compareMetric(
      'totalFat',
      'Total Fat',
      'g',
      foodA.nutrition.totalFat.value,
      foodB.nutrition.totalFat.value,
      foodA.nutrition.totalFat.provenance,
      foodB.nutrition.totalFat.provenance
    ),
    compareMetric(
      'saturatedFat',
      'Saturated Fat',
      'g',
      foodA.nutrition.saturatedFat.value,
      foodB.nutrition.saturatedFat.value,
      foodA.nutrition.saturatedFat.provenance,
      foodB.nutrition.saturatedFat.provenance
    )
  ];

  const sugarNormA = normalizeTo100g(foodA.nutrition.totalSugar.value, gramsA) ?? 0;
  const sugarNormB = normalizeTo100g(foodB.nutrition.totalSugar.value, gramsB) ?? 0;
  const sodiumNormA = normalizeTo100g(foodA.nutrition.sodium.value, gramsA) ?? 0;
  const sodiumNormB = normalizeTo100g(foodB.nutrition.sodium.value, gramsB) ?? 0;

  let generalTakeaway = `Comparing ${foodA.name} and ${foodB.name} on a standardized 100g basis reveals distinct trade-offs: `;
  if (sugarNormA < sugarNormB && sodiumNormA > sodiumNormB) {
    generalTakeaway += `${foodA.name} offers lower sugar density, while ${foodB.name} provides lower sodium per 100g.`;
  } else if (sugarNormA > sugarNormB && sodiumNormA < sodiumNormB) {
    generalTakeaway += `${foodB.name} offers lower sugar density, while ${foodA.name} provides lower sodium per 100g.`;
  } else {
    generalTakeaway += `Review both serving sizes carefully before making a purchasing decision, as portion scales differ (${foodA.servingBasis} vs ${foodB.servingBasis}).`;
  }

  return {
    productA: foodA,
    productB: foodB,
    metrics,
    allergensA: foodA.ingredientsAnalysis.declaredAllergens,
    allergensB: foodB.ingredientsAnalysis.declaredAllergens,
    novaGroupA: foodA.interpretation.processingLevel.novaGroup,
    novaGroupB: foodB.interpretation.processingLevel.novaGroup,
    generalTakeaway
  };
}
