import React from 'react';
import type { Recommendation } from '../../types/nutrition';
import { Compass, Scale, GitCompare, CheckCircle2, RefreshCw } from 'lucide-react';

interface RecommendationCardProps {
  recommendations: Recommendation[];
  onTriggerCompare?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendations,
  onTriggerCompare
}) => {
  const getIcon = (type: Recommendation['iconType']) => {
    switch (type) {
      case 'portion':
        return <Scale size={18} className="text-[#3D7954]" />;
      case 'compare':
        return <GitCompare size={18} className="text-[#1D5B79]" />;
      case 'check':
        return <CheckCircle2 size={18} className="text-[#A65D12]" />;
      case 'alternative':
      default:
        return <RefreshCw size={18} className="text-[#163D2B]" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ECEEEA] gap-2">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-[#163D2B]" />
          <div>
            <h2 className="text-lg font-extrabold text-[#163D2B]">
              Your Next Best Step
            </h2>
            <p className="text-xs text-[#68736B]">
              Practical consumer actions grounded in extracted facts — no generic dietary prescriptions
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#163D2B] bg-[#E4F0E5] px-2.5 py-1 rounded-full border border-[#3D7954]/20 self-start sm:self-center">
          Actionable Next Steps
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-xl border border-[#E2E8E0] bg-[#F6F4E9]/50 hover:bg-white hover:border-[#3D7954]/50 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8E0] flex items-center justify-center shadow-2xs">
                {getIcon(rec.iconType)}
              </div>

              <h4 className="text-sm font-bold text-[#1D2921]">
                {rec.title}
              </h4>

              <p className="text-xs font-semibold text-[#163D2B] leading-relaxed">
                {rec.action}
              </p>

              <p className="text-[11px] text-[#68736B] leading-relaxed pt-1 border-t border-[#ECEEEA]">
                {rec.rationale}
              </p>
            </div>

            {rec.iconType === 'compare' && onTriggerCompare && (
              <div className="mt-4 pt-3 border-t border-[#ECEEEA]">
                <button
                  type="button"
                  onClick={onTriggerCompare}
                  className="w-full py-2 px-3 rounded-lg bg-white border border-[#E2E8E0] text-xs font-semibold text-[#163D2B] hover:bg-[#E4F0E5] transition-colors flex items-center justify-center gap-1.5"
                >
                  <GitCompare size={13} />
                  <span>Launch Product Comparison</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
