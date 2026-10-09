import React, { useState } from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { compareTwoProducts } from '../../services/comparisonService';
import { GitCompare, Info, ArrowRight } from 'lucide-react';
import { NovaBadge } from '../common/Badge';

interface ProductComparisonProps {
  availableFoods: FoodScanResult[];
  initialProductA?: FoodScanResult;
  initialProductB?: FoodScanResult;
  onSelectFoodToView?: (food: FoodScanResult) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  availableFoods,
  initialProductA,
  initialProductB,
  onSelectFoodToView
}) => {
  const [productAId, setProductAId] = useState<string>(
    initialProductA?.id || availableFoods[0]?.id || ''
  );
  const [productBId, setProductBId] = useState<string>(
    initialProductB?.id || availableFoods[1]?.id || availableFoods[0]?.id || ''
  );
  const [normalizedPer100g, setNormalizedPer100g] = useState<boolean>(true);

  const productA = availableFoods.find(f => f.id === productAId) || availableFoods[0];
  const productB = availableFoods.find(f => f.id === productBId) || availableFoods[1] || availableFoods[0];

  const comparison = productA && productB ? compareTwoProducts(productA, productB) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8E0] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E4F0E5] flex items-center justify-center text-[#163D2B]">
              <GitCompare size={18} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163D2B]">
              Product Comparison Engine
            </h1>
          </div>
          <p className="text-xs text-[#68736B] mt-1">
            Standardized nutrient evaluation with neutral, evidence-grounded comparative insights
          </p>
        </div>

        {/* Normalization Toggle */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E2E8E0] shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setNormalizedPer100g(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              normalizedPer100g
                ? 'bg-[#163D2B] text-white shadow-xs'
                : 'text-[#68736B] hover:text-[#1D2921]'
            }`}
          >
            Normalized (Per 100 g)
          </button>
          <button
            type="button"
            onClick={() => setNormalizedPer100g(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !normalizedPer100g
                ? 'bg-[#163D2B] text-white shadow-xs'
                : 'text-[#68736B] hover:text-[#1D2921]'
            }`}
          >
            Stated Package Portion
          </button>
        </div>
      </div>

      {/* Product Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector A */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8E0] shadow-2xs space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#163D2B] block">
            Product A Selection
          </label>
          <select
            value={productAId}
            onChange={(e) => setProductAId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#E2E8E0] bg-[#F6F4E9]/50 text-xs font-semibold text-[#1D2921] focus:outline-none focus:border-[#163D2B]"
          >
            {availableFoods.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.servingBasis})
              </option>
            ))}
          </select>

          {productA && (
            <div className="flex items-center gap-3 pt-2">
              <img
                src={productA.imageUrl}
                alt={productA.name}
                className="w-14 h-14 rounded-lg object-cover border border-[#ECEEEA]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-[#1D2921] truncate">{productA.name}</h4>
                <p className="text-[11px] text-[#68736B]">Portion: {productA.servingBasis}</p>
                <div className="flex items-center justify-between mt-1">
                  <NovaBadge novaGroup={productA.interpretation.processingLevel.novaGroup} />
                  {onSelectFoodToView && (
                    <button
                      type="button"
                      onClick={() => onSelectFoodToView(productA)}
                      className="text-[11px] font-semibold text-[#163D2B] hover:underline flex items-center gap-0.5"
                    >
                      <span>View Report</span>
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selector B */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8E0] shadow-2xs space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#3D7954] block">
            Product B Selection
          </label>
          <select
            value={productBId}
            onChange={(e) => setProductBId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#E2E8E0] bg-[#F6F4E9]/50 text-xs font-semibold text-[#1D2921] focus:outline-none focus:border-[#3D7954]"
          >
            {availableFoods.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.servingBasis})
              </option>
            ))}
          </select>

          {productB && (
            <div className="flex items-center gap-3 pt-2">
              <img
                src={productB.imageUrl}
                alt={productB.name}
                className="w-14 h-14 rounded-lg object-cover border border-[#ECEEEA]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-[#1D2921] truncate">{productB.name}</h4>
                <p className="text-[11px] text-[#68736B]">Portion: {productB.servingBasis}</p>
                <div className="flex items-center justify-between mt-1">
                  <NovaBadge novaGroup={productB.interpretation.processingLevel.novaGroup} />
                  {onSelectFoodToView && (
                    <button
                      type="button"
                      onClick={() => onSelectFoodToView(productB)}
                      className="text-[11px] font-semibold text-[#3D7954] hover:underline flex items-center gap-0.5"
                    >
                      <span>View Report</span>
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {comparison && (
        <div className="space-y-6">
          {/* Neutral Takeaway Banner */}
          <div className="p-4 rounded-2xl bg-[#E4F0E5] border border-[#3D7954]/30 flex items-start gap-3 text-xs text-[#163D2B]">
            <Info size={18} className="text-[#3D7954] shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold uppercase tracking-wide block mb-0.5">
                Neutral Comparative Takeaway:
              </span>
              <p className="leading-relaxed font-medium">
                {comparison.generalTakeaway}
              </p>
            </div>
          </div>

          {/* Metric Comparison Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8E0] overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-[#ECEEEA] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#163D2B]">
                Nutrient Metric Comparison Table ({normalizedPer100g ? 'Per 100 g Normalized' : 'Stated Serving Basis'})
              </h3>
              <span className="text-[11px] text-[#68736B]">
                Basis: {normalizedPer100g ? '100 grams dry/wet mass' : 'Varying package portion'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F6F4E9]/60 border-b border-[#E2E8E0] text-[#68736B] font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Nutrient Metric</th>
                    <th className="py-3 px-4 text-[#163D2B]">{productA.name}</th>
                    <th className="py-3 px-4 text-[#3D7954]">{productB.name}</th>
                    <th className="py-3 px-4">Neutral Evidence Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEEEA]">
                  {comparison.metrics.map(m => {
                    const valA = normalizedPer100g ? m.productANormalized100g : m.productAValue;
                    const valB = normalizedPer100g ? m.productBNormalized100g : m.productBValue;

                    return (
                      <tr key={m.key} className="hover:bg-[#F6F4E9]/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#1D2921]">
                          {m.label}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-mono font-bold text-[#1D2921]">
                          {valA !== null ? `${valA} ${m.unit}` : 'Not available'}
                          <div className="text-[9px] text-[#68736B] font-sans font-normal mt-0.5">
                            {m.sourceNoteA}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-mono font-bold text-[#1D2921]">
                          {valB !== null ? `${valB} ${m.unit}` : 'Not available'}
                          <div className="text-[9px] text-[#68736B] font-sans font-normal mt-0.5">
                            {m.sourceNoteB}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#68736B] leading-relaxed">
                          {m.neutralObservation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allergen & Processing Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8E0] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#163D2B]">
                Declared Allergens in {productA.name}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {productA.ingredientsAnalysis.declaredAllergens.length > 0 ? (
                  productA.ingredientsAnalysis.declaredAllergens.map((a, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-[#FEF3F2] text-[#B42318] border border-[#B42318]/30 font-bold text-xs">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#68736B] italic">No declared allergens on label</span>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8E0] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D7954]">
                Declared Allergens in {productB.name}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {productB.ingredientsAnalysis.declaredAllergens.length > 0 ? (
                  productB.ingredientsAnalysis.declaredAllergens.map((a, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-[#FEF3F2] text-[#B42318] border border-[#B42318]/30 font-bold text-xs">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#68736B] italic">No declared allergens on label</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
