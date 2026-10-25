import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Grid,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  FileArchive,
  Eye,
  Sliders,
  Check,
  Maximize2,
  Copy,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { SAMPLE_SPLIT_IMAGE } from '../../utils/newToolsSampleImages';
import { formatBytes, downloadBlob } from '../../utils/imageProcessing';
import JSZip from 'jszip';

interface ImageSplitterProps {
  tool: ToolMetadata;
  onBack: () => void;
  onSelectRelatedTool: (id: string) => void;
}

interface SplitPiece {
  id: string;
  row: number;
  col: number;
  partNumber: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export const ImageSplitter: React.FC<ImageSplitterProps> = ({
  tool,
  onBack,
  onSelectRelatedTool,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Source Image state (pre-populate with sample image)
  const [sourceUrl, setSourceUrl] = useState<string>(SAMPLE_SPLIT_IMAGE.url);
  const [sourceName, setSourceName] = useState<string>(SAMPLE_SPLIT_IMAGE.name);
  const [sourceWidth, setSourceWidth] = useState<number>(SAMPLE_SPLIT_IMAGE.width);
  const [sourceHeight, setSourceHeight] = useState<number>(SAMPLE_SPLIT_IMAGE.height);
  const [sourceBytes, setSourceBytes] = useState<number>(SAMPLE_SPLIT_IMAGE.sizeBytes);

  // Grid Settings
  const [gridPreset, setGridPreset] = useState<string>('3x3');
  const [customRows, setCustomRows] = useState<number>(3);
  const [customCols, setCustomCols] = useState<number>(3);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [includeBorders, setIncludeBorders] = useState<boolean>(true);
  const [borderSize, setBorderSize] = useState<number>(10);
  const [borderColor, setBorderColor] = useState<string>('#ffffff');

  // Generated pieces
  const [splitPieces, setSplitPieces] = useState<SplitPiece[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Active grid dimensions
  const getGridRowsCols = () => {
    switch (gridPreset) {
      case '3x3': return { rows: 3, cols: 3 };
      case '2x2': return { rows: 2, cols: 2 };
      case '3x1': return { rows: 1, cols: 3 }; // 3 columns horizontal panorama
      case '1x3': return { rows: 3, cols: 1 }; // 3 vertical parts
      case '2x3': return { rows: 2, cols: 3 };
      case '3x2': return { rows: 3, cols: 2 };
      case '4x4': return { rows: 4, cols: 4 };
      case 'custom': return { rows: customRows, cols: customCols };
      default: return { rows: 3, cols: 3 };
    }
  };

  const { rows, cols } = getGridRowsCols();
  const totalParts = rows * cols;

  // Handle image upload
  const handleImageUploaded = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setSourceUrl(url);
      setSourceName(file.name);
      setSourceWidth(img.naturalWidth || 1200);
      setSourceHeight(img.naturalHeight || 800);
      setSourceBytes(file.size);
      setSplitPieces([]);
      setStatusMessage('New image loaded. Click Split Image to generate pieces.');
    };
  };

  // Perform client-side canvas slicing
  const handleSplitImage = async () => {
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = sourceUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load source image'));
      });

      const fullW = img.naturalWidth || sourceWidth;
      const fullH = img.naturalHeight || sourceHeight;

      const pieceW = Math.floor(fullW / cols);
      const pieceH = Math.floor(fullH / rows);

      const generated: SplitPiece[] = [];
      let partCounter = 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const srcX = c * pieceW;
          const srcY = r * pieceH;

          // If borders are included on pieces
          const borderPadding = includeBorders ? borderSize : 0;
          const canvasW = pieceW + borderPadding * 2;
          const canvasH = pieceH + borderPadding * 2;

          const canvas = document.createElement('canvas');
          canvas.width = canvasW;
          canvas.height = canvasH;
          const ctx = canvas.getContext('2d')!;

