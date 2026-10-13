import React, { useState } from 'react';
import { Search, ArrowRight, Zap, CheckCircle2, Shield, Sliders } from 'lucide-react';
import { ToolMetadata } from '../types';
import { TOOLS } from '../data/tools';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
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
      ).slice(0, 5);
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <section
      className={`relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-28 transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-[#060913] via-[#0b1024] to-[#060913]'
          : 'bg-gradient-to-b from-white via-slate-50/80 to-slate-100/70'
      }`}
    >
      {/* Soft blue-violet ambient glow effects */}
      {theme === 'dark' ? (
        <>
          {/* Luminous aura behind heading */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[650px] max-w-full h-[320px] bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-blue-500/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Focused electric glow behind search bar */}
          <div className="absolute top-[320px] left-1/2 -translate-x-1/2 w-[520px] max-w-full h-[140px] bg-gradient-to-r from-blue-500/20 via-cyan-400/15 to-indigo-500/20 rounded-full blur-[60px] pointer-events-none" />

          {/* Flanking atmospheric orbs */}
          <div className="absolute -top-10 left-10 w-96 h-96 bg-indigo-500/12 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-24 right-10 w-96 h-96 bg-blue-600/12 rounded-full blur-[100px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-32 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Brand Tagline Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm mb-6 backdrop-blur-md border transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                : 'bg-white/90 border-slate-200 text-slate-600 shadow-xs'
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span
              className={`font-semibold tracking-wide ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`}
            >
              PIXEL LAB
            </span>
            <span className="text-slate-400">·</span>
            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}>
              Every Image. More Possibilities.
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 font-display [text-wrap:balance] ${
              theme === 'dark' ? 'text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]' : 'text-slate-900'
            }`}
          >
            Make Every Image{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]">
              Look Its Best.
            </span>
          </h1>

          {/* Supporting Description */}
          <p
            className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-9 font-normal leading-relaxed ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Resize, compress, edit, convert, and enhance your images with simple, powerful tools in one place. 100% private in your browser with zero upload limits.
          </p>

          {/* Search bar inside Hero (Centered Main Search Bar - Preserved exactly as requested) */}
          <div className="max-w-xl mx-auto relative mb-8">
            <div
              className={`relative flex items-center rounded-2xl p-1.5 border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-900/85 backdrop-blur-xl border-indigo-500/30 hover:border-indigo-400/50 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.18)] focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_30px_rgba(56,189,248,0.25)]'
                  : 'bg-white border-slate-300 shadow-xl shadow-slate-200/70 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20'
              }`}
            >
              <div className="pl-3.5 text-slate-400">
                <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Find a tool (e.g. Collage & DP, Compressor, Splitter, Signature)..."
                className={`w-full bg-transparent px-3 py-2 text-sm focus:outline-none ${
                  theme === 'dark'
                    ? 'text-white placeholder-slate-400'
                    : 'text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={onExploreClick}
                className="shrink-0 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                Browse All
              </button>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div
                className={`absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl p-2 z-30 text-left border ${
                  theme === 'dark'
                    ? 'bg-slate-900/95 backdrop-blur-xl border-slate-700/80 text-white shadow-black/80'
                    : 'bg-white border-slate-200 text-slate-900 shadow-slate-200'
                }`}
              >
                {suggestions.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => onSelectTool(tool.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors group ${
                      theme === 'dark' ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div
                        className={`text-xs font-semibold group-hover:text-cyan-400 transition-colors ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {tool.name}
                      </div>
                      <div
                        className={`text-[11px] ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {tool.tagline}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border ${
                        theme === 'dark'
                          ? 'text-indigo-300 bg-indigo-950/80 border-indigo-700/50'
                          : 'text-indigo-600 bg-indigo-50 border-indigo-200'
                      }`}
                    >
                      Open Tool →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore All {TOOLS.length} Tools</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onSelectTool('image-compressor')}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 border ${
                theme === 'dark'
                  ? 'text-slate-200 bg-slate-900/70 hover:bg-slate-800/90 border-indigo-500/25 hover:border-indigo-400/50 backdrop-blur-md shadow-sm'
                  : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Start Editing</span>
            </button>
          </div>

          {/* Key Value Propositions */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-6 border-t ${
              theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'
            }`}
          >
            <div
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/60 backdrop-blur-md border-indigo-500/15 text-slate-300 shadow-sm'
                  : 'bg-white border-slate-200/80 text-slate-700 shadow-xs'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Zero Wait · Instant In-Browser</span>
            </div>
            <div
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/60 backdrop-blur-md border-indigo-500/15 text-slate-300 shadow-sm'
                  : 'bg-white border-slate-200/80 text-slate-700 shadow-xs'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Private · Zero Server Uploads</span>
            </div>
            <div
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/60 backdrop-blur-md border-indigo-500/15 text-slate-300 shadow-sm'
                  : 'bg-white border-slate-200/80 text-slate-700 shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{TOOLS.length} Working Image Tools</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
