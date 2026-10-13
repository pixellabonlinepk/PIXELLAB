import React from 'react';
import {
  Sparkles,
  Wand2,
  Maximize2,
  Shirt,
  Minimize2,
  Scaling,
  Crop,
  RefreshCw,
  RotateCw,
  FlipHorizontal,
  SlidersHorizontal,
  Sun,
  CircleDot,
  Droplets,
  Stamp,
  Square,
  BoxSelect,
  LayoutGrid,
  UserCheck,
  CreditCard,
  Video,
  Smile,
  Pipette,
  Palette,
  QrCode,
  Scan,
  FileCode2,
  FileText,
  FileImage,
  ArrowRight,
  Check,
  Layers,
  Grid,
  Combine,
  PenTool,
} from 'lucide-react';
import { ToolMetadata } from '../types';
import { ToolPreviewContent } from './ToolPreviewContent';
import { useTheme } from '../context/ThemeContext';

interface ToolCardProps {
  tool: ToolMetadata;
  onSelect: (id: string) => void;
}

// Icon mapper
const renderIcon = (name: string, className = 'w-6 h-6') => {
  switch (name) {
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Wand2':
      return <Wand2 className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Minimize2':
      return <Minimize2 className={className} />;
    case 'Scaling':
      return <Scaling className={className} />;
    case 'Crop':
      return <Crop className={className} />;
    case 'RefreshCw':
      return <RefreshCw className={className} />;
    case 'RotateCw':
      return <RotateCw className={className} />;
    case 'FlipHorizontal':
      return <FlipHorizontal className={className} />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'CircleDot':
      return <CircleDot className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Sparkle':
      return <Sparkles className={className} />;
    case 'Stamp':
      return <Stamp className={className} />;
    case 'Square':
      return <Square className={className} />;
    case 'BoxSelect':
      return <BoxSelect className={className} />;
    case 'LayoutGrid':
      return <LayoutGrid className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'Smile':
      return <Smile className={className} />;
    case 'Pipette':
      return <Pipette className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'QrCode':
      return <QrCode className={className} />;
    case 'Scan':
      return <Scan className={className} />;
    case 'FileCode2':
      return <FileCode2 className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'FileImage':
      return <FileImage className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Grid':
      return <Grid className={className} />;
    case 'Combine':
      return <Combine className={className} />;
    case 'PenTool':
      return <PenTool className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

// Color palettes for cards based on theme
const getColorStyles = (color: ToolMetadata['themeColor'], theme: 'light' | 'dark') => {
  if (theme === 'light') {
    switch (color) {
      case 'blue':
        return {
          cardBg: 'bg-white hover:bg-blue-50/20',
          border: 'border-slate-200/90 hover:border-blue-400/80',
          iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
          badge: 'text-blue-700 bg-blue-50 border-blue-200',
          btnGrad: 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-600/20',
          checkColor: 'text-blue-600',
        };
      case 'emerald':
        return {
          cardBg: 'bg-white hover:bg-emerald-50/20',
          border: 'border-slate-200/90 hover:border-emerald-400/80',
          iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
          badge: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          btnGrad: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20',
          checkColor: 'text-emerald-600',
        };
      case 'pink':
      case 'rose':
        return {
          cardBg: 'bg-white hover:bg-rose-50/20',
          border: 'border-slate-200/90 hover:border-rose-400/80',
          iconBg: 'bg-pink-600 text-white shadow-pink-500/20',
          badge: 'text-pink-700 bg-pink-50 border-pink-200',
          btnGrad: 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-600/20',
          checkColor: 'text-pink-600',
        };
      case 'violet':
      case 'purple':
        return {
          cardBg: 'bg-white hover:bg-purple-50/20',
          border: 'border-slate-200/90 hover:border-purple-400/80',
          iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
          badge: 'text-purple-700 bg-purple-50 border-purple-200',
          btnGrad: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/20',
          checkColor: 'text-purple-600',
        };
      case 'amber':
        return {
          cardBg: 'bg-white hover:bg-amber-50/20',
          border: 'border-slate-200/90 hover:border-amber-400/80',
          iconBg: 'bg-amber-600 text-white shadow-amber-500/20',
          badge: 'text-amber-800 bg-amber-50 border-amber-200',
          btnGrad: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/20',
          checkColor: 'text-amber-600',
        };
      case 'cyan':
      case 'teal':
        return {
          cardBg: 'bg-white hover:bg-cyan-50/20',
          border: 'border-slate-200/90 hover:border-cyan-400/80',
          iconBg: 'bg-cyan-600 text-white shadow-cyan-500/20',
          badge: 'text-cyan-800 bg-cyan-50 border-cyan-200',
          btnGrad: 'from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/20',
          checkColor: 'text-cyan-600',
        };
      default:
        return {
          cardBg: 'bg-white hover:bg-indigo-50/20',
          border: 'border-slate-200/90 hover:border-indigo-400/80',
          iconBg: 'bg-indigo-600 text-white shadow-indigo-500/20',
          badge: 'text-indigo-700 bg-indigo-50 border-indigo-200',
          btnGrad: 'from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/20',
          checkColor: 'text-indigo-600',
        };
    }
  }

  // Dark Theme
  switch (color) {
    case 'blue':
      return {
        cardBg: 'bg-gradient-to-b from-blue-950/20 via-[#0b1022]/85 to-[#060913]/95 backdrop-blur-md',
        border: 'border-blue-500/25 hover:border-blue-400/60',
        iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25',
        badge: 'text-blue-300 bg-blue-950/80 border-blue-700/50',
        btnGrad: 'from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-600/20',
        checkColor: 'text-blue-400',
        glowShadow: 'shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(59,130,246,0.2)]',
      };
    case 'emerald':
      return {
        cardBg: 'bg-gradient-to-b from-emerald-950/20 via-[#0b1022]/85 to-[#060913]/95 backdrop-blur-md',
        border: 'border-emerald-500/25 hover:border-emerald-400/60',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25',
        badge: 'text-emerald-300 bg-emerald-950/80 border-emerald-700/50',
        btnGrad: 'from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-600/20',
        checkColor: 'text-emerald-400',
        glowShadow: 'shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(16,185,129,0.2)]',
      };
    case 'pink':
    case 'rose':
      return {
        cardBg: 'bg-gradient-to-b from-rose-950/20 via-[#0b1022]/85 to-[#060913]/95 backdrop-blur-md',
        border: 'border-rose-500/25 hover:border-rose-400/60',
        iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/25',
        badge: 'text-pink-300 bg-pink-950/80 border-pink-700/50',
        btnGrad: 'from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 shadow-pink-600/20',
        checkColor: 'text-pink-400',
        glowShadow: 'shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(244,63,94,0.2)]',
      };
    case 'violet':
    case 'purple':
      return {
        cardBg: 'bg-gradient-to-b from-purple-950/20 via-[#0b1022]/85 to-[#060913]/95 backdrop-blur-md',
        border: 'border-purple-500/25 hover:border-purple-400/60',
        iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25',
        badge: 'text-purple-300 bg-purple-950/80 border-purple-700/50',
        btnGrad: 'from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 shadow-purple-600/20',
        checkColor: 'text-purple-400',
        glowShadow: 'shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(168,85,247,0.2)]',
      };
    case 'amber':
      return {
        cardBg: 'bg-gradient-to-b from-amber-950/20 via-[#0b1022]/85 to-[#060913]/95 backdrop-blur-md',
        border: 'border-amber-500/25 hover:border-amber-400/60',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25',
        badge: 'text-amber-300 bg-amber-950/80 border-amber-700/50',
        btnGrad: 'from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 shadow-amber-600/20',
        checkColor: 'text-amber-400',
        glowShadow: 'shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.2)]',
      };
    case 'cyan':
    case 'teal':
      return {
        cardBg: 'bg-gradient-to-b from-cyan-950/20 via-[#0b1022]/85 to-[#060913]/95 backdrop-blur-md',
        border: 'border-cyan-500/25 hover:border-cyan-400/60',
        iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25',
        badge: 'text-cyan-300 bg-cyan-950/80 border-cyan-700/50',
        btnGrad: 'from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 shadow-cyan-600/20',
        checkColor: 'text-cyan-400',
        glowShadow: 'shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(6,182,212,0.2)]',
      };
    default:
      return {
        cardBg: 'bg-gradient-to-b from-indigo-950/20 via-[#0b1022]/85 to-[#060913]/95 backdrop-blur-md',
        border: 'border-indigo-500/25 hover:border-indigo-400/60',
        iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25',
        badge: 'text-indigo-300 bg-indigo-950/80 border-indigo-700/50',
        btnGrad: 'from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-indigo-600/20',
        checkColor: 'text-indigo-400',
        glowShadow: 'shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(99,102,241,0.2)]',
      };
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const { theme } = useTheme();
  const styles = getColorStyles(tool.themeColor, theme);

  return (
    <div
      onClick={() => onSelect(tool.id)}
      className={`group relative flex flex-col justify-between rounded-[22px] p-5 sm:p-6 ${styles.cardBg} border ${styles.border} ${
        theme === 'dark'
          ? (styles as any).glowShadow || 'shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(99,102,241,0.2)]'
          : 'shadow-md shadow-slate-200/70 hover:shadow-xl hover:shadow-slate-300/50'
      } hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden`}
    >
      {/* Top ambient sheen highlight for premium glass depth */}
      {theme === 'dark' && (
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent group-hover:via-cyan-400/60 transition-colors pointer-events-none" />
      )}

      {/* Top section: Icon, Title, Badge, Description */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Icon Container */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${styles.iconBg} shrink-0 group-hover:scale-105 transition-transform`}
          >
            {renderIcon(tool.icon, 'w-6 h-6')}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border ${styles.badge} shrink-0`}
            >
              {tool.badge}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-lg font-bold mb-1.5 tracking-tight font-display transition-colors ${
            theme === 'dark'
              ? 'text-white group-hover:text-cyan-300'
              : 'text-slate-900 group-hover:text-blue-600'
          }`}
        >
          {tool.name}
        </h3>

        {/* Short description */}
        <p
          className={`text-xs line-clamp-2 leading-relaxed mb-4 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {tool.description}
        </p>

        {/* Feature Checkpoints */}
        <div className="space-y-1.5 mb-5">
          {tool.features.slice(0, 4).map((feat, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${styles.checkColor} shrink-0 stroke-[2.5]`} />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Photographic Visual Preview Container */}
      <div className="my-3">
        <div
          className={`w-full h-36 rounded-xl p-2 flex items-center justify-center relative overflow-hidden transition-all duration-200 border ${
            theme === 'dark'
              ? 'bg-[#060913]/90 border-slate-800/80 group-hover:border-slate-700/80 shadow-inner'
              : 'bg-slate-100/90 border-slate-200 group-hover:border-slate-300'
          }`}
        >
          <ToolPreviewContent toolId={tool.id} />
        </div>
      </div>

      {/* Bottom: Try Now Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(tool.id);
          }}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${styles.btnGrad} shadow-md flex items-center justify-center gap-1.5 transition-all group-hover:scale-[1.01] active:scale-[0.98]`}
        >
          <span>Try Now</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
