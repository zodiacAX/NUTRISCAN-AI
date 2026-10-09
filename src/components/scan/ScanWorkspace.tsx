import React, { useState, useRef } from 'react';
import type { FoodScanResult, ScanWorkspaceSettings } from '../../types/nutrition';
import { UploadDropzone } from './UploadDropzone';
import { ScanSettings } from './ScanSettings';
import { LoadingState } from './LoadingState';
import { analyzeFoodImage, type AnalysisProgressEvent } from '../../services/apiService';
import { Sparkles, ArrowRight, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { SAMPLE_FOODS } from '../../data/sampleFoods';

interface ScanWorkspaceProps {
  onScanComplete: (result: FoodScanResult) => void;
  isDemoMode: boolean;
  apiKey?: string;
  initialScanType?: 'packaged' | 'cooked_meal';
}

export const ScanWorkspace: React.FC<ScanWorkspaceProps> = ({
  onScanComplete,
  isDemoMode,
  apiKey,
  initialScanType = 'packaged'
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<ScanWorkspaceSettings>({
    foodType: initialScanType,
    packagedFocus: 'nutrition',
    cookedContext: '',
    servingPortionContext: '',
    scanMode: 'full'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgressEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleImageSelected = (file: File | null, url: string) => {
    setImageFile(file);
    setPreviewUrl(url);
    setError(null);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleSettingsChange = (updated: Partial<ScanWorkspaceSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setProgress(null);
  };

  const handleStartAnalysis = async () => {
    if (!previewUrl) {
      setError('Please upload a food image or choose a sample to analyze.');
      return;
    }

    setError(null);
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const result = await analyzeFoodImage(
        imageFile,
        previewUrl,
        settings,
        isDemoMode,
        apiKey,
        (evt) => setProgress(evt),
        abortControllerRef.current.signal
      );
      onScanComplete(result);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('Analysis aborted');
        return;
      }
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
      setProgress(null);
      abortControllerRef.current = null;
    }
  };

  // Quick picker for judge / demo workflow
  const loadPresetSample = (sample: FoodScanResult) => {
    setImageFile(null);
    setPreviewUrl(sample.imageUrl);
    setSettings({
      foodType: sample.scanType,
      packagedFocus: 'nutrition',
      cookedContext: sample.scanType === 'cooked_meal' ? 'Restaurant plated dish' : '',
      servingPortionContext: sample.servingBasis,
      scanMode: 'full'
    });
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6">
        <LoadingState progress={progress} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8E0] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163D2B]">
            Scan & Analyze Food
          </h1>
          <p className="text-xs text-[#68736B] mt-1">
            Gemma 4 Multimodal Vision • Nutrition Facts OCR • NOVA Processing Audit
          </p>
        </div>

        {/* Quick Demo Pre-loader */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#68736B] uppercase tracking-wider hidden sm:inline">
            Load Sample:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_FOODS.slice(0, 3).map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => loadPresetSample(s)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[#E2E8E0] bg-white hover:bg-[#E4F0E5] hover:text-[#163D2B] transition-all"
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-[#FEF3F2] border border-[#B42318]/30 flex items-start justify-between gap-3 text-xs text-[#B42318]">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Analysis Error</p>
              <p className="mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
          <button
            onClick={handleStartAnalysis}
            className="px-3 py-1.5 rounded-lg bg-[#B42318] text-white font-semibold text-xs hover:bg-[#8e1b12] flex items-center gap-1 shrink-0"
          >
            <RefreshCw size={12} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Dropzone & Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <UploadDropzone
            imageFile={imageFile}
            imagePreviewUrl={previewUrl}
            onImageSelected={handleImageSelected}
            onClearImage={handleClearImage}
            error={error}
          />

          <div className="p-4 rounded-xl bg-white border border-[#E2E8E0] flex items-center justify-between text-xs text-[#68736B]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#3D7954]" />
              <span>Image remains local in your browser session</span>
            </div>
            <span className="text-[11px] font-medium text-[#163D2B]">
              Max 10 MB (JPG/PNG/WEBP)
            </span>
          </div>
        </div>

        {/* Right Column: Scan Settings & Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ScanSettings
            settings={settings}
            onChange={handleSettingsChange}
          />

          {/* Primary Analyze Action Button */}
          <button
            type="button"
            disabled={!previewUrl}
            onClick={handleStartAnalysis}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-sm ${
              previewUrl
                ? 'bg-[#163D2B] text-white hover:bg-[#0F2A1E] hover:shadow-md active:scale-[0.99] cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Sparkles size={20} className={previewUrl ? 'text-[#E4F0E5]' : 'text-gray-400'} />
            <span>Analyze with Gemma 4</span>
            <ArrowRight size={18} />
          </button>

          {!previewUrl && (
            <p className="text-center text-xs text-[#68736B]">
              Select or drop an image on the left to begin analysis
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
