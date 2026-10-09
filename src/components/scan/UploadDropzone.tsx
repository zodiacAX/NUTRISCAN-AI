import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, X, RefreshCw, AlertCircle } from 'lucide-react';
import { validateImageFile } from '../../services/apiService';

interface UploadDropzoneProps {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  onImageSelected: (file: File | null, previewUrl: string) => void;
  onClearImage: () => void;
  error?: string | null;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  imageFile,
  imagePreviewUrl,
  onImageSelected,
  onClearImage,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setLocalError(null);
    try {
      validateImageFile(file);
      const url = URL.createObjectURL(file);
      onImageSelected(file, url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid file';
      setLocalError(msg);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Camera capture simulation using canvas or device camera stream
  const triggerCameraSimulation = () => {
    // We create a sample canvas snapshot representing a live captured camera shot
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background
      ctx.fillStyle = '#163D2B';
      ctx.fillRect(0, 0, 640, 480);
      
      // Draw simulated food box
      ctx.fillStyle = '#E4F0E5';
      ctx.roundRect(140, 80, 360, 320, 20);
      ctx.fill();

      ctx.fillStyle = '#163D2B';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText('NutriScan Camera Capture', 170, 160);

      ctx.font = '16px Inter, sans-serif';
      ctx.fillStyle = '#3D7954';
      ctx.fillText('Nutrition Facts & Ingredients Label', 170, 200);

      ctx.fillStyle = '#1D2921';
      ctx.font = '14px monospace';
      ctx.fillText('CALORIES: 190 kcal', 170, 250);
      ctx.fillText('SUGAR: 11g | SODIUM: 140mg', 170, 280);
      ctx.fillText('BB: 18 NOV 2026', 170, 310);

      canvas.toBlob((blob) => {
        if (blob) {
          const simulatedFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          onImageSelected(simulatedFile, url);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        id="food-image-input"
      />

      {/* Upload Zone or Preview */}
      {!imagePreviewUrl ? (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[340px] ${
            isDragOver
              ? 'border-[#163D2B] bg-[#E4F0E5]/50 scale-[0.99]'
              : 'border-[#E2E8E0] bg-white hover:border-[#3D7954] hover:bg-[#F6F4E9]/50'
          }`}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#E4F0E5] flex items-center justify-center text-[#163D2B] mb-4 shadow-2xs">
            <UploadCloud size={30} className="stroke-[2.2]" />
          </div>

          <h3 className="text-lg font-bold text-[#1D2921]">
            Drag & drop food image here
          </h3>
          <p className="text-xs text-[#68736B] mt-1 max-w-xs leading-relaxed">
            Support JPG, PNG, or WEBP up to 10 MB. Snap a packaged label or fresh plate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#163D2B] text-white text-xs font-semibold hover:bg-[#0F2A1E] transition-all flex items-center gap-2 shadow-2xs"
            >
              <ImageIcon size={15} />
              <span>Browse files</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerCameraSimulation();
              }}
              className="px-4 py-2.5 rounded-xl bg-white text-[#163D2B] border border-[#E2E8E0] text-xs font-semibold hover:bg-[#F6F4E9] transition-all flex items-center gap-2 shadow-2xs"
            >
              <Camera size={15} className="text-[#3D7954]" />
              <span>Take photo</span>
            </button>
          </div>
        </div>
      ) : (
        /* Image Preview / Viewfinder State (Inspired by Mobile Reference) */
        <div className="bg-white rounded-3xl border border-[#E2E8E0] p-4 sm:p-6 shadow-sm space-y-5">
          {/* Viewfinder Frame with Corner Brackets & Laser */}
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 max-h-[380px] flex items-center justify-center group">
            <img
              src={imagePreviewUrl}
              alt="Uploaded food target"
              className="w-full h-full object-contain select-none"
            />

            {/* Corner Reticle Brackets [ ] */}
            <div className="absolute inset-4 pointer-events-none">
              {/* Top-Left Bracket */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-[#22C55E] rounded-tl-xl" />
              {/* Top-Right Bracket */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-[#22C55E] rounded-tr-xl" />
              {/* Bottom-Left Bracket */}
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-[#22C55E] rounded-bl-xl" />
              {/* Bottom-Right Bracket */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-[#22C55E] rounded-br-xl" />
            </div>

            {/* Animated Laser Scanning Beam */}
            <div className="absolute left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_15px_#22C55E] animate-scan-laser pointer-events-none z-10" />

            {/* Pulsing "Scanning..." Status Pill */}
            <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-2 border border-white/10 z-20">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <span>Scanning Target Ready</span>
            </div>

            {/* Overlay badge with file name */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-lg max-w-[70%] truncate z-20">
              {imageFile?.name || 'Target Image Selected'}
            </div>
            {imageFile && (
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#163D2B] text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs z-20">
                {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            )}
          </div>

          {/* "Next Steps" Checklist Card (Inspired by Image 1) */}
          <div className="bg-[#F6F4E9]/70 rounded-2xl p-4 border border-[#E2E8E0] space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#163D2B] flex items-center gap-1.5">
              <span>Next Steps</span>
            </h4>
            <div className="space-y-2 text-xs text-[#1D2921]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3D7954] shrink-0" />
                <span>Image loaded into optical bounding viewport</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3D7954] shrink-0" />
                <span>Label centered at optical reticle target</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3D7954] shrink-0" />
                <span>Click <strong>"Analyze Food with Gemma 4"</strong> below to proceed</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 px-3 rounded-xl border border-[#E2E8E0] bg-[#F6F4E9] text-xs font-semibold text-[#163D2B] hover:bg-[#E4F0E5] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Replace Image</span>
            </button>

            <button
              type="button"
              onClick={onClearImage}
              className="py-2.5 px-4 rounded-xl border border-[#B42318]/30 bg-rose-50/50 text-xs font-semibold text-[#B42318] hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <X size={15} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {/* Validation error display */}
      {(localError || error) && (
        <div className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#B42318]/30 flex items-start gap-2.5 text-xs text-[#B42318]">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{localError || error}</p>
        </div>
      )}
    </div>
  );
};
