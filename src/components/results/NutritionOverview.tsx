import React from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { ProvenanceBadge } from '../common/Badge';
import { Flame, Dumbbell, Wheat, Candy, Droplet, ShieldAlert, PieChart, Info } from 'lucide-react';

interface NutritionOverviewProps {
  food: FoodScanResult;
}

export const NutritionOverview: React.FC<NutritionOverviewProps> = ({ food }) => {
  const n = food.nutrition;
  const servingBasis = food.servingBasis;

  const cards = [
    {
      key: 'calories',
      label: 'Calories / Energy',
      metric: n.calories,
      icon: <Flame size={17} className="text-[#A65D12]" />,
      accentBg: 'bg-[#FEF7ED]',
      isPrimary: true
    },
    {
      key: 'protein',
      label: 'Protein',
      metric: n.protein,
      icon: <Dumbbell size={17} className="text-[#163D2B]" />,
      accentBg: 'bg-[#E4F0E5]',
      isPrimary: false
    },
    {
      key: 'carbohydrates',
      label: 'Carbohydrates',
      metric: n.carbohydrates,
      icon: <Wheat size={17} className="text-[#3D7954]" />,
      accentBg: 'bg-emerald-50',
      isPrimary: false
    },
    {
      key: 'totalSugar',
      label: 'Total Sugars',
      subLabel: n.addedSugar?.value !== undefined ? `incl. ${n.addedSugar.value}g added` : undefined,
      metric: n.totalSugar,
      icon: <Candy size={17} className="text-[#A65D12]" />,
      accentBg: 'bg-amber-50',
      isPrimary: false
    },
    {
      key: 'totalFat',
      label: 'Total Fat',
      metric: n.totalFat,
      icon: <Droplet size={17} className="text-orange-700" />,
      accentBg: 'bg-orange-50',
      isPrimary: false
    },
    {
      key: 'saturatedFat',
      label: 'Saturated Fat',
      metric: n.saturatedFat,
      icon: <ShieldAlert size={17} className="text-[#B42318]" />,
      accentBg: 'bg-[#FEF3F2]',
      isPrimary: false
    },
    {
      key: 'sodium',
      label: 'Sodium / Salt',
      metric: n.sodium,
      icon: <Info size={17} className="text-[#1D5B79]" />,
      accentBg: 'bg-[#F0F7FB]',
      isPrimary: false
    }
  ];

  // Calculate macronutrient energy shares if available
  const proteinGrams = n.protein.value ?? 0;
  const carbGrams = n.carbohydrates.value ?? 0;
  const fatGrams = n.totalFat.value ?? 0;
  const totalMacroGrams = proteinGrams + carbGrams + fatGrams;

  const proteinPct = totalMacroGrams > 0 ? Math.round((proteinGrams / totalMacroGrams) * 100) : 0;
  const carbPct = totalMacroGrams > 0 ? Math.round((carbGrams / totalMacroGrams) * 100) : 0;
  const fatPct = totalMacroGrams > 0 ? Math.round((fatGrams / totalMacroGrams) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECEEEA] gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-[#163D2B]">
            Nutrition Overview
          </h2>
          <p className="text-xs text-[#68736B]">
            Quantified nutrients standardized to stated portion: <span className="font-semibold text-[#1D2921]">{servingBasis}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#68736B]">
          <span className="w-2 h-2 rounded-full bg-[#3D7954]"></span>
          <span>% Daily Value based on 2,000 kcal diet</span>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => {
          const hasValue = c.metric && c.metric.value !== null && c.metric.value !== undefined;
          const displayValue = hasValue ? `${c.metric.value} ${c.metric.unit}` : 'Not available';
          const dv = c.metric?.dailyValuePercentage;

          return (
            <div
              key={c.key}
              className={`p-4 rounded-xl border border-[#E2E8E0] bg-[#F6F4E9]/50 flex flex-col justify-between transition-all hover:bg-white hover:border-[#3D7954]/40 hover:shadow-2xs ${
                c.isPrimary ? 'sm:col-span-2 lg:col-span-1 border-[#163D2B]/30 bg-white' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${c.accentBg} flex items-center justify-center`}>
                    {c.icon}
                  </div>
                  {dv !== undefined && dv !== null && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      dv > 20
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-[#E4F0E5] text-[#163D2B]'
                    }`}>
                      {dv}% DV
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#68736B] block">
                  {c.label}
                </span>

                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-extrabold tracking-tight tabular-nums ${
                    hasValue ? 'text-[#1D2921]' : 'text-gray-400 text-base font-medium'
                  }`}>
                    {displayValue}
                  </span>
                </div>

                {c.subLabel && (
                  <span className="text-[10px] text-[#68736B] block mt-0.5">
                    {c.subLabel}
                  </span>
                )}
              </div>

              {/* Provenance Badge */}
              <div className="mt-4 pt-2.5 border-t border-[#ECEEEA]">
                <ProvenanceBadge provenance={c.metric.provenance} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Macronutrient Distribution Bar */}
      {totalMacroGrams > 0 && (
        <div className="p-4 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#163D2B] flex items-center gap-1.5">
              <PieChart size={14} className="text-[#3D7954]" />
              <span>Macronutrient Gram Distribution</span>
            </span>
            <span className="text-[11px] text-[#68736B]">
              Total: {totalMacroGrams}g macros per {servingBasis}
            </span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-200">
            <div
              style={{ width: `${carbPct}%` }}
              className="bg-emerald-600 transition-all duration-300"
              title={`Carbohydrates: ${carbGrams}g (${carbPct}%)`}
            />
            <div
              style={{ width: `${proteinPct}%` }}
              className="bg-[#163D2B] transition-all duration-300"
              title={`Protein: ${proteinGrams}g (${proteinPct}%)`}
            />
            <div
              style={{ width: `${fatPct}%` }}
              className="bg-amber-600 transition-all duration-300"
              title={`Fat: ${fatGrams}g (${fatPct}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#1D2921]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Carbs: <strong>{carbGrams}g</strong> ({carbPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#163D2B]"></span>
              <span>Protein: <strong>{proteinGrams}g</strong> ({proteinPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span>Fat: <strong>{fatGrams}g</strong> ({fatPct}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
