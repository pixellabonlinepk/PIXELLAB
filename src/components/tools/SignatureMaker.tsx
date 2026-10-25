import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  PenTool,
  Download,
  Trash2,
  RotateCcw,
  Undo2,
  Redo2,
  Eraser,
  Pen,
  Copy,
  Check,
  Sparkles,
  Maximize2,
  FileCode,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { DEFAULT_SIGNATURE_STROKES } from '../../utils/newToolsSampleImages';
import { downloadBlob } from '../../utils/imageProcessing';

interface SignatureMakerProps {
  tool: ToolMetadata;
  onBack: () => void;
  onSelectRelatedTool: (id: string) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  isEraser: boolean;
}

export const SignatureMaker: React.FC<SignatureMakerProps> = ({
  tool,
  onBack,
  onSelectRelatedTool,
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tool Modes
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState<string>('#ffffff');
  const [penSize, setPenSize] = useState<number>(3);
  const [bgType, setBgType] = useState<'transparent' | 'white'>('transparent');

  // Drawing state & history stack
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef = useRef<Stroke[]>([]);
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isDrawing = useRef<boolean>(false);
  const currentPoints = useRef<Point[]>([]);

  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  // UI status
  const [copied, setCopied] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Internal logical canvas resolution (high resolution for crisp vector-like export)
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 450;

  // Initialize with cursive "John Doe" signature on first load
  useEffect(() => {
    // Convert default strokes
    const initialStrokes: Stroke[] = DEFAULT_SIGNATURE_STROKES.map((pts) => ({
      points: pts.map((p) => ({ ...p })),
      color: theme === 'dark' ? '#ffffff' : '#0f172a',
      size: 3.5,
      isEraser: false,
    }));

    setStrokes(initialStrokes);
    setHistory([initialStrokes]);
    setHistoryIndex(0);
    setPenColor(theme === 'dark' ? '#ffffff' : '#0f172a');
  }, []);

  // Update stroke rendering on canvas
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgType === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw all strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 1) return;

      ctx.save();
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.size;

      if (stroke.isEraser) {
        if (bgType === 'white') {
          ctx.strokeStyle = '#ffffff';
        } else {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.strokeStyle = 'rgba(0,0,0,1)';
        }
      } else {
        ctx.strokeStyle = stroke.color;
      }

      if (stroke.points.length === 1) {
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length - 1; i++) {
          const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
          const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
        }
        const last = stroke.points[stroke.points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }

      ctx.restore();
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [strokes, bgType]);

  // Transform pointer client coordinates to canvas internal resolution
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Pointer event handlers with stylus/touch pressure & multi-touch prevention
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    isDrawing.current = true;

    const pt = getCanvasPoint(e);
    currentPoints.current = [pt];

    const newStroke: Stroke = {
      points: [pt],
      color: penColor,
      size: penSize,
      isEraser: activeTool === 'eraser',
    };

    setStrokes((prev) => [...prev, newStroke]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    e.preventDefault();

    const pt = getCanvasPoint(e);
    currentPoints.current.push(pt);

    setStrokes((prev) => {
      const copy = [...prev];
      if (copy.length > 0) {
        copy[copy.length - 1].points = [...currentPoints.current];
      }
      return copy;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    currentPoints.current = [];

    // Push latest completed strokes to undo history stack
    const latest = strokesRef.current.length > 0 ? strokesRef.current : strokes;
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, latest];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setStrokes(history[nextIndex]);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setStrokes([]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setStrokes(history[nextIndex]);
    }
  };

  const handleClear = () => {
    setStrokes([]);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), []]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleResetSample = () => {
    const sampleStrokes: Stroke[] = DEFAULT_SIGNATURE_STROKES.map((pts) => ({
      points: pts.map((p) => ({ ...p })),
      color: penColor,
      size: penSize,
      isEraser: false,
    }));
    setStrokes(sampleStrokes);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), sampleStrokes]);
    setHistoryIndex((prev) => prev + 1);
  };

  // Export PNG
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `signature-${bgType}-${Date.now()}.png`);
        window.dispatchEvent(
          new CustomEvent('pixellab:tool-completed', {
            detail: { toolId: tool.id, toolName: tool.name },
          })
        );
      }
    }, 'image/png');
  };

  // Export SVG vector path
  const handleDownloadSVG = () => {
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">\n`;
    if (bgType === 'white') {
      svgContent += `  <rect width="100%" height="100%" fill="#ffffff"/>\n`;
    }

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2 || stroke.isEraser) return;
      let d = `M ${stroke.points[0].x.toFixed(1)} ${stroke.points[0].y.toFixed(1)}`;
      for (let i = 1; i < stroke.points.length; i++) {
        d += ` L ${stroke.points[i].x.toFixed(1)} ${stroke.points[i].y.toFixed(1)}`;
      }
      svgContent += `  <path d="${d}" fill="none" stroke="${stroke.color}" stroke-width="${stroke.size}" stroke-linecap="round" stroke-linejoin="round"/>\n`;
    });

    svgContent += `</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    downloadBlob(blob, `signature-${Date.now()}.svg`);
    window.dispatchEvent(
      new CustomEvent('pixellab:tool-completed', {
        detail: { toolId: tool.id, toolName: tool.name },
      })
    );
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch (err) {
      setStatusMessage('Clipboard copy not supported in this browser. Use Download PNG.');
    }
  };

  return (
    <div className="w-full">
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
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                : 'bg-cyan-50 text-cyan-700 border-cyan-200'
            }`}
          >
            Zero-Cost Browser Tool
          </span>
        </div>

        {/* Centered Title & Tagline matching design reference */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 mb-3 shadow-lg shadow-cyan-500/10">
            <PenTool className="w-6 h-6" />
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold font-display mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Signature Maker
          </h1>
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Create your digital signature easily. Draw with your mouse or touch and download as a transparent PNG.
          </p>
        </div>

        {/* MAIN WORKSPACE 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT COLUMN: INTERACTIVE SIGNATURE DRAWING PAD */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <div
              className={`rounded-2xl p-6 border shadow-xl relative transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}
            >
              {/* Canvas Action Bar */}
              <div
                className={`flex items-center justify-between pb-4 mb-4 border-b ${
                  theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                {/* Tool modes: Pen vs Eraser */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTool('pen')}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTool === 'pen'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : theme === 'dark'
                        ? 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                    title="Pen tool"
                  >
                    <Pen className="w-4 h-4" />
                    <span>Pen</span>
                  </button>

                  <button
                    onClick={() => setActiveTool('eraser')}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTool === 'eraser'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : theme === 'dark'
                        ? 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                    title="Eraser tool"
                  >
                    <Eraser className="w-4 h-4" />
                    <span>Eraser</span>
                  </button>
                </div>

                {/* History & Clear controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0 && strokes.length === 0}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Undo stroke"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Redo stroke"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetSample}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Restore sample signature"
                  >
                    Sample
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Drawing Canvas Box */}
              <div
                ref={containerRef}
                className={`w-full h-[320px] sm:h-[380px] rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-800 touch-none select-none ${
                  bgType === 'transparent' ? 'bg-checkerboard' : 'bg-white'
                }`}
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="w-full h-full object-contain cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                />

                {strokes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-sm font-medium">
                    Draw your signature here with mouse or fingertip
                  </div>
                )}
              </div>

              {/* Canvas Footer Readout */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="font-mono">
                  Canvas: {CANVAS_WIDTH} × {CANVAS_HEIGHT} px (High Resolution)
                </span>
                <span className="text-cyan-400 font-medium">
                  Supports mouse, stylus, & multi-touch
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SETTINGS PANEL */}
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
                  <PenTool className="w-4 h-4 text-cyan-400" />
                  Settings
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {strokes.length} strokes
                </span>
              </div>

              <div className="space-y-5">
                {/* Color Swatches */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Pen Color
                  </label>
                  <div className="flex items-center gap-2.5">
                    {[
                      '#ffffff',
                      '#000000',
                      '#1d4ed8',
                      '#06b6d4',
                      '#d946ef',
                      '#ef4444',
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setPenColor(c);
                          setActiveTool('pen');
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform shadow-sm ${
                          penColor === c && activeTool === 'pen'
                            ? 'scale-115 border-cyan-400 ring-2 ring-cyan-400/40'
                            : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={penColor}
                      onChange={(e) => {
                        setPenColor(e.target.value);
                        setActiveTool('pen');
                      }}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      title="Custom Color"
                    />
                  </div>
                </div>

                {/* Pen Size Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300">Pen Size</span>
                    <span className="font-mono text-cyan-400 font-bold">{penSize} px</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={penSize}
                      onChange={(e) => setPenSize(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div
                      className="rounded-full bg-cyan-400 shrink-0"
                      style={{ width: `${Math.max(4, penSize)}px`, height: `${Math.max(4, penSize)}px` }}
                    />
                  </div>
                </div>

                {/* Background Type */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Background
                  </label>
                  <div
                    className={`grid grid-cols-2 p-1 rounded-xl border text-xs font-semibold ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setBgType('transparent')}
                      className={`py-2 rounded-lg transition-all text-center ${
                        bgType === 'transparent'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : theme === 'dark'
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Transparent
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgType('white')}
                      className={`py-2 rounded-lg transition-all text-center ${
                        bgType === 'white'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : theme === 'dark'
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      White
                    </button>
                  </div>
                </div>

                {/* Status or Alert */}
                {statusMessage && (
                  <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs">
                    {statusMessage}
                  </div>
                )}

                {/* PRIMARY ACTION: DOWNLOAD PNG */}
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  disabled={strokes.length === 0}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG ({bgType === 'transparent' ? 'Transparent' : 'White'})</span>
                </button>

                {/* Secondary Actions: SVG and Copy */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadSVG}
                    disabled={strokes.length === 0}
                    className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Vector SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    disabled={strokes.length === 0}
                    className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </button>
                </div>
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
                Inspect clean empty canvas alongside finalized transparent signature
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Transparent PNG
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Before Box (Blank Canvas) */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Before (Blank Signature Canvas)
              </span>
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative shadow-inner flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <PenTool className="w-8 h-8 mx-auto mb-1 opacity-40" />
                  <span className="text-[11px] font-mono">Empty Signature Pad</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="md:col-span-1 flex items-center justify-center py-2">
              <div className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
                →
              </div>
            </div>

            {/* After Box (Finished Signature) */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                After (Digitized Transparent Signature)
              </span>
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-checkerboard border border-cyan-500/40 relative shadow-inner flex items-center justify-center p-3">
                {/* SVG representation of current signature */}
                <svg
                  viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
                  className="w-full h-full object-contain filter drop-shadow-md"
                >
                  {strokes.map((stroke, sIndex) => {
                    if (stroke.points.length < 2 || stroke.isEraser) return null;
                    let d = `M ${stroke.points[0].x} ${stroke.points[0].y}`;
                    for (let i = 1; i < stroke.points.length; i++) {
                      d += ` L ${stroke.points[i].x} ${stroke.points[i].y}`;
                    }
                    return (
                      <path
                        key={sIndex}
                        d={d}
                        fill="none"
                        stroke={stroke.color}
                        strokeWidth={stroke.size}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })}
                </svg>
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
              { id: 'image-watermark-maker', name: 'Watermark Maker', desc: 'Add text watermarks with transparency' },
              { id: 'image-format-converter', name: 'Format Converter', desc: 'Convert to transparent PNG/WEBP' },
              { id: 'image-cropper', name: 'Image Cropper', desc: 'Cut photos to exact aspect ratios' },
              { id: 'batch-image-resizer', name: 'Batch Image Resizer', desc: 'Resize multiple images at once' },
            ].map((related) => (
              <button
                key={related.id}
                onClick={() => onSelectRelatedTool(related.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    : 'bg-white border-slate-200 hover:border-cyan-300 hover:shadow-md'
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
