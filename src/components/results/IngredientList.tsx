import React, { useState } from 'react';
import type { IngredientsAnalysis } from '../../types/nutrition';
import { AlertTriangle, AlertCircle, FileText, ChevronDown, ChevronUp, HelpCircle, ShieldAlert } from 'lucide-react';

interface IngredientListProps {
  ingredientsAnalysis: IngredientsAnalysis;
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredientsAnalysis }) => {
  const [showRawText, setShowRawText] = useState(false);
  const {
    rawExtractedText,
    extractedIngredients,
    declaredAllergens,
    crossContaminationWarnings,
    allergenCautionMessage,
    unreadableSections
  } = ingredientsAnalysis;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ECEEEA] gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-[#163D2B]">
            Ingredients & Additive Intelligence
          </h2>
          <p className="text-xs text-[#68736B]">
            Extracted from label OCR paragraph • {extractedIngredients.length} ingredients recognized
          </p>
        </div>

        <button
          onClick={() => setShowRawText(!showRawText)}
          className="text-xs font-semibold text-[#163D2B] hover:text-[#3D7954] flex items-center gap-1 self-start sm:self-center"
        >
          <FileText size={13} />
          <span>{showRawText ? 'Hide Raw OCR Text' : 'View Raw OCR Text'}</span>
          {showRawText ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Mandatory Prominent Allergy Caution Banner */}
      <div className="p-4 rounded-xl bg-[#FEF3F2] border-2 border-[#B42318]/30 flex items-start gap-3">
        <ShieldAlert size={20} className="text-[#B42318] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#B42318]">
            Critical Allergy Caution
          </h4>
          <p className="text-xs text-[#1D2921] font-medium mt-0.5 leading-relaxed">
            {allergenCautionMessage || 'Always verify the original packaging. AI extraction may miss allergens.'}
          </p>
          <p className="text-[11px] text-[#68736B] mt-1 italic">
            Do not rely solely on photographic OCR for life-threatening allergies. Ingredients not detected in camera perspective are never guaranteed absent.
          </p>
        </div>
      </div>

      {/* Allergen Section: Declared vs Cross-Contamination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Declared Allergens */}
        <div className="p-4 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#163D2B] tracking-wider block">
            Declared Contained Allergens
          </span>
          {declaredAllergens.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {declaredAllergens.map((allergen, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#FEF3F2] text-[#B42318] border border-[#B42318]/30 font-bold text-xs flex items-center gap-1"
                >
                  <AlertCircle size={12} />
                  <span>{allergen}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#68736B] italic">
              No allergens explicitly listed in the inspected label text. Always confirm with the physical box.
            </p>
          )}
        </div>

        {/* Cross Contamination / Shared Line Warnings */}
        <div className="p-4 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#A65D12] tracking-wider block">
            Shared Facility / Advisory Warnings
          </span>
          {crossContaminationWarnings.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {crossContaminationWarnings.map((warn, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#FEF7ED] text-[#A65D12] border border-[#A65D12]/30 font-semibold text-xs flex items-center gap-1"
                >
                  <AlertTriangle size={12} />
                  <span>May contain {warn}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#68736B] italic">
              No shared line “May contain” advisory statement visible in this camera view.
            </p>
          )}
        </div>
      </div>

      {/* Raw OCR Text Drawer if toggled */}
      {showRawText && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-800 leading-relaxed space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">
            Original Optical Character Recognition Output:
          </span>
          <p className="bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap select-all">
            {rawExtractedText}
          </p>
        </div>
      )}

      {/* Ingredients & Unfamiliar Additives Breakdown Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#163D2B]">
          Ingredient Taxonomy & Additive Explanations
        </h4>
        <div className="divide-y divide-[#ECEEEA] border border-[#E2E8E0] rounded-xl overflow-hidden bg-white">
          {extractedIngredients.map((item, idx) => {
            return (
              <div key={idx} className="p-3.5 hover:bg-[#F6F4E9]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1D2921]">
                      {item.name}
                    </span>
                    {item.isAdditive && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        {item.sourceECode ? `Additive ${item.sourceECode}` : 'Food Additive'}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-[#68736B] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  {item.purpose && (
                    <span className="text-[10px] text-[#163D2B] bg-[#E4F0E5] px-2 py-0.5 rounded-full font-medium">
                      {item.purpose}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unreadable or Uncertain Text */}
      {unreadableSections && unreadableSections.length > 0 && (
        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#68736B] flex items-start gap-2">
          <HelpCircle size={15} className="shrink-0 mt-0.5 text-gray-500" />
          <div>
            <span className="font-semibold text-gray-700">Unreadable or Folded Label Sections: </span>
            {unreadableSections.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};
