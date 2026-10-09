import React from 'react';
import { Leaf, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E2E8E0] mt-16 pt-12 pb-10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#163D2B] flex items-center justify-center text-[#E4F0E5]">
                <Leaf size={16} />
              </div>
              <span className="font-bold text-lg text-[#163D2B]">NutriScan AI</span>
            </div>
            <p className="text-sm text-[#1D2921] font-medium">
              “Know your food. Make smarter choices.”
            </p>
            <p className="text-xs text-[#68736B] leading-relaxed max-w-md">
              NutriScan AI converts complex food packaging, ingredient lists, and meal photos into verified, evidence-based nutrition intelligence powered by Gemma 4 multimodal models.
            </p>
          </div>

          {/* Reference Data Sources */}
          <div>
            <h4 className="text-xs font-bold text-[#163D2B] uppercase tracking-wider mb-3">
              Data & Verification
            </h4>
            <ul className="text-xs text-[#68736B] space-y-2">
              <li className="flex items-center gap-1.5 hover:text-[#163D2B] transition-colors">
                <ShieldCheck size={13} className="text-[#3D7954]" />
                <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer" className="flex items-center gap-1">
                  Open Food Facts Database <ExternalLink size={10} />
                </a>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#163D2B] transition-colors">
                <ShieldCheck size={13} className="text-[#3D7954]" />
                <a href="https://fdc.nal.usda.gov" target="_blank" rel="noreferrer" className="flex items-center gap-1">
                  USDA FoodData Central <ExternalLink size={10} />
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D7954]"></span>
                <span>NOVA Processing Standard</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D7954]"></span>
                <span>Gemma 4 Multimodal Vision</span>
              </li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div>
            <h4 className="text-xs font-bold text-[#163D2B] uppercase tracking-wider mb-3">
              Transparency
            </h4>
            <ul className="text-xs text-[#68736B] space-y-2">
              <li>100% Client-side Privacy Mode</li>
              <li>Visible Data Provenance Badges</li>
              <li>Zero Fabricated Historical Scans</li>
              <li>WCAG 2.2 AA Contrast Verified</li>
            </ul>
          </div>
        </div>

        {/* Mandatory Health & Safety Notice Banner */}
        <div className="p-4 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] flex items-start gap-3 text-xs text-[#68736B] leading-relaxed">
          <AlertCircle size={18} className="text-[#A65D12] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#1D2921]">Important Scientific & Safety Disclosures: </span>
            NutriScan AI is an educational food literacy tool and is not a medical device. Visual image inspection cannot detect foodborne pathogens, microbiological safety, toxic contaminants, or invisible allergens. Always review the original manufacturer packaging. Values from nutrition labels, external reference databases, and AI estimations are strictly distinguished throughout every report.
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E2E8E0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#68736B] gap-4">
          <p>© 2026 NutriScan AI. Built for MLH Hackathon with Gemma 4.</p>
          <p className="flex items-center gap-2">
            <span>Inter Sans</span>
            <span>•</span>
            <span>Vite + React + TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
