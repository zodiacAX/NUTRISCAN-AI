import React from 'react';
import type { EvidenceItem } from '../../types/nutrition';
import { ProvenanceBadge } from '../common/Badge';
import { FileSearch, ExternalLink, MapPin } from 'lucide-react';

interface EvidencePanelProps {
  evidenceItems: EvidenceItem[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidenceItems }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ECEEEA] gap-2">
        <div className="flex items-center gap-2">
          <FileSearch size={18} className="text-[#163D2B]" />
          <div>
            <h2 className="text-lg font-extrabold text-[#163D2B]">
              Evidence & Verification Audit Trail
            </h2>
            <p className="text-xs text-[#68736B]">
              Transparent attribution linking each AI claim to OCR text or reference databases
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#163D2B] bg-[#E4F0E5] px-2.5 py-1 rounded-full border border-[#3D7954]/20 self-start sm:self-center">
          {evidenceItems.length} Audited Claims
        </span>
      </div>

      <div className="space-y-3">
        {evidenceItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-[#E2E8E0] bg-[#F6F4E9]/40 hover:bg-white transition-all space-y-3"
          >
            {/* Header: Claim & Provenance Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-[#1D2921]">
                {item.claim}
              </h4>
              <ProvenanceBadge provenance={item.provenance} size="sm" />
            </div>

            {/* Extracted snippet quote */}
            <div className="p-2.5 rounded-lg bg-white border border-[#E2E8E0] text-xs font-mono text-[#1D2921] leading-relaxed">
              <span className="text-[10px] uppercase font-bold text-[#68736B] block mb-1 font-sans">
                Extracted Snippet from Image:
              </span>
              “{item.extractedSnippet}”
            </div>

            {/* Meta tags: Location on package & External source */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#68736B] pt-1 border-t border-[#ECEEEA]">
              {item.locationOnPackage && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#3D7954]" />
                  <span>Package section: <strong>{item.locationOnPackage}</strong></span>
                </div>
              )}

              {item.externalSource && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#163D2B]">{item.externalSource.name}</span>
                  <span className="font-mono text-[10px] text-gray-500">[{item.externalSource.referenceId}]</span>
                  {item.externalSource.url && (
                    <a
                      href={item.externalSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D5B79] hover:underline flex items-center gap-0.5 ml-1"
                    >
                      <span>Verify source</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
