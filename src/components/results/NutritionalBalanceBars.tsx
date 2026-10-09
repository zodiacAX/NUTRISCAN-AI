import React from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { AlertTriangle, CheckCircle2, Award, Zap, Heart } from 'lucide-react';

interface NutritionalBalanceBarsProps {
  food: FoodScanResult;
}

export const NutritionalBalanceBars: React.FC<NutritionalBalanceBarsProps> = ({ food }) => {
  const nutrition = food.nutrition;

  // Calculate rough health score 0-100 based on standard nutrient profiling
  const calculateHealthScore = (): { score: number; label: string; tone: 'excellent' | 'fair' | 'caution' } => {
    let score = 70;
    const sugar = nutrition.totalSugar.value ?? 0;
    const satFat = nutrition.saturatedFat.value ?? 0;
    const sodium = nutrition.sodium.value ?? 0;
    const protein = nutrition.protein.value ?? 0;
    const fiber = nutrition.dietaryFiber?.value ?? 0;

    if (sugar > 15) score -= 25;
    else if (sugar > 8) score -= 12;

    if (satFat > 5) score -= 20;
    else if (satFat > 2) score -= 8;

    if (sodium > 600) score -= 25;
    else if (sodium > 300) score -= 10;

    if (protein > 10) score += 15;
    else if (protein > 4) score += 8;

    if (fiber > 5) score += 15;
    else if (fiber > 2) score += 8;

    score = Math.max(15, Math.min(95, score));

    if (score >= 70) return { score, label: 'Excellent Choice', tone: 'excellent' };
    if (score >= 45) return { score, label: 'Fair Balance', tone: 'fair' };
    return { score, label: 'Not the best option', tone: 'caution' };
  };

  const { score, label, tone } = calculateHealthScore();

  // Watch-out items (Negatives)
  const negatives = [
    {
      name: 'Added & Total Sugars',
      valStr: `${nutrition.totalSugar.value ?? 'N/A'} g`,
      percentage: Math.min(100, Math.round(((nutrition.totalSugar.value ?? 0) / 30) * 100)),
      flag: (nutrition.totalSugar.value ?? 0) > 10 ? 'High' : 'Moderate',
      isHigh: (nutrition.totalSugar.value ?? 0) > 10
    },
    {
      name: 'Saturated Fats',
      valStr: `${nutrition.saturatedFat.value ?? 'N/A'} g`,
      percentage: Math.min(100, Math.round(((nutrition.saturatedFat.value ?? 0) / 10) * 100)),
      flag: (nutrition.saturatedFat.value ?? 0) > 3 ? 'High' : 'Low',
      isHigh: (nutrition.saturatedFat.value ?? 0) > 3
    },
    {
      name: 'Sodium Content',
      valStr: `${nutrition.sodium.value ?? 'N/A'} mg`,
      percentage: Math.min(100, Math.round(((nutrition.sodium.value ?? 0) / 1000) * 100)),
      flag: (nutrition.sodium.value ?? 0) > 400 ? 'High' : 'Acceptable',
      isHigh: (nutrition.sodium.value ?? 0) > 400
    }
  ];

  // Positive items
  const positives = [
    {
      name: 'Protein',
      valStr: `${nutrition.protein.value ?? 'N/A'} g`,
      percentage: Math.min(100, Math.round(((nutrition.protein.value ?? 0) / 15) * 100)),
      highlight: (nutrition.protein.value ?? 0) >= 4 ? 'High' : 'Present'
    },
    {
      name: 'Dietary Fiber',
      valStr: `${nutrition.dietaryFiber?.value ?? 2.5} g`,
      percentage: Math.min(100, Math.round(((nutrition.dietaryFiber?.value ?? 2.5) / 6) * 100)),
      highlight: 'Satiety'
    },
    {
      name: 'Energy Density',
      valStr: `${nutrition.calories.value ?? 'N/A'} kcal`,
      percentage: Math.min(100, Math.round(((nutrition.calories.value ?? 0) / 350) * 100)),
      highlight: 'Fuel'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Health Score Banner inspired by Mobile Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ECEEEA]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E4F0E5] flex items-center justify-center text-[#163D2B] shadow-2xs shrink-0">
            {tone === 'excellent' ? (
              <Award size={28} className="text-[#163D2B]" />
            ) : tone === 'fair' ? (
              <Zap size={28} className="text-[#A65D12]" />
            ) : (
              <Heart size={28} className="text-[#B42318]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#68736B]">NutriScore Rating</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  tone === 'excellent'
                    ? 'bg-[#E4F0E5] text-[#163D2B]'
                    : tone === 'fair'
                    ? 'bg-[#FEF7ED] text-[#A65D12]'
                    : 'bg-[#FEF3F2] text-[#B42318]'
                }`}
              >
                {label}
              </span>
            </div>
            <p className="text-xl font-bold text-[#1D2921] mt-0.5">
              Health Score: <span className="text-[#163D2B]">{score}%</span>
            </p>
          </div>
        </div>

        {/* Serving quick tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-[#F6F4E9] text-[#163D2B] text-xs font-semibold">
            Cal: {nutrition.calories.value ?? 'N/A'} kcal
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#F6F4E9] text-[#163D2B] text-xs font-semibold">
            Protein: {nutrition.protein.value ?? 'N/A'}g
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#F6F4E9] text-[#163D2B] text-xs font-semibold">
            Carbs: {nutrition.carbohydrates.value ?? 'N/A'}g
          </span>
        </div>
      </div>

      {/* Grid: Negatives vs Positives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Negatives Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#B42318]">
            <AlertTriangle size={18} className="stroke-[2.2]" />
            <h3 className="font-bold text-sm tracking-wide">Watch-outs (Negatives)</h3>
          </div>

          <div className="space-y-4 bg-[#FEF3F2]/40 rounded-2xl p-4 border border-[#B42318]/15">
            {negatives.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1D2921]">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#B42318]">{item.valStr}</span>
                    <span className="text-[10px] uppercase font-bold text-[#68736B] bg-white px-1.5 py-0.5 rounded-md border border-[#E2E8E0]">
                      {item.flag}
                    </span>
                  </div>
                </div>
                {/* Visual Red Progress Bar */}
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-400 to-[#B42318] rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(8, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Positives Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#163D2B]">
            <CheckCircle2 size={18} className="stroke-[2.2] text-[#3D7954]" />
            <h3 className="font-bold text-sm tracking-wide">Beneficial Nutrients (Positives)</h3>
          </div>

          <div className="space-y-4 bg-[#E4F0E5]/40 rounded-2xl p-4 border border-[#3D7954]/20">
            {positives.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1D2921]">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#163D2B]">{item.valStr}</span>
                    <span className="text-[10px] uppercase font-bold text-[#163D2B] bg-white px-1.5 py-0.5 rounded-md border border-[#E2E8E0]">
                      {item.highlight}
                    </span>
                  </div>
                </div>
                {/* Visual Green Progress Bar */}
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3D7954] to-[#163D2B] rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(8, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
