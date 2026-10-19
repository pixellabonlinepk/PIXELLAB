import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { createSamplePortrait, createSampleLandscape } from '../utils/sampleImages';
import portraitYoungWoman from '../assets/images/portrait_young_woman_1791695480567.jpg';
import landscapeAlpineLake from '../assets/images/landscape_alpine_lake_1791695494103.jpg';

interface ImageUploaderProps {
  onImageSelected: (file: File | string, filename?: string) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  onMultipleImagesSelected?: (files: File[]) => void;
  acceptPdf?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  acceptedFormats = ['PNG', 'JPG', 'WEBP'],
  maxSizeMB = 30,
  multiple = false,
  onMultipleImagesSelected,
  acceptPdf = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcess = (file: File) => {
    setErrorMsg(null);
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setErrorMsg(`File size exceeds limit (${maxSizeMB} MB maximum).`);
      return false;
    }

    if (acceptPdf) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onImageSelected(file, file.name);
        return true;
      }
    }

    if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
      setErrorMsg('Please upload a supported image file (PNG, JPG, WebP, etc.).');
      return false;
    }

    onImageSelected(file, file.name);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (multiple && onMultipleImagesSelected && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length > 0) {
        onMultipleImagesSelected(files);
        return;
      }
    }

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcess(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple && onMultipleImagesSelected && e.target.files) {
      const files = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
      if (files.length > 0) {
        onMultipleImagesSelected(files);
        return;
      }
    }

    const file = e.target.files?.[0];
    if (file) {
      validateAndProcess(file);
    }
  };

  const handleLoadSample = (type: 'portrait' | 'landscape') => {
    setErrorMsg(null);
    const sampleDataUrl = type === 'portrait' ? createSamplePortrait() : createSampleLandscape();
    onImageSelected(sampleDataUrl, `sample-${type}.png`);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-14 text-center transition-all cursor-pointer group glass-panel ${
          isDragging
            ? 'border-indigo-500 scale-[0.99] ring-4 ring-indigo-500/20'
            : 'border-indigo-500/30 hover:border-indigo-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptPdf ? '.pdf,application/pdf' : 'image/png,image/jpeg,image/webp,image/bmp,image/svg+xml'}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
          {/* Liquid upload icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 group-hover:scale-105 transition-transform duration-300">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold mb-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-display">
            Drag & drop your {acceptPdf ? 'PDF document' : multiple ? 'images' : 'photo'} here
          </h3>

          <p className="text-xs sm:text-sm mb-6 text-[#6E6E73] dark:text-[#86868B]">
            or click anywhere to browse files from your computer or phone
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all active:scale-95"
            >
              Browse Files
            </button>

            {!acceptPdf && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample('portrait');
                  }}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/5 dark:border-white/10 flex items-center gap-2 transition-all active:scale-95"
                >
                  <img
                    src={portraitYoungWoman}
                    alt="Portrait sample"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>Try Portrait Sample</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample('landscape');
                  }}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/5 dark:border-white/10 flex items-center gap-2 transition-all active:scale-95"
                >
                  <img
                    src={landscapeAlpineLake}
                    alt="Landscape sample"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>Try Landscape Sample</span>
                </button>
              </div>
            )}
          </div>

          {/* Privacy & format specs */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#6E6E73] dark:text-[#86868B]">
            <span className="font-semibold text-emerald-500 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> 100% In-Browser Memory
            </span>
            <span>·</span>
            <span>Formats: {acceptedFormats.join(', ')}</span>
            <span>·</span>
            <span>Up to {maxSizeMB} MB</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center justify-center gap-2 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
