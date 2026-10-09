import React from 'react';
import { SAMPLE_FOODS } from '../../data/sampleFoods';
import type { FoodScanResult } from '../../types/nutrition';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ProvenanceBadge } from '../common/Badge';

interface SampleShowcaseProps {
  onSelectSample: (sample: FoodScanResult) => void;
}

export const SampleShowcase: React.FC<SampleShowcaseProps> = ({ onSelectSample }) => {
  return (
    <section id="sample-section" className="py-10 bg-white border-y border-[#E2E8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F0E5] text-[#163D2B] text-xs font-semibold mb-2">
              <Sparkles size={13} />
              <span>MLH Hackathon 90-Second Demo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163D2B]">
              Explore Curated Sample Foods
            </h2>
            <p className="text-sm text-[#68736B] mt-1 max-w-2xl">
              Inspect live extracted nutrition reports with zero setup. Test how Gemma 4 differentiates extracted packaging facts from meal estimates.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-medium text-[#68736B] bg-[#F6F4E9] px-3.5 py-2 rounded-xl border border-[#E2E8E0]">
            ⚡ 1-Click Instant Evaluation
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_FOODS.map(food => {
            const isMeal = food.scanType === 'cooked_meal';
            const calories = food.nutrition.calories.value;
            const primaryAlert = food.interpretation.keyTakeaways[0];

            return (
              <div
                key={food.id}
                onClick={() => onSelectSample(food)}
                className="bg-[#F6F4E9] rounded-2xl border border-[#E2E8E0] overflow-hidden hover:border-[#163D2B] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                role="button"
                tabIndex={0}
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-16/10 overflow-hidden bg-black/5">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                        isMeal
                          ? 'bg-[#1D5B79] text-white'
                          : 'bg-[#163D2B] text-white'
                      }`}>
                        {isMeal ? 'Cooked Meal' : 'Packaged'}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                        NOVA {food.interpretation.processingLevel.novaGroup}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#68736B] tracking-wider block">
                        {food.category}
                      </span>
                      <h3 className="text-base font-bold text-[#1D2921] line-clamp-1 group-hover:text-[#163D2B] transition-colors">
                        {food.name}
                      </h3>
                      <p className="text-[11px] text-[#68736B] truncate">
                        {food.servingBasis}
                      </p>
                    </div>

                    {/* Quick Metric Pills */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-[#E2E8E0]">
                        <span className="text-[10px] text-[#68736B] block">Energy</span>
                        <span className="font-extrabold text-[#1D2921]">{calories} kcal</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-[#E2E8E0]">
                        <span className="text-[10px] text-[#68736B] block">Sodium</span>
                        <span className="font-extrabold text-[#1D2921]">{food.nutrition.sodium.value} mg</span>
                      </div>
                    </div>

                    {/* Key takeaway snippet */}
                    {primaryAlert && (
                      <div className={`p-2 rounded-lg text-[11px] leading-tight border ${
                        primaryAlert.sentiment === 'warning'
                          ? 'bg-[#FEF7ED] text-[#A65D12] border-[#A65D12]/20'
                          : 'bg-[#E4F0E5] text-[#163D2B] border-[#3D7954]/20'
                      }`}>
                        <span className="font-semibold">{primaryAlert.title}: </span>
                        <span className="line-clamp-2">{primaryAlert.description}</span>
                      </div>
                    )}

                    {/* Provenance badge */}
                    <div className="pt-1">
                      <ProvenanceBadge provenance={food.nutrition.calories.provenance} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                  <div className="w-full py-2 px-3 rounded-xl bg-white border border-[#E2E8E0] text-xs font-semibold text-[#163D2B] flex items-center justify-between group-hover:bg-[#163D2B] group-hover:text-white transition-colors">
                    <span>Inspect Full Report</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