          if (includeBorders) {
            ctx.fillStyle = borderColor;
            ctx.fillRect(0, 0, canvasW, canvasH);
          } else if (outputFormat === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvasW, canvasH);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(
            img,
            srcX,
            srcY,
            pieceW,
            pieceH,
            borderPadding,
            borderPadding,
            pieceW,
            pieceH
          );

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => {
                if (b) resolve(b);
                else reject(new Error('Slice creation failed'));
              },
              outputFormat,
              0.92
            );
          });

          const pieceUrl = URL.createObjectURL(blob);

          generated.push({
            id: `part-${r}-${c}`,
            row: r + 1,
            col: c + 1,
            partNumber: partCounter,
            blob,
            url: pieceUrl,
            width: canvasW,
            height: canvasH,
            sizeBytes: blob.size,
          });

          partCounter++;
        }
      }

      setSplitPieces(generated);
      setStatusMessage(`Successfully generated ${generated.length} image pieces!`);
    } catch (err: any) {
      setStatusMessage(`Error splitting image: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    if (splitPieces.length === 0) return;
    setIsProcessing(true);

    try {
      const zip = new JSZip();
      const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/png' ? 'png' : 'webp';
      const baseName = sourceName.replace(/\.[^/.]+$/, '');

      splitPieces.forEach((piece) => {
        const filename = `${baseName}_part_${piece.partNumber}_r${piece.row}_c${piece.col}.${ext}`;
        zip.file(filename, piece.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `${baseName}-split-${rows}x${cols}.zip`);
      window.dispatchEvent(
        new CustomEvent('pixellab:tool-completed', {
          detail: { toolId: tool.id, toolName: tool.name },
        })
      );
    } catch (err: any) {
      setStatusMessage(`Failed to create ZIP: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download individual piece
  const handleDownloadPiece = (piece: SplitPiece) => {
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/png' ? 'png' : 'webp';
    const baseName = sourceName.replace(/\.[^/.]+$/, '');
    downloadBlob(piece.blob, `${baseName}_part_${piece.partNumber}.${ext}`);
    window.dispatchEvent(
      new CustomEvent('pixellab:tool-completed', {
        detail: { toolId: tool.id, toolName: tool.name },
      })
    );
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && e.target.files[0] && handleImageUploaded(e.target.files[0])}
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
                ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                : 'bg-violet-50 text-violet-700 border-violet-200'
            }`}
          >
            Zero-Cost Browser Tool
          </span>
        </div>

        {/* Centered Title & Tagline matching design reference */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 mb-3 shadow-lg shadow-violet-500/10">
            <Grid className="w-6 h-6" />
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold font-display mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Image Splitter
          </h1>
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Split your image into multiple parts. Perfect for Instagram grids, wallpapers, or creative projects.
          </p>
        </div>

        {/* MAIN WORKSPACE 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT COLUMN: LARGE PREVIEW WITH INTERACTIVE GRID OVERLAY LINES */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <div
              className={`rounded-2xl p-6 border shadow-xl relative transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}
            >
              {/* Preview Header */}
              <div
                className={`flex items-center justify-between pb-4 mb-4 border-b ${
                  theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold">
                    Split Boundaries Preview ({cols} × {rows} = {totalParts} parts)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Image</span>
                </button>
              </div>

              {/* Large Image Preview with Live Split Overlay Cut Lines */}
              <div className="w-full min-h-[380px] max-h-[540px] rounded-xl bg-checkerboard flex items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                <div className="relative inline-block max-w-full max-h-[480px] shadow-2xl rounded-lg overflow-hidden">
                  <img
                    src={sourceUrl}
                    alt="Split preview"
                    className="max-h-[480px] w-auto max-w-full object-contain block select-none"
                  />

                  {/* SVG Grid Overlay Cut Lines */}
                  <div
                    className="absolute inset-0 pointer-events-none grid"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, 1fr)`,
                      gridTemplateRows: `repeat(${rows}, 1fr)`,
                    }}
                  >
                    {Array.from({ length: totalParts }).map((_, index) => {
                      const r = Math.floor(index / cols) + 1;
                      const c = (index % cols) + 1;
                      return (
                        <div
                          key={index}
                          className="border border-white/60 border-dashed relative flex items-center justify-center transition-colors hover:bg-violet-500/20"
                          style={{
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)',
                          }}
                        >
                          <span className="px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-mono font-bold shadow-md backdrop-blur-xs">
                            Part {index + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Preview Specs */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 font-mono">
                  <span>Source: {sourceWidth} × {sourceHeight} px</span>
                  <span>·</span>
                  <span>{formatBytes(sourceBytes)}</span>
                </div>
                <div className="text-violet-400 font-medium">
                  Each part approx: {Math.round(sourceWidth / cols)} × {Math.round(sourceHeight / rows)} px
                </div>
              </div>
            </div>

            {/* Generated Pieces Grid (Once Split) */}
            {splitPieces.length > 0 && (
              <div
                className={`rounded-2xl p-6 border shadow-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900/90 border-slate-800 text-white'
                    : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
                }`}
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">
                      {splitPieces.length} Slices Ready for Download
                    </span>
                  </div>
                  <button
                    onClick={handleDownloadAllZip}
                    disabled={isProcessing}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Download All (ZIP)</span>
                  </button>
                </div>

                {/* Slices Grid */}
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(cols, 4)}, minmax(0, 1fr))`,
                  }}
                >
                  {splitPieces.map((piece) => (
                    <div
                      key={piece.id}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-checkerboard mb-2 relative">
                        <img
                          src={piece.url}
                          alt={`Part ${piece.partNumber}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold">
                          #{piece.partNumber}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] mb-2 font-mono text-slate-400">
                        <span>{piece.width}×{piece.height}</span>
                        <span>{formatBytes(piece.sizeBytes)}</span>
                      </div>

                      <button
                        onClick={() => handleDownloadPiece(piece)}
                        className="w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <Download className="w-3 h-3" />
                        <span>Part {piece.partNumber}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SPLIT SETTINGS */}
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
                  <Sliders className="w-4 h-4 text-violet-400" />
                  Split Settings
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {totalParts} total tiles
                </span>
              </div>

              <div className="space-y-4">
                {/* Grid Type Dropdown */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Grid Type
                  </label>
                  <select
                    value={gridPreset}
                    onChange={(e) => setGridPreset(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="3x3">3 × 3 (9 parts - Instagram Grid)</option>
                    <option value="2x2">2 × 2 (4 parts - Quad)</option>
                    <option value="3x1">3 × 1 (3 parts - Carousel Panorama)</option>
                    <option value="1x3">1 × 3 (3 parts - Vertical Story)</option>
                    <option value="2x3">2 × 3 (6 parts - Billboard)</option>
                    <option value="3x2">3 × 2 (6 parts)</option>
                    <option value="4x4">4 × 4 (16 parts - Giant Wall)</option>
                    <option value="custom">Custom Rows & Columns</option>
                  </select>
                </div>

                {/* Custom Grid Controls */}
                {gridPreset === 'custom' && (
                  <div className="p-3.5 rounded-xl border space-y-3 bg-slate-950/60 border-slate-800">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">Columns (Vertical cuts)</span>
                        <span className="font-mono text-violet-400 font-bold">{customCols}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={customCols}
                        onChange={(e) => setCustomCols(Number(e.target.value))}
                        className="w-full accent-violet-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">Rows (Horizontal cuts)</span>
                        <span className="font-mono text-violet-400 font-bold">{customRows}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={customRows}
                        onChange={(e) => setCustomRows(Number(e.target.value))}
                        className="w-full accent-violet-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Output Format */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Output Format
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="image/jpeg">JPG (Standard quality)</option>
                    <option value="image/png">PNG (Lossless clarity)</option>
                    <option value="image/webp">WEBP (Lightweight)</option>
                  </select>
                </div>

                {/* Include Borders Toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeBorders}
                      onChange={(e) => setIncludeBorders(e.target.checked)}
                      className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-700 bg-slate-950"
                    />
                    <span>Include borders between pieces</span>
                  </label>
                </div>

                {/* Border Size & Color (if enabled) */}
                {includeBorders && (
                  <div className="p-3.5 rounded-xl border space-y-3 bg-slate-950/60 border-slate-800">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">Border Size</span>
                        <span className="font-mono text-violet-400 font-bold">{borderSize} px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="40"
                        value={borderSize}
                        onChange={(e) => setBorderSize(Number(e.target.value))}
                        className="w-full accent-violet-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">
                        Border Color
                      </label>
                      <div className="flex items-center gap-2">
                        {['#ffffff', '#000000', '#0f172a', '#3b82f6'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setBorderColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              borderColor === c ? 'scale-110 border-violet-400' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <input
                          type="color"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          title="Custom Color"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Message */}
                {statusMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                      statusMessage.startsWith('Error')
                        ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                        : 'bg-violet-950/60 border-violet-800 text-violet-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* ACTION BUTTON: SPLIT IMAGE */}
                <button
                  type="button"
                  onClick={handleSplitImage}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Slicing {totalParts} Parts...</span>
                    </>
                  ) : (
                    <>
                      <Grid className="w-4 h-4" />
                      <span>Split Image</span>
                    </>
                  )}
                </button>

                {/* ZIP Download Button */}
                {splitPieces.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDownloadAllZip}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    <FileArchive className="w-4 h-4" />
                    <span>Download All Parts (ZIP)</span>
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
                Inspect single seamless photo alongside split grid pieces
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Split Layout
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Before Box */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Before (Single Image)
              </span>
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-checkerboard border border-slate-800 relative shadow-inner">
                <img
                  src={sourceUrl}
                  alt="Single photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-200">
                  {sourceWidth} × {sourceHeight} px
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="md:col-span-1 flex items-center justify-center py-2">
              <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-sm">
                →
              </div>
            </div>

            {/* After Box */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wide">
                After ({cols} × {rows} Grid Parts)
              </span>
              <div
                className="aspect-16/10 rounded-xl overflow-hidden bg-slate-950 p-2 border border-violet-500/40 relative shadow-inner grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                }}
              >
                {Array.from({ length: totalParts }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded overflow-hidden border border-violet-500/30 relative"
                  >
                    <img
                      src={splitPieces[i]?.url || sourceUrl}
                      alt={`Part ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
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
              { id: 'image-cropper', name: 'Image Cropper', desc: 'Precision crop box with aspect ratios' },
              { id: 'photo-collage-maker', name: 'Photo Collage Maker', desc: 'Combine multiple images in layouts' },
              { id: 'image-joiner', name: 'Image Joiner', desc: 'Stitch photos horizontally or vertically' },
              { id: 'batch-image-resizer', name: 'Batch Image Resizer', desc: 'Resize multiple images at once' },
            ].map((related) => (
              <button
                key={related.id}
                onClick={() => onSelectRelatedTool(related.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-md'
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
