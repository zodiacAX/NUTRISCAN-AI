import React, { useState } from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { History, Search, Trash2, ArrowRight, Calendar } from 'lucide-react';
import { NovaBadge } from '../common/Badge';

interface ScanHistoryProps {
  history: FoodScanResult[];
  onOpenReport: (food: FoodScanResult) => void;
  onDeleteScan: (id: string) => void;
  onClearAll: () => void;
  onNavigateScan: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onOpenReport,
  onDeleteScan,
  onClearAll,
  onNavigateScan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'packaged' | 'cooked_meal'>('all');

  const filtered = history.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ingredientsAnalysis.rawExtractedText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === 'all' || item.scanType === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8E0] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E4F0E5] flex items-center justify-center text-[#163D2B]">
              <History size={18} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163D2B]">
              Food Analysis History
            </h1>
          </div>
          <p className="text-xs text-[#68736B] mt-1">
            Persisted in your local browser storage • {history.length} items recorded
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your saved scan history?")) {
                onClearAll();
              }
            }}
            className="px-3.5 py-2 rounded-xl border border-[#B42318]/30 bg-rose-50 text-xs font-semibold text-[#B42318] hover:bg-rose-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E2E8E0] shadow-2xs">
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by food name, ingredient, or brand..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8E0] bg-[#F6F4E9]/40 text-xs text-[#1D2921] focus:outline-none focus:border-[#163D2B]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'packaged', label: 'Packaged Foods' },
            { id: 'cooked_meal', label: 'Cooked Meals' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedType(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === f.id
                  ? 'bg-[#163D2B] text-white shadow-xs'
                  : 'bg-[#F6F4E9] text-[#68736B] hover:text-[#1D2921]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List or Empty State */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-[#E2E8E0] text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#F6F4E9] flex items-center justify-center text-[#68736B] mx-auto">
            <History size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1D2921]">No Matching Scans Found</h3>
            <p className="text-xs text-[#68736B] mt-1">
              Try adjusting your search query or perform a new food scan.
            </p>
          </div>
          <button
            onClick={onNavigateScan}
            className="px-4 py-2 rounded-xl bg-[#163D2B] text-white text-xs font-semibold hover:bg-[#0F2A1E] transition-all"
          >
            Scan New Food
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(food => (
            <div
              key={food.id}
              className="bg-white rounded-2xl border border-[#E2E8E0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative aspect-16/9 bg-gray-100 overflow-hidden">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                      {food.scanType === 'cooked_meal' ? 'Cooked Meal' : 'Packaged'}
                    </span>
                  </div>
                  {food.isDemoSample && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white shadow-2xs">
                        Preset Sample
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#68736B] tracking-wider block">
                      {food.category}
                    </span>
                    <h3 className="text-base font-bold text-[#1D2921] line-clamp-1 group-hover:text-[#163D2B] transition-colors">
                      {food.name}
                    </h3>
                    <p className="text-[11px] text-[#68736B] truncate">
                      Basis: {food.servingBasis}
                    </p>
                  </div>

                  {/* Nutrition Highlights */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1 border-y border-[#ECEEEA]">
                    <div>
                      <span className="text-[10px] text-[#68736B] block">Calories</span>
                      <span className="font-extrabold text-[#1D2921] tabular-nums">
                        {food.nutrition.calories.value ?? 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#68736B] block">Sugar</span>
                      <span className="font-extrabold text-[#1D2921] tabular-nums">
                        {food.nutrition.totalSugar.value ? `${food.nutrition.totalSugar.value}g` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#68736B] block">Sodium</span>
                      <span className="font-extrabold text-[#1D2921] tabular-nums">
                        {food.nutrition.sodium.value ? `${food.nutrition.sodium.value}mg` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <NovaBadge novaGroup={food.interpretation.processingLevel.novaGroup} />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-[#ECEEEA] mt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#68736B]">
                  <Calendar size={12} />
                  <span>{new Date(food.timestamp).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  {!food.isDemoSample && (
                    <button
                      onClick={() => onDeleteScan(food.id)}
                      className="p-1.5 text-[#68736B] hover:text-[#B42318] transition-colors rounded-lg hover:bg-rose-50"
                      title="Delete scan"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => onOpenReport(food)}
                    className="py-1.5 px-3 rounded-xl bg-[#163D2B] text-white text-xs font-semibold hover:bg-[#0F2A1E] transition-colors flex items-center gap-1"
                  >
                    <span>View Report</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
