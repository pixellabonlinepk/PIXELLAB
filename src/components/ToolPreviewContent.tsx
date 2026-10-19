import React from 'react';
import portraitYoungWoman from '../assets/images/portrait_young_woman_1791695480567.jpg';
import landscapeAlpineLake from '../assets/images/landscape_alpine_lake_1791695494103.jpg';
import portraitAdultWoman from '../assets/images/portrait_adult_woman_1791695506600.jpg';
import portraitWomanRedBlazer from '../assets/images/portrait_woman_red_blazer_1791695816563.jpg';
import portraitYoungMan from '../assets/images/portrait_young_man_1791695520543.jpg';
import sunsetOceanCoastal from '../assets/images/sunset_ocean_coastal_1791695537299.jpg';
import faceCloseup from '../assets/images/face_beauty_closeup_1791695871827.jpg';
import qrScannable from '../assets/images/qr_preview_scannable.png';
import { Check, QrCode, ScanLine, Pipette, PenTool, Shield, Sliders, Sun, EyeOff, Square, Grid3X3, Columns, FileImage } from 'lucide-react';

interface ToolPreviewContentProps {
  toolId: string;
}

export const ToolPreviewContent: React.FC<ToolPreviewContentProps> = ({ toolId }) => {
  switch (toolId) {
    // 1. IMAGE COMPRESSOR
    case 'image-compressor':
      return (
        <div className="w-full h-full flex items-center gap-2">
          <div className="flex-1 h-full rounded-xl overflow-hidden relative border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <img src={landscapeAlpineLake} alt="Original photo" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-[9px]">
              <span className="text-white/80 font-medium">Original</span>
              <span className="text-white font-mono">2.8 MB</span>
            </div>
          </div>
          <div className="text-indigo-500 font-bold text-xs shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-black/5 dark:bg-white/10">
            →
          </div>
          <div className="flex-1 h-full rounded-xl overflow-hidden relative border border-emerald-500/30 bg-emerald-500/5">
            <img src={landscapeAlpineLake} alt="Compressed photo" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-[9px]">
              <span className="text-emerald-300 font-mono font-bold">480 KB</span>
              <span className="px-1 py-0.2 rounded bg-emerald-500 text-white text-[8px] font-bold">
                -83%
              </span>
            </div>
          </div>
        </div>
      );

    // 2. IMAGE RESIZER
    case 'image-resizer':
      return (
        <div className="w-full h-full flex items-center gap-2">
          <div className="flex-1 h-full rounded-xl overflow-hidden relative border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <img src={sunsetOceanCoastal} alt="Original resolution" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[8px] font-mono text-white">
              1920 × 1080
            </span>
          </div>
          <div className="text-blue-500 font-bold text-xs shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-black/5 dark:bg-white/10">
            →
          </div>
          <div className="flex-1 h-full rounded-xl overflow-hidden relative border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-center p-2">
            <div className="w-3/4 h-3/4 rounded-lg overflow-hidden relative border border-blue-500/40">
              <img src={sunsetOceanCoastal} alt="Scaled resolution" className="w-full h-full object-cover" />
              <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-black/70 text-[8px] font-mono text-white">
                800 × 450
              </span>
            </div>
          </div>
        </div>
      );

    // 3. BATCH IMAGE RESIZER
    case 'batch-image-resizer':
      return (
        <div className="w-full h-full relative flex items-center justify-center">
          <div className="absolute w-28 h-20 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 transform -rotate-6 translate-x-4 opacity-50">
            <img src={portraitAdultWoman} alt="Batch photo 1" className="w-full h-full object-cover" />
          </div>
          <div className="absolute w-28 h-20 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 transform rotate-3 -translate-x-3 opacity-75">
            <img src={sunsetOceanCoastal} alt="Batch photo 2" className="w-full h-full object-cover" />
          </div>
          <div className="relative w-32 h-22 rounded-xl overflow-hidden border border-indigo-500/40 shadow-lg z-10">
            <img src={landscapeAlpineLake} alt="Batch photo 3" className="w-full h-full object-cover" />
            <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-xs">
              +12 Photos
            </div>
          </div>
        </div>
      );

    // 4. IMAGE CROPPER
    case 'image-cropper':
      return (
        <div className="w-full h-full rounded-xl overflow-hidden relative border border-black/5 dark:border-white/10">
          <img src={portraitYoungWoman} alt="Cropping preview" className="w-full h-full object-cover opacity-85" />
          <div className="absolute inset-3 border-2 border-dashed border-white rounded-lg shadow-2xl flex flex-col justify-between p-1.5 bg-black/20 backdrop-blur-[1px]">
            <div className="flex justify-between items-center text-[8px] text-white font-mono bg-black/60 px-1.5 py-0.5 rounded w-max">
              1:1 Square
            </div>
            <div className="self-end text-[8px] font-mono text-white bg-indigo-600/90 px-1.5 py-0.5 rounded">
              800 × 800
            </div>
          </div>
        </div>
      );

    // 5. IMAGE FORMAT CONVERTER
    case 'image-format-converter':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-black/5 dark:bg-white/10 text-theme-primary">
              PNG
            </span>
            <span className="text-indigo-500 font-bold">→</span>
            <span className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-600 text-white shadow-xs">
              WEBP
            </span>
            <span className="text-indigo-500 font-bold">→</span>
            <span className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-black/5 dark:bg-white/10 text-theme-primary">
              JPG
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
            <Check className="w-3 h-3" /> Alpha transparency preserved
          </span>
        </div>
      );

    // 6. IMAGE TO PDF CONVERTER
    case 'image-to-pdf-converter':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-16 h-22 rounded-md bg-white text-slate-800 shadow-md p-1.5 flex flex-col justify-between border border-black/10">
            <div className="w-full h-1.5 rounded bg-indigo-500/30" />
            <div className="w-3/4 h-1 rounded bg-slate-200" />
            <div className="w-full h-10 rounded overflow-hidden">
              <img src={landscapeAlpineLake} alt="PDF preview page" className="w-full h-full object-cover" />
            </div>
            <span className="text-[7px] font-mono text-slate-400 self-end">A4 PDF</span>
          </div>
          <div className="text-left space-y-1">
            <div className="text-xs font-bold text-theme-primary">Printable PDF</div>
            <div className="text-[10px] text-theme-secondary">Multi-page layout</div>
            <span className="inline-block px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[9px] font-bold">
              High Resolution
            </span>
          </div>
        </div>
      );

    // 7. PDF TO IMAGE CONVERTER
    case 'pdf-to-image-converter':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-14 h-20 rounded bg-rose-500/10 border border-rose-500/20 flex flex-col items-center justify-center p-2 text-rose-500">
            <FileImage className="w-6 h-6 mb-1" />
            <span className="text-[8px] font-mono font-bold">.PDF</span>
          </div>
          <span className="text-indigo-500 font-bold">→</span>
          <div className="w-16 h-20 rounded-md overflow-hidden border border-emerald-500/40 relative">
            <img src={landscapeAlpineLake} alt="Rendered page" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-emerald-600 text-white text-[7.5px] font-bold font-mono">
              PNG / JPG
            </span>
          </div>
        </div>
      );

    // 8. FAVICON GENERATOR
    case 'favicon-generator':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1.5px] shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-white dark:bg-black flex items-center justify-center">
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                P
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-[9px] font-mono text-theme-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-500/20 text-indigo-500 text-[7px] flex items-center justify-center font-bold">16</span>
              <span>favicon-16x16</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-blue-500/20 text-blue-500 text-[7px] flex items-center justify-center font-bold">32</span>
              <span>favicon-32x32</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-xs bg-cyan-500/20 text-cyan-500 text-[7px] flex items-center justify-center font-bold">180</span>
              <span>apple-touch-icon</span>
            </div>
          </div>
        </div>
      );

    // 9. PASSPORT & ID PHOTO RESIZER
    case 'passport-photo-resizer':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-20 h-26 rounded-lg overflow-hidden relative border-2 border-blue-500/60 shadow-md">
            <img src={portraitWomanRedBlazer} alt="Passport specimen" className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/70 text-[8px] font-mono text-white">
              35×45mm
            </div>
            <div className="absolute bottom-1 inset-x-1 text-center bg-blue-600/90 text-white text-[7.5px] font-bold rounded py-0.2">
              Pakistan / CNIC
            </div>
          </div>
          <div className="text-left space-y-1">
            <div className="text-[11px] font-bold text-theme-primary">Official Standards</div>
            <div className="text-[9px] text-theme-muted font-mono">35×45 mm / 2×2 in</div>
            <div className="text-[9px] text-emerald-500 font-semibold">300 DPI High-Res Print</div>
          </div>
        </div>
      );

    // 10. WHATSAPP & SOCIAL DP MAKER
    case 'whatsapp-dp-maker':
      return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-xl">
          <img src={portraitYoungMan} alt="Blur backdrop" className="absolute inset-0 w-full h-full object-cover filter blur-md scale-125 opacity-60" />
          <div className="relative w-20 h-20 rounded-full border-2 border-white shadow-xl overflow-hidden">
            <img src={portraitYoungMan} alt="DP Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-bold">
            No Crop DP
          </div>
        </div>
      );

    // 11. PHOTO COLLAGE & SQUAD DP MAKER
    case 'photo-collage-dp-maker':
      return (
        <div className="w-full h-full grid grid-cols-2 gap-1.5 p-1 rounded-xl">
          <div className="rounded-lg overflow-hidden border border-black/5 dark:border-white/10">
            <img src={portraitYoungWoman} alt="Squad 1" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-lg overflow-hidden border border-black/5 dark:border-white/10">
            <img src={portraitAdultWoman} alt="Squad 2" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-lg overflow-hidden border border-black/5 dark:border-white/10">
            <img src={portraitWomanRedBlazer} alt="Squad 3" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-lg overflow-hidden border border-black/5 dark:border-white/10">
            <img src={portraitYoungMan} alt="Squad 4" className="w-full h-full object-cover" />
          </div>
        </div>
      );

    // 12. INSTAGRAM GRID & IMAGE SPLITTER
    case 'image-splitter':
      return (
        <div className="w-full h-full p-2 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-1 w-32 h-24 rounded-lg overflow-hidden border border-pink-500/30 p-1 bg-black/5 dark:bg-white/5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
              <div key={idx} className="rounded-xs overflow-hidden relative border border-white/20">
                <img src={landscapeAlpineLake} alt={`Tile ${idx}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0.5 right-0.5 text-[6px] font-mono text-white bg-black/60 px-0.5 rounded">
                  {idx}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    // 13. IMAGE JOINER
    case 'image-joiner':
      return (
        <div className="w-full h-full flex items-center justify-center p-2 gap-1">
          <div className="w-16 h-20 rounded-l-lg overflow-hidden border border-indigo-500/40 relative">
            <img src={landscapeAlpineLake} alt="Left photo" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 text-[7px] text-white bg-black/60 px-1 rounded">Photo 1</span>
          </div>
          <div className="w-0.5 h-16 bg-indigo-500 rounded-full" />
          <div className="w-16 h-20 rounded-r-lg overflow-hidden border border-indigo-500/40 relative">
            <img src={sunsetOceanCoastal} alt="Right photo" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 right-1 text-[7px] text-white bg-black/60 px-1 rounded">Photo 2</span>
          </div>
        </div>
      );

    // 14. YOUTUBE THUMBNAIL MAKER
    case 'youtube-thumbnail-maker':
      return (
        <div className="w-full h-full rounded-xl overflow-hidden relative border border-black/5 dark:border-white/10">
          <img src={landscapeAlpineLake} alt="Thumbnail bg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-2.5">
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[8px] font-black w-max uppercase tracking-wider mb-1">
              HD 16:9
            </span>
            <div className="text-xs font-black text-white leading-tight uppercase font-display drop-shadow-md">
              Epic Video Title
            </div>
          </div>
        </div>
      );

    // 15. DIGITAL SIGNATURE MAKER
    case 'signature-maker':
      return (
        <div className="w-full h-full rounded-xl border border-black/10 dark:border-white/15 bg-checkerboard flex flex-col items-center justify-center p-3 relative overflow-hidden">
          <svg className="w-36 h-16 text-indigo-600 dark:text-cyan-400" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 20 60 Q 40 20 60 50 T 100 30 Q 130 10 150 45 T 180 35" />
            <path d="M 50 65 L 170 55" strokeWidth="2" strokeDasharray="4 2" />
          </svg>
          <div className="absolute bottom-1 right-2 px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[7.5px] font-bold">
            Transparent PNG
          </div>
        </div>
      );

    // 16. IMAGE WATERMARK MAKER
    case 'image-watermark-maker':
      return (
        <div className="w-full h-full rounded-xl overflow-hidden relative border border-black/5 dark:border-white/10">
          <img src={landscapeAlpineLake} alt="Watermark preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center transform -rotate-12 pointer-events-none">
            <span className="text-white/60 font-black text-xs sm:text-sm tracking-widest uppercase border-2 border-white/40 px-3 py-1 rounded-lg backdrop-blur-[1px]">
              © COPYRIGHT PIXAL LAB
            </span>
          </div>
        </div>
      );

    // 17. CINEMATIC PHOTO FILTERS
    case 'image-filters':
      return (
        <div className="w-full h-full flex rounded-xl overflow-hidden border border-black/5 dark:border-white/10">
          <div className="flex-1 h-full relative overflow-hidden">
            <img src={faceCloseup} alt="Original filter" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 text-[7px] text-white bg-black/60 px-1 rounded">Raw</span>
          </div>
          <div className="w-0.5 h-full bg-violet-500 z-10" />
          <div className="flex-1 h-full relative overflow-hidden">
            <img src={faceCloseup} alt="Cyberpunk filter" className="w-full h-full object-cover filter contrast-125 saturate-150 hue-rotate-15" />
            <span className="absolute bottom-1 right-1 text-[7px] text-white bg-violet-600 px-1 rounded font-bold">Cyberpunk</span>
          </div>
        </div>
      );

    // 18. BRIGHTNESS, CONTRAST & SHARPEN STUDIO
    case 'brightness-contrast-tool':
      return (
        <div className="w-full h-full flex rounded-xl overflow-hidden border border-black/5 dark:border-white/10">
          <div className="flex-1 h-full relative overflow-hidden">
            <img src={portraitAdultWoman} alt="Dim original" className="w-full h-full object-cover filter brightness-75 contrast-75" />
            <span className="absolute bottom-1 left-1 text-[7px] text-white bg-black/60 px-1 rounded">Dim</span>
          </div>
          <div className="w-0.5 h-full bg-amber-400 z-10" />
          <div className="flex-1 h-full relative overflow-hidden">
            <img src={portraitAdultWoman} alt="Enhanced bright" className="w-full h-full object-cover filter brightness-110 contrast-125" />
            <span className="absolute bottom-1 right-1 text-[7px] text-white bg-amber-500 px-1 rounded font-bold">Crisp & Vivid</span>
          </div>
        </div>
      );

    // 19. BACKGROUND & PRIVACY BLUR TOOL
    case 'image-blur-tool':
      return (
        <div className="w-full h-full rounded-xl overflow-hidden relative border border-black/5 dark:border-white/10">
          <img src={portraitYoungWoman} alt="Blurred scene" className="w-full h-full object-cover filter blur-[3px] scale-105" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1.5 shadow-lg">
              <EyeOff className="w-3 h-3 text-cyan-400" />
              <span>Gaussian Blur Active</span>
            </div>
          </div>
        </div>
      );

    // 20. IMAGE FRAME & ROUND CORNER STUDIO
    case 'border-corner-maker':
      return (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-28 h-24 rounded-3xl overflow-hidden border-4 border-indigo-500 shadow-xl relative">
            <img src={sunsetOceanCoastal} alt="Rounded border" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 inset-x-2 text-center text-[7px] font-bold text-white bg-black/60 rounded py-0.5">
              Squircle Frame
            </span>
          </div>
        </div>
      );

    // 21. QR CODE GENERATOR
    case 'qr-code-generator':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-20 h-20 p-1.5 rounded-xl bg-white shadow-md flex items-center justify-center border border-black/10">
            <img src={qrScannable} alt="Scannable QR" className="w-full h-full object-contain" />
          </div>
          <div className="text-left space-y-1">
            <div className="text-xs font-bold text-theme-primary">Instant Scan</div>
            <div className="text-[10px] text-theme-muted font-mono">https://pixallab.online</div>
            <div className="text-[9px] text-emerald-500 font-semibold">Static & Permanent</div>
          </div>
        </div>
      );

    // 22. QR CODE SCANNER & DECODER
    case 'qr-code-reader':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-18 h-18 p-1.5 rounded-xl bg-white shadow-md relative overflow-hidden border border-emerald-500/40">
            <img src={qrScannable} alt="Scan target" className="w-full h-full object-contain" />
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
          </div>
          <div className="text-left space-y-1">
            <div className="text-xs font-bold text-theme-primary">Decoded Link</div>
            <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-mono font-bold truncate max-w-[120px]">
              pixallab.online
            </div>
            <div className="text-[9px] text-theme-muted">In-Browser jsQR</div>
          </div>
        </div>
      );

    // 23. IMAGE COLOR PICKER & PALETTE EXTRACTOR
    case 'color-picker-palette':
      return (
        <div className="w-full h-full flex flex-col justify-center items-center p-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 shadow-md flex items-center justify-center overflow-hidden relative">
              <img src={sunsetOceanCoastal} alt="Loupe view" className="w-full h-full object-cover scale-150" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Pipette className="w-3.5 h-3.5 text-white drop-shadow-md" />
              </div>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono font-bold text-theme-primary">#4F46E5</div>
              <div className="text-[8px] font-mono text-theme-muted">RGB(79, 70, 229)</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {['#4F46E5', '#38BDF8', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'].map((color) => (
              <span key={color} className="w-5 h-5 rounded-md shadow-xs border border-white/20" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      );

    // 24. MEME GENERATOR
    case 'meme-generator':
    default:
      return (
        <div className="w-full h-full rounded-xl overflow-hidden relative border border-black/5 dark:border-white/10 bg-black flex items-center justify-center">
          <img src={sunsetOceanCoastal} alt="Meme template" className="w-full h-full object-cover opacity-80" />
          <div className="absolute top-1 inset-x-2 text-center text-xs font-black text-white uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)] tracking-wider">
            When it works
          </div>
          <div className="absolute bottom-1 inset-x-2 text-center text-xs font-black text-white uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)] tracking-wider">
            Client-Side Only
          </div>
        </div>
      );
  }
};
