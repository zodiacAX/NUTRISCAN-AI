import React from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { ProductHeader } from './ProductHeader';
import { NutritionalBalanceBars } from './NutritionalBalanceBars';
import { CookedMealPlateDeconstruction } from './CookedMealPlateDeconstruction';
import { AlternativeProductsSection } from './AlternativeProductsSection';
import { NutritionOverview } from './NutritionOverview';
import { NutritionInterpretation } from './NutritionInterpretation';
import { IngredientList } from './IngredientList';
import { SafetyInformation } from './SafetyInformation';
import { EvidencePanel } from './EvidencePanel';
import { RecommendationCard } from './RecommendationCard';
import { FollowUpChat } from './FollowUpChat';
import { ReportPrintLayout } from './ReportPrintLayout';

interface FoodAnalysisResultsProps {
  food: FoodScanResult;
  onScanAnother: () => void;
  onCompareWithAnother: (food: FoodScanResult) => void;
}

export const FoodAnalysisResults: React.FC<FoodAnalysisResultsProps> = ({
  food,
  onScanAnother,
  onCompareWithAnother
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Result Header */}
      <ProductHeader
        food={food}
        onScanAnother={onScanAnother}
        onCompare={() => onCompareWithAnother(food)}
        onPrint={handlePrint}
      />

      {/* 2. Nutritional Balance: Negatives vs Positives (Inspired by Mobile Reference) */}
      <NutritionalBalanceBars food={food} />

      {/* 3. Nutrition Overview Metric Cards */}
      <NutritionOverview food={food} />

      {/* 4. Radial Plate Segmentation (For cooked meals inspired by Image 2) */}
      {food.scanType === 'cooked_meal' && (
        <CookedMealPlateDeconstruction food={food} />
      )}

      {/* 5. Nutrition Interpretation: "What this means" & NOVA Audit */}
      <NutritionInterpretation food={food} />

      {/* 6. Ingredients Analysis & Additives & Allergens */}
      <IngredientList ingredientsAnalysis={food.ingredientsAnalysis} />

      {/* 7. Alternative Products from Verified Database */}
      <AlternativeProductsSection
        currentFood={food}
        onCompareWithAlternative={onCompareWithAnother}
      />

      {/* 8. Food Safety & Packaging Info */}
      <SafetyInformation foodSafety={food.foodSafety} />

      {/* 9. Evidence & Verification Audit Panel */}
      <EvidencePanel evidenceItems={food.evidenceItems} />

      {/* 10. Practical Recommendations: "Your Next Best Step" */}
      <RecommendationCard
        recommendations={food.recommendations}
        onTriggerCompare={() => onCompareWithAnother(food)}
      />

      {/* 11. Follow-up Grounded Chat Drawer */}
      <FollowUpChat food={food} />

      {/* Hidden Layout strictly rendered for browser printing */}
      <ReportPrintLayout food={food} />
    </div>
  );
};
