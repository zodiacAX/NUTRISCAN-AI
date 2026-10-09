import React from 'react';
import type { ProvenanceType } from '../../types/nutrition';
import { Database, Sparkles, AlertCircle, FileText } from 'lucide-react';

export const ProvenanceBadge: React.FC<{ provenance: ProvenanceType; size?: 'sm' | 'md' }> = ({
  provenance,
  size = 'sm'
}) => {
  const isSm = size === 'sm';
  const textClass = isSm ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const iconSize = isSm ? 12 : 14;

  switch (provenance) {
    case 'extracted_label':
      return (
        <span
          title="Extracted directly from package text via OCR"
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-[#E4F0E5] text-[#163D2B] border border-[#3D7954]/20 ${textClass}`}
        >
          <FileText size={iconSize} className="text-[#3D7954]" />
          <span>Extracted from label</span>
        </span>
      );
    case 'matched_database':
      return (
        <span
          title="Matched with USDA FoodData Central or Open Food Facts reference database"
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-[#F0F7FB] text-[#1D5B79] border border-[#1D5B79]/20 ${textClass}`}
        >
          <Database size={iconSize} className="text-[#1D5B79]" />
          <span>Matched with database</span>
        </span>
      );
    case 'estimated_ai':
      return (
        <span
          title="Visually estimated by Gemma 4 multimodal model (approximate)"
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-[#FEF7ED] text-[#A65D12] border border-[#A65D12]/20 ${textClass}`}
        >
          <Sparkles size={iconSize} className="text-[#A65D12]" />
          <span>Estimated by AI</span>
        </span>
      );
    case 'needs_verification':
    default:
      return (
        <span
          title="Ambiguous text or low OCR confidence — verify original physical label"
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-[#FEF3F2] text-[#B42318] border border-[#B42318]/20 ${textClass}`}
        >
          <AlertCircle size={iconSize} className="text-[#B42318]" />
          <span>Needs verification</span>
        </span>
      );
  }
};

export const NovaBadge: React.FC<{ novaGroup: 1 | 2 | 3 | 4 }> = ({ novaGroup }) => {
  const configs = {
    1: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      label: 'Group 1: Unprocessed / Minimal'
    },
    2: {
      bg: 'bg-blue-50 text-blue-800 border-blue-300',
      label: 'Group 2: Culinary Ingredients'
    },
    3: {
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      label: 'Group 3: Processed Foods'
    },
    4: {
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      label: 'Group 4: Ultra-Processed Food'
    }
  };

  const current = configs[novaGroup];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg}`}>
      <span className="w-2 h-2 rounded-full bg-current"></span>
      <span>NOVA {novaGroup} • {current.label}</span>
    </span>
  );
};
