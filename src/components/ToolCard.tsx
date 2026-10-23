import React from 'react';
import {
  Minimize2,
  Scaling,
  Layers,
  Crop,
  RefreshCw,
  CreditCard,
  UserCheck,
  Grid,
  Video,
  Smile,
  FileText,
  FileImage,
  QrCode,
  ArrowRight,
  Sparkles,
  Grid3X3,
  Columns,
  PenTool,
  Shield,
  Sliders,
  Sun,
  EyeOff,
  Square,
  ScanLine,
  Pipette,
  Maximize2,
  ShieldCheck,
} from 'lucide-react';
import { ToolMetadata } from '../types';
import { ToolPreviewContent } from './ToolPreviewContent';

interface ToolCardProps {
  tool: ToolMetadata;
  onSelect: (id: string) => void;
}

// Icon mapper for all 26 tools
const renderIcon = (name: string, className = 'w-4 h-4') => {
  switch (name) {
    case 'Minimize2':
      return <Minimize2 className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'Scaling':
      return <Scaling className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Crop':
      return <Crop className={className} />;
    case 'RefreshCw':
      return <RefreshCw className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'FileImage':
      return <FileImage className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Grid':
      return <Grid className={className} />;
    case 'Grid3X3':
      return <Grid3X3 className={className} />;
    case 'Columns':
      return <Columns className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'PenTool':
      return <PenTool className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Sliders':
      return <Sliders className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'EyeOff':
      return <EyeOff className={className} />;
    case 'Square':
      return <Square className={className} />;
    case 'QrCode':
      return <QrCode className={className} />;
    case 'ScanLine':
      return <ScanLine className={className} />;
    case 'Pipette':
      return <Pipette className={className} />;
    case 'Smile':
      return <Smile className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="glass-panel glass-panel-interactive rounded-3xl p-5 flex flex-col justify-between group cursor-pointer transition-all duration-300 relative overflow-hidden"
    >
      <div>
        {/* Apple Canvas Preview Window */}
        <div className="w-full h-36 rounded-2xl p-2.5 flex items-center justify-center relative overflow-hidden bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 mb-4 group-hover:border-indigo-500/30 transition-colors">
          <ToolPreviewContent toolId={tool.id} />
        </div>

        {/* Category & Badge Meta Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 shrink-0 group-hover:scale-105 transition-transform">
              {renderIcon(tool.icon, 'w-3.5 h-3.5')}
            </div>
            <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider truncate">
              {tool.categoryLabel}
            </span>
          </div>

          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-theme-muted">
            {tool.badge}
          </span>
        </div>

        {/* Tool Name */}
        <h3 className="text-base sm:text-lg font-bold font-display text-theme-primary group-hover:text-indigo-500 transition-colors mb-1.5">
          {tool.name}
        </h3>

        {/* 1-Sentence Concise Tagline */}
        <p className="text-xs text-theme-secondary leading-relaxed line-clamp-2 mb-4">
          {tool.tagline}
        </p>
      </div>

      {/* Apple-Style "Open Tool →" Glass Button */}
      <div className="pt-3 border-t border-black/5 dark:border-white/10 mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(tool.id);
          }}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-theme-primary group-hover:text-white bg-black/5 dark:bg-white/10 group-hover:bg-indigo-600 transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>Open Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
