import React from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SAMPLE_FOODS } from '../../data/sampleFoods';

interface AlternativeProductsSectionProps {
  currentFood: FoodScanResult;
  onCompareWithAlternative: (altFood: FoodScanResult) => void;
}

export const AlternativeProductsSection: React.FC<AlternativeProductsSectionProps> = ({
  currentFood,
  onCompareWithAlternative
}) => {
  // Select alternative products different from current food
  const alternatives = SAMPLE_FOODS.filter(f => f.id !== currentFood.id).slice(0, 3);

  return (
    <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ECEEEA]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#3D7954]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#3D7954]">
              Smarter Choice Swaps
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#1D2921] mt-0.5">
            Alternative Products from Verified Database
          </h3>
          <p className="text-xs text-[#68736B]">
            Healthier or minimally-processed swaps matched against Open Food Facts nutritional profiles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alternatives.map((alt) => (
          <div
            key={alt.id}
            className="rounded-2xl border border-[#E2E8E0] p-4 bg-[#F6F4E9]/40 hover:bg-[#F6F4E9] hover:border-[#3D7954] transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={alt.imageUrl}
                  alt={alt.name}
                  className="w-14 h-14 rounded-xl object-cover bg-white border border-[#E2E8E0] shadow-2xs shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#3D7954] shrink-0" />
                    <span className="text-[11px] font-bold text-[#163D2B] bg-[#E4F0E5] px-2 py-0.5 rounded-full">
                      Health Score: Excellent
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1D2921] truncate mt-1">
                    {alt.name}
                  </h4>
                  <p className="text-[11px] text-[#68736B] truncate">
                    {alt.brand || alt.category}
                  </p>
                </div>
              </div>

              {/* Macro Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8E0] text-[11px] font-semibold text-[#1D2921]">
                  Cal: {alt.nutrition.calories.value ?? 'N/A'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8E0] text-[11px] font-semibold text-[#1D2921]">
                  Protein: {alt.nutrition.protein.value ?? 'N/A'}g
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8E0] text-[11px] font-semibold text-[#1D2921]">
                  Sugar: {alt.nutrition.totalSugar.value ?? 'N/A'}g
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onCompareWithAlternative(alt)}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-white border border-[#163D2B]/30 text-xs font-semibold text-[#163D2B] hover:bg-[#163D2B] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Compare with {currentFood.name.split(' ')[0]}</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
