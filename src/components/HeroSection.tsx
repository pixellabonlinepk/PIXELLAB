import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';
import { ToolMetadata } from '../types';
import { TOOLS } from '../data/tools';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSelectTool: (toolId: string) => void;
  onSearchQueryChange?: (q: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onSelectTool,
  onSearchQueryChange,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ToolMetadata[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchQueryChange) onSearchQueryChange(val);

    if (val.trim()) {
      const matched = TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(val.toLowerCase()) ||
          t.description.toLowerCase().includes(val.toLowerCase()) ||
          t.categoryLabel.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6);
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  const QUICK_CATEGORY_GLASS_PILLS = [
    { label: 'Compress Image', id: 'image-compressor', icon: '⚡' },
    { label: 'Passport Photo', id: 'passport-photo-resizer', icon: '🪪' },
    { label: 'Picture Puzzle Game', id: 'puzzle', icon: '🧩' },
    { label: 'Image to PDF', id: 'image-to-pdf-converter', icon: '📄' },
    { label: 'Squad DP Collage', id: 'photo-collage-dp-maker', icon: '👥' },
  ];

  return (
    <section className="relative pt-6 pb-6 sm:pt-10 sm:pb-8 overflow-hidden">
      {/* Luminous Apple Atmospheric Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-b from-indigo-500/10 via-sky-400/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Subtle Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 text-[#6E6E73] dark:text-[#86868B] border border-black/5 dark:border-white/10 mb-3.5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>Client-Side Architecture · 100% Private</span>
        </div>

        {/* Apple Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-[#1D1D1F] dark:text-[#F5F5F7] mb-5 [text-wrap:balance]">
          Every Image.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400">
            More Possibilities.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl max-w-2xl mx-auto text-[#6E6E73] dark:text-[#86868B] font-normal leading-relaxed mb-5 sm:mb-6">
          {TOOLS.length} professional, client-side image utilities. Zero server uploads. Free forever.
        </p>

        {/* Apple Liquid Glass Search Bar */}
        <div className="max-w-2xl mx-auto relative mb-6">
          <div className="relative flex items-center glass-panel rounded-2xl p-2.5 transition-all focus-within:ring-2 focus-within:ring-indigo-500/30">
            <div className="pl-3.5 pr-2 text-[#6E6E73] dark:text-[#86868B] shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search tools (e.g. Compress, Resize, Passport, PDF, Collage)..."
              className="flex-1 min-w-0 bg-transparent px-2 py-1.5 text-sm sm:text-base text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#86868B] focus:outline-none"
            />
            <div className="hidden sm:flex items-center gap-1.5 pr-2">
              <kbd className="px-2 py-0.5 text-[11px] font-mono text-[#6E6E73] dark:text-[#86868B] bg-black/5 dark:bg-white/10 rounded-md border border-black/5 dark:border-white/10">
                ⌘K
              </kbd>
            </div>
            <button
              type="button"
              onClick={onExploreClick}
              className="shrink-0 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Browse All
            </button>
          </div>

          {/* Instant Dropdown Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl glass-panel p-2 z-30 text-left shadow-2xl max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
                Matching Tools ({suggestions.length})
              </div>
              {suggestions.map((tool) => (
                <a
                  key={tool.id}
                  href={`/tool/${tool.id}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      onSelectTool(tool.id);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-left group no-underline"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-indigo-500 transition-colors">
                      {tool.name}
                    </div>
                    <div className="text-xs text-[#6E6E73] dark:text-[#86868B] truncate">
                      {tool.tagline}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-500 shrink-0">
                    Open →
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 4 Quick Category Glass Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-5 sm:mb-6">
          {QUICK_CATEGORY_GLASS_PILLS.map((pill) => {
            const href = pill.id === 'puzzle' ? '/puzzle' : `/tool/${pill.id}`;
            return (
              <a
                key={pill.id}
                href={href}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    onSelectTool(pill.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold glass-panel glass-panel-interactive text-[#1D1D1F] dark:text-[#F5F5F7] transition-all active:scale-95 no-underline"
              >
                <span className="text-sm">{pill.icon}</span>
                <span>{pill.label}</span>
              </a>
            );
          })}
        </div>

        {/* Three Apple Trust Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 sm:pt-5 border-t border-black/5 dark:border-white/10 text-left">
          <div className="glass-panel rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">Real-Time Processing</div>
              <div className="text-[11px] text-[#6E6E73] dark:text-[#86868B] leading-relaxed">Browser-native speed with zero server queues</div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">True In-Browser Privacy</div>
              <div className="text-[11px] text-[#6E6E73] dark:text-[#86868B] leading-relaxed">Photos never leave your device memory</div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{TOOLS.length} Focused Tools</div>
              <div className="text-[11px] text-[#6E6E73] dark:text-[#86868B] leading-relaxed">No bloat, no subscription walls, no ads</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
