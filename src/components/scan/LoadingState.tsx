import React from 'react';
import type { AnalysisProgressEvent } from '../../services/apiService';
import { Loader2, CheckCircle2, Circle, X, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  progress: AnalysisProgressEvent | null;
  onCancel?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ progress, onCancel }) => {
  const currentStage = progress?.stage || 1;
  const currentPercentage = progress?.percentage || 20;
  const currentMessage = progress?.message || 'Processing image tensors...';

  const stages = [
    { number: 1, name: 'Processing image' },
    { number: 2, name: 'Reading visible food information' },
    { number: 3, name: 'Analyzing nutrition details' },
    { number: 4, name: 'Checking available reference data' },
    { number: 5, name: 'Preparing the report' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-8 max-w-xl mx-auto shadow-sm space-y-6 text-center animate-in fade-in duration-300">
      {/* Icon & Heading */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E4F0E5] flex items-center justify-center text-[#163D2B] mb-3 relative">
          <Loader2 size={32} className="animate-spin text-[#163D2B]" />
          <Sparkles size={16} className="absolute -top-1 -right-1 text-[#3D7954]" />
        </div>
        <h3 className="text-xl font-extrabold text-[#163D2B]">
          Analyzing Food Intelligence
        </h3>
        <p className="text-xs text-[#68736B] mt-1">
          Gemma 4 Multimodal model is inspecting nutrition labels and ingredients
        </p>
      </div>

      {/* Real Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-[#163D2B]">
          <span>{progress?.stageName || 'Processing...'}</span>
          <span className="tabular-nums font-mono">{currentPercentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#E2E8E0] overflow-hidden">
          <div
            className="h-full bg-[#163D2B] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${currentPercentage}%` }}
          />
        </div>
        <p className="text-[11px] text-[#68736B] italic pt-1 truncate">
          {currentMessage}
        </p>
      </div>

      {/* 5 Real Stages Stepper */}
      <div className="pt-4 border-t border-[#ECEEEA] space-y-2.5 text-left">
        {stages.map((st) => {
          const isDone = st.number < currentStage;
          const isCurrent = st.number === currentStage;

          return (
            <div
              key={st.number}
              className={`flex items-center gap-3 p-2 rounded-lg text-xs transition-colors ${
                isCurrent
                  ? 'bg-[#E4F0E5]/60 text-[#163D2B] font-bold'
                  : isDone
                  ? 'text-[#3D7954]'
                  : 'text-[#68736B]/60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 size={16} className="text-[#3D7954] shrink-0" />
              ) : isCurrent ? (
                <Loader2 size={16} className="text-[#163D2B] animate-spin shrink-0" />
              ) : (
                <Circle size={16} className="text-gray-300 shrink-0" />
              )}
              <span className="flex-1">{st.name}</span>
              {isDone && <span className="text-[10px] uppercase font-bold text-[#3D7954]">Complete</span>}
              {isCurrent && <span className="text-[10px] uppercase font-bold text-[#163D2B]">In progress</span>}
            </div>
          );
        })}
      </div>

      {/* Cancel button */}
      {onCancel && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#68736B] hover:text-[#B42318] hover:bg-rose-50 transition-colors"
          >
            <X size={14} />
            <span>Cancel Analysis</span>
          </button>
        </div>
      )}
    </div>
  );
};
