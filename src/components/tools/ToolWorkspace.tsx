import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Download,
  RotateCcw,
  RefreshCw,
  Sliders,
  Check,
  Copy,
  Sparkles,
  ArrowLeft,
  Eye,
  FileImage,
  ExternalLink,
  Lock,
  Unlock,
  AlertTriangle,
  ZoomIn,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { ImageUploader } from '../ImageUploader';
import {
  loadImage,
  formatBytes,
  downloadBlob,
  compressImage,
  resizeImage,
  cropImage,
  convertFormat,
  rotateImage,
  flipImage,
  applyFilter,
  adjustBrightnessContrast,
  applyBlur,
  applySharpen,
  applyWatermark,
  applyBorder,
  applyRoundCorners,
  generateCollage,
  generateWhatsAppDP,
  generatePassportPhoto,
  generateYouTubeThumbnail,
  generateMeme,
  getPixelColor,
  extractColorPalette,
  generateFaviconPack,
  generateQrCodeUrl,
  readQrCodeFromImage,
  convertImagesToPdf,
  renderPdfToImage,
} from '../../utils/imageProcessing';
import { createSamplePortrait, createSampleLandscape } from '../../utils/sampleImages';
import { BatchImageResizer } from './BatchImageResizer';
import { ImageSplitter } from './ImageSplitter';
import { ImageJoiner } from './ImageJoiner';
import { SignatureMaker } from './SignatureMaker';
import { PhotoCollageDPMaker } from './PhotoCollageDPMaker';

