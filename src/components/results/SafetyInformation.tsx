import React from 'react';
import type { FoodSafetyInfo } from '../../types/nutrition';
import { Calendar, AlertCircle, ShieldAlert, Thermometer, ShieldCheck } from 'lucide-react';

interface SafetyInformationProps {
  foodSafety: FoodSafetyInfo;
}

export const SafetyInformation: React.FC<SafetyInformationProps> = ({ foodSafety }) => {
  const {
    dateType,
    dateExtracted,
    dateRawSnippet,
    isDateAmbiguous,
    storageInstructions,
    packagingIntegrityNotes,
    recallStatus,
    safetyDisclaimer
  } = foodSafety;

  const dateLabel = {
    best_before: 'Best Before (Quality Guide)',
    use_by: 'Use By (Safety Cutoff)',
    expiry: 'Expiration Date',
    not_detected: 'Date Not Detected in Image'
  }[dateType];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ECEEEA] gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-[#163D2B]">
            Food Safety & Packaging Integrity
          </h2>
          <p className="text-xs text-[#68736B]">
            Date extraction, storage guidelines, and recall registry status
          </p>
        </div>

        <span className="text-[11px] font-semibold text-[#163D2B] bg-[#E4F0E5] px-2.5 py-1 rounded-full border border-[#3D7954]/20 self-start sm:self-center">
          Packaging Intelligence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Extraction Card */}
        <div className="p-4 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#68736B] tracking-wider flex items-center gap-1.5">
              <Calendar size={13} className="text-[#163D2B]" />
              <span>{dateLabel}</span>
            </span>
            {dateType === 'use_by' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                Safety Date
              </span>
            )}
          </div>

          <div className="text-base font-extrabold text-[#1D2921]">
            {dateExtracted || 'Not visible on scanned angle'}
          </div>

          {dateRawSnippet && (
            <p className="text-[11px] font-mono bg-white p-2 rounded border border-[#E2E8E0] text-[#68736B]">
              Raw stamp OCR: “{dateRawSnippet}”
            </p>
          )}

          {isDateAmbiguous && (
            <div className="flex items-center gap-1.5 text-xs text-[#A65D12]">
              <AlertCircle size={14} />
              <span>Date stamp format is ambiguous. Verify on box flap.</span>
            </div>
          )}

          <p className="text-[10px] text-[#68736B] leading-tight">
            <em>Best before</em> refers to sensory peak quality, whereas <em>Use by</em> indicates a microbiological safety deadline.
          </p>
        </div>

        {/* Storage Instructions Card */}
        <div className="p-4 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-[#68736B] tracking-wider flex items-center gap-1.5">
            <Thermometer size={13} className="text-[#3D7954]" />
            <span>Storage & Handling Directions</span>
          </span>

          <p className="text-xs font-semibold text-[#1D2921] leading-relaxed">
            {storageInstructions || 'No specific temperature storage instructions printed on visible packaging section.'}
          </p>

          {packagingIntegrityNotes && (
            <p className="text-[11px] text-[#68736B]">
              <strong>Package visual condition:</strong> {packagingIntegrityNotes}
            </p>
          )}
        </div>
      </div>

      {/* Product Recall Verification Registry Card */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            recallStatus.hasRecalls ? 'bg-rose-100 text-[#B42318]' : 'bg-[#E4F0E5] text-[#3D7954]'
          }`}>
            {recallStatus.hasRecalls ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <h4 className="font-bold text-[#1D2921]">
              Regulatory Recall Registry Status
            </h4>
            <p className="text-[11px] text-[#68736B] mt-0.5">
              {recallStatus.details || 'No active FDA/USDA safety recalls or allergen alerts on file for this batch.'}
            </p>
          </div>
        </div>

        {recallStatus.source && (
          <span className="text-[10px] font-mono text-[#68736B] bg-[#F6F4E9] px-2 py-1 rounded border border-[#E2E8E0] shrink-0">
            Source: {recallStatus.source}
          </span>
        )}
      </div>

      {/* Honest Physical Safety Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] text-xs text-[#68736B] flex items-start gap-2.5">
        <ShieldAlert size={16} className="text-[#A65D12] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#1D2921]">Microbiological Safety Boundary: </strong>
          {safetyDisclaimer || 'Photographs alone cannot determine microbiological safety, viral pathogens, or chemical contaminants.'}
        </p>
      </div>
    </div>
  );
};
