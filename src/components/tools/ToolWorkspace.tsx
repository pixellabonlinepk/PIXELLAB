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
  Lock,
  Unlock,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Pipette,
  Square,
  EyeOff,
  Sun,
  ExternalLink,
  FileImage,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Archive,
  ChevronLeft,
  ChevronRight,
  FileDown,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { getToolGuide } from '../../data/toolGuides';
import { RenderedPdfPage } from '../../utils/pdfRenderer';
import { ImageUploader } from '../ImageUploader';
import {
  loadImage,
  formatBytes,
  downloadBlob,
  compressImage,
  resizeImage,
  cropImage,
  convertFormat,
  generateWhatsAppDP,
  generatePassportPhoto,
  generateYouTubeThumbnail,
  generateMeme,
  generateQrCodeUrl,
  convertImagesToPdf,
  renderPdfToImage,
  generateFaviconPack,
  applyWatermark,
  applyFilter,
  adjustBrightnessContrast,
  applySharpen,
  applyBlur,
  applyBorder,
  applyRoundCorners,
  readQrCodeFromImage,
  getPixelColor,
  extractColorPalette,
  aspectRatioPad,
  stripExifMetadata,
} from '../../utils/imageProcessing';
import { BatchImageResizer } from './BatchImageResizer';
import { PhotoCollageDPMaker } from './PhotoCollageDPMaker';
import { ImageSplitter } from './ImageSplitter';
import { ImageJoiner } from './ImageJoiner';
import { SignatureMaker } from './SignatureMaker';
import JSZip from 'jszip';

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
  // Delegate specialized multi-item / canvas studios
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

  // Zoom & Preview state
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Object URL tracking for memory leak prevention
  const trackedUrlsRef = useRef<Set<string>>(new Set());

  // Memory cleanup on unmount
  useEffect(() => {
    return () => {
      trackedUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      trackedUrlsRef.current.clear();
    };
  }, []);

  // Comparison view toggle
  const [compareMode, setCompareMode] = useState<'after' | 'before' | 'split'>('after');
  const [splitPos, setSplitPos] = useState<number>(50);
  const [openToolFaq, setOpenToolFaq] = useState<number | null>(0);

  // High-value SEO guide for this specific tool
  const guide = getToolGuide(tool.id, tool.name, tool.categoryLabel);

  // Specific Tool Settings:
  // 1. Compressor
  const [compQuality, setCompQuality] = useState<number>(0.8);
  const [compFormat, setCompFormat] = useState<string>('image/jpeg');

  // 2. Resizer
  const [resizeW, setResizeW] = useState<number>(1280);
  const [resizeH, setResizeH] = useState<number>(720);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  // 3. Cropper
  const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '16:9' | '4:3' | '9:16'>('free');
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 400, h: 400 });

  // 4. Converter
  const [targetMime, setTargetMime] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');

  // 5. WhatsApp DP
  const [dpShape, setDpShape] = useState<'circle' | 'square'>('circle');
  const [dpRing, setDpRing] = useState<boolean>(true);
  const [dpRingColor, setDpRingColor] = useState<string>('#3b82f6');

  // 6. Passport
  const [passportPreset, setPassportPreset] = useState<
    'pakistan-passport' | 'us-passport' | 'schengen' | 'uk-passport' | 'india-passport'
  >('pakistan-passport');

  // 7. YouTube Thumbnail
  const [ytTitle, setYtTitle] = useState<string>('HOW TO EDIT LIKE A PRO');
  const [ytSubtitle, setYtSubtitle] = useState<string>('Pixal Lab Masterclass 2026');
  const [ytBadge, setYtBadge] = useState<string>('NEW GUIDE');
  const [ytGradient, setYtGradient] = useState<'blue-violet' | 'emerald-cyan' | 'amber-rose' | 'dark-scrim'>('blue-violet');

  // 8. Meme
  const [memeTop, setMemeTop] = useState<string>('ONE DOES NOT SIMPLY');
  const [memeBottom, setMemeBottom] = useState<string>('PROCESS IMAGES ON THE SERVER');
  const [memeSize, setMemeSize] = useState<number>(38);

  // 9. QR Code Generator
  const [qrText, setQrText] = useState<string>('https://pixallab.online');
  const [qrDarkColor, setQrDarkColor] = useState<string>('#000000');
  const [qrLightColor, setQrLightColor] = useState<string>('#ffffff');

  // 10. Image to PDF
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pdfMargin, setPdfMargin] = useState<number>(10);
  const [pdfImages, setPdfImages] = useState<{ img: HTMLImageElement; filename: string }[]>([]);

  // 11. PDF to Image
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(1);
  const [pdfScale, setPdfScale] = useState<number>(2.0);
  const [pdfTargetFormat, setPdfTargetFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [pdfPages, setPdfPages] = useState<RenderedPdfPage[]>([]);
  const [isZippingPdf, setIsZippingPdf] = useState<boolean>(false);

  // 12. Watermark Maker
  const [wmText, setWmText] = useState<string>('© PIXAL LAB');
  const [wmOpacity, setWmOpacity] = useState<number>(0.35);
  const [wmFontSize, setWmFontSize] = useState<number>(36);
  const [wmColor, setWmColor] = useState<string>('#ffffff');
  const [wmPattern, setWmPattern] = useState<'single' | 'tiled'>('tiled');

  // 13. Cinematic Filters
  const [activeFilter, setActiveFilter] = useState<'vintage' | 'noir' | 'cyberpunk' | 'warm' | 'sepia' | 'cool'>('vintage');
  const [filterIntensity, setFilterIntensity] = useState<number>(85);

  // 14. Brightness, Contrast & Sharpen
  const [toolBrightness, setToolBrightness] = useState<number>(10);
  const [toolContrast, setToolContrast] = useState<number>(15);
  const [toolSharpen, setToolSharpen] = useState<number>(20);

  // 15. Privacy Blur & Pixelate Redactor
  const [blurRadius, setBlurRadius] = useState<number>(14);
  const [blurMode, setBlurMode] = useState<'gaussian' | 'pixelate' | 'soft'>('gaussian');

  // 16. Border & Corner Studio
  const [frameBorderWidth, setFrameBorderWidth] = useState<number>(16);
  const [frameBorderColor, setFrameBorderColor] = useState<string>('#4F46E5');
  const [frameCornerRadius, setFrameCornerRadius] = useState<number>(36);

  // 17. QR Code Scanner / Reader
  const [decodedQrResult, setDecodedQrResult] = useState<string | null>(null);

  // 18. Color Picker & Palette
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: string }>({ hex: '#4F46E5', rgb: 'rgb(79, 70, 229)' });
  const [paletteColors, setPaletteColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 19. Aspect Ratio Pad (No-Crop Social Expander)
  const [aspectPadRatio, setAspectPadRatio] = useState<'1:1' | '4:5' | '9:16' | '16:9'>('1:1');
  const [aspectPadBgMode, setAspectPadBgMode] = useState<'blur' | 'white' | 'black' | 'custom'>('blur');
  const [aspectPadBgColor, setAspectPadBgColor] = useState<string>('#4F46E5');

  // 20. EXIF & GPS Metadata Cleaner
  const [exifFormat, setExifFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  // Color picker sampling on hover / tap
  const handleCanvasPointer = (e: React.MouseEvent<HTMLImageElement>) => {
    if (tool.id !== 'color-picker-palette' || !sourceImg) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const normX = Math.max(0, Math.min(1, clientX / rect.width));
    const normY = Math.max(0, Math.min(1, clientY / rect.height));

    const origW = sourceImg.naturalWidth || sourceImg.width;
    const origH = sourceImg.naturalHeight || sourceImg.height;
    const pixelX = Math.floor(normX * origW);
    const pixelY = Math.floor(normY * origH);

    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = origW;
    sampleCanvas.height = origH;
    const sCtx = sampleCanvas.getContext('2d');
    if (sCtx) {
      sCtx.drawImage(sourceImg, 0, 0);
      const pixel = sCtx.getImageData(pixelX, pixelY, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
      setPickedColor({ hex, rgb: `rgb(${r}, ${g}, ${b})` });
    }
  };

  // Handle image upload
  const handleImageSelected = async (fileOrUrl: File | string, filename?: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      if (typeof fileOrUrl === 'string') {
        const img = await loadImage(fileOrUrl);
        setSourceImg(img);
        setSourceUrl(fileOrUrl);
        setSourceFilename(filename || 'image.png');
        setOriginalSize(0);
        setResizeW(img.naturalWidth);
        setResizeH(img.naturalHeight);
        setCropRect({
          x: 0,
          y: 0,
          w: Math.min(img.naturalWidth, 800),
          h: Math.min(img.naturalHeight, 800),
        });
      } else {
        setSourceFile(fileOrUrl);
        setSourceFilename(fileOrUrl.name);
        setOriginalSize(fileOrUrl.size);

        if (tool.id === 'pdf-to-image-converter' || fileOrUrl.type === 'application/pdf') {
          // Process PDF directly
          const pdfRes = await renderPdfToImage(fileOrUrl, { scale: pdfScale, format: pdfTargetFormat });
          pdfRes.pages.forEach((p) => trackedUrlsRef.current.add(p.url));
          setPdfPages(pdfRes.pages);
          setPdfTotalPages(pdfRes.totalPages);
          setPdfPage(1);
          if (pdfRes.pages.length > 0) {
            setResultBlob(pdfRes.pages[0].blob);
            setResultUrl(pdfRes.pages[0].url);
            setResultSize(pdfRes.pages[0].blob.size);
          }
          setIsProcessing(false);
          return;
        }

        const img = await loadImage(fileOrUrl);
        const url = URL.createObjectURL(fileOrUrl);
        trackedUrlsRef.current.add(url);
        setSourceImg(img);
        setSourceUrl(url);
        setResizeW(img.naturalWidth);
        setResizeH(img.naturalHeight);
        setCropRect({
          x: 0,
          y: 0,
          w: Math.min(img.naturalWidth, 800),
          h: Math.min(img.naturalHeight, 800),
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load image';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Multiple files for PDF conversion
  const handleMultipleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const loaded = await Promise.all(
        files.map(async (f) => ({
          img: await loadImage(f),
          filename: f.name,
        }))
      );
      setPdfImages(loaded);
      if (loaded.length > 0) {
        setSourceImg(loaded[0].img);
        setSourceUrl(URL.createObjectURL(files[0]));
        setSourceFilename(files[0].name);
      }
    } catch (err: unknown) {
      setErrorMessage('Failed to load multiple files');
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger processing whenever settings change
  const executeProcessing = async () => {
    if (!sourceImg && tool.id !== 'qr-code-generator' && tool.id !== 'image-to-pdf-converter') {
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

        case 'pdf-to-image-converter': {
          if (sourceFile) {
            let currentPages = pdfPages;
            if (currentPages.length === 0) {
              const pdfRes = await renderPdfToImage(sourceFile, { scale: pdfScale, format: pdfTargetFormat });
              pdfRes.pages.forEach((p) => trackedUrlsRef.current.add(p.url));
              setPdfPages(pdfRes.pages);
              setPdfTotalPages(pdfRes.totalPages);
              currentPages = pdfRes.pages;
            }
            const pageIdx = Math.min(Math.max(1, pdfPage), currentPages.length || 1) - 1;
            const targetPage = currentPages[pageIdx];
            if (targetPage) {
              res = {
                blob: targetPage.blob,
                url: targetPage.url,
                size: targetPage.blob.size,
              };
            }
          }
          break;
        }

        case 'favicon-generator': {
          if (sourceImg) {
            const pack = await generateFaviconPack(sourceImg);
            const zip = new JSZip();
            for (const item of pack) {
              zip.file(`favicon-${item.size}x${item.size}.png`, item.blob);
            }
            zip.file(
              'favicon-instructions.html',
              `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">`
            );
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            res = {
              blob: zipBlob,
              url: pack[pack.length - 1].url,
              size: zipBlob.size,
            };
          }
          break;
        }

        case 'image-watermark-maker': {
          if (sourceImg) {
            res = await applyWatermark(sourceImg, {
              text: wmText,
              fontSize: wmFontSize,
              fontFamily: 'Outfit, sans-serif',
              color: wmColor,
              opacity: wmOpacity,
              position: wmPattern === 'tiled' ? 'tiled' : 'center',
              rotation: wmPattern === 'tiled' ? -30 : 0,
            });
          }
          break;
        }

        case 'image-filters': {
          if (sourceImg) {
            res = await applyFilter(sourceImg, activeFilter, filterIntensity / 100);
          }
          break;
        }

        case 'brightness-contrast-tool': {
          if (sourceImg) {
            const baseRes = await adjustBrightnessContrast(sourceImg, toolBrightness, toolContrast);
            if (toolSharpen > 0) {
              const sharpImg = await loadImage(baseRes.url);
              res = await applySharpen(sharpImg, toolSharpen);
            } else {
              res = baseRes;
            }
          }
          break;
        }

        case 'image-blur-tool': {
          if (sourceImg) {
            res = await applyBlur(sourceImg, blurRadius, blurMode);
          }
          break;
        }

        case 'aspect-ratio-pad': {
          if (sourceImg) {
            const padRes = await aspectRatioPad(sourceImg, {
              ratio: aspectPadRatio,
              bgMode: aspectPadBgMode,
              bgColor: aspectPadBgColor,
            });
            res = {
              blob: padRes.blob,
              url: padRes.url,
              size: padRes.blob.size,
            };
          }
          break;
        }

        case 'exif-metadata-remover': {
          if (sourceImg) {
            res = await stripExifMetadata(sourceImg, exifFormat, 0.95);
          }
          break;
        }

        case 'border-corner-maker': {
          if (sourceImg) {
            const borderRes = await applyBorder(sourceImg, frameBorderWidth, frameBorderColor);
            const borderImg = await loadImage(borderRes.url);
            res = await applyRoundCorners(borderImg, frameCornerRadius);
          }
          break;
        }

        case 'qr-code-reader': {
          if (sourceImg) {
            const decodeRes = await readQrCodeFromImage(sourceImg);
            setDecodedQrResult(decodeRes.data);
            res = { blob: new Blob([]), url: sourceUrl || '' };
          }
          break;
        }

        case 'color-picker-palette': {
          if (sourceImg) {
            const palette = extractColorPalette(sourceImg, 6);
            setPaletteColors(palette.map((p) => p.hex));
            res = { blob: new Blob([]), url: sourceUrl || '' };
          }
          break;
        }
      }

      if (res) {
        setResultBlob(res.blob);
        setResultUrl(res.url);
        setResultSize(res.blob.size || 0);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-run execution on parameter changes
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
    pdfPage,
    pdfTargetFormat,
    wmText,
    wmOpacity,
    wmFontSize,
    wmColor,
    wmPattern,
    activeFilter,
    filterIntensity,
    toolBrightness,
    toolContrast,
    toolSharpen,
    blurRadius,
    blurMode,
    frameBorderWidth,
    frameBorderColor,
    frameCornerRadius,
    aspectPadRatio,
    aspectPadBgMode,
    aspectPadBgColor,
    exifFormat,
  ]);

  // Handle Resize aspect ratio
  const handleWidthChange = (w: number) => {
    setResizeW(w);
    if (lockAspect && sourceImg && sourceImg.naturalWidth) {
      const ratio = sourceImg.naturalHeight / sourceImg.naturalWidth;
      setResizeH(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    setResizeH(h);
    if (lockAspect && sourceImg && sourceImg.naturalHeight) {
      const ratio = sourceImg.naturalWidth / sourceImg.naturalHeight;
      setResizeW(Math.round(h * ratio));
    }
  };

  // Handle PDF Page selection
  const handlePdfPageChange = (newPageNum: number) => {
    const target = Math.max(1, Math.min(newPageNum, pdfTotalPages));
    setPdfPage(target);
    if (pdfPages.length >= target) {
      const page = pdfPages[target - 1];
      setResultBlob(page.blob);
      setResultUrl(page.url);
      setResultSize(page.blob.size);
    }
  };

  // Handle PDF Format or Scale change
  const handlePdfFormatOrScaleChange = async (newFormat?: 'image/png' | 'image/jpeg', newScale?: number) => {
    const fmt = newFormat ?? pdfTargetFormat;
    const sc = newScale ?? pdfScale;
    if (newFormat) setPdfTargetFormat(newFormat);
    if (newScale) setPdfScale(sc);

    if (sourceFile) {
      setIsProcessing(true);
      try {
        const pdfRes = await renderPdfToImage(sourceFile, { scale: sc, format: fmt });
        pdfRes.pages.forEach((p) => trackedUrlsRef.current.add(p.url));
        setPdfPages(pdfRes.pages);
        setPdfTotalPages(pdfRes.totalPages);
        const pageIdx = Math.min(Math.max(1, pdfPage), pdfRes.totalPages) - 1;
        const curPage = pdfRes.pages[pageIdx] || pdfRes.pages[0];
        if (curPage) {
          setResultBlob(curPage.blob);
          setResultUrl(curPage.url);
          setResultSize(curPage.blob.size);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to re-render PDF with updated settings';
        setErrorMessage(msg);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Download all PDF pages as a ZIP package
  const handleDownloadAllPdfPages = async () => {
    if (pdfPages.length === 0) return;
    setIsZippingPdf(true);
    try {
      const zip = new JSZip();
      const baseName = sourceFilename.replace(/\.[^/.]+$/, '') || 'document';
      const ext = pdfTargetFormat === 'image/jpeg' ? 'jpg' : 'png';

      pdfPages.forEach((page) => {
        zip.file(`${baseName}-page-${page.pageNumber}.${ext}`, page.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `pixallab-${baseName}-all-pages.zip`);

      window.dispatchEvent(
        new CustomEvent('pixellab:tool-completed', {
          detail: { toolId: tool.id, toolName: tool.name },
        })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create ZIP package';
      setErrorMessage(msg);
    } finally {
      setIsZippingPdf(false);
    }
  };

  // Download handler
  const handleDownload = () => {
    if (!resultBlob && tool.id !== 'qr-code-generator') return;

    let baseName = sourceFilename.replace(/\.[^/.]+$/, '');
    if (!baseName || baseName === 'image') {
      baseName = `pixallab-${tool.id}`;
    }

    let ext = '.png';
    if (tool.id === 'image-to-pdf-converter' || resultBlob?.type === 'application/pdf') {
      ext = '.pdf';
    } else if (tool.id === 'favicon-generator' || resultBlob?.type === 'application/zip') {
      ext = '.zip';
    } else if (tool.id === 'image-format-converter') {
      ext = `.${targetMime.replace('image/', '')}`;
    } else if (tool.id === 'pdf-to-image-converter') {
      ext = pdfTargetFormat === 'image/jpeg' ? '.jpg' : '.png';
    } else if (tool.id === 'image-compressor') {
      ext = compFormat === 'image/png' ? '.png' : compFormat === 'image/webp' ? '.webp' : '.jpg';
    } else if (resultBlob?.type === 'image/jpeg') {
      ext = '.jpg';
    } else if (resultBlob?.type === 'image/webp') {
      ext = '.webp';
    } else if (resultBlob?.type === 'image/png') {
      ext = '.png';
    }

    let filename = `${baseName}-${Date.now()}${ext}`;
    if (tool.id === 'pdf-to-image-converter') {
      filename = `${baseName}-page-${pdfPage}${ext}`;
    }

    if (resultBlob) {
      downloadBlob(resultBlob, filename);
    } else if (resultUrl && tool.id === 'qr-code-generator') {
      const a = document.createElement('a');
      a.href = resultUrl;
      a.download = `pixallab-qrcode-${Date.now()}.png`;
      a.click();
    }

    // Trigger feedback event
    window.dispatchEvent(
      new CustomEvent('pixellab:tool-completed', {
        detail: { toolId: tool.id, toolName: tool.name },
      })
    );
  };

  // Copy helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation & Tool Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 glass-panel text-theme-secondary hover:text-theme-primary transition-all active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tools</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Processing</span>
            </span>
          </div>
        </div>

        {/* Centered Title & Tagline */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-theme-primary mb-2.5 [text-wrap:balance]">
            {tool.name}
          </h1>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* UPLOADER / WORKSPACE AREA */}
        {!sourceImg && tool.id !== 'qr-code-generator' ? (
          <div className="max-w-3xl mx-auto">
            <ImageUploader
              onImageSelected={handleImageSelected}
              acceptedFormats={tool.acceptedFormats}
              maxSizeMB={tool.maxFileSizeMB}
              multiple={tool.id === 'image-to-pdf-converter'}
              onMultipleImagesSelected={handleMultipleFiles}
              acceptPdf={tool.id === 'pdf-to-image-converter'}
            />
          </div>
        ) : (
          /* Active Editor 2-Column Split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: LIVE CANVAS VIEWER */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              <div className="glass-panel rounded-3xl p-5 shadow-xl relative">
                {/* Floating Preview Toolbar */}
                <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-black/5 dark:border-white/10 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-theme-primary">
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      Live Canvas
                    </span>
                    {isProcessing && (
                      <span className="text-[10px] font-mono text-indigo-500 animate-pulse">
                        Processing...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Zoom Level Controls */}
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.max(25, z - 25))}
                        title="Zoom Out"
                        className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-theme-secondary hover:text-theme-primary transition-colors cursor-pointer"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomLevel(100)}
                        title="Reset Zoom to 100%"
                        className="px-1 text-[10px] font-mono font-bold text-theme-primary cursor-pointer hover:underline"
                      >
                        {zoomLevel}%
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.min(300, z + 25))}
                        title="Zoom In"
                        className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-theme-secondary hover:text-theme-primary transition-colors cursor-pointer"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Mode Toggles: After, Before, Split */}
                    <div className="flex items-center apple-segmented p-1 rounded-full">
                      <button
                        onClick={() => setCompareMode('after')}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          compareMode === 'after'
                            ? 'bg-white dark:bg-white/20 text-theme-primary font-semibold shadow-xs'
                            : 'text-theme-muted'
                        }`}
                      >
                        Output
                      </button>
                      {sourceUrl && (
                        <button
                          onClick={() => setCompareMode('before')}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            compareMode === 'before'
                              ? 'bg-white dark:bg-white/20 text-theme-primary font-semibold shadow-xs'
                              : 'text-theme-muted'
                          }`}
                        >
                          Original
                        </button>
                      )}
                      {sourceUrl && resultUrl && (
                        <button
                          onClick={() => setCompareMode('split')}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            compareMode === 'split'
                              ? 'bg-white dark:bg-white/20 text-theme-primary font-semibold shadow-xs'
                              : 'text-theme-muted'
                          }`}
                        >
                          Split View
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Multi-page PDF Stepper Banner */}
                {tool.id === 'pdf-to-image-converter' && pdfTotalPages > 1 && (
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 text-xs">
                    <button
                      type="button"
                      disabled={pdfPage <= 1 || isProcessing}
                      onClick={() => handlePdfPageChange(pdfPage - 1)}
                      className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/40 disabled:opacity-40 hover:bg-white dark:hover:bg-black/60 font-semibold flex items-center gap-1 transition-all cursor-pointer text-theme-primary"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev Page</span>
                    </button>

                    <div className="font-semibold text-theme-primary">
                      Viewing Page <span className="text-indigo-500 font-bold font-mono">{pdfPage}</span> of{' '}
                      <span className="font-mono">{pdfTotalPages}</span>
                    </div>

                    <button
                      type="button"
                      disabled={pdfPage >= pdfTotalPages || isProcessing}
                      onClick={() => handlePdfPageChange(pdfPage + 1)}
                      className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/40 disabled:opacity-40 hover:bg-white dark:hover:bg-black/60 font-semibold flex items-center gap-1 transition-all cursor-pointer text-theme-primary"
                    >
                      <span>Next Page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Canvas/Image Viewer Area */}
                <div className="w-full min-h-[380px] max-h-[560px] rounded-2xl bg-checkerboard flex items-center justify-center p-4 relative overflow-hidden border border-black/5 dark:border-white/10">
                  {/* Split Comparison View */}
                  {compareMode === 'split' && sourceUrl && resultUrl ? (
                    <div className="relative w-full h-full max-h-[500px] flex items-center justify-center overflow-hidden select-none">
                      <img
                        src={resultUrl}
                        alt="Output comparison"
                        style={{
                          transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                          transformOrigin: 'center center',
                          transition: 'transform 0.15s ease-out',
                        }}
                        className="max-h-[480px] max-w-full object-contain pointer-events-none"
                      />
                      <div
                        className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
                        style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
                      >
                        <img
                          src={sourceUrl}
                          alt="Original comparison"
                          style={{
                            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                            transformOrigin: 'center center',
                            transition: 'transform 0.15s ease-out',
                          }}
                          className="max-h-[480px] max-w-full object-contain"
                        />
                      </div>
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 shadow-md cursor-ew-resize z-20"
                        style={{ left: `${splitPos}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full liquid-dock border border-indigo-500 flex items-center justify-center shadow-lg text-indigo-500 font-bold text-xs">
                          ⇄
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={splitPos}
                        onChange={(e) => setSplitPos(Number(e.target.value))}
                        className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                        aria-label="Split position slider"
                      />
                    </div>
                  ) : compareMode === 'before' && sourceUrl ? (
                    <img
                      src={sourceUrl}
                      alt="Original view"
                      style={{
                        transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out',
                      }}
                      className="max-h-[500px] max-w-full object-contain rounded-lg"
                    />
                  ) : resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="Processed output"
                      onMouseMove={handleCanvasPointer}
                      onClick={handleCanvasPointer}
                      style={{
                        transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out',
                      }}
                      className={`max-h-[500px] max-w-full object-contain rounded-lg ${tool.id === 'color-picker-palette' ? 'cursor-crosshair' : ''}`}
                    />
                  ) : sourceUrl ? (
                    <img
                      src={sourceUrl}
                      alt="Preview"
                      onMouseMove={handleCanvasPointer}
                      onClick={handleCanvasPointer}
                      style={{
                        transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out',
                      }}
                      className={`max-h-[500px] max-w-full object-contain rounded-lg ${tool.id === 'color-picker-palette' ? 'cursor-crosshair' : ''}`}
                    />
                  ) : (
                    <div className="text-center text-xs text-theme-muted">
                      No active canvas
                    </div>
                  )}
                </div>

                {/* Bottom Canvas Stats Bar */}
                <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-black/5 dark:border-white/10 text-xs text-theme-secondary gap-2">
                  <div className="flex items-center gap-4">
                    {originalSize > 0 && (
                      <div>
                        <span className="text-theme-muted">Original: </span>
                        <span className="font-mono font-semibold text-theme-primary">{formatBytes(originalSize)}</span>
                      </div>
                    )}
                    {resultSize > 0 && (
                      <div>
                        <span className="text-theme-muted">Result: </span>
                        <span className="font-mono font-semibold text-emerald-500">{formatBytes(resultSize)}</span>
                        {originalSize > 0 && resultSize < originalSize && (
                          <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                            -{Math.round((1 - resultSize / originalSize) * 100)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {sourceUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setSourceImg(null);
                        setSourceUrl(null);
                        setResultUrl(null);
                        setResultBlob(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/10 text-xs text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replace Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTROLS PANEL */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
              <div className="glass-panel rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-bold text-theme-primary">
                      Settings & Presets
                    </span>
                  </div>
                </div>

                {/* 1. Image Compressor Controls */}
                {tool.id === 'image-compressor' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-theme-secondary block mb-2">
                        1-Click Quick Presets
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'WhatsApp / Email', quality: 0.6, format: 'image/jpeg' },
                          { label: 'Best Web Quality', quality: 0.8, format: 'image/webp' },
                          { label: 'Extreme 80% Shrink', quality: 0.4, format: 'image/jpeg' },
                          { label: 'Lossless Clarity', quality: 0.95, format: 'image/png' },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setCompQuality(preset.quality);
                              setCompFormat(preset.format);
                            }}
                            className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                              compQuality === preset.quality && compFormat === preset.format
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary hover:border-indigo-500/30'
                            }`}
                          >
                            <div>{preset.label}</div>
                            <div className="text-[10px] text-theme-muted font-mono">
                              {Math.round(preset.quality * 100)}% quality
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1.5">
                        <span>Quality Level</span>
                        <span className="font-mono font-bold text-indigo-500">
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
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="text-xs text-theme-secondary block mb-1.5">
                        Output Format
                      </span>
                      <select
                        value={compFormat}
                        onChange={(e) => setCompFormat(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-theme-primary focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
                      >
                        <option value="image/jpeg">JPEG (Fast, widely compatible)</option>
                        <option value="image/webp">WebP (Modern, 30% smaller)</option>
                        <option value="image/png">PNG (Preserves transparency)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 2. Image Resizer Controls */}
                {tool.id === 'image-resizer' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-theme-secondary block mb-2">
                        1-Click Resolution Presets
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Instagram Post (1:1)', w: 1080, h: 1080 },
                          { label: 'Story / Reels (9:16)', w: 1080, h: 1920 },
                          { label: 'Full HD 1080p', w: 1920, h: 1080 },
                          { label: 'Passport Photo (35x45)', w: 413, h: 531 },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setLockAspect(false);
                              setResizeW(preset.w);
                              setResizeH(preset.h);
                            }}
                            className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                              resizeW === preset.w && resizeH === preset.h
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary hover:border-indigo-500/30'
                            }`}
                          >
                            <div>{preset.label}</div>
                            <div className="text-[10px] text-theme-muted font-mono">
                              {preset.w} × {preset.h}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-theme-secondary block mb-1">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          value={resizeW}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-theme-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-theme-secondary block mb-1">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          value={resizeH}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-theme-primary"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLockAspect(!lockAspect)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                        lockAspect
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                          : 'border-black/10 dark:border-white/10 text-theme-muted'
                      }`}
                    >
                      {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
                    </button>
                  </div>
                )}

                {/* 3. Image Cropper Controls */}
                {tool.id === 'image-cropper' && (
                  <div className="space-y-4">
                    <span className="text-xs text-theme-secondary block mb-1">
                      Aspect Ratio
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['free', '1:1', '16:9', '4:3', '9:16'] as const).map((asp) => (
                        <button
                          key={asp}
                          onClick={() => {
                            setCropAspect(asp);
                            if (sourceImg) {
                              const nw = sourceImg.naturalWidth;
                              const nh = sourceImg.naturalHeight;
                              let w = Math.floor(nw * 0.8);
                              let h = Math.floor(nh * 0.8);
                              if (asp === '1:1') {
                                const s = Math.min(w, h);
                                w = s;
                                h = s;
                              } else if (asp === '16:9') {
                                h = Math.floor((w * 9) / 16);
                              } else if (asp === '4:3') {
                                h = Math.floor((w * 3) / 4);
                              } else if (asp === '9:16') {
                                w = Math.floor((h * 9) / 16);
                              }
                              setCropRect({ x: Math.floor((nw - w) / 2), y: Math.floor((nh - h) / 2), w, h });
                            }
                          }}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            cropAspect === asp
                              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                              : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                          }`}
                        >
                          {asp === 'free' ? 'Free Form' : asp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Format Converter Controls */}
                {tool.id === 'image-format-converter' && (
                  <div className="space-y-4">
                    <span className="text-xs text-theme-secondary block mb-1">
                      Target Format
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['image/webp', 'image/png', 'image/jpeg'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setTargetMime(fmt)}
                          className={`py-2.5 rounded-xl text-xs font-bold font-mono border transition-all ${
                            targetMime === fmt
                              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                              : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                          }`}
                        >
                          {fmt.replace('image/', '').toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. WhatsApp DP Maker Controls */}
                {tool.id === 'whatsapp-dp-maker' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-theme-secondary block mb-1">
                        Crop Shape
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['circle', 'square'] as const).map((sh) => (
                          <button
                            key={sh}
                            onClick={() => setDpShape(sh)}
                            className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                              dpShape === sh
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {sh}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-theme-primary">Outer Ring Accent</span>
                      <input
                        type="checkbox"
                        checked={dpRing}
                        onChange={(e) => setDpRing(e.target.checked)}
                        className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 6. Passport Photo Resizer Controls */}
                {tool.id === 'passport-photo-resizer' && (
                  <div className="space-y-4">
                    <span className="text-xs text-theme-secondary block mb-1">
                      Official Specification
                    </span>
                    <div className="space-y-2">
                      {[
                        { id: 'pakistan-passport', label: 'Pakistan Passport & CNIC (35x45 mm)', spec: 'NADRA & Visa Standard' },
                        { id: 'us-passport', label: 'United States Passport (2x2 inch)', spec: '600x600 px Standard' },
                        { id: 'schengen', label: 'Schengen Visa (35x45 mm)', spec: 'European Union Standard' },
                        { id: 'uk-passport', label: 'United Kingdom Passport (35x45 mm)', spec: 'HM Passport Office' },
                        { id: 'india-passport', label: 'India Passport & Visa (2x2 inch)', spec: 'Government of India' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setPassportPreset(item.id as any)}
                          className={`w-full p-2.5 rounded-xl text-left border transition-all ${
                            passportPreset === item.id
                              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                              : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-theme-muted">{item.spec}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. YouTube Thumbnail Maker */}
                {tool.id === 'youtube-thumbnail-maker' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-theme-secondary block mb-1">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={ytTitle}
                        onChange={(e) => setYtTitle(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-theme-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-theme-secondary block mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={ytSubtitle}
                        onChange={(e) => setYtSubtitle(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-theme-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-theme-secondary block mb-1">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={ytBadge}
                        onChange={(e) => setYtBadge(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-theme-primary"
                      />
                    </div>
                  </div>
                )}

                {/* 8. Meme Generator */}
                {tool.id === 'meme-generator' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-theme-secondary block mb-1">
                        Top Caption
                      </label>
                      <input
                        type="text"
                        value={memeTop}
                        onChange={(e) => setMemeTop(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs uppercase font-bold text-theme-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-theme-secondary block mb-1">
                        Bottom Caption
                      </label>
                      <input
                        type="text"
                        value={memeBottom}
                        onChange={(e) => setMemeBottom(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs uppercase font-bold text-theme-primary"
                      />
                    </div>
                  </div>
                )}

                {/* 9. QR Code Generator */}
                {tool.id === 'qr-code-generator' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-theme-secondary block mb-1">
                        URL or Content
                      </label>
                      <input
                        type="text"
                        value={qrText}
                        onChange={(e) => setQrText(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-theme-primary"
                      />
                    </div>
                  </div>
                )}

                {/* 10. Image to PDF Converter */}
                {tool.id === 'image-to-pdf-converter' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-theme-secondary block mb-1">
                        Page Orientation
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['portrait', 'landscape'] as const).map((orient) => (
                          <button
                            key={orient}
                            onClick={() => setPdfOrientation(orient)}
                            className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                              pdfOrientation === orient
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {orient}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. PDF to Image Converter */}
                {tool.id === 'pdf-to-image-converter' && (
                  <div className="space-y-4">
                    {/* Document Stats Badge */}
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-theme-primary">
                        <span className="flex items-center gap-1.5 text-indigo-500">
                          <FileImage className="w-4 h-4" />
                          <span>PDF Document</span>
                        </span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500 font-semibold">
                          {pdfTotalPages} {pdfTotalPages === 1 ? 'Page' : 'Pages'}
                        </span>
                      </div>
                      <div className="text-[11px] text-theme-secondary truncate font-mono">
                        {sourceFilename}
                      </div>
                    </div>

                    {/* Page Selector & Quick Switch */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-theme-secondary mb-1.5">
                        <span>Select Page</span>
                        <span className="font-mono text-xs font-bold text-indigo-500">
                          Page {pdfPage} of {pdfTotalPages}
                        </span>
                      </div>

                      {pdfTotalPages > 1 ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={pdfPage <= 1 || isProcessing}
                            onClick={() => handlePdfPageChange(pdfPage - 1)}
                            className="p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-all text-theme-primary cursor-pointer"
                            title="Previous Page"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <select
                            value={pdfPage}
                            onChange={(e) => handlePdfPageChange(Number(e.target.value))}
                            className="flex-1 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-theme-primary font-semibold focus:outline-none"
                          >
                            {Array.from({ length: pdfTotalPages }, (_, i) => i + 1).map((pg) => (
                              <option key={pg} value={pg}>
                                Page {pg} of {pdfTotalPages}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            disabled={pdfPage >= pdfTotalPages || isProcessing}
                            onClick={() => handlePdfPageChange(pdfPage + 1)}
                            className="p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-all text-theme-primary cursor-pointer"
                            title="Next Page"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs text-theme-secondary text-center">
                          Single page document (Page 1)
                        </div>
                      )}
                    </div>

                    {/* Rendering Resolution / Scale */}
                    <div>
                      <span className="text-xs text-theme-secondary block mb-1.5">
                        Rendering Resolution (DPI)
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { scale: 1.5, label: '1.5x Web' },
                          { scale: 2.0, label: '2.0x Retina' },
                          { scale: 3.0, label: '3.0x Ultra' },
                        ].map((item) => (
                          <button
                            key={item.scale}
                            type="button"
                            onClick={() => handlePdfFormatOrScaleChange(undefined, item.scale)}
                            className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center ${
                              pdfScale === item.scale
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Export Format */}
                    <div>
                      <span className="text-xs text-theme-secondary block mb-1.5">
                        Export Format
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['image/png', 'image/jpeg'] as const).map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => handlePdfFormatOrScaleChange(fmt, undefined)}
                            className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                              pdfTargetFormat === fmt
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {fmt === 'image/png' ? 'PNG (Sharp)' : 'JPG (Compact)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Multi-page ZIP Download Button */}
                    {pdfTotalPages > 1 && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleDownloadAllPdfPages}
                          disabled={isZippingPdf || isProcessing}
                          className="w-full py-2.5 px-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>
                            {isZippingPdf
                              ? 'Packaging ZIP Archive...'
                              : `Download All ${pdfTotalPages} Pages (ZIP)`}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 12. Favicon Generator */}
                {tool.id === 'favicon-generator' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-theme-primary">
                      <span className="font-bold block mb-1">Complete Icon Suite Included:</span>
                      <span className="text-theme-secondary text-[11px] leading-relaxed">
                        favicon-16x16, 32x32, 48x48, apple-touch-icon 180x180, android-chrome 192x192, and ready HTML code.
                      </span>
                    </div>
                  </div>
                )}

                {/* 13. Image Watermark Maker */}
                {tool.id === 'image-watermark-maker' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-theme-secondary block mb-1">
                        Watermark Text
                      </label>
                      <input
                        type="text"
                        value={wmText}
                        onChange={(e) => setWmText(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-theme-primary font-semibold"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1">
                        <span>Opacity</span>
                        <span className="font-mono text-indigo-500">{Math.round(wmOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={wmOpacity}
                        onChange={(e) => setWmOpacity(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-theme-secondary block mb-1">
                        Watermark Layout
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['tiled', 'single'] as const).map((pat) => (
                          <button
                            key={pat}
                            onClick={() => setWmPattern(pat)}
                            className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                              wmPattern === pat
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {pat === 'tiled' ? 'Tiled Grid (45°)' : 'Single Center'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 14. Cinematic Photo Filters */}
                {tool.id === 'image-filters' && (
                  <div className="space-y-4">
                    <span className="text-xs text-theme-secondary block mb-1">
                      Filter Presets
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'vintage', label: 'Vintage Warm' },
                        { id: 'noir', label: 'B&W Noir' },
                        { id: 'cyberpunk', label: 'Cyberpunk' },
                        { id: 'warm', label: 'Golden Hour' },
                        { id: 'sepia', label: 'Classic Sepia' },
                        { id: 'cool', label: 'Nordic Frost' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setActiveFilter(f.id as any)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            activeFilter === f.id
                              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                              : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1">
                        <span>Intensity</span>
                        <span className="font-mono text-indigo-500">{filterIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={filterIntensity}
                        onChange={(e) => setFilterIntensity(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 15. Brightness, Contrast & Sharpen Studio */}
                {tool.id === 'brightness-contrast-tool' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1">
                        <span>Brightness</span>
                        <span className="font-mono text-indigo-500">{toolBrightness > 0 ? `+${toolBrightness}` : toolBrightness}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={toolBrightness}
                        onChange={(e) => setToolBrightness(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1">
                        <span>Contrast</span>
                        <span className="font-mono text-indigo-500">{toolContrast > 0 ? `+${toolContrast}` : toolContrast}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={toolContrast}
                        onChange={(e) => setToolContrast(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1">
                        <span>Sharpen Detail</span>
                        <span className="font-mono text-indigo-500">{toolSharpen}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={toolSharpen}
                        onChange={(e) => setToolSharpen(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 16. Background & Privacy Blur Tool */}
                {/* 16. Privacy Blur & Pixelate Redactor */}
                {tool.id === 'image-blur-tool' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-theme-secondary block mb-1.5">
                        Redaction Mode
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'gaussian', label: 'Gaussian' },
                          { id: 'pixelate', label: 'Mosaic Pixel' },
                          { id: 'soft', label: 'Soft Portrait' },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setBlurMode(m.id as any)}
                            className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center ${
                              blurMode === m.id
                                ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1">
                        <span>{blurMode === 'pixelate' ? 'Mosaic Pixel Size' : 'Blur Intensity'}</span>
                        <span className="font-mono text-teal-500">{blurRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="50"
                        value={blurRadius}
                        onChange={(e) => setBlurRadius(Number(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Aspect Ratio Pad & No-Crop Social Expander */}
                {tool.id === 'aspect-ratio-pad' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-theme-secondary block mb-1.5">
                        Target Aspect Ratio
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: '1:1', label: '1:1 Square (Feed)' },
                          { id: '4:5', label: '4:5 Vertical (Instagram)' },
                          { id: '9:16', label: '9:16 Story (TikTok/Reels)' },
                          { id: '16:9', label: '16:9 Wide (YouTube)' },
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setAspectPadRatio(r.id as any)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                              aspectPadRatio === r.id
                                ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-theme-secondary block mb-1.5">
                        Background Fill
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'blur', label: 'Aesthetic Blur' },
                          { id: 'white', label: 'Clean White' },
                          { id: 'black', label: 'Pitch Black' },
                          { id: 'custom', label: 'Custom Color' },
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setAspectPadBgMode(b.id as any)}
                            className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                              aspectPadBgMode === b.id
                                ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {aspectPadBgMode === 'custom' && (
                      <div>
                        <span className="text-xs text-theme-secondary block mb-1">
                          Border Color
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={aspectPadBgColor}
                            onChange={(e) => setAspectPadBgColor(e.target.value)}
                            className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <span className="font-mono text-xs font-semibold text-theme-primary">
                            {aspectPadBgColor}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* EXIF Metadata Cleaner */}
                {tool.id === 'exif-metadata-remover' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verified Clean Status</span>
                      </div>
                      <div className="text-[11px] text-theme-secondary leading-relaxed">
                        Raw pixel stream extracted through sandboxed HTML5 Canvas. All EXIF binary chunks, GPS coordinates, device identifiers, and timestamps have been permanently stripped.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-theme-secondary block">
                        Purged Metadata Categories:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {[
                          'GPS Coordinates (Lat/Long)',
                          'Camera Make & Model',
                          'Lens & Shutter Speed',
                          'Exact Timestamp & Date',
                        ].map((tag, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center gap-1.5 text-theme-primary"
                          >
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span className="truncate">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-theme-secondary block mb-1">
                        Export Format
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['image/jpeg', 'image/png'] as const).map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setExifFormat(fmt)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                              exifFormat === fmt
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-theme-primary'
                            }`}
                          >
                            {fmt === 'image/jpeg' ? 'JPEG (Sanitized)' : 'PNG (Sanitized)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 17. Image Frame & Round Corner Studio */}
                {tool.id === 'border-corner-maker' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1">
                        <span>Corner Roundness</span>
                        <span className="font-mono text-indigo-500">{frameCornerRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={frameCornerRadius}
                        onChange={(e) => setFrameCornerRadius(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-theme-primary mb-1">
                        <span>Frame Border Width</span>
                        <span className="font-mono text-indigo-500">{frameBorderWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        value={frameBorderWidth}
                        onChange={(e) => setFrameBorderWidth(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-theme-secondary block mb-1.5">
                        Border Color
                      </span>
                      <div className="flex items-center gap-2">
                        {['#4F46E5', '#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#FFFFFF', '#000000'].map((col) => (
                          <button
                            key={col}
                            onClick={() => setFrameBorderColor(col)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              frameBorderColor === col ? 'scale-125 border-indigo-500 shadow-sm' : 'border-black/20'
                            }`}
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 18. QR Code Scanner & Decoder */}
                {tool.id === 'qr-code-reader' && (
                  <div className="space-y-4">
                    <span className="text-xs text-theme-secondary block mb-1">
                      Decoded Content
                    </span>
                    {decodedQrResult ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono break-all space-y-3">
                        <div>{decodedQrResult}</div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(decodedQrResult)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-sans text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedText === decodedQrResult ? 'Copied!' : 'Copy Text'}</span>
                          </button>
                          {decodedQrResult.startsWith('http') && (
                            <a
                              href={decodedQrResult}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-500 font-sans text-xs font-semibold flex items-center gap-1.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open URL</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs text-theme-muted">
                        Upload an image containing a QR code to extract its link or text.
                      </div>
                    )}
                  </div>
                )}

                {/* 19. Color Picker & Palette Extractor */}
                {tool.id === 'color-picker-palette' && (
                  <div className="space-y-4">
                    {/* Active Selected Pixel Loupe */}
                    <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary flex items-center gap-1.5">
                          <Pipette className="w-3.5 h-3.5 text-rose-500" />
                          Inspected Pixel Color
                        </span>
                        <span className="text-[10px] text-theme-muted">Tap image to sample</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl border border-black/10 dark:border-white/20 shadow-md shrink-0 transition-colors"
                          style={{ backgroundColor: pickedColor.hex }}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-theme-primary">
                              {pickedColor.hex}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(pickedColor.hex)}
                              className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[10px] font-semibold text-theme-primary transition-colors cursor-pointer"
                            >
                              {copiedText === pickedColor.hex ? 'Copied!' : 'Copy HEX'}
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-theme-muted">
                              {pickedColor.rgb}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(pickedColor.rgb)}
                              className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[10px] font-semibold text-theme-primary transition-colors cursor-pointer"
                            >
                              {copiedText === pickedColor.rgb ? 'Copied!' : 'Copy RGB'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-theme-secondary block mb-1">
                      Dominant Harmonic Palette
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {paletteColors.map((col, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => copyToClipboard(col)}
                          className="p-2 rounded-xl border border-black/5 dark:border-white/10 flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95 transition-all bg-black/5 dark:bg-white/5 cursor-pointer"
                        >
                          <span className="w-full h-8 rounded-lg shadow-inner" style={{ backgroundColor: col }} />
                          <span className="text-[10px] font-mono font-bold text-theme-primary">
                            {copiedText === col ? 'Copied!' : col}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleDownload}
                    disabled={(!resultBlob && tool.id !== 'qr-code-generator') || isProcessing}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {tool.id === 'pdf-to-image-converter'
                        ? `Download Page ${pdfPage} (${pdfTargetFormat === 'image/jpeg' ? 'JPG' : 'PNG'})`
                        : tool.id === 'favicon-generator'
                        ? 'Download Favicon Suite (ZIP)'
                        : 'Download Finished File'}
                    </span>
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HIGH-VALUE SEO EDUCATIONAL SECTION */}
        <section className="mt-10 pt-8 border-t border-black/5 dark:border-white/10">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-theme-primary mb-2">
              How to Use {tool.name}
            </h2>
            <p className="text-xs sm:text-sm text-theme-secondary">
              Step-by-step guidance for optimal results, zero compression artifacts, and privacy guarantees.
            </p>
          </div>

          {/* 3 Steps Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {guide.steps.map((st) => (
              <div key={st.step} className="glass-panel rounded-2xl p-5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs mb-3">
                  0{st.step}
                </div>
                <h3 className="text-sm font-bold text-theme-primary mb-1">
                  {st.title}
                </h3>
                <p className="text-xs text-theme-secondary leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          {/* How It Works & Architecture */}
          <div className="glass-panel rounded-2xl p-6 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-theme-primary">
                How It Works & Client-Side Privacy
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
              {guide.howItWorks}
            </p>
          </div>

          {/* FAQ Accordion */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <h3 className="text-base font-bold text-theme-primary">
                Frequently Asked Questions ({guide.faqs.length})
              </h3>
            </div>
            <div className="space-y-3">
              {guide.faqs.map((faq, idx) => {
                const isOpen = openToolFaq === idx;
                return (
                  <div key={idx} className="glass-panel rounded-2xl overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => setOpenToolFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-theme-primary">
                        {faq.question}
                      </span>
                      <span className="text-theme-muted shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-theme-secondary leading-relaxed border-t border-black/5 dark:border-white/10 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RELATED TOOLS */}
        <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/10">
          <h3 className="text-lg font-bold font-display text-theme-primary mb-4">
            Related Creative Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'image-compressor', name: 'Image Compressor', desc: 'Shrink file size up to 90%' },
              { id: 'image-resizer', name: 'Image Resizer', desc: 'Exact pixel dimensions & aspect ratio' },
              { id: 'signature-maker', name: 'Digital Signature Maker', desc: 'Draw smooth transparent signatures' },
              { id: 'qr-code-generator', name: 'QR Code Generator', desc: 'Permanent scannable QR matrices' },
            ].map((rel) => (
              <button
                key={rel.id}
                onClick={() => onSelectRelatedTool(rel.id)}
                className="glass-panel glass-panel-interactive rounded-2xl p-4 text-left transition-all"
              >
                <div className="text-xs font-bold text-theme-primary mb-1">
                  {rel.name}
                </div>
                <div className="text-[11px] text-theme-muted">
                  {rel.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
