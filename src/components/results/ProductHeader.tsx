import React from 'react';
import type { FoodScanResult } from '../../types/nutrition';
import { Camera, GitCompare, Printer, Clock } from 'lucide-react';

interface ProductHeaderProps {
  food: FoodScanResult;
  onScanAnother: () => void;
  onCompare: () => void;
  onPrint: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  food,
  onScanAnother,
  onCompare,
  onPrint
}) => {
  const isIdentified = Boolean(food.name && food.name.trim().length > 0);
  const displayName = isIdentified ? food.name : 'Product not confidently identified';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left: Product Thumbnail & Title */}
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-black/5 shrink-0 border border-[#ECEEEA]">
            <img
              src={food.imageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
            {food.isDemoSample && (
              <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-600 text-white shadow-2xs">
                Demo
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#68736B] px-2 py-0.5 rounded bg-[#F6F4E9] border border-[#E2E8E0]">
                {food.category || 'Uncategorized Food'}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                food.scanType === 'cooked_meal' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-[#E4F0E5] text-[#163D2B] border border-[#3D7954]/20'
              }`}>
                {food.scanType === 'cooked_meal' ? 'Cooked Meal Analysis' : 'Packaged Product'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#163D2B] tracking-tight">
              {displayName}
            </h1>

            {food.brand && (
              <p className="text-xs font-medium text-[#68736B]">
                Brand: <span className="text-[#1D2921]">{food.brand}</span>
              </p>
            )}

            {/* Timestamps & Serving Basis */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#68736B] pt-1">
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span>{new Date(food.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <span>•</span>
              <div className="font-semibold text-[#1D2921]">
                Serving basis: <span className="underline decoration-[#3D7954]/40">{food.servingBasis}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start pt-2 md:pt-0 no-print">
          <button
            onClick={onScanAnother}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8E0] text-xs font-semibold text-[#1D2921] hover:bg-[#F6F4E9] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Camera size={14} className="text-[#3D7954]" />
            <span>Scan Another</span>
          </button>

          <button
            onClick={onCompare}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8E0] text-xs font-semibold text-[#1D2921] hover:bg-[#F6F4E9] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <GitCompare size={14} className="text-[#1D5B79]" />
            <span>Compare</span>
          </button>

          <button
            onClick={onPrint}
            className="px-3.5 py-2 rounded-xl bg-[#163D2B] text-white text-xs font-semibold hover:bg-[#0F2A1E] transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Print or export PDF report"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
