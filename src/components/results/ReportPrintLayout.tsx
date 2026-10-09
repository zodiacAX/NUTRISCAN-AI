import React from 'react';
import type { FoodScanResult } from '../../types/nutrition';

interface ReportPrintLayoutProps {
  food: FoodScanResult;
}

export const ReportPrintLayout: React.FC<ReportPrintLayoutProps> = ({ food }) => {
  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">NUTRISCAN AI — NUTRITIONAL AUDIT REPORT</h1>
          <p className="text-sm text-gray-700">Multimodal Food Intelligence & Label Extraction Report</p>
        </div>
        <div className="text-right text-xs">
          <p>Date: {new Date(food.timestamp).toLocaleDateString()}</p>
          <p>Scan ID: {food.id}</p>
          <p>Status: {food.status.toUpperCase()}</p>
        </div>
      </div>

      {/* Product Summary */}
      <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pb-4 text-sm">
        <div>
          <p className="font-bold text-lg">{food.name}</p>
          <p className="text-gray-600">{food.brand ? `Brand: ${food.brand}` : 'No brand indicated'}</p>
          <p className="text-gray-600">Category: {food.category}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Stated Serving Basis: {food.servingBasis}</p>
          <p>Processing Level: NOVA {food.interpretation.processingLevel.novaGroup} ({food.interpretation.processingLevel.label})</p>
          <p>Expiry/Best Before: {food.foodSafety.dateExtracted || 'Not detected'}</p>
        </div>
      </div>

      {/* Nutritional Breakdown Table */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-black pb-1">
          Nutritional Profile ({food.servingBasis})
        </h2>
        <table className="w-full text-xs text-left border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
              <th className="p-2 border-r border-gray-400">Nutrient</th>
              <th className="p-2 border-r border-gray-400">Extracted Value</th>
              <th className="p-2 border-r border-gray-400">% Daily Value</th>
              <th className="p-2">Provenance Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Calories</td>
              <td className="p-2 border border-gray-300">{food.nutrition.calories.value ?? 'N/A'} kcal</td>
              <td className="p-2 border border-gray-300">{food.nutrition.calories.dailyValuePercentage ?? '-'}%</td>
              <td className="p-2 border border-gray-300">{food.nutrition.calories.provenance}</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Protein</td>
              <td className="p-2 border border-gray-300">{food.nutrition.protein.value ?? 'N/A'} g</td>
              <td className="p-2 border border-gray-300">{food.nutrition.protein.dailyValuePercentage ?? '-'}%</td>
              <td className="p-2 border border-gray-300">{food.nutrition.protein.provenance}</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Carbohydrates</td>
              <td className="p-2 border border-gray-300">{food.nutrition.carbohydrates.value ?? 'N/A'} g</td>
              <td className="p-2 border border-gray-300">{food.nutrition.carbohydrates.dailyValuePercentage ?? '-'}%</td>
              <td className="p-2 border border-gray-300">{food.nutrition.carbohydrates.provenance}</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Total Sugars</td>
              <td className="p-2 border border-gray-300">{food.nutrition.totalSugar.value ?? 'N/A'} g</td>
              <td className="p-2 border border-gray-300">{food.nutrition.totalSugar.dailyValuePercentage ?? '-'}%</td>
              <td className="p-2 border border-gray-300">{food.nutrition.totalSugar.provenance}</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Total Fat</td>
              <td className="p-2 border border-gray-300">{food.nutrition.totalFat.value ?? 'N/A'} g</td>
              <td className="p-2 border border-gray-300">{food.nutrition.totalFat.dailyValuePercentage ?? '-'}%</td>
              <td className="p-2 border border-gray-300">{food.nutrition.totalFat.provenance}</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Saturated Fat</td>
              <td className="p-2 border border-gray-300">{food.nutrition.saturatedFat.value ?? 'N/A'} g</td>
              <td className="p-2 border border-gray-300">{food.nutrition.saturatedFat.dailyValuePercentage ?? '-'}%</td>
              <td className="p-2 border border-gray-300">{food.nutrition.saturatedFat.provenance}</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Sodium</td>
              <td className="p-2 border border-gray-300">{food.nutrition.sodium.value ?? 'N/A'} mg</td>
              <td className="p-2 border border-gray-300">{food.nutrition.sodium.dailyValuePercentage ?? '-'}%</td>
              <td className="p-2 border border-gray-300">{food.nutrition.sodium.provenance}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ingredients & Allergens */}
      <div className="space-y-2 text-xs border-b border-gray-300 pb-4">
        <h2 className="font-bold uppercase tracking-wider border-b border-black pb-1">
          Ingredients OCR Text
        </h2>
        <p className="font-mono bg-gray-50 p-2 border border-gray-300">
          {food.ingredientsAnalysis.rawExtractedText}
        </p>
        <p className="font-semibold text-rose-800">
          Declared Allergens: {food.ingredientsAnalysis.declaredAllergens.join(', ') || 'None declared'}
        </p>
        <p className="text-gray-700">
          Cross-Contamination Warnings: {food.ingredientsAnalysis.crossContaminationWarnings.join(', ') || 'None visible'}
        </p>
      </div>

      {/* Disclaimers & Sign-off */}
      <div className="text-[10px] text-gray-500 leading-tight space-y-1">
        <p><strong>Clinical Disclaimer:</strong> NutriScan AI is an educational food literacy tool and does not provide medical diagnoses or dietary prescriptions. Optical character recognition may occasionally misread packaging folds or fine print. Always examine physical food containers for severe allergens.</p>
        <p>NutriScan AI • Powered by Gemma 4 Multimodal Intelligence • Open Food Facts & USDA Verified Reference Integration.</p>
      </div>
    </div>
  );
};
