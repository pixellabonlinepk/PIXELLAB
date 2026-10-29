import React, { useState } from 'react';
import {
  Home,
  Search,
  Wrench,
  Gamepad2,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (view: string, toolId?: string, guideSlug?: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onNavigate('all-tools');
    }
  };

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in">
      {/* 404 Pill Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4">
        <span>Error 404</span>
        <span className="opacity-40">•</span>
        <span>Page Not Found</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black font-display text-theme-primary mb-3 tracking-tight">
        Lost in the Pixels?
      </h1>

      <p className="text-xs sm:text-base text-theme-secondary max-w-lg mx-auto mb-8 leading-relaxed">
        The link you followed may be broken or the URL might have moved. Everything on PIXAL LAB is free and accessible through the links below.
      </p>

      {/* Quick Search */}
      <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-10 relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, games, guides..."
          aria-label="Search site from 404 page"
          className="w-full pl-11 pr-24 py-3 rounded-2xl glass-panel text-xs sm:text-sm text-theme-primary placeholder-theme-muted border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs"
        >
          Search
        </button>
      </form>

      {/* Directory Shortcut Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
        <div
          onClick={() => onNavigate('all-tools')}
          className="glass-panel p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all group flex items-start gap-4 border border-black/5 dark:border-white/10 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-primary group-hover:text-indigo-500 transition-colors flex items-center gap-1.5">
              <span>Image Tools Suite</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-theme-secondary mt-1">
              Explore 26 free in-browser utilities to compress, resize, crop, and convert photos.
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('games')}
          className="glass-panel p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all group flex items-start gap-4 border border-black/5 dark:border-white/10 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-primary group-hover:text-purple-500 transition-colors flex items-center gap-1.5">
              <span>Games & Fun</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-theme-secondary mt-1">
              Play 8 brain & picture puzzle games with 10 difficulty levels and offline progress saving.
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('study-material')}
          className="glass-panel p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all group flex items-start gap-4 border border-black/5 dark:border-white/10 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-primary group-hover:text-emerald-500 transition-colors flex items-center gap-1.5">
              <span>Free Study Material</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-theme-secondary mt-1">
              Download open-access study notes and cheat sheets across Science, Math, CS & AI.
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('guides')}
          className="glass-panel p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all group flex items-start gap-4 border border-black/5 dark:border-white/10 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-primary group-hover:text-amber-500 transition-colors flex items-center gap-1.5">
              <span>Educational Guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-theme-secondary mt-1">
              Step-by-step tutorials on thumbnails, photo sizing, aspect ratios, and digital signatures.
            </p>
          </div>
        </div>
      </div>

      {/* Return to Home Button */}
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
      >
        <Home className="w-4 h-4" />
        <span>Return to Homepage</span>
      </button>
    </div>
  );
};
