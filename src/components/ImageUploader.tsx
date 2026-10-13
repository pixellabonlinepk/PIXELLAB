import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, FileCheck, AlertCircle, Sparkles } from 'lucide-react';
import { createSamplePortrait, createSampleLandscape } from '../utils/sampleImages';
import { useTheme } from '../context/ThemeContext';

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

  const { theme } = useTheme();

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer group ${
          isDragging
            ? theme === 'dark'
              ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
              : 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
            : theme === 'dark'
            ? 'border-slate-700/80 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-900/80'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50 shadow-sm'
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

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          {/* Animated upload icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3
            className={`text-base sm:text-lg font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Drag & drop your {acceptPdf ? 'PDF' : multiple ? 'images' : 'image'} here
          </h3>

          <p
            className={`text-xs mb-5 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            or click to browse files from your computer or phone
          </p>

          {/* Action button */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-colors"
            >
              Browse Files
            </button>

            {!acceptPdf && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSample('portrait');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border-cyan-800/60'
                    : 'text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border-cyan-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Photo</span>
              </button>
            )}
          </div>

          {/* Supported formats guidance */}
          <div
            className={`mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            <span className="flex items-center gap-1">
              <FileCheck
                className={`w-3.5 h-3.5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}
              />
              <span>Supports {acceptedFormats.join(', ')}</span>
            </span>
            <span>·</span>
            <span>Up to {maxSizeMB} MB</span>
            <span>·</span>
            <span className="text-emerald-500 font-medium">100% Private (In-Browser)</span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
