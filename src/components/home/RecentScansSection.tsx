import React from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { History, ArrowRight, Calendar, Trash2, Camera } from 'lucide-react';
import { ProvenanceBadge } from '../common/Badge';

interface RecentScansSectionProps {
  history: FoodScanResult[];
  onOpenReport: (scan: FoodScanResult) => void;
  onNavigateScan: () => void;
  onNavigateHistory: () => void;
  onDeleteScan?: (id: string) => void;
}

export const RecentScansSection: React.FC<RecentScansSectionProps> = ({
  history,
  onOpenReport,
  onNavigateScan,
  onNavigateHistory,
  onDeleteScan
}) => {
  // Filter user scans vs preloaded samples if we want, or display up to 4 most recent
  const recentItems = history.slice(0, 4);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E4F0E5] flex items-center justify-center text-[#163D2B]">
              <History size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#163D2B]">Recent Food Analyses</h2>
              <p className="text-xs text-[#68736B]">Access your saved nutritional assessments and audit logs</p>
            </div>
          </div>

          {recentItems.length > 0 && (
            <button
              onClick={onNavigateHistory}
              className="text-xs font-semibold text-[#163D2B] hover:text-[#3D7954] flex items-center gap-1 transition-colors"
            >
              <span>View all ({history.length})</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {recentItems.length === 0 ? (
          // Truthful empty state
          <div className="p-10 rounded-2xl bg-white border border-[#E2E8E0] text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F6F4E9] flex items-center justify-center text-[#68736B] mx-auto">
              <Camera size={26} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1D2921]">No Scans Recorded Yet</h3>
              <p className="text-xs text-[#68736B] mt-1 max-w-sm mx-auto leading-relaxed">
                You haven't scanned any food items or saved any reports in this browser session. Scan your first package or try one of our curated samples above.
              </p>
            </div>
            <button
              onClick={onNavigateScan}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#163D2B] text-white text-xs font-semibold hover:bg-[#0F2A1E] transition-all"
            >
              <Camera size={15} />
              <span>Scan Food Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentItems.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white border border-[#E2E8E0] hover:border-[#163D2B]/50 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0 border border-[#ECEEEA]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736B] truncate">
                          {item.category}
                        </span>
                        {item.isDemoSample && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            Sample
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#1D2921] truncate mt-0.5 group-hover:text-[#163D2B]">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#68736B] truncate">
                        {item.servingBasis}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#ECEEEA] flex items-center justify-between text-xs text-[#68736B]">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar size={12} />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span className="font-bold text-[#1D2921]">
                      {item.nutrition.calories.value ? `${item.nutrition.calories.value} kcal` : 'N/A'}
                    </span>
                  </div>

                  <div className="mt-2">
                    <ProvenanceBadge provenance={item.nutrition.calories.provenance} size="sm" />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#ECEEEA] flex items-center justify-between">
                  <button
                    onClick={() => onOpenReport(item)}
                    className="text-xs font-semibold text-[#163D2B] hover:text-[#3D7954] flex items-center gap-1 transition-colors"
                  >
                    <span>Open report</span>
                    <ArrowRight size={13} />
                  </button>

                  {onDeleteScan && !item.isDemoSample && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScan(item.id);
                      }}
                      className="text-[#68736B] hover:text-[#B42318] p-1 transition-colors"
                      title="Delete scan"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
