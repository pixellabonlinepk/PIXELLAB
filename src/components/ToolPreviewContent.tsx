import React from 'react';
import portraitYoungWoman from '../assets/images/portrait_young_woman_1791695480567.jpg';
import landscapeAlpineLake from '../assets/images/landscape_alpine_lake_1791695494103.jpg';
import portraitAdultWoman from '../assets/images/portrait_adult_woman_1791695506600.jpg';
import portraitWomanRedBlazer from '../assets/images/portrait_woman_red_blazer_1791695816563.jpg';
import portraitYoungMan from '../assets/images/portrait_young_man_1791695520543.jpg';
import cartoonYoungMan from '../assets/images/cartoon_young_man_1791695763624.jpg';
import sunsetOceanCoastal from '../assets/images/sunset_ocean_coastal_1791695537299.jpg';
import faceBeautyCloseup from '../assets/images/face_beauty_closeup_1791695871827.jpg';
import faceRetouchSmooth from '../assets/images/face_retouch_smooth_1791695933370.jpg';
import qrScannable from '../assets/images/qr_preview_scannable.png';
import { ArrowRight, FileText, Check, Copy } from 'lucide-react';

interface ToolPreviewContentProps {
  toolId: string;
}

export const ToolPreviewContent: React.FC<ToolPreviewContentProps> = ({ toolId }) => {
  switch (toolId) {
    // 5. IMAGE COMPRESSOR
    case 'image-compressor':
      return (
        <div className="w-full h-full flex items-center gap-2">
          {/* Before: High-res uncompressed photo */}
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-slate-700/60 shadow-inner">
            <img
              src={landscapeAlpineLake}
              alt="Original uncompressed photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between text-[10px]">
              <span className="text-slate-300 font-medium">Original</span>
              <span className="text-slate-400 font-mono">2.8 MB</span>
            </div>
          </div>

          <div className="text-indigo-400 font-bold text-xs shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 border border-slate-700">
            →
          </div>

          {/* After: Crisp compressed photo */}
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-indigo-500/40 shadow-inner">
            <img
              src={landscapeAlpineLake}
              alt="Compressed photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-semibold font-mono">480 KB</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-800">
                -83%
              </span>
            </div>
          </div>
        </div>
      );

    // 6. IMAGE RESIZER
    case 'image-resizer':
      return (
        <div className="w-full h-full flex items-center gap-2">
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-slate-700/60 shadow-inner bg-slate-900">
            <img
              src={sunsetOceanCoastal}
              alt="Original 1920x1280 resolution"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[10px] font-mono text-slate-300 border border-slate-700/60">
              1920 × 1280 px
            </span>
          </div>

          <div className="text-teal-400 font-bold text-xs shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 border border-slate-700">
            →
          </div>

          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-teal-500/40 shadow-inner bg-slate-900 flex items-center justify-center p-2">
            <div className="w-4/5 h-4/5 rounded overflow-hidden relative border border-teal-500/30">
              <img
                src={sunsetOceanCoastal}
                alt="Resized 800x533"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-teal-950/90 backdrop-blur-sm text-[10px] font-mono text-teal-300 border border-teal-800/80">
              800 × 533 px
            </span>
          </div>
        </div>
      );

    // 7. IMAGE CROPPER
    case 'image-cropper':
      return (
        <div className="w-full h-full flex items-center gap-2">
          {/* Landscape photo with interactive crop overlay */}
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-slate-700/60 shadow-inner bg-slate-900">
            <img
              src={sunsetOceanCoastal}
              alt="Source landscape photo"
              className="w-full h-full object-cover"
            />
            {/* Dashed crop box overlay */}
            <div className="absolute inset-2 border-2 border-dashed border-pink-400 rounded bg-pink-400/10 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-white bg-pink-600/90 px-1.5 py-0.5 rounded">
                16:9
              </span>
            </div>
          </div>

          <div className="text-pink-400 font-bold text-xs shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 border border-slate-700">
            →
          </div>

          {/* Result of the cropped area */}
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-pink-500/40 shadow-inner bg-slate-900">
            <img
              src={sunsetOceanCoastal}
              alt="Cropped sunset view"
              className="w-full h-full object-cover object-center"
              style={{ transform: 'scale(1.25)' }}
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-pink-950/90 backdrop-blur-sm text-[10px] font-semibold text-pink-300 border border-pink-800/80">
              Cropped Output
            </span>
          </div>
        </div>
      );

    // 8. IMAGE FORMAT CONVERTER
    case 'image-format-converter':
      return (
        <div className="w-full h-full flex items-center justify-between gap-3 px-2">
          <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-700 shrink-0 shadow-md">
            <img
              src={landscapeAlpineLake}
              alt="Sample image format"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono">
              <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/60">
                JPG
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/60">
                PNG
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/60">
                WEBP
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Lossless & Alpha Transparent
            </span>
          </div>
        </div>
      );

    // 9. IMAGE ROTATOR
    case 'image-rotator':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700 shadow-md">
            <img
              src={sunsetOceanCoastal}
              alt="Original angle"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-cyan-400 font-bold text-sm">↻ 90°</div>
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-cyan-500/40 shadow-md">
            <img
              src={sunsetOceanCoastal}
              alt="Rotated 90 degrees"
              className="w-full h-full object-cover rotate-90 scale-125"
            />
          </div>
        </div>
      );

    // 10. IMAGE FLIPPER
    case 'image-flipper':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700 shadow-md">
            <img
              src={portraitYoungMan}
              alt="Original"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-blue-400 font-bold text-sm">⇄ Mirror</div>
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-blue-500/40 shadow-md">
            <img
              src={portraitYoungMan}
              alt="Horizontally flipped"
              className="w-full h-full object-cover -scale-x-100"
            />
          </div>
        </div>
      );

    // 11. IMAGE FILTERS
    case 'image-filters':
      return (
        <div className="w-full h-full flex items-center gap-2">
          {/* Main filtered photo */}
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-pink-500/40 shadow-inner">
            <img
              src={sunsetOceanCoastal}
              alt="Vintage styled photo"
              className="w-full h-full object-cover"
              style={{ filter: 'sepia(0.4) saturate(1.4) hue-rotate(-15deg)' }}
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-pink-950/90 text-[10px] font-semibold text-pink-300 border border-pink-800">
              Vintage Glow
            </span>
          </div>

          {/* Mini filter thumbnails */}
          <div className="flex flex-col gap-1 w-14 shrink-0">
            <div className="h-6 rounded overflow-hidden border border-slate-700 relative">
              <img
                src={sunsetOceanCoastal}
                alt="Noir"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>
            <div className="h-6 rounded overflow-hidden border border-slate-700 relative">
              <img
                src={sunsetOceanCoastal}
                alt="Cyber"
                className="w-full h-full object-cover hue-rotate-90 saturate-150"
              />
            </div>
            <div className="h-6 rounded overflow-hidden border border-slate-700 relative">
              <img
                src={sunsetOceanCoastal}
                alt="Warm"
                className="w-full h-full object-cover sepia-50"
              />
            </div>
          </div>
        </div>
      );

    // 12. BRIGHTNESS ADJUSTER
    case 'brightness-adjuster':
      return (
        <div className="w-full h-full flex items-center gap-2">
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-slate-700 shadow-inner">
            <img
              src={portraitYoungWoman}
              alt="Darker exposure"
              className="w-full h-full object-cover brightness-75"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300">
              -30%
            </span>
          </div>
          <div className="text-amber-400 font-bold text-xs shrink-0">→</div>
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-amber-500/40 shadow-inner">
            <img
              src={portraitYoungWoman}
              alt="Brightened"
              className="w-full h-full object-cover brightness-125"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-amber-950/90 text-[10px] font-semibold text-amber-300 border border-amber-800">
              +30% Bright
            </span>
          </div>
        </div>
      );

    // 13. CONTRAST ADJUSTER
    case 'contrast-adjuster':
      return (
        <div className="w-full h-full flex items-center gap-2">
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-slate-700 shadow-inner">
            <img
              src={landscapeAlpineLake}
              alt="Low contrast"
              className="w-full h-full object-cover contrast-75"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300">
              Low Contrast
            </span>
          </div>
          <div className="text-rose-400 font-bold text-xs shrink-0">→</div>
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-rose-500/40 shadow-inner">
            <img
              src={landscapeAlpineLake}
              alt="Punchy dynamic contrast"
              className="w-full h-full object-cover contrast-150 saturate-110"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-rose-950/90 text-[10px] font-semibold text-rose-300 border border-rose-800">
              Punchy Deep Contrast
            </span>
          </div>
        </div>
      );

    // 14. IMAGE BLUR TOOL
    case 'image-blur-tool':
      return (
        <div className="w-full h-full flex items-center gap-2">
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-slate-700 shadow-inner">
            <img
              src={sunsetOceanCoastal}
              alt="Sharp original"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300">
              Sharp
            </span>
          </div>
          <div className="text-teal-400 font-bold text-xs shrink-0">→</div>
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-teal-500/40 shadow-inner">
            <img
              src={sunsetOceanCoastal}
              alt="Gaussian blurred effect"
              className="w-full h-full object-cover blur-[3px]"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-teal-950/90 text-[10px] font-semibold text-teal-300 border border-teal-800">
              Soft Blur (12px)
            </span>
          </div>
        </div>
      );

    // 15. IMAGE SHARPEN TOOL
    case 'image-sharpen-tool':
      return (
        <div className="w-full h-full flex items-center gap-2">
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-slate-700 shadow-inner">
            <img
              src={landscapeAlpineLake}
              alt="Soft focus"
              className="w-full h-full object-cover blur-[0.6px]"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300">
              Soft
            </span>
          </div>
          <div className="text-emerald-400 font-bold text-xs shrink-0">→</div>
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-emerald-500/40 shadow-inner">
            <img
              src={landscapeAlpineLake}
              alt="High pass sharpened"
              className="w-full h-full object-cover contrast-125"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-950/90 text-[10px] font-semibold text-emerald-300 border border-emerald-800">
              Edge Sharpened
            </span>
          </div>
        </div>
      );

    // 16. IMAGE WATERMARK MAKER
    case 'image-watermark-maker':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative border border-violet-500/40 shadow-inner">
          <img
            src={landscapeAlpineLake}
            alt="Watermarked photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
            <span className="font-extrabold font-display text-white/70 tracking-widest text-lg sm:text-xl drop-shadow-lg -rotate-12 select-none border-2 border-white/40 px-3 py-1 rounded">
              © PIXAL LAB
            </span>
          </div>
          <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300">
            Protected
          </span>
        </div>
      );

    // 17. IMAGE BORDER MAKER
    case 'image-border-maker':
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-900 p-2">
          {/* Framed photo with white border mat */}
          <div className="w-4/5 h-full bg-white p-2 rounded shadow-lg flex items-center justify-center">
            <img
              src={sunsetOceanCoastal}
              alt="Framed coastal landscape"
              className="w-full h-full object-cover rounded-xs"
            />
          </div>
        </div>
      );

    // 18. ROUND CORNER MAKER
    case 'round-corner-maker':
      return (
        <div className="w-full h-full bg-checkerboard p-3 flex items-center justify-center">
          <div className="w-3/4 h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <img
              src={portraitYoungWoman}
              alt="Rounded corner avatar"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      );

    // 19. PHOTO COLLAGE MAKER
    case 'photo-collage-maker':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden bg-slate-900 border border-pink-500/30 p-1.5 grid grid-cols-2 gap-1.5 shadow-inner">
          <div className="rounded overflow-hidden">
            <img
              src={landscapeAlpineLake}
              alt="Collage 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded overflow-hidden">
            <img
              src={sunsetOceanCoastal}
              alt="Collage 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded overflow-hidden">
            <img
              src={portraitYoungWoman}
              alt="Collage 3"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="rounded overflow-hidden">
            <img
              src={faceRetouchSmooth}
              alt="Collage 4"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );

    // 20. WHATSAPP DP MAKER
    case 'whatsapp-dp-maker':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          {/* Circular avatar overlay with border ring */}
          <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
              <img
                src={portraitYoungWoman}
                alt="WhatsApp Profile Picture"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-slate-950 text-xs shadow">
              ✓
            </div>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1">
            <div className="text-emerald-400 font-bold">1:1 Square & Circle</div>
            <div className="text-slate-400">High-Resolution Avatar</div>
          </div>
        </div>
      );

    // 21. PASSPORT PHOTO RESIZER
    case 'passport-photo-resizer':
      return (
        <div className="w-full h-full flex items-center justify-center gap-4">
          <div className="w-20 h-24 bg-white p-1 rounded shadow-md relative overflow-hidden border border-slate-700">
            <img
              src={portraitYoungMan}
              alt="Passport photo portrait"
              className="w-full h-full object-cover object-top"
            />
            {/* Alignment guides */}
            <div className="absolute inset-1 border border-blue-400/50 rounded-xs pointer-events-none" />
          </div>
          <div className="text-[11px] text-slate-300 space-y-1">
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[10px] border border-blue-800">
              US 2×2 in · 600×600 px
            </span>
            <div className="text-slate-400 text-[10px]">
              300 DPI · Schengen / UK / India
            </div>
          </div>
        </div>
      );

    // 22. YOUTUBE THUMBNAIL MAKER
    case 'youtube-thumbnail-maker':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative border border-rose-500/40 shadow-inner group">
          <img
            src={sunsetOceanCoastal}
            alt="YouTube Thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2.5 flex flex-col justify-between">
            <span className="self-start px-2 py-0.5 rounded bg-red-600 text-[9px] font-bold text-white uppercase tracking-wider shadow">
              NEW 2026
            </span>
            <div>
              <div className="font-extrabold font-display text-white text-xs sm:text-sm drop-shadow-md leading-tight">
                SECRET PHOTO TRICKS
              </div>
              <div className="text-cyan-300 font-semibold text-[10px] mt-0.5">
                1280 × 720 HD Ready
              </div>
            </div>
          </div>
        </div>
      );

    // 23. MEME GENERATOR
    case 'meme-generator':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative border border-amber-500/40 shadow-inner">
          <img
            src={portraitYoungMan}
            alt="Meme base"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-x-0 top-1.5 text-center text-[11px] font-extrabold text-white tracking-wider font-sans drop-shadow-[0_2px_2px_rgba(0,0,0,1)] uppercase">
            WHEN THE CODE COMPILES
          </div>
          <div className="absolute inset-x-0 bottom-1.5 text-center text-[11px] font-extrabold text-white tracking-wider font-sans drop-shadow-[0_2px_2px_rgba(0,0,0,1)] uppercase">
            ON THE FIRST TRY
          </div>
        </div>
      );

    // 24. COLOR PICKER FROM IMAGE
    case 'color-picker-image':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative border border-teal-500/40 shadow-inner">
          <img
            src={sunsetOceanCoastal}
            alt="Color picker source"
            className="w-full h-full object-cover"
          />
          {/* Crosshair loupe sampling coastal flower color */}
          <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-700 shadow-xl flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-rose-500 border border-white/60 shadow" />
            <div className="text-[10px] font-mono text-white font-bold">
              #F43F5E
            </div>
          </div>
        </div>
      );

    // 25. COLOR PALETTE EXTRACTOR
    case 'color-palette-extractor':
      return (
        <div className="w-full h-full flex items-center gap-2 px-1">
          <div className="flex-1 h-full rounded-lg overflow-hidden border border-slate-700 shadow">
            <img
              src={sunsetOceanCoastal}
              alt="Palette source photo"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Harmonic color swatches matching row 3 col 4 of reference image */}
          <div className="flex flex-col gap-1 w-12 shrink-0">
            <div className="h-5 rounded bg-rose-500 shadow-sm" title="#F43F5E" />
            <div className="h-5 rounded bg-amber-500 shadow-sm" title="#F59E0B" />
            <div className="h-5 rounded bg-teal-500 shadow-sm" title="#14B8A6" />
            <div className="h-5 rounded bg-indigo-600 shadow-sm" title="#4F46E5" />
            <div className="h-5 rounded bg-slate-900 border border-slate-700 shadow-sm" title="#0F172A" />
          </div>
        </div>
      );

    // 26. QR CODE GENERATOR (Genuinely Scannable)
    case 'qr-code-generator':
      return (
        <div className="w-full h-full flex items-center justify-center gap-4">
          <div className="w-24 h-24 bg-white rounded-xl p-1.5 shadow-xl border border-slate-700 shrink-0 flex items-center justify-center">
            <img
              src={qrScannable}
              alt="Genuinely scannable QR Code to Pixal Lab"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-1 text-[10px] text-slate-300">
            <span className="px-2 py-0.5 rounded bg-blue-950/90 border border-blue-800 text-blue-300 font-semibold">
              ✓ 100% Scannable
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
              URL & WiFi
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
              Download PNG / SVG
            </span>
          </div>
        </div>
      );

    // 27. QR CODE READER
    case 'qr-code-reader':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-20 h-20 bg-white rounded-lg p-1 relative overflow-hidden shadow-md">
            <img
              src={qrScannable}
              alt="QR Code Scanner"
              className="w-full h-full object-contain"
            />
            {/* Laser scanner line */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>
          <div className="text-[10px] text-slate-300 space-y-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[9px] border border-cyan-800 block">
              https://pixallab.online
            </span>
            <div className="text-slate-400">Decoded safely in browser</div>
          </div>
        </div>
      );

    // 28. FAVICON GENERATOR
    case 'favicon-generator':
      return (
        <div className="w-full h-full flex items-center justify-center gap-4">
          <div className="flex items-end gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-4 h-4 rounded-xs overflow-hidden border border-cyan-400/80">
              <img src={sunsetOceanCoastal} alt="16x16" className="w-full h-full object-cover" />
            </div>
            <div className="w-8 h-8 rounded-xs overflow-hidden border border-cyan-400/80">
              <img src={sunsetOceanCoastal} alt="32x32" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 rounded-sm overflow-hidden border border-cyan-400/80">
              <img src={sunsetOceanCoastal} alt="48x48" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 space-y-0.5">
            <div className="text-white font-bold">Web Icon Pack</div>
            <div>16 · 32 · 48 · 180 px</div>
          </div>
        </div>
      );

    // 29. IMAGE TO PDF CONVERTER
    case 'image-to-pdf-converter':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-16 h-20 rounded-md overflow-hidden border border-rose-500/50 shadow-md relative">
            <img
              src={landscapeAlpineLake}
              alt="Image to be converted to PDF"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-rose-400 font-bold text-xs">→</div>
          <div className="w-16 h-20 rounded-md bg-rose-950/70 border border-rose-800 p-2 flex flex-col justify-between shadow-md">
            <span className="text-[9px] font-bold text-rose-300 bg-rose-900/60 px-1 py-0.5 rounded self-start">
              PDF
            </span>
            <div className="space-y-1">
              <div className="h-1 bg-rose-600/60 rounded w-full" />
              <div className="h-1 bg-rose-600/40 rounded w-4/5" />
            </div>
          </div>
        </div>
      );

    // 30. PDF TO IMAGE CONVERTER
    case 'pdf-to-image-converter':
      return (
        <div className="w-full h-full flex items-center justify-center gap-3">
          <div className="w-16 h-20 rounded-md bg-emerald-950/70 border border-emerald-800 p-2 flex flex-col justify-between shadow-md">
            <span className="text-[9px] font-bold text-emerald-300 bg-emerald-900/60 px-1 py-0.5 rounded self-start">
              PDF
            </span>
            <div className="space-y-1">
              <div className="h-1 bg-emerald-600/60 rounded w-full" />
              <div className="h-1 bg-emerald-600/40 rounded w-4/5" />
            </div>
          </div>
          <div className="text-emerald-400 font-bold text-xs">→</div>
          <div className="w-16 h-20 rounded-md overflow-hidden border border-emerald-500/50 shadow-md">
            <img
              src={landscapeAlpineLake}
              alt="Extracted image page"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );

    // 31. BATCH IMAGE RESIZER
    case 'batch-image-resizer':
      return (
        <div className="w-full h-full flex items-center gap-2">
          {/* Stack of original images */}
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-slate-700/60 shadow-inner">
            <img
              src={landscapeAlpineLake}
              alt="Original batch"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between text-[10px]">
              <span className="text-slate-300 font-medium">4 Photos</span>
              <span className="text-slate-400 font-mono">1920×1080</span>
            </div>
          </div>

          <div className="text-blue-400 font-bold text-xs shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 border border-slate-700">
            →
          </div>

          {/* Resized batch */}
          <div className="flex-1 h-full rounded-lg overflow-hidden relative border border-blue-500/40 shadow-inner">
            <img
              src={landscapeAlpineLake}
              alt="Batch resized"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between text-[10px]">
              <span className="text-blue-400 font-semibold font-mono">1024×768</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 text-[9px] font-bold border border-blue-800">
                ZIP
              </span>
            </div>
          </div>
        </div>
      );

    // 32. IMAGE SPLITTER
    case 'image-splitter':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative border border-violet-500/40 shadow-inner">
          <img
            src={landscapeAlpineLake}
            alt="Image to split"
            className="w-full h-full object-cover"
          />
          {/* 3x3 Grid Overlay */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="border border-white/60 border-dashed flex items-center justify-center"
              >
                <span className="text-[8px] font-mono text-white bg-black/60 px-1 rounded">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-800 text-violet-300 text-[9px] font-bold">
            3×3 Grid (9 Parts)
          </div>
        </div>
      );

    // 33. IMAGE JOINER
    case 'image-joiner':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative border border-indigo-500/40 shadow-inner flex bg-slate-950 p-1 gap-1 items-center justify-center">
          <div className="flex-1 h-full rounded overflow-hidden border border-slate-700">
            <img
              src={sunsetOceanCoastal}
              alt="Joined slice 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 h-full rounded overflow-hidden border border-slate-700">
            <img
              src={landscapeAlpineLake}
              alt="Joined slice 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 h-full rounded overflow-hidden border border-slate-700">
            <img
              src={portraitYoungWoman}
              alt="Joined slice 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-indigo-950/90 border border-indigo-800 text-indigo-300 text-[9px] font-bold">
            Stitched Panorama
          </div>
        </div>
      );

    // 34. SIGNATURE MAKER
    case 'signature-maker':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative border border-cyan-500/40 shadow-inner bg-checkerboard flex items-center justify-center p-2">
          <svg
            viewBox="0 0 500 240"
            className="w-full h-full object-contain filter drop-shadow-md"
          >
            {/* Elegant cursive signature */}
            <path
              d="M 50 140 Q 60 70 85 70 Q 110 70 100 160 Q 90 220 70 200 Q 60 170 110 130 T 150 140 Q 160 120 170 145 T 190 140 Q 210 80 215 150 T 245 140 Q 270 90 270 150 Q 290 80 320 100 Q 330 130 310 155 Q 290 155 315 135 T 350 140 Q 370 125 385 145 T 410 140 M 80 180 Q 250 170 430 165"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[9px] font-bold">
            Transparent PNG
          </div>
        </div>
      );

    // 35. PHOTO COLLAGE & DP MAKER
    case 'photo-collage-dp-maker':
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative border border-indigo-500/40 shadow-inner bg-gradient-to-br from-[#060a14] via-[#0d1428] to-[#160c2b] flex items-center justify-between p-2 select-none">
          {/* Ambient light glow behind */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-28 h-28 bg-blue-600/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 bg-violet-600/20 rounded-full blur-xl pointer-events-none" />

          {/* LEFT SIDE: BEFORE (6 separate portrait cards) */}
          <div className="relative z-10 flex flex-col items-start w-[42%] h-full justify-between py-0.5">
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full bg-blue-600/90 border border-blue-400/80 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-sm shadow-blue-500/50">
                Before
              </span>
              <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">6 Photos</span>
            </div>

            {/* 6 separate portrait photo cards (2 rows of 3, polaroid-style white/slate borders with slight natural rotation) */}
            <div className="w-full grid grid-cols-3 gap-1 my-auto">
              {/* Photo 1 */}
              <div className="aspect-[4/5] rounded bg-white p-[1.5px] shadow-md shadow-black/50 transform -rotate-3 hover:rotate-0 transition-transform">
                <img src={portraitYoungWoman} alt="P1" className="w-full h-full object-cover rounded-[2px]" />
              </div>
              {/* Photo 2 */}
              <div className="aspect-[4/5] rounded bg-white p-[1.5px] shadow-md shadow-black/50 transform rotate-2 hover:rotate-0 transition-transform">
                <img src={portraitYoungMan} alt="P2" className="w-full h-full object-cover rounded-[2px]" />
              </div>
              {/* Photo 3 */}
              <div className="aspect-[4/5] rounded bg-white p-[1.5px] shadow-md shadow-black/50 transform -rotate-1 hover:rotate-0 transition-transform">
                <img src={portraitAdultWoman} alt="P3" className="w-full h-full object-cover rounded-[2px]" />
              </div>
              {/* Photo 4 */}
              <div className="aspect-[4/5] rounded bg-white p-[1.5px] shadow-md shadow-black/50 transform rotate-3 hover:rotate-0 transition-transform">
                <img src={portraitWomanRedBlazer} alt="P4" className="w-full h-full object-cover rounded-[2px]" />
              </div>
              {/* Photo 5 */}
              <div className="aspect-[4/5] rounded bg-white p-[1.5px] shadow-md shadow-black/50 transform -rotate-2 hover:rotate-0 transition-transform">
                <img src={cartoonYoungMan} alt="P5" className="w-full h-full object-cover rounded-[2px]" />
              </div>
              {/* Photo 6 */}
              <div className="aspect-[4/5] rounded bg-white p-[1.5px] shadow-md shadow-black/50 transform rotate-1 hover:rotate-0 transition-transform">
                <img src={faceBeautyCloseup} alt="P6" className="w-full h-full object-cover rounded-[2px]" />
              </div>
            </div>

            <span className="text-[8px] text-slate-400 font-medium tracking-tight">Separate Portraits</span>
          </div>

          {/* CENTER: GLOWING CURVED ARROW */}
          <div className="relative z-10 flex flex-col items-center justify-center shrink-0 px-1">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
              viewBox="0 0 48 32"
              fill="none"
              stroke="url(#arrow-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="arrow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <path d="M 6 22 Q 22 6 38 14" />
              <polyline points="30,8 40,14 34,24" />
            </svg>
          </div>

          {/* RIGHT SIDE: AFTER (Stunning Circular Group Profile Picture) */}
          <div className="relative z-10 flex flex-col items-end w-[46%] h-full justify-between py-0.5">
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full bg-violet-600/90 border border-violet-400/80 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-sm shadow-violet-500/50">
                After
              </span>
              <span className="text-[9px] text-cyan-300 font-semibold hidden sm:inline">Group DP</span>
            </div>

            {/* Circular Group DP Layout */}
            <div className="relative w-24 h-24 my-auto flex items-center justify-center">
              {/* Paint splash / electric neon aura backdrop */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-indigo-500/40 to-pink-500/30 blur-md transform scale-110" />

              {/* Main Circular DP Container with glowing border */}
              <div className="relative w-22 h-22 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] bg-slate-950 flex items-center justify-center">
                {/* 6 Avatar Wedges / Orbiting Ring around center */}
                {/* 1. Top */}
                <div className="absolute top-0 inset-x-0 h-1/2 overflow-hidden flex justify-center">
                  <div className="w-10 h-10 -mt-1 rounded-full overflow-hidden border border-cyan-300/60 shadow-sm">
                    <img src={portraitYoungWoman} alt="M1" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* 2. Top-Right */}
                <div className="absolute top-2 right-0 w-8 h-8 rounded-full overflow-hidden border border-violet-300/60 shadow-sm z-10">
                  <img src={portraitYoungMan} alt="M2" className="w-full h-full object-cover" />
                </div>
                {/* 3. Bottom-Right */}
                <div className="absolute bottom-2 right-0 w-8 h-8 rounded-full overflow-hidden border border-pink-300/60 shadow-sm z-10">
                  <img src={portraitAdultWoman} alt="M3" className="w-full h-full object-cover" />
                </div>
                {/* 4. Bottom */}
                <div className="absolute bottom-0 inset-x-0 h-1/2 overflow-hidden flex justify-center items-end">
                  <div className="w-10 h-10 -mb-1 rounded-full overflow-hidden border border-emerald-300/60 shadow-sm">
                    <img src={portraitWomanRedBlazer} alt="M4" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* 5. Bottom-Left */}
                <div className="absolute bottom-2 left-0 w-8 h-8 rounded-full overflow-hidden border border-amber-300/60 shadow-sm z-10">
                  <img src={cartoonYoungMan} alt="M5" className="w-full h-full object-cover" />
                </div>
                {/* 6. Top-Left */}
                <div className="absolute top-2 left-0 w-8 h-8 rounded-full overflow-hidden border border-blue-300/60 shadow-sm z-10">
                  <img src={faceBeautyCloseup} alt="M6" className="w-full h-full object-cover" />
                </div>

                {/* Center Circle Portrait / Leader with glowing ring */}
                <div className="relative z-20 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  <img src={faceRetouchSmooth} alt="Center" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Decorative "Friends Forever" Script Label */}
              <div className="absolute -bottom-1 -right-2 z-30 px-1.5 py-0.2 rounded-md bg-slate-950/90 border border-violet-400/80 shadow-md backdrop-blur-sm flex items-center gap-0.5 transform rotate-[-6deg]">
                <span className="text-[8px] text-amber-300 leading-none">👑</span>
                <span className="text-[8px] font-bold text-white tracking-tight leading-none italic font-serif">
                  Friends Forever
                </span>
              </div>
            </div>

            <span className="text-[8px] text-cyan-300 font-medium tracking-tight">1:1 Squad Avatar</span>
          </div>
        </div>
      );

    // Default Fallback
    default:
      return (
        <div className="w-full h-full rounded-lg overflow-hidden relative">
          <img
            src={landscapeAlpineLake}
            alt="Pixal Lab tool sample"
            className="w-full h-full object-cover"
          />
        </div>
      );
  }
};