interface ToolWorkspaceProps {
  tool: ToolMetadata;
  onBack: () => void;
  onSelectRelatedTool: (id: string) => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  onBack,
  onSelectRelatedTool,
}) => {
  if (tool.id === 'photo-collage-dp-maker') {
    return <PhotoCollageDPMaker tool={tool} onBack={onBack} onSelectRelatedTool={onSelectRelatedTool} />;
  }
  if (tool.id === 'batch-image-resizer') {
    return <BatchImageResizer tool={tool} onBack={onBack} onSelectRelatedTool={onSelectRelatedTool} />;
  }
  if (tool.id === 'image-splitter') {
    return <ImageSplitter tool={tool} onBack={onBack} onSelectRelatedTool={onSelectRelatedTool} />;
  }
  if (tool.id === 'image-joiner') {
    return <ImageJoiner tool={tool} onBack={onBack} onSelectRelatedTool={onSelectRelatedTool} />;
  }
  if (tool.id === 'signature-maker') {
    return <SignatureMaker tool={tool} onBack={onBack} onSelectRelatedTool={onSelectRelatedTool} />;
  }

  // Source Image state
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceFilename, setSourceFilename] = useState<string>('image.png');
  const [originalSize, setOriginalSize] = useState<number>(0);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Comparison view toggle
  const [compareMode, setCompareMode] = useState<'after' | 'before' | 'split'>('after');
  const [splitPos, setSplitPos] = useState<number>(50);

  // Specific Tool Settings:
  // 1. Compressor
  const [compQuality, setCompQuality] = useState<number>(0.8);
  const [compFormat, setCompFormat] = useState<string>('image/jpeg');

  // 2. Resizer
  const [resizeW, setResizeW] = useState<number>(800);
  const [resizeH, setResizeH] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  // 3. Cropper
  const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '16:9' | '4:3' | '9:16'>('free');
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 400, h: 400 });

  // 4. Converter
  const [targetMime, setTargetMime] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');

  // 5. Rotator
  const [rotAngle, setRotAngle] = useState<number>(90);

  // 6. Flipper
  const [flipH, setFlipH] = useState<boolean>(true);
  const [flipV, setFlipV] = useState<boolean>(false);

  // 7. Filters
  const [activeFilter, setActiveFilter] = useState<string>('vintage');
  const [filterIntensity, setFilterIntensity] = useState<number>(1.0);

  // 8. Brightness / Contrast
  const [brightnessVal, setBrightnessVal] = useState<number>(20);
  const [contrastVal, setContrastVal] = useState<number>(25);

  // 9. Blur / Sharpen
  const [blurRadius, setBlurRadius] = useState<number>(8);
  const [sharpenAmount, setSharpenAmount] = useState<number>(2);

  // 10. Watermark
  const [wmText, setWmText] = useState<string>('PIXAL LAB');
  const [wmSize, setWmSize] = useState<number>(36);
  const [wmColor, setWmColor] = useState<string>('#ffffff');
  const [wmOpacity, setWmOpacity] = useState<number>(0.7);
  const [wmPos, setWmPos] = useState<'bottom-right' | 'center' | 'top-left' | 'tiled'>('bottom-right');
  const [wmRot, setWmRot] = useState<number>(0);

  // 11. Border & Corner
  const [borderWidth, setBorderWidth] = useState<number>(24);
  const [borderColor, setBorderColor] = useState<string>('#ffffff');
  const [borderPadding, setBorderPadding] = useState<number>(0);
  const [cornerRadius, setCornerRadius] = useState<number>(40);

  // 12. Collage
  const [collageImages, setCollageImages] = useState<HTMLImageElement[]>([]);
  const [collageLayout, setCollageLayout] = useState<'2-horizontal' | '2-vertical' | '3-triad' | '4-grid'>('4-grid');
  const [collageGap, setCollageGap] = useState<number>(16);

  // 13. WhatsApp DP
  const [dpShape, setDpShape] = useState<'circle' | 'square'>('circle');
  const [dpRing, setDpRing] = useState<boolean>(true);
  const [dpRingColor, setDpRingColor] = useState<string>('#3b82f6');

  // 14. Passport
  const [passportPreset, setPassportPreset] = useState<'us-passport' | 'schengen' | 'uk-passport' | 'india-passport'>('us-passport');

  // 15. YouTube Thumbnail
  const [ytTitle, setYtTitle] = useState<string>('HOW TO EDIT LIKE A PRO');
  const [ytSubtitle, setYtSubtitle] = useState<string>('Pixal Lab Masterclass 2026');
  const [ytBadge, setYtBadge] = useState<string>('NEW GUIDE');
  const [ytGradient, setYtGradient] = useState<'blue-violet' | 'emerald-cyan' | 'amber-rose' | 'dark-scrim'>('blue-violet');

  // 16. Meme
  const [memeTop, setMemeTop] = useState<string>('WHEN THE CLIENT SAYS');
  const [memeBottom, setMemeBottom] = useState<string>('MAKE THE LOGO BIGGER');
  const [memeSize, setMemeSize] = useState<number>(48);

  // 17. Color Picker & Palette
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: string; hsl: string } | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<{ hex: string; rgb: string; percentage: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 18. QR Code Generator
  const [qrText, setQrText] = useState<string>('https://pixallab.app');
  const [qrDarkColor, setQrDarkColor] = useState<string>('#000000');
  const [qrLightColor, setQrLightColor] = useState<string>('#ffffff');

  // 19. QR Code Reader
  const [decodedQr, setDecodedQr] = useState<string | null>(null);

  // 20. Favicon
  const [favicons, setFavicons] = useState<{ size: number; label: string; blob: Blob; url: string }[]>([]);

  // 21. PDF Tools
  const [pdfMargin, setPdfMargin] = useState<number>(10);
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pdfImages, setPdfImages] = useState<{ img: HTMLImageElement; filename: string }[]>([]);
  const [pdfPages, setPdfPages] = useState<{ pageNumber: number; blob: Blob; url: string }[]>([]);

  // Handle image selection
  const handleImageSelected = async (fileOrUrl: File | string, filename = 'image.png') => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      let url: string;
      let size = 0;
      let fileObj: File | null = null;

      if (typeof fileOrUrl === 'string') {
        url = fileOrUrl;
        const res = await fetch(fileOrUrl);
        const b = await res.blob();
        size = b.size;
      } else {
        fileObj = fileOrUrl;
        url = URL.createObjectURL(fileOrUrl);
        size = fileOrUrl.size;
      }

      const img = await loadImage(url);
      setSourceImg(img);
      setSourceFile(fileObj);
      setSourceUrl(url);
      setSourceFilename(filename);
      setOriginalSize(size);

      // Initialize dimensions
      setResizeW(img.naturalWidth || img.width);
      setResizeH(img.naturalHeight || img.height);
      setCropRect({
        x: 0,
        y: 0,
        w: Math.round((img.naturalWidth || img.width) * 0.8),
        h: Math.round((img.naturalHeight || img.height) * 0.8),
      });

      // Special initializations
      if (tool.id === 'color-palette-extractor') {
        const palette = extractColorPalette(img, 8);
        setExtractedPalette(palette);
      } else if (tool.id === 'qr-code-reader') {
        const result = await readQrCodeFromImage(img);
        if (result.found && result.data) {
          setDecodedQr(result.data);
        } else {
          setErrorMessage(result.error || 'No readable QR code found in this image.');
        }
      } else if (tool.id === 'favicon-generator') {
        const pack = await generateFaviconPack(img);
        setFavicons(pack);
      } else if (tool.id === 'pdf-to-image-converter' && fileObj) {
        const rendered = await renderPdfToImage(fileObj);
        setPdfPages(rendered.pages);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load image';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Multiple files selection (for collage or image to PDF)
  const handleMultipleFiles = async (files: File[]) => {
    try {
      setIsProcessing(true);
      const loaded = await Promise.all(
        files.map(async (f) => ({
          img: await loadImage(f),
          filename: f.name,
        }))
      );
      if (tool.id === 'photo-collage-maker') {
        setCollageImages(loaded.map((item) => item.img));
      } else if (tool.id === 'image-to-pdf-converter') {
        setPdfImages(loaded);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading multiple images';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger processing whenever settings change
  const executeProcessing = async () => {
    if (!sourceImg && tool.id !== 'qr-code-generator' && tool.id !== 'photo-collage-maker' && tool.id !== 'image-to-pdf-converter') {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let res: { blob: Blob; url: string; size?: number } | null = null;

      switch (tool.id) {
        case 'image-compressor':
          if (sourceImg) res = await compressImage(sourceImg, compQuality, compFormat);
          break;

        case 'image-resizer':
          if (sourceImg) res = await resizeImage(sourceImg, resizeW, resizeH);
          break;

        case 'image-cropper':
          if (sourceImg) res = await cropImage(sourceImg, cropRect.x, cropRect.y, cropRect.w, cropRect.h);
          break;

        case 'image-format-converter':
          if (sourceImg) res = await convertFormat(sourceImg, targetMime);
          break;

        case 'image-rotator':
          if (sourceImg) res = await rotateImage(sourceImg, rotAngle);
          break;

        case 'image-flipper':
          if (sourceImg) res = await flipImage(sourceImg, flipH, flipV);
          break;

        case 'image-filters':
          if (sourceImg) res = await applyFilter(sourceImg, activeFilter, filterIntensity);
          break;

        case 'brightness-adjuster':
          if (sourceImg) res = await adjustBrightnessContrast(sourceImg, brightnessVal, 0);
          break;

        case 'contrast-adjuster':
          if (sourceImg) res = await adjustBrightnessContrast(sourceImg, 0, contrastVal);
          break;

        case 'image-blur-tool':
          if (sourceImg) res = await applyBlur(sourceImg, blurRadius);
          break;

        case 'image-sharpen-tool':
          if (sourceImg) res = await applySharpen(sourceImg, sharpenAmount);
          break;

        case 'image-watermark-maker':
          if (sourceImg)
            res = await applyWatermark(sourceImg, {
              text: wmText,
              fontSize: wmSize,
              fontFamily: 'Outfit, sans-serif',
              color: wmColor,
              opacity: wmOpacity,
              position: wmPos,
              rotation: wmRot,
            });
          break;

        case 'image-border-maker':
          if (sourceImg) res = await applyBorder(sourceImg, borderWidth, borderColor, borderPadding);
          break;

        case 'round-corner-maker':
          if (sourceImg) res = await applyRoundCorners(sourceImg, cornerRadius);
          break;

        case 'photo-collage-maker': {
          const imgsToCollage = collageImages.length > 0 ? collageImages : sourceImg ? [sourceImg, sourceImg, sourceImg, sourceImg] : [];
          if (imgsToCollage.length > 0) {
            res = await generateCollage(imgsToCollage, collageLayout, collageGap);
          }
          break;
        }

        case 'whatsapp-dp-maker':
          if (sourceImg)
            res = await generateWhatsAppDP(sourceImg, {
              cropShape: dpShape,
              borderRing: dpRing,
              borderColor: dpRingColor,
              borderWidth: 12,
              bgPattern: 'blur',
              bgColor: '#0f172a',
            });
          break;

        case 'passport-photo-resizer':
          if (sourceImg) res = await generatePassportPhoto(sourceImg, passportPreset);
          break;

        case 'youtube-thumbnail-maker':
          res = await generateYouTubeThumbnail(sourceImg, {
            title: ytTitle,
            subtitle: ytSubtitle,
            badge: ytBadge,
            gradient: ytGradient,
          });
          break;

        case 'meme-generator':
          if (sourceImg) res = await generateMeme(sourceImg, memeTop, memeBottom, memeSize);
          break;

        case 'qr-code-generator': {
          const qr = await generateQrCodeUrl(qrText, {
            darkColor: qrDarkColor,
            lightColor: qrLightColor,
          });
          res = { blob: qr.blob, url: qr.dataUrl };
          break;
        }

        case 'image-to-pdf-converter': {
          const imgs = pdfImages.length > 0 ? pdfImages : sourceImg ? [{ img: sourceImg, filename: sourceFilename }] : [];
          if (imgs.length > 0) {
            const pdfBlob = await convertImagesToPdf(imgs, {
              orientation: pdfOrientation,
              format: 'a4',
              margin: pdfMargin,
            });
            res = { blob: pdfBlob, url: URL.createObjectURL(pdfBlob) };
          }
          break;
        }
      }

      if (res) {
        setResultBlob(res.blob);
        setResultUrl(res.url);
        setResultSize(res.blob.size);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-run execution whenever key controls change
  useEffect(() => {
    executeProcessing();
  }, [
    sourceImg,
    compQuality,
    compFormat,
    resizeW,
    resizeH,
    cropRect,
    targetMime,
    rotAngle,
    flipH,
    flipV,
    activeFilter,
    filterIntensity,
    brightnessVal,
    contrastVal,
    blurRadius,
    sharpenAmount,
    wmText,
    wmSize,
    wmColor,
    wmOpacity,
    wmPos,
    wmRot,
    borderWidth,
    borderColor,
    borderPadding,
    cornerRadius,
    collageLayout,
    collageGap,
    collageImages,
    dpShape,
    dpRing,
    dpRingColor,
    passportPreset,
    ytTitle,
    ytSubtitle,
    ytBadge,
    ytGradient,
    memeTop,
    memeBottom,
    memeSize,
    qrText,
    qrDarkColor,
    qrLightColor,
    pdfMargin,
    pdfOrientation,
    pdfImages,
  ]);

  // Color picker canvas hover/click listener
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const color = getPixelColor(ctx, x, y);
      setPickedColor(color);
    }
  };

  // Download handler
  const handleDownload = () => {
    if (!resultBlob) return;
    let ext = 'png';
    if (tool.id === 'image-compressor' && compFormat === 'image/jpeg') ext = 'jpg';
    if (tool.id === 'image-format-converter') {
      ext = targetMime === 'image/jpeg' ? 'jpg' : targetMime === 'image/webp' ? 'webp' : 'png';
    }
    if (tool.id === 'image-to-pdf-converter') ext = 'pdf';
    const nameWithoutExt = sourceFilename.replace(/\.[^/.]+$/, '');
    downloadBlob(resultBlob, `${nameWithoutExt}-${tool.id}.${ext}`);
    // Notify application that a tool was successfully used
    window.dispatchEvent(new CustomEvent('pixellab:tool-completed', { detail: { toolId: tool.id, toolName: tool.name } }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleResetImage = () => {
    setSourceImg(null);
    setSourceFile(null);
    setSourceUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setErrorMessage(null);
  };

  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen pb-20 pt-6 transition-colors duration-200 ${
        theme === 'dark' ? 'dark-studio-bg text-slate-100' : 'light-studio-bg text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={`flex items-center gap-2 text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <button
              onClick={onBack}
              className={`flex items-center gap-1.5 transition-colors ${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tools</span>
            </button>
            <span>/</span>
            <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>
              {tool.categoryLabel}
            </span>
            <span>/</span>
            <span
              className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {tool.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-cyan-400'
                  : 'bg-white border-slate-200 text-cyan-700 shadow-xs'
              }`}
            >
              {tool.badge}
            </span>
          </div>
        </div>

        {/* Tool Header */}
        <div className="mb-8">
          <h1
            className={`text-2xl sm:text-3xl font-extrabold font-display mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {tool.name}
          </h1>
          <p
            className={`text-sm max-w-3xl leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {tool.description}
          </p>
        </div>

        {/* WORKBENCH CONTENT */}
        {!sourceImg && tool.id !== 'qr-code-generator' ? (
          /* Empty / Upload View */
          <div className="max-w-3xl mx-auto my-6">
            <ImageUploader
              onImageSelected={handleImageSelected}
              acceptedFormats={tool.acceptedFormats}
              maxSizeMB={tool.maxFileSizeMB}
              multiple={tool.id === 'photo-collage-maker' || tool.id === 'image-to-pdf-converter'}
              onMultipleImagesSelected={handleMultipleFiles}
              acceptPdf={tool.id === 'pdf-to-image-converter'}
            />
          </div>
        ) : (
          /* Active Editor 2-Column Split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: INTERACTIVE PREVIEW CANVAS */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              <div
                className={`rounded-2xl p-4 sm:p-6 shadow-xl relative transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900/90 border border-slate-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-900 shadow-slate-200/50'
                }`}
              >
                {/* Preview Toolbar */}
                <div
                  className={`flex items-center justify-between pb-4 mb-4 border-b ${
                    theme === 'dark' ? 'border-slate-800/80' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Live Canvas
                    </span>
                    {isProcessing && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 animate-pulse font-mono">
                        <Sparkles className="w-3 h-3" /> Processing...
                      </span>
                    )}
                  </div>

                  {/* Mode Toggles */}
                  <div
                    className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => setCompareMode('after')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        compareMode === 'after'
                          ? 'bg-indigo-600 text-white font-semibold'
                          : theme === 'dark'
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Output
                    </button>
                    {sourceUrl && (
                      <button
                        onClick={() => setCompareMode('before')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${
                          compareMode === 'before'
                            ? 'bg-indigo-600 text-white font-semibold'
                            : theme === 'dark'
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Original
                      </button>
                    )}
                  </div>
                </div>

                {/* The Canvas / Image Viewer */}
                <div className="w-full min-h-[360px] max-h-[560px] rounded-xl bg-checkerboard flex items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                  {/* Color Picker Interactive Canvas */}
                  {tool.id === 'color-picker-image' && sourceImg ? (
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        width={sourceImg.naturalWidth || sourceImg.width}
                        height={sourceImg.naturalHeight || sourceImg.height}
                        onMouseMove={handleCanvasMouseMove}
                        className="max-h-[500px] w-auto max-w-full object-contain cursor-crosshair rounded-lg"
                      />
                      {pickedColor && (
                        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg shadow-inner border border-white/20"
                            style={{ backgroundColor: pickedColor.hex }}
                          />
                          <div className="text-xs font-mono">
                            <div className="font-bold text-white">{pickedColor.hex}</div>
                            <div className="text-slate-400 text-[10px]">{pickedColor.rgb}</div>
                          </div>
                          <button
                            onClick={() => handleCopy(pickedColor.hex)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                            title="Copy HEX"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : compareMode === 'before' && sourceUrl ? (
                    <img
                      src={sourceUrl}
                      alt="Source"
                      className="max-h-[500px] max-w-full object-contain rounded-lg shadow-lg"
                    />
                  ) : resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="Result"
                      className="max-h-[500px] max-w-full object-contain rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="text-center text-slate-500 text-xs">
                      Ready for processing
                    </div>
                  )}
                </div>

                {/* Footer specs inside preview card */}
                <div
                  className={`mt-4 flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t ${
                    theme === 'dark'
                      ? 'text-slate-400 border-slate-800/80'
                      : 'text-slate-500 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {sourceImg && (
                      <span>
                        Original: {sourceImg.naturalWidth || sourceImg.width} ×{' '}
                        {sourceImg.naturalHeight || sourceImg.height} px
                      </span>
                    )}
                    {originalSize > 0 && <span>· {formatBytes(originalSize)}</span>}
                  </div>

                  {resultSize > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-semibold font-mono">
                        Output: {formatBytes(resultSize)}
                      </span>
                      {originalSize > 0 && originalSize > resultSize && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] border ${
                            theme === 'dark'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          -
                          {Math.round(
                            ((originalSize - resultSize) / originalSize) * 100
                          )}
                          %
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTROLS & SETTINGS */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
              <div
                className={`rounded-2xl p-6 shadow-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900/90 border border-slate-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-900 shadow-slate-200/50'
                }`}
              >
                <div
                  className={`flex items-center justify-between pb-4 mb-5 border-b ${
                    theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <h3
                    className={`text-sm font-bold flex items-center gap-2 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Tool Settings
                  </h3>
                  <button
                    onClick={handleResetImage}
                    className={`text-xs flex items-center gap-1 transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replace Image</span>
                  </button>
                </div>

                {/* TOOL SPECIFIC CONTROLS */}
                <div className="space-y-5">
                  {/* Image Compressor */}
                  {tool.id === 'image-compressor' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                          <span>Quality</span>
                          <span className="font-mono text-cyan-400">
                            {Math.round(compQuality * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={compQuality}
                          onChange={(e) => setCompQuality(Number(e.target.value))}
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-2">
                          Output Format
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['image/jpeg', 'image/webp', 'image/png'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => setCompFormat(fmt)}
                              className={`py-2 rounded-xl text-xs font-medium border ${
                                compFormat === fmt
                                  ? 'bg-indigo-600 border-indigo-400 text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-400'
                              }`}
                            >
                              {fmt.split('/')[1].toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Image Resizer */}
                  {tool.id === 'image-resizer' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Width (px)
                          </label>
                          <input
                            type="number"
                            value={resizeW}
                            onChange={(e) => {
                              const w = Number(e.target.value);
                              setResizeW(w);
                              if (lockAspect && sourceImg) {
                                const ratio =
                                  (sourceImg.naturalHeight || sourceImg.height) /
                                  (sourceImg.naturalWidth || sourceImg.width);
                                setResizeH(Math.round(w * ratio));
                              }
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Height (px)
                          </label>
                          <input
                            type="number"
                            value={resizeH}
                            onChange={(e) => {
                              const h = Number(e.target.value);
                              setResizeH(h);
                              if (lockAspect && sourceImg) {
                                const ratio =
                                  (sourceImg.naturalWidth || sourceImg.width) /
                                  (sourceImg.naturalHeight || sourceImg.height);
                                setResizeW(Math.round(h * ratio));
                              }
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setLockAspect(!lockAspect)}
                        className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border w-full ${
                          lockAspect
                            ? 'bg-slate-800 border-slate-700 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {lockAspect ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* 7. Image Cropper */}
                  {tool.id === 'image-cropper' && (
                    <div className="space-y-4">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Crop Presets
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['free', '1:1', '16:9', '4:3', '9:16'] as const).map((asp) => (
                          <button
                            key={asp}
                            onClick={() => {
                              setCropAspect(asp);
                              if (!sourceImg) return;
                              const origW = sourceImg.naturalWidth || sourceImg.width;
                              const origH = sourceImg.naturalHeight || sourceImg.height;
                              if (asp === '1:1') {
                                const dim = Math.min(origW, origH);
                                setCropRect({ x: 0, y: 0, w: dim, h: dim });
                              } else if (asp === '16:9') {
                                const w = origW;
                                const h = Math.round((w * 9) / 16);
                                setCropRect({ x: 0, y: 0, w, h: Math.min(h, origH) });
                              } else if (asp === '4:3') {
                                const w = origW;
                                const h = Math.round((w * 3) / 4);
                                setCropRect({ x: 0, y: 0, w, h: Math.min(h, origH) });
                              }
                            }}
                            className={`py-2 rounded-xl text-xs font-medium border ${
                              cropAspect === asp
                                ? 'bg-pink-600 border-pink-400 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {asp}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 8. Format Converter */}
                  {tool.id === 'image-format-converter' && (
                    <div className="space-y-4">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Target File Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'WEBP (Recommended)', mime: 'image/webp' },
                          { label: 'PNG (Lossless)', mime: 'image/png' },
                          { label: 'JPG (Universal)', mime: 'image/jpeg' },
                        ].map((f) => (
                          <button
                            key={f.mime}
                            onClick={() => setTargetMime(f.mime as any)}
                            className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                              targetMime === f.mime
                                ? 'bg-violet-600 border-violet-400 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 9. Rotator */}
                  {tool.id === 'image-rotator' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setRotAngle((a) => (a + 90) % 360)}
                          className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          +90° Right
                        </button>
                        <button
                          onClick={() => setRotAngle((a) => (a - 90 + 360) % 360)}
                          className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          -90° Left
                        </button>
                        <button
                          onClick={() => setRotAngle(180)}
                          className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          180° Flip
                        </button>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Custom Angle</span>
                          <span className="font-mono text-cyan-400">{rotAngle}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={rotAngle}
                          onChange={(e) => setRotAngle(Number(e.target.value))}
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* 10. Flipper */}
                  {tool.id === 'image-flipper' && (
                    <div className="space-y-3">
                      <button
                        onClick={() => setFlipH(!flipH)}
                        className={`w-full py-3 rounded-xl border text-xs font-semibold ${
                          flipH
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        Flip Horizontal (Mirror)
                      </button>
                      <button
                        onClick={() => setFlipV(!flipV)}
                        className={`w-full py-3 rounded-xl border text-xs font-semibold ${
                          flipV
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        Flip Vertical (Upside Down)
                      </button>
                    </div>
                  )}

                  {/* 11. Filters */}
                  {tool.id === 'image-filters' && (
                    <div className="space-y-4">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Preset Style
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          'vintage',
                          'noir',
                          'sepia',
                          'cold',
                          'warm',
                          'cyberpunk',
                          'emerald',
                          'grayscale',
                          'invert',
                        ].map((f) => (
                          <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`py-2 rounded-xl text-xs font-medium capitalize border ${
                              activeFilter === f
                                ? 'bg-pink-600 border-pink-400 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Filter Intensity</span>
                          <span className="font-mono text-pink-400">
                            {Math.round(filterIntensity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={filterIntensity}
                          onChange={(e) => setFilterIntensity(Number(e.target.value))}
                          className="w-full accent-pink-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* 12. Brightness / Contrast */}
                  {(tool.id === 'brightness-adjuster' || tool.id === 'contrast-adjuster') && (
                    <div className="space-y-4">
                      {tool.id === 'brightness-adjuster' ? (
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Brightness</span>
                            <span className="font-mono text-amber-400">
                              {brightnessVal > 0 ? `+${brightnessVal}` : brightnessVal}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={brightnessVal}
                            onChange={(e) => setBrightnessVal(Number(e.target.value))}
                            className="w-full accent-amber-400"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Contrast</span>
                            <span className="font-mono text-rose-400">
                              {contrastVal > 0 ? `+${contrastVal}` : contrastVal}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={contrastVal}
                            onChange={(e) => setContrastVal(Number(e.target.value))}
                            className="w-full accent-rose-400"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 13. Blur / Sharpen */}
                  {tool.id === 'image-blur-tool' && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Blur Radius</span>
                        <span className="font-mono text-teal-400">{blurRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={blurRadius}
                        onChange={(e) => setBlurRadius(Number(e.target.value))}
                        className="w-full accent-teal-400"
                      />
                    </div>
                  )}

                  {tool.id === 'image-sharpen-tool' && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Sharpen Strength</span>
                        <span className="font-mono text-emerald-400">{sharpenAmount}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={sharpenAmount}
                        onChange={(e) => setSharpenAmount(Number(e.target.value))}
                        className="w-full accent-emerald-400"
                      />
                    </div>
                  )}

                  {/* 14. Watermark Maker */}
                  {tool.id === 'image-watermark-maker' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          Watermark Text
                        </label>
                        <input
                          type="text"
                          value={wmText}
                          onChange={(e) => setWmText(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Text Color
                          </label>
                          <input
                            type="color"
                            value={wmColor}
                            onChange={(e) => setWmColor(e.target.value)}
                            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Position
                          </label>
                          <select
                            value={wmPos}
                            onChange={(e) => setWmPos(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="bottom-right">Bottom Right</option>
                            <option value="center">Center</option>
                            <option value="top-left">Top Left</option>
                            <option value="tiled">Tiled / Repeat</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 15. Border & Round Corner Maker */}
                  {tool.id === 'image-border-maker' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Border Width</span>
                          <span className="font-mono text-indigo-400">{borderWidth}px</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="80"
                          value={borderWidth}
                          onChange={(e) => setBorderWidth(Number(e.target.value))}
                          className="w-full accent-indigo-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          Border Color
                        </label>
                        <input
                          type="color"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {tool.id === 'round-corner-maker' && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Corner Radius</span>
                        <span className="font-mono text-cyan-400">{cornerRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="200"
                        value={cornerRadius}
                        onChange={(e) => setCornerRadius(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  )}

                  {/* 16. WhatsApp DP Maker */}
                  {tool.id === 'whatsapp-dp-maker' && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDpShape('circle')}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border ${
                            dpShape === 'circle'
                              ? 'bg-emerald-600 border-emerald-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Circle Avatar
                        </button>
                        <button
                          onClick={() => setDpShape('square')}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border ${
                            dpShape === 'square'
                              ? 'bg-emerald-600 border-emerald-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Square
                        </button>
                      </div>

                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dpRing}
                          onChange={(e) => setDpRing(e.target.checked)}
                          className="rounded text-emerald-500 focus:ring-0"
                        />
                        <span>Add Highlight Border Ring</span>
                      </label>
                    </div>
                  )}

                  {/* 17. Passport Photo Resizer */}
                  {tool.id === 'passport-photo-resizer' && (
                    <div className="space-y-4">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Select Standard Dimension
                      </label>
                      <div className="space-y-2">
                        {[
                          {
                            id: 'us-passport',
                            label: 'United States (2×2 in / 51×51 mm)',
                            spec: '600×600 px @ 300 DPI',
                          },
                          {
                            id: 'schengen',
                            label: 'Schengen / Europe (35×45 mm)',
                            spec: '413×531 px @ 300 DPI',
                          },
                          {
                            id: 'uk-passport',
                            label: 'United Kingdom (35×45 mm)',
                            spec: '413×531 px @ 300 DPI',
                          },
                          {
                            id: 'india-passport',
                            label: 'India Passport / OCI (35×35 mm)',
                            spec: '413×413 px @ 300 DPI',
                          },
                        ].map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setPassportPreset(p.id as any)}
                            className={`w-full p-3 rounded-xl text-left border transition-all ${
                              passportPreset === p.id
                                ? 'bg-blue-950/60 border-blue-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{p.label}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {p.spec}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 18. YouTube Thumbnail Maker */}
                  {tool.id === 'youtube-thumbnail-maker' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          Bold Title
                        </label>
                        <input
                          type="text"
                          value={ytTitle}
                          onChange={(e) => setYtTitle(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={ytSubtitle}
                          onChange={(e) => setYtSubtitle(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Badge Tag
                          </label>
                          <input
                            type="text"
                            value={ytBadge}
                            onChange={(e) => setYtBadge(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Theme
                          </label>
                          <select
                            value={ytGradient}
                            onChange={(e) => setYtGradient(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="blue-violet">Blue & Violet</option>
                            <option value="emerald-cyan">Emerald & Cyan</option>
                            <option value="amber-rose">Amber & Rose</option>
                            <option value="dark-scrim">Cinematic Dark</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 19. Meme Generator */}
                  {tool.id === 'meme-generator' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          Top Text
                        </label>
                        <input
                          type="text"
                          value={memeTop}
                          onChange={(e) => setMemeTop(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          Bottom Text
                        </label>
                        <input
                          type="text"
                          value={memeBottom}
                          onChange={(e) => setMemeBottom(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Font Size</span>
                          <span className="font-mono text-amber-400">{memeSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="24"
                          max="80"
                          value={memeSize}
                          onChange={(e) => setMemeSize(Number(e.target.value))}
                          className="w-full accent-amber-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* 20. QR Code Generator */}
                  {tool.id === 'qr-code-generator' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          URL or Content
                        </label>
                        <input
                          type="text"
                          value={qrText}
                          onChange={(e) => setQrText(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            QR Color
                          </label>
                          <input
                            type="color"
                            value={qrDarkColor}
                            onChange={(e) => setQrDarkColor(e.target.value)}
                            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Background
                          </label>
                          <input
                            type="color"
                            value={qrLightColor}
                            onChange={(e) => setQrLightColor(e.target.value)}
                            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 21. QR Code Reader Display */}
                  {tool.id === 'qr-code-reader' && decodedQr && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-3">
                      <div className="text-xs text-cyan-400 font-bold">
                        Decoded Content:
                      </div>
                      <div className="text-xs font-mono text-white bg-slate-900 p-2.5 rounded-lg break-all">
                        {decodedQr}
                      </div>
                      <button
                        onClick={() => handleCopy(decodedQr)}
                        className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Decoded Text</span>
                      </button>
                    </div>
                  )}

                  {/* 22. Color Palette Extractor Display */}
                  {tool.id === 'color-palette-extractor' && extractedPalette.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Extracted Dominant Palette
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {extractedPalette.map((col) => (
                          <div
                            key={col.hex}
                            onClick={() => handleCopy(col.hex)}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-5 h-5 rounded-md border border-white/20"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span className="text-xs font-mono text-slate-200">
                                {col.hex}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">
                              {col.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 23. Favicon Generator Display */}
                  {tool.id === 'favicon-generator' && favicons.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Generated Favicon Icons
                      </label>
                      <div className="space-y-2">
                        {favicons.map((fav) => (
                          <div
                            key={fav.size}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={fav.url}
                                alt={fav.label}
                                className="w-6 h-6 rounded bg-white p-0.5 object-contain"
                              />
                              <span className="text-xs text-slate-300 font-medium">
                                {fav.label}
                              </span>
                            </div>
                            <button
                              onClick={() => downloadBlob(fav.blob, `favicon-${fav.size}x${fav.size}.png`)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300"
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Copied Alert */}
                {copiedText && (
                  <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Copied &quot;{copiedText}&quot; to clipboard!</span>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* PRIMARY ACTION: DOWNLOAD RESULT BUTTON */}
                <div className="mt-8 pt-5 border-t border-slate-800">
                  <button
                    onClick={handleDownload}
                    disabled={!resultBlob || isProcessing}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Processed Image</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    Processed safely in your browser. Never uploaded to servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RELATED TOOLS SECTION */}
        <div
          className={`mt-20 pt-10 border-t ${
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
              { id: 'image-compressor', name: 'Image Compressor', desc: 'Shrink file size up to 90%' },
              { id: 'image-resizer', name: 'Image Resizer', desc: 'Resize width & height in pixels' },
              { id: 'image-filters', name: 'Image Filters', desc: 'Artistic color filters & presets' },
              { id: 'qr-code-generator', name: 'QR Code Generator', desc: 'Scannable QR codes for links' },
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
