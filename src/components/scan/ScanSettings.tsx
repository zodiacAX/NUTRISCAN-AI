import React from 'react';
import type { ScanWorkspaceSettings } from '../../types/nutrition';
import { Package, Utensils, Info, Sliders } from 'lucide-react';

interface ScanSettingsProps {
  settings: ScanWorkspaceSettings;
  onChange: (updated: Partial<ScanWorkspaceSettings>) => void;
}

export const ScanSettings: React.FC<ScanSettingsProps> = ({ settings, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#ECEEEA]">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-[#163D2B]" />
          <h3 className="text-base font-bold text-[#1D2921]">Scan Configuration</h3>
        </div>
        <span className="text-[11px] font-semibold text-[#68736B] bg-[#F6F4E9] px-2.5 py-1 rounded-full border border-[#E2E8E0]">
          Gemma 4 Multimodal
        </span>
      </div>

      {/* 1. Food Type Selector: Packaged vs Cooked Meal */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#163D2B] block">
          1. Select Food Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange({ foodType: 'packaged' })}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
              settings.foodType === 'packaged'
                ? 'border-[#163D2B] bg-[#E4F0E5]/50 shadow-2xs'
                : 'border-[#E2E8E0] bg-white hover:border-[#3D7954]/50 hover:bg-[#F6F4E9]/50'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <Package size={18} className={settings.foodType === 'packaged' ? 'text-[#163D2B]' : 'text-[#68736B]'} />
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                settings.foodType === 'packaged' ? 'border-[#163D2B] bg-[#163D2B]' : 'border-gray-300'
              }`}>
                {settings.foodType === 'packaged' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </div>
            <div>
              <span className="font-bold text-xs text-[#1D2921] block">Packaged Food</span>
              <span className="text-[11px] text-[#68736B] leading-tight">Barcodes, tables & ingredients</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ foodType: 'cooked_meal' })}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
              settings.foodType === 'cooked_meal'
                ? 'border-[#3D7954] bg-[#E4F0E5]/50 shadow-2xs'
                : 'border-[#E2E8E0] bg-white hover:border-[#3D7954]/50 hover:bg-[#F6F4E9]/50'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <Utensils size={18} className={settings.foodType === 'cooked_meal' ? 'text-[#3D7954]' : 'text-[#68736B]'} />
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                settings.foodType === 'cooked_meal' ? 'border-[#3D7954] bg-[#3D7954]' : 'border-gray-300'
              }`}>
                {settings.foodType === 'cooked_meal' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </div>
            <div>
              <span className="font-bold text-xs text-[#1D2921] block">Cooked Meal</span>
              <span className="text-[11px] text-[#68736B] leading-tight">Plated foods & portions</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Contextual Options based on food type */}
      {settings.foodType === 'packaged' ? (
        <div className="space-y-3 pt-2 border-t border-[#ECEEEA]">
          <label className="text-xs font-bold uppercase tracking-wider text-[#163D2B] block">
            2. Package Label Focus Area
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'nutrition', label: 'Nutrition Facts Label' },
              { id: 'ingredients', label: 'Ingredients Paragraph' },
              { id: 'front', label: 'Front of Package' },
              { id: 'expiry', label: 'Best-Before / Expiry Stamp' },
              { id: 'all', label: 'Full Package / Multiple' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ packagedFocus: opt.id as any })}
                className={`py-2 px-3 rounded-lg border text-left text-xs font-medium transition-all ${
                  settings.packagedFocus === opt.id
                    ? 'border-[#163D2B] bg-[#163D2B] text-white'
                    : 'border-[#E2E8E0] text-[#1D2921] hover:bg-[#F6F4E9]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#F6F4E9] border border-[#E2E8E0] text-[11px] text-[#68736B] flex items-start gap-2">
            <Info size={15} className="text-[#3D7954] shrink-0 mt-0.5" />
            <p>
              <strong>Tip:</strong> Photographing both the nutrition table and the ingredients paragraph guarantees complete allergen and sugar breakdown.
            </p>
          </div>
        </div>
      ) : (
        /* Cooked Meal Context */
        <div className="space-y-3 pt-2 border-t border-[#ECEEEA]">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#163D2B] block mb-1">
              2. Optional Meal Context <span className="text-[11px] font-normal text-[#68736B] lowercase">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Homemade whole-wheat pasta with turkey bolognese"
              value={settings.cookedContext || ''}
              onChange={(e) => onChange({ cookedContext: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E0] text-xs text-[#1D2921] focus:outline-none focus:border-[#163D2B] bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#163D2B] block mb-1">
              Portion Basis <span className="text-[11px] font-normal text-[#68736B] lowercase">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 1 medium bowl (~350 g)"
              value={settings.servingPortionContext || ''}
              onChange={(e) => onChange({ servingPortionContext: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E0] text-xs text-[#1D2921] focus:outline-none focus:border-[#163D2B] bg-white"
            />
          </div>

          <p className="text-[11px] text-[#68736B] italic">
            Cooked meal nutritional statistics are explicitly flagged as <em>AI Estimates</em> rather than laboratory verified facts.
          </p>
        </div>
      )}

      {/* 3. Analysis Depth / Mode */}
      <div className="space-y-2 pt-2 border-t border-[#ECEEEA]">
        <label className="text-xs font-bold uppercase tracking-wider text-[#163D2B] block">
          3. Analysis Scope
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'full', label: 'Full Analysis', desc: 'All macros + allergens' },
            { id: 'allergen_only', label: 'Allergen Focus', desc: 'Safety & traces' },
            { id: 'macro_quick', label: 'Macro Quick', desc: 'Protein, carbs, fat' }
          ].map(mode => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange({ scanMode: mode.id as any })}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                settings.scanMode === mode.id
                  ? 'border-[#163D2B] bg-[#E4F0E5] text-[#163D2B] font-bold'
                  : 'border-[#E2E8E0] text-[#1D2921] hover:bg-[#F6F4E9]'
              }`}
            >
              <span className="block">{mode.label}</span>
              <span className="text-[10px] text-[#68736B] font-normal block mt-0.5 truncate">{mode.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
