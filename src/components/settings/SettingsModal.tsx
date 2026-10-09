import React, { useState } from 'react';
import type { AppSettings } from '../../types/nutrition';
import { X, Sparkles, Shield, Cpu, Database, AlertCircle, Globe, Check, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E2E8E0] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECEEEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E4F0E5] flex items-center justify-center text-[#163D2B]">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#163D2B]">Settings & About NutriScan AI</h2>
              <p className="text-xs text-[#68736B]">Model configuration, privacy policies, and data sources</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#68736B] hover:text-[#1D2921] rounded-lg hover:bg-[#F6F4E9] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inference Mode Toggle: Demo Adapter vs Live Gemma / Gemini Endpoint */}
        <div className="p-5 rounded-2xl bg-[#F6F4E9] border border-[#E2E8E0] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-[#163D2B]" />
              <h3 className="text-sm font-bold text-[#1D2921]">AI Inference Mode</h3>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              localSettings.useDemoMode
                ? 'bg-[#FEF7ED] text-[#A65D12] border border-[#A65D12]/30'
                : 'bg-[#E4F0E5] text-[#163D2B] border border-[#3D7954]/30'
            }`}>
              {localSettings.useDemoMode ? 'Demo Adapter Active' : 'Live Gateway Active'}
            </span>
          </div>

          <p className="text-xs text-[#68736B] leading-relaxed">
            By default, NutriScan AI runs on a deterministic <strong>Demo Adapter</strong> with zero API key setup required. You can toggle Live Mode below to pass multimodal queries to your live Google AI Studio Gemma 4 or Gemini 2.5 Flash gateway.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLocalSettings(s => ({ ...s, useDemoMode: true }))}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                localSettings.useDemoMode
                  ? 'bg-[#163D2B] text-white border-[#163D2B] shadow-xs'
                  : 'bg-white text-[#1D2921] border-[#E2E8E0] hover:bg-[#E4F0E5]/50'
              }`}
            >
              Demo Adapter (Recommended for Hackathon)
            </button>
            <button
              type="button"
              onClick={() => setLocalSettings(s => ({ ...s, useDemoMode: false }))}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                !localSettings.useDemoMode
                  ? 'bg-[#163D2B] text-white border-[#163D2B] shadow-xs'
                  : 'bg-white text-[#1D2921] border-[#E2E8E0] hover:bg-[#E4F0E5]/50'
              }`}
            >
              Live Gemma 4 / Gemini API
            </button>
          </div>

          {!localSettings.useDemoMode && (
            <div className="space-y-2 pt-2 border-t border-[#E2E8E0]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#163D2B] flex items-center gap-1.5">
                <Key size={13} />
                <span>Google AI Studio API Key:</span>
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={localSettings.apiKey || ''}
                onChange={(e) => setLocalSettings(s => ({ ...s, apiKey: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8E0] text-xs bg-white text-[#1D2921] focus:outline-none focus:border-[#163D2B]"
              />
              <p className="text-[11px] text-[#68736B]">
                Your key is stored strictly in your browser session localStorage and never transmitted to any third-party analytics.
              </p>
            </div>
          )}
        </div>

        {/* Language Preference */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#163D2B] flex items-center gap-1.5">
            <Globe size={14} />
            <span>Language Preference</span>
          </label>
          <select
            value={localSettings.language}
            onChange={(e) => setLocalSettings(s => ({ ...s, language: e.target.value as any }))}
            className="w-full p-2.5 rounded-xl border border-[#E2E8E0] text-xs font-medium text-[#1D2921] bg-white focus:outline-none focus:border-[#163D2B]"
          >
            <option value="en">English (US / International)</option>
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="de">Deutsch (German)</option>
          </select>
        </div>

        {/* Model Information */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8E0] space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#163D2B] flex items-center gap-1.5">
            <Cpu size={14} />
            <span>Multimodal Model Architecture</span>
          </h4>
          <p className="text-xs text-[#68736B] leading-relaxed">
            NutriScan AI is designed for <strong>Gemma 4</strong>, Google’s open-weights lightweight vision-language multimodal foundation model. It combines high-resolution patch tokenization with sub-word OCR embeddings to decipher compact nutrition facts tables, ingredient lists, and culinary plates.
          </p>
        </div>

        {/* Nutrition Reference Data Sources */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8E0] space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#163D2B] flex items-center gap-1.5">
            <Database size={14} />
            <span>Nutrition Reference Data Sources</span>
          </h4>
          <ul className="text-xs text-[#68736B] space-y-1 leading-relaxed list-disc list-inside">
            <li><strong>Open Food Facts:</strong> Open database of packaged foods with global barcodes and additives taxonomy.</li>
            <li><strong>USDA FoodData Central:</strong> Standard nutrient profiles for whole culinary food ingredients and foundation foods.</li>
            <li><strong>NOVA Food Classification:</strong> Monteiro et al. 4-tier industrial processing framework.</li>
          </ul>
        </div>

        {/* Privacy & Data Retention */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8E0] space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#163D2B] flex items-center gap-1.5">
            <Shield size={14} />
            <span>Privacy & Local Data Retention</span>
          </h4>
          <p className="text-xs text-[#68736B] leading-relaxed">
            Scanned food photos and extracted reports are kept entirely inside your browser's private localStorage. We do not maintain server-side image logs, sell biometric food habits, or track user identities.
          </p>
        </div>

        {/* AI Limitations & Clinical Disclaimers */}
        <div className="p-4 rounded-xl bg-[#FEF7ED] border border-[#A65D12]/30 space-y-1.5 text-xs text-[#A65D12]">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle size={15} />
            <span>AI Limitations & Non-Medical Status</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#1D2921]">
            NutriScan AI cannot diagnose illness, treat diabetes, prescribe dietary programs, or detect microbiological toxins. AI optical character recognition may fail to register allergens obscured by glare, wrinkles, or folding. Always confirm with the physical packaging label.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ECEEEA]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8E0] text-xs font-semibold text-[#68736B] hover:bg-[#F6F4E9]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#163D2B] text-white text-xs font-semibold hover:bg-[#0F2A1E] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            {savedSuccess ? (
              <>
                <Check size={14} />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
