import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Combine,
  Upload,
  Download,
  Trash2,
  ArrowRight,
  Sparkles,
  Sliders,
  RotateCcw,
  Check,
  Maximize2,
  Plus,
  MoveLeft,
  MoveRight,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { SAMPLE_BATCH_ITEMS } from '../../utils/newToolsSampleImages';
import { formatBytes, downloadBlob } from '../../utils/imageProcessing';

interface ImageJoinerProps {
  tool: ToolMetadata;
  onBack: () => void;
  onSelectRelatedTool: (id: string) => void;
}

interface JoinImageItem {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  imgElement?: HTMLImageElement;
}

export const ImageJoiner: React.FC<ImageJoinerProps> = ({
  tool,
  onBack,
  onSelectRelatedTool,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Images state (initialize with sample photos)
  const [images, setImages] = useState<JoinImageItem[]>(() =>
    SAMPLE_BATCH_ITEMS.map((item) => ({ ...item }))
  );

  // Layout Settings
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'grid'>('horizontal');
  const [spacing, setSpacing] = useState<number>(10);
  const [alignment, setAlignment] = useState<'center' | 'start' | 'end'>('center');
  const [equalizeDimensions, setEqualizeDimensions] = useState<boolean>(true);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isTransparent, setIsTransparent] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.92);

  // Joined result state
  const [joinedBlob, setJoinedBlob] = useState<Blob | null>(null);
  const [joinedUrl, setJoinedUrl] = useState<string | null>(null);
  const [joinedWidth, setJoinedWidth] = useState<number>(0);
  const [joinedHeight, setJoinedHeight] = useState<number>(0);
  const [joinedSize, setJoinedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Add files
  const handleFilesAdded = async (files: FileList | File[]) => {
    const newItems: JoinImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const url = URL.createObjectURL(file);
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
      });
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
      setStatusMessage(`Added ${newItems.length} images to joiner`);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Re-stitch images whenever settings change or images change
  const renderJoinedCanvas = async () => {
    if (images.length === 0) {
      setJoinedBlob(null);
      setJoinedUrl(null);
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      // Pre-load all HTMLImageElements
      const loadedImgs = await Promise.all(
        images.map(
          (item) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.src = item.url;
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error(`Failed to load ${item.name}`));
            })
        )
      );

      // Compute dimensions based on layout
      let canvasW = 0;
      let canvasH = 0;

      // Equalized dimensions target
      const baseHeight = 800; // standard height for horizontal
      const baseWidth = 800;  // standard width for vertical

      const positions: { img: HTMLImageElement; x: number; y: number; w: number; h: number }[] = [];

      if (layout === 'horizontal') {
        let currentX = spacing;
        let maxH = 0;

        loadedImgs.forEach((img) => {
          let drawW = img.naturalWidth || img.width;
          let drawH = img.naturalHeight || img.height;

          if (equalizeDimensions) {
            const aspect = drawW / drawH;
            drawH = baseHeight;
            drawW = Math.round(baseHeight * aspect);
          }

          if (drawH > maxH) maxH = drawH;

          positions.push({ img, x: currentX, y: 0, w: drawW, h: drawH });
          currentX += drawW + spacing;
        });

        canvasW = currentX;
        canvasH = maxH + spacing * 2;

        // Apply alignment Y
        positions.forEach((pos) => {
          if (alignment === 'center') {
            pos.y = spacing + Math.round((maxH - pos.h) / 2);
          } else if (alignment === 'end') {
            pos.y = spacing + (maxH - pos.h);
          } else {
            pos.y = spacing;
          }
        });
      } else if (layout === 'vertical') {
        let currentY = spacing;
        let maxW = 0;

        loadedImgs.forEach((img) => {
          let drawW = img.naturalWidth || img.width;
          let drawH = img.naturalHeight || img.height;

          if (equalizeDimensions) {
            const aspect = drawH / drawW;
            drawW = baseWidth;
            drawH = Math.round(baseWidth * aspect);
          }

          if (drawW > maxW) maxW = drawW;

          positions.push({ img, x: 0, y: currentY, w: drawW, h: drawH });
          currentY += drawH + spacing;
        });

        canvasW = maxW + spacing * 2;
        canvasH = currentY;

        // Apply alignment X
        positions.forEach((pos) => {
          if (alignment === 'center') {
            pos.x = spacing + Math.round((maxW - pos.w) / 2);
          } else if (alignment === 'end') {
            pos.x = spacing + (maxW - pos.w);
          } else {
            pos.x = spacing;
          }
        });
      } else {
        // Grid Layout (2 columns)
        const cols = 2;
        const rows = Math.ceil(loadedImgs.length / cols);
        const cellDim = 600;

        canvasW = cols * cellDim + (cols + 1) * spacing;
        canvasH = rows * cellDim + (rows + 1) * spacing;

        loadedImgs.forEach((img, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);

          const cellX = spacing + c * (cellDim + spacing);
          const cellY = spacing + r * (cellDim + spacing);

          let drawW = img.naturalWidth || img.width;
          let drawH = img.naturalHeight || img.height;
          const aspect = drawW / drawH;

          if (aspect > 1) {
            drawW = cellDim;
            drawH = Math.round(cellDim / aspect);
          } else {
            drawH = cellDim;
            drawW = Math.round(cellDim * aspect);
          }

          const x = cellX + Math.round((cellDim - drawW) / 2);
          const y = cellY + Math.round((cellDim - drawH) / 2);

          positions.push({ img, x, y, w: drawW, h: drawH });
        });
      }

      // Render to canvas
      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d')!;

      // Background fill
      if (!isTransparent) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasW, canvasH);
      } else {
        ctx.clearRect(0, 0, canvasW, canvasH);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw all images
      positions.forEach((pos) => {
        ctx.drawImage(pos.img, pos.x, pos.y, pos.w, pos.h);
      });

      const exportMime = isTransparent ? 'image/png' : outputFormat;
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Export failed'));
          },
          exportMime,
          quality
        );
      });

      const url = URL.createObjectURL(blob);
      setJoinedBlob(blob);
      setJoinedUrl(url);
      setJoinedWidth(canvasW);
      setJoinedHeight(canvasH);
      setJoinedSize(blob.size);
    } catch (err: any) {
      setStatusMessage(`Error joining images: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    renderJoinedCanvas();
  }, [images, layout, spacing, alignment, equalizeDimensions, bgColor, isTransparent, outputFormat, quality]);

  // Download joined image
  const handleDownloadJoined = () => {
    if (!joinedBlob) return;
    const ext = isTransparent || outputFormat === 'image/png' ? 'png' : outputFormat === 'image/jpeg' ? 'jpg' : 'webp';
    downloadBlob(joinedBlob, `pixallab-joined-${layout}-${Date.now()}.${ext}`);
  };

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
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            Zero-Cost Browser Tool
          </span>
        </div>

        {/* Centered Title & Tagline matching design reference */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3 shadow-lg shadow-indigo-500/10">
            <Combine className="w-6 h-6" />
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold font-display mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Image Joiner
          </h1>
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Combine multiple images into one. Join them horizontally or vertically with custom spacing and background.
          </p>
        </div>

        {/* MAIN WORKSPACE 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT COLUMN: ADD IMAGES STRIP & LIVE JOINED PREVIEW */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            {/* Add Images Strip (Matching Design Reference) */}
            <div
              className={`rounded-2xl p-5 border shadow-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Combine className="w-3.5 h-3.5 text-indigo-400" />
                  Add Images ({images.length} in sequence)
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Photos</span>
                </button>
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {images.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group relative rounded-xl p-2 border transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => handleRemoveImage(item.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    <div className="aspect-square rounded-lg overflow-hidden bg-checkerboard mb-1.5 relative">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-mono text-white font-bold">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleMoveImage(index, 'left')}
                        disabled={index === 0}
                        className="text-[10px] p-1 rounded hover:bg-slate-800 disabled:opacity-20 text-slate-400"
                        title="Move left"
                      >
                        <MoveLeft className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] text-slate-500 font-mono truncate max-w-[60px]">
                        {item.width}×{item.height}
                      </span>
                      <button
                        onClick={() => handleMoveImage(index, 'right')}
                        disabled={index === images.length - 1}
                        className="text-[10px] p-1 rounded hover:bg-slate-800 disabled:opacity-20 text-slate-400"
                        title="Move right"
                      >
                        <MoveRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add More Drop Zone Card */}
                <div
                  onClick={() => fileInputRef.current?.click()}
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
                  className={`rounded-xl border-2 border-dashed p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-square ${
                    dragOver
                      ? 'border-indigo-400 bg-indigo-500/10'
                      : theme === 'dark'
                      ? 'border-slate-800 bg-slate-950 hover:border-indigo-500/50 hover:bg-slate-900'
                      : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/20'
                  }`}
                >
                  <Upload className="w-5 h-5 text-indigo-400 mb-1" />
                  <span className="text-[11px] font-bold block">Add more</span>
                  <span className="text-[9px] text-slate-400">or drag & drop</span>
                </div>
              </div>
            </div>

            {/* Large Combined Canvas Preview Area */}
            <div
              className={`rounded-2xl p-6 border shadow-xl relative transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-4 mb-4 border-b ${
                  theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold">
                    Combined Result Preview ({layout})
                  </span>
                  {isProcessing && (
                    <span className="text-[11px] text-amber-400 animate-pulse font-mono">
                      Stitching...
                    </span>
                  )}
                </div>

                {joinedWidth > 0 && (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {joinedWidth} × {joinedHeight} px ({formatBytes(joinedSize)})
                  </span>
                )}
              </div>

              {/* Joined Preview Container */}
              <div className="w-full min-h-[360px] max-h-[560px] rounded-xl bg-checkerboard flex items-center justify-center p-4 relative overflow-auto border border-slate-800">
                {joinedUrl ? (
                  <img
                    src={joinedUrl}
                    alt="Combined stitch"
                    className="max-h-[500px] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="text-slate-500 text-xs">No images to combine</div>
                )}
              </div>

              {/* Download Bar inside Preview */}
              {joinedBlob && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    High-resolution {isTransparent ? 'PNG (Transparent)' : outputFormat.split('/')[1].toUpperCase()} ready
                  </span>
                  <button
                    onClick={handleDownloadJoined}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Joined Image</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: LAYOUT SETTINGS */}
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
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Layout Settings
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {images.length} photos
                </span>
              </div>

              <div className="space-y-4">
                {/* Layout Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Layout
                  </label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="horizontal">Horizontal (Side-by-side strip)</option>
                    <option value="vertical">Vertical (Stacked column)</option>
                    <option value="grid">Grid (2 Columns)</option>
                  </select>
                </div>

                {/* Spacing Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">Spacing</span>
                    <span className="font-mono text-indigo-400 font-bold">{spacing} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={spacing}
                    onChange={(e) => setSpacing(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Alignment */}
                {layout !== 'grid' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {layout === 'horizontal' ? 'Vertical Alignment' : 'Horizontal Alignment'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {(['start', 'center', 'end'] as const).map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setAlignment(a)}
                          className={`py-1.5 rounded-lg border text-center font-medium capitalize ${
                            alignment === a
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {a === 'start' ? (layout === 'horizontal' ? 'Top' : 'Left') : a === 'end' ? (layout === 'horizontal' ? 'Bottom' : 'Right') : 'Center'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equalize Dimensions Toggle */}
                {layout !== 'grid' && (
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={equalizeDimensions}
                        onChange={(e) => setEqualizeDimensions(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
                      />
                      <span>
                        {layout === 'horizontal' ? 'Equalize heights to uniform baseline' : 'Equalize widths to uniform baseline'}
                      </span>
                    </label>
                  </div>
                )}

                {/* Background Color Settings */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Background Color
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400">
                      <input
                        type="checkbox"
                        checked={isTransparent}
                        onChange={(e) => setIsTransparent(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
                      />
                      <span>Transparent</span>
                    </label>
                  </div>

                  {!isTransparent && (
                    <div className="flex items-center gap-2">
                      {['#ffffff', '#000000', '#060913', '#0f172a', '#3b82f6'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBgColor(c)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            bgColor === c ? 'scale-110 border-indigo-400' : 'border-slate-700'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                        title="Custom Color"
                      />
                      <span className="text-xs font-mono text-slate-400">{bgColor}</span>
                    </div>
                  )}
                </div>

                {/* Output Format */}
                <div className="pt-1">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Output Format
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="image/jpeg">JPG (Standard photography)</option>
                    <option value="image/png">PNG (Preserves transparent canvas)</option>
                    <option value="image/webp">WEBP (High web compression)</option>
                  </select>
                </div>

                {/* Status Message */}
                {statusMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                      statusMessage.startsWith('Error')
                        ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                        : 'bg-indigo-950/60 border-indigo-800 text-indigo-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* ACTION BUTTON: JOIN IMAGES */}
                <button
                  type="button"
                  onClick={renderJoinedCanvas}
                  disabled={images.length === 0 || isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Stitching Composite...</span>
                    </>
                  ) : (
                    <>
                      <Combine className="w-4 h-4" />
                      <span>Join Images</span>
                    </>
                  )}
                </button>

                {/* Download Button */}
                {joinedBlob && (
                  <button
                    type="button"
                    onClick={handleDownloadJoined}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Stitched Image</span>
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
                Inspect separate individual photos alongside joined single composite
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Composite Stitch
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Before Box (Separate Thumbnails) */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Before ({images.length} Separate Photos)
              </span>
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-950 p-2 border border-slate-800 relative shadow-inner grid grid-cols-4 gap-1.5 items-center">
                {images.slice(0, 4).map((img, i) => (
                  <div key={img.id} className="rounded overflow-hidden border border-slate-800 aspect-3/4">
                    <img
                      src={img.url}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="md:col-span-1 flex items-center justify-center py-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                →
              </div>
            </div>

            {/* After Box (Joined Composite) */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                After (Unified Single Photo)
              </span>
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-checkerboard p-2 border border-indigo-500/40 relative shadow-inner flex items-center justify-center">
                {joinedUrl && (
                  <img
                    src={joinedUrl}
                    alt="Combined stitch"
                    className="max-h-full max-w-full object-contain rounded shadow"
                  />
                )}
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
              { id: 'photo-collage-maker', name: 'Photo Collage Maker', desc: 'Creative grid & moodboard layouts' },
              { id: 'image-splitter', name: 'Image Splitter', desc: 'Cut photos into grid tiles' },
              { id: 'batch-image-resizer', name: 'Batch Image Resizer', desc: 'Resize multiple photos together' },
              { id: 'image-watermark-maker', name: 'Watermark Maker', desc: 'Add copyright notices or branding' },
            ].map((related) => (
              <button
                key={related.id}
                onClick={() => onSelectRelatedTool(related.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
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
