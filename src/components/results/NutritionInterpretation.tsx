import React from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { NovaBadge } from '../common/Badge';
import { AlertTriangle, CheckCircle2, Info, Factory, BookOpen } from 'lucide-react';

interface NutritionInterpretationProps {
  food: FoodScanResult;
}

export const NutritionInterpretation: React.FC<NutritionInterpretationProps> = ({ food }) => {
  const interp = food.interpretation;
  const nova = interp.processingLevel;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ECEEEA] gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-[#163D2B]">
            What This Means
          </h2>
          <p className="text-xs text-[#68736B]">
            Evidence-grounded observations without binary “good” vs “bad” judgments
          </p>
        </div>

        <div>
          <NovaBadge novaGroup={nova.novaGroup} />
        </div>
      </div>

      {/* Observations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {interp.keyTakeaways.map((item, idx) => {
          const isWarning = item.sentiment === 'warning';
          const isPositive = item.sentiment === 'positive';

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isWarning
                  ? 'bg-[#FEF7ED] border-[#A65D12]/30 text-[#1D2921]'
                  : isPositive
                  ? 'bg-[#E4F0E5]/60 border-[#3D7954]/30 text-[#1D2921]'
                  : 'bg-[#F6F4E9] border-[#E2E8E0] text-[#1D2921]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {isWarning ? (
                      <AlertTriangle size={15} className="text-[#A65D12]" />
                    ) : isPositive ? (
                      <CheckCircle2 size={15} className="text-[#3D7954]" />
                    ) : (
                      <Info size={15} className="text-[#1D5B79]" />
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      isWarning ? 'text-[#A65D12]' : isPositive ? 'text-[#163D2B]' : 'text-[#68736B]'
                    }`}>
                      Observation {idx + 1}
                    </span>
                  </div>

                  {item.metricTag && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-current/20">
                      {item.metricTag}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#1D2921]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#68736B] mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* NOVA Classification Scientific Methodology Box */}
      <div className="p-5 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Factory size={17} className="text-[#163D2B]" />
            <h4 className="text-xs font-bold text-[#163D2B] uppercase tracking-wider">
              Food Processing Audit: NOVA System Evaluation
            </h4>
          </div>
          <span className="text-[11px] text-[#68736B] flex items-center gap-1">
            <BookOpen size={12} />
            <span>Monteiro et al. Scientific Standard</span>
          </span>
        </div>

        <p className="text-xs text-[#1D2921] leading-relaxed">
          {nova.explanation}
        </p>

        {nova.markers.length > 0 && (
          <div className="pt-2 border-t border-[#E2E8E0]/70">
            <span className="text-[11px] font-bold text-[#68736B] block mb-1.5">
              Identified Formulation Markers on Packaging:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {nova.markers.map((marker, mIdx) => (
                <span
                  key={mIdx}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-[#E2E8E0] text-[#1D2921]"
                >
                  • {marker}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dietary Suitability Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#68736B]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#163D2B] mr-1">
          Dietary Compatibility:
        </span>
        {Object.entries(interp.dietarySuitability).map(([key, val]) => {
          if (val === undefined) return null;
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          return (
            <span
              key={key}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                val
                  ? 'bg-[#E4F0E5] text-[#163D2B] border-[#3D7954]/20'
                  : 'bg-gray-100 text-gray-500 border-gray-200 line-through'
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};
