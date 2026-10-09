import React from 'react';
import { ShieldCheck, AlertTriangle, FileSearch, Database } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-12 bg-white border-t border-[#E2E8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F0E5] text-[#163D2B] text-xs font-semibold mb-2">
            <ShieldCheck size={14} className="text-[#3D7954]" />
            <span>Science-Informed & Transparent</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163D2B]">
            Designed for Trust, Not Hype
          </h2>
          <p className="text-sm text-[#68736B] mt-2 leading-relaxed">
            NutriScan AI is engineered to provide clear, verifiable facts instead of black-box guesses. We strictly communicate uncertainty and provenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Provenance Separation */}
          <div className="p-6 rounded-2xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#163D2B] shadow-2xs">
              <Database size={20} />
            </div>
            <h3 className="text-base font-bold text-[#1D2921]">
              Strict Provenance Separation
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed">
              Every single metric in your report explicitly marks whether it was directly extracted from the package OCR, matched from standard nutritional databases (USDA / Open Food Facts), or visually estimated by AI. We never present estimates as lab facts.
            </p>
          </div>

          {/* Card 2: AI Uncertainty Disclosure */}
          <div className="p-6 rounded-2xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#3D7954] shadow-2xs">
              <FileSearch size={20} />
            </div>
            <h3 className="text-base font-bold text-[#1D2921]">
              Verifiable Text Snippets
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed">
              NutriScan AI extracts and displays the original bounding text paragraphs for ingredients, allergens, and dates. If text is blurry, truncated, or ambiguous, it is tagged as “Needs verification” rather than silently filled in.
            </p>
          </div>

          {/* Card 3: Food Safety & Allergen Limits */}
          <div className="p-6 rounded-2xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#A65D12] shadow-2xs">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-base font-bold text-[#1D2921]">
              Honest Safety Boundaries
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed">
              Computer vision cannot verify microbiological sterility, bacterial contamination, or trace airborne allergens. NutriScan AI does not replace clinical allergy protocols or food safety health inspections.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
