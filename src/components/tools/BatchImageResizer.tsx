import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Layers,
  Upload,
  Download,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  FileArchive,
  Image as ImageIcon,
  Sliders,
  Maximize2,
  Lock,
  Unlock,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { SAMPLE_BATCH_ITEMS, SampleImageItem } from '../../utils/newToolsSampleImages';
import { formatBytes, downloadBlob } from '../../utils/imageProcessing';
import JSZip from 'jszip';

interface BatchImageResizerProps {
  tool: ToolMetadata;
  onBack: () => void;
  onSelectRelatedTool: (id: string) => void;
}

interface ImageBatchItem {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  file?: File;
  resizedBlob?: Blob;
  resizedUrl?: string;
  resizedWidth?: number;
  resizedHeight?: number;
  resizedSize?: number;
}

export const BatchImageResizer: React.FC<BatchImageResizerProps> = ({
  tool,
  onBack,
  onSelectRelatedTool,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Images state (initialize with high-quality samples for immediate visual feedback)
  const [images, setImages] = useState<ImageBatchItem[]>(() =>
    SAMPLE_BATCH_ITEMS.map((item) => ({
      ...item,
    }))
  );
  const [selectedImageId, setSelectedImageId] = useState<string>(SAMPLE_BATCH_ITEMS[0].id);

  // Resize Settings
  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage'>('dimensions');
  const [targetWidth, setTargetWidth] = useState<number>(1024);
  const [targetHeight, setTargetHeight] = useState<number>(768);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [scalePercentage, setScalePercentage] = useState<number>(50);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.9);

  // Processing & UI state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Keep target height in sync with aspect ratio when width changes if aspect ratio locked
  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (keepAspectRatio) {
      const active = images.find((i) => i.id === selectedImageId) || images[0];
      if (active && active.width > 0) {
        const ratio = active.height / active.width;
        setTargetHeight(Math.round(w * ratio));
      }
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (keepAspectRatio) {
      const active = images.find((i) => i.id === selectedImageId) || images[0];
      if (active && active.height > 0) {
        const ratio = active.width / active.height;
        setTargetWidth(Math.round(h * ratio));
      }
    }
  };

  // Add files to batch
  const handleFilesAdded = async (files: FileList | File[]) => {
    const newItems: ImageBatchItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const url = URL.createObjectURL(file);
      // Read dimensions
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      newItems.push({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        url,
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 600,
        sizeBytes: file.size,
        file,
      });
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
      setSelectedImageId(newItems[0].id);
      setHasProcessed(false);
      setStatusMessage(`Added ${newItems.length} image${newItems.length > 1 ? 's' : ''}`);
    }
  };

  const handleRemoveImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (selectedImageId === id && filtered.length > 0) {
        setSelectedImageId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    setImages([]);
    setHasProcessed(false);
  };

  const handleResetToSamples = () => {
    setImages(SAMPLE_BATCH_ITEMS.map((item) => ({ ...item })));
    setSelectedImageId(SAMPLE_BATCH_ITEMS[0].id);
    setHasProcessed(false);
    setStatusMessage('Restored sample photos');
  };

  // Resize all images via Canvas
  const handleResizeAll = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const updatedImages = await Promise.all(
        images.map(async (item) => {
          let destW = targetWidth;
          let destH = targetHeight;

          if (resizeMode === 'percentage') {
            const factor = scalePercentage / 100;
            destW = Math.max(1, Math.round(item.width * factor));
            destH = Math.max(1, Math.round(item.height * factor));
          } else if (keepAspectRatio) {
            const ratio = item.width / item.height;
            if (destW / destH > ratio) {
              destW = Math.round(destH * ratio);
            } else {
              destH = Math.round(destW / ratio);
            }
          }

          // Create canvas and draw
          const canvas = document.createElement('canvas');
          canvas.width = destW;
          canvas.height = destH;
          const ctx = canvas.getContext('2d')!;

          if (outputFormat === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, destW, destH);
          }

          // Load image element
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = item.url;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load ${item.name}`));
          });

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, destW, destH);

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => {
                if (b) resolve(b);
                else reject(new Error('Export failed'));
              },
              outputFormat,
              quality
            );
          });

          const resizedUrl = URL.createObjectURL(blob);

          return {
            ...item,
            resizedBlob: blob,
            resizedUrl,
            resizedWidth: destW,
            resizedHeight: destH,
            resizedSize: blob.size,
          };
        })
      );

      setImages(updatedImages);
      setHasProcessed(true);
      setStatusMessage(`Successfully resized ${updatedImages.length} images!`);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || 'Failed to resize batch'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    const readyItems = images.filter((img) => img.resizedBlob);
    if (readyItems.length === 0) return;

    setIsProcessing(true);
    try {
      const zip = new JSZip();
      const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/png' ? 'png' : 'webp';

      readyItems.forEach((img, index) => {
        const baseName = img.name.replace(/\.[^/.]+$/, '');
        const filename = `${baseName}_resized_${img.resizedWidth}x${img.resizedHeight}.${ext}`;
        zip.file(filename, img.resizedBlob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `pixallab-batch-resized-${Date.now()}.zip`);
    } catch (err: any) {
      setStatusMessage(`Failed to create ZIP: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download single image
  const handleDownloadSingle = (item: ImageBatchItem) => {
    if (!item.resizedBlob) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/png' ? 'png' : 'webp';
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    downloadBlob(item.resizedBlob, `${baseName}_resized_${item.resizedWidth}x${item.resizedHeight}.${ext}`);
  };

  const selectedImage = images.find((i) => i.id === selectedImageId) || images[0];

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
        multiple
        accept="image/png,image/jpeg,image/webp,image/bmp"
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation & Tool Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tools</span>
          </button>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              theme === 'dark'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            Zero-Cost Browser Tool
          </span>
        </div>

        {/* Centered Title & Tagline matching design reference */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-3 shadow-lg shadow-blue-500/10">
            <Layers className="w-6 h-6" />
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold font-display mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Batch Image Resizer
          </h1>
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Resize multiple images at once. Save time and get perfectly sized images for your website, social media, or projects.
          </p>
        </div>

        {/* MAIN WORKSPACE 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT COLUMN: UPLOAD & THUMBNAILS LIST */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            {/* Upload Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files) handleFilesAdded(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl p-8 border-2 border-dashed transition-all cursor-pointer text-center relative group ${
                dragOver
                  ? 'border-blue-400 bg-blue-500/10'
                  : theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/60 hover:border-blue-500/50 hover:bg-slate-900/90'
                  : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/20 shadow-xs'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3
                className={`text-sm font-bold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                Drop your images here or click to browse
              </h3>
              <p
                className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Supports JPG, PNG, WEBP (Max 10MB each)
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 inline-flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Choose Images</span>
              </button>
            </div>

            {/* Thumbnails Strip & Selection */}
            {images.length > 0 ? (
              <div
                className={`rounded-2xl p-5 border shadow-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 text-white'
                    : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {images.length} Image{images.length !== 1 ? 's' : ''} Selected
                    </span>
                    {hasProcessed && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Resized
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetToSamples}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                      title="Reload demo images"
                    >
                      Samples
                    </button>
                    <span className="text-slate-700">·</span>
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((item) => {
                    const isSelected = item.id === selectedImageId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedImageId(item.id)}
                        className={`group relative rounded-xl p-2 border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/5'
                            : theme === 'dark'
                            ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {/* Delete button */}
                        <button
                          onClick={(e) => handleRemoveImage(item.id, e)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        <div className="aspect-4/3 rounded-lg overflow-hidden bg-checkerboard mb-2 relative">
                          <img
                            src={item.resizedUrl || item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {item.resizedWidth && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono text-emerald-400 px-1 py-0.2 rounded">
                              {item.resizedWidth}×{item.resizedHeight}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] font-medium truncate mb-0.5" title={item.name}>
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>{item.width}×{item.height}</span>
                          <span>{formatBytes(item.resizedSize || item.sizeBytes)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Selected Image Detail / Canvas Preview */}
            {selectedImage && (
              <div
                className={`rounded-2xl p-5 border shadow-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    Preview: {selectedImage.name}
                  </span>
                  <div className="text-slate-400 font-mono text-[11px]">
                    Original: {selectedImage.width} × {selectedImage.height} px ({formatBytes(selectedImage.sizeBytes)})
                  </div>
                </div>

                <div className="w-full h-[280px] rounded-xl bg-checkerboard flex items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                  <img
                    src={selectedImage.resizedUrl || selectedImage.url}
                    alt={selectedImage.name}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                  />
                </div>

                {selectedImage.resizedBlob && (
                  <div className="mt-3 flex items-center justify-between pt-2 text-xs">
                    <span className="text-emerald-400 font-semibold font-mono">
                      Resized: {selectedImage.resizedWidth} × {selectedImage.resizedHeight} px ({formatBytes(selectedImage.resizedSize || 0)})
                    </span>
                    <button
                      onClick={() => handleDownloadSingle(selectedImage)}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download This Image</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: RESIZE OPTIONS & ACTIONS */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <div
              className={`rounded-2xl p-6 border shadow-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-4 mb-5 border-b ${
                  theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  Resize Options
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {images.length} images queued
                </span>
              </div>

              {/* Mode Selection: Dimensions vs Percentage */}
              <div className="space-y-4">
                <div
                  className={`grid grid-cols-2 p-1 rounded-xl border text-xs font-semibold ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setResizeMode('dimensions')}
                    className={`py-2 rounded-lg transition-all text-center ${
                      resizeMode === 'dimensions'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : theme === 'dark'
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    By Width & Height
                  </button>
                  <button
                    type="button"
                    onClick={() => setResizeMode('percentage')}
                    className={`py-2 rounded-lg transition-all text-center ${
                      resizeMode === 'percentage'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : theme === 'dark'
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    By Percentage
                  </button>
                </div>

                {/* Dimensions Controls */}
                {resizeMode === 'dimensions' ? (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="8000"
                          value={targetWidth}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-slate-950 border-slate-800 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="8000"
                          value={targetHeight}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-slate-950 border-slate-800 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Aspect Ratio Lock Toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={keepAspectRatio}
                          onChange={(e) => setKeepAspectRatio(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-950"
                        />
                        <span>Keep aspect ratio</span>
                      </label>
                      {keepAspectRatio ? (
                        <Lock className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>

                    {/* Dimension Presets */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                        Standard Presets
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                        {[
                          { label: 'Full HD', w: 1920, h: 1080 },
                          { label: 'HD 720p', w: 1280, h: 720 },
                          { label: 'Instagram', w: 1080, h: 1080 },
                          { label: 'Web Med', w: 1024, h: 768 },
                          { label: 'VGA Web', w: 800, h: 600 },
                          { label: 'Thumb', w: 400, h: 300 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setTargetWidth(preset.w);
                              setTargetHeight(preset.h);
                            }}
                            className={`p-1.5 rounded-lg border text-center transition-all ${
                              targetWidth === preset.w && targetHeight === preset.h
                                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                                : theme === 'dark'
                                ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Percentage Mode */
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">Scale Factor</span>
                      <span className="font-mono text-blue-400 font-bold">{scalePercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={scalePercentage}
                      onChange={(e) => setScalePercentage(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                      {[25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setScalePercentage(pct)}
                          className={`py-1 rounded-lg border text-center ${
                            scalePercentage === pct
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Output Format */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Output Format
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="image/jpeg">JPG (Best for photos)</option>
                    <option value="image/png">PNG (Preserves transparency)</option>
                    <option value="image/webp">WEBP (Modern web optimized)</option>
                  </select>
                </div>

                {/* Quality Slider for JPG/WEBP */}
                {outputFormat !== 'image/png' && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300">Compression Quality</span>
                      <span className="font-mono text-blue-400">{Math.round(quality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* Status Message */}
                {statusMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                      statusMessage.startsWith('Error')
                        ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                        : 'bg-blue-950/60 border-blue-800 text-blue-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* ACTION BUTTON: RESIZE ALL IMAGES */}
                <button
                  type="button"
                  onClick={handleResizeAll}
                  disabled={images.length === 0 || isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Processing {images.length} Images...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4" />
                      <span>Resize All Images</span>
                    </>
                  )}
                </button>

                {/* ZIP DOWNLOAD BUTTON (Appears once processed) */}
                {hasProcessed && (
                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    <FileArchive className="w-4 h-4" />
                    <span>Download All as ZIP Archive</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BEFORE & AFTER PREVIEW SECTION (Matching Design Reference) */}
        <div
          className={`rounded-2xl p-6 sm:p-8 border shadow-xl transition-colors mb-16 ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display">
                Before & After Visual Comparison
              </h2>
              <p
                className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Inspect original aspect ratio against newly scaled canvas
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Live Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Before Box */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Before (Original)
              </span>
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-checkerboard border border-slate-800 relative shadow-inner">
                <img
                  src={selectedImage?.url || SAMPLE_BATCH_ITEMS[0].url}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-200">
                  {selectedImage?.width || 1920} × {selectedImage?.height || 1080} px
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="md:col-span-1 flex items-center justify-center py-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                →
              </div>
            </div>

            {/* After Box */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                After (Resized Result)
              </span>
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-checkerboard border border-emerald-500/40 relative shadow-inner">
                <img
                  src={selectedImage?.resizedUrl || selectedImage?.url || SAMPLE_BATCH_ITEMS[0].url}
                  alt="Resized"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-emerald-400 font-bold">
                  {selectedImage?.resizedWidth || targetWidth} × {selectedImage?.resizedHeight || targetHeight} px
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED CREATIVE TOOLS */}
        <div
          className={`pt-10 border-t ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <h2
            className={`text-lg font-bold font-display mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Related Creative Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'image-resizer', name: 'Image Resizer', desc: 'Single image resizing with exact pixels' },
              { id: 'image-compressor', name: 'Image Compressor', desc: 'Shrink file size up to 90%' },
              { id: 'image-cropper', name: 'Image Cropper', desc: 'Cut photos to exact aspect ratios' },
              { id: 'image-format-converter', name: 'Format Converter', desc: 'Convert PNG, JPG, and WebP' },
            ].map((related) => (
              <button
                key={related.id}
                onClick={() => onSelectRelatedTool(related.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div
                  className={`text-xs font-bold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {related.name}
                </div>
                <div
                  className={`text-[11px] ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {related.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
