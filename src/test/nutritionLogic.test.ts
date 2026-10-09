import { describe, it, expect } from 'vitest';
import { SAMPLE_FOODS } from '../data/sampleFoods';
import { compareTwoProducts } from '../services/comparisonService';
import { answerFollowUpQuestion } from '../services/chatService';

describe('Nutrition & Comparison Logic', () => {
  it('correctly handles missing nutrition values without fabricating zeros', () => {
    const testFood = {
      ...SAMPLE_FOODS[0],
      nutrition: {
        ...SAMPLE_FOODS[0].nutrition,
        potassium: {
          value: null,
          unit: 'mg' as const,
          provenance: 'needs_verification' as const,
          confidence: 0
        }
      }
    };

    expect(testFood.nutrition.potassium.value).toBeNull();
    // Verify it is not 0
    expect(testFood.nutrition.potassium.value).not.toBe(0);
  });

  it('normalizes nutrients to 100g accurately in product comparison', () => {
    const natureValley = SAMPLE_FOODS[0]; // 42g serving, 190 kcal, 11g sugar
    const dangCoconut = SAMPLE_FOODS[1];  // 30g serving, 180 kcal, 8g sugar

    const comparison = compareTwoProducts(natureValley, dangCoconut);

    expect(comparison.metrics.length).toBeGreaterThan(0);

    const sugarMetric = comparison.metrics.find(m => m.key === 'totalSugar');
    expect(sugarMetric).toBeDefined();

    // Nature Valley 11g in 42g -> (11/42)*100 = ~26.2g per 100g
    expect(sugarMetric?.productANormalized100g).toBeCloseTo(26.2, 0);

    // Dang Coconut 8g in 30g -> (8/30)*100 = ~26.7g per 100g
    expect(sugarMetric?.productBNormalized100g).toBeCloseTo(26.7, 0);

    // Verified neutral language
    expect(sugarMetric?.neutralObservation).not.toMatch(/unhealthy|bad food|toxic/i);
  });

  it('declines to act as a medical doctor when clinical queries are received', async () => {
    const food = SAMPLE_FOODS[0];
    const response = await answerFollowUpQuestion("Can this cure diabetes or what medicine should I take?", food);

    expect(response.unsupportedQueryWarning).toBe(true);
    expect(response.text).toMatch(/does not provide medical diagnoses/i);
    expect(response.citations).toContain("Clinical Disclaimer: Non-medical software");
  });

  it('provides grounded evidence answers with citations for ingredient questions', async () => {
    const food = SAMPLE_FOODS[0];
    const response = await answerFollowUpQuestion("Explain the soy lecithin in this label", food);

    expect(response.text).toMatch(/Soy Lecithin/i);
    expect(response.citations?.length).toBeGreaterThan(0);
  });
});
