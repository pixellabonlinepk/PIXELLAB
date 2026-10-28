import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Search,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TOOLS, CATEGORIES } from '../data/tools';
import { ToolCategory } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, toolId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('optimize-resize');
  const { theme, toggleTheme } = useTheme();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleToolClick = (toolId: string) => {
    onNavigate('tool', toolId);
    setMobileMenuOpen(false);
    setDrawerSearch('');
  };

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setDrawerSearch('');
  };

  // Search filtered tools inside drawer
  const searchResults = drawerSearch.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(drawerSearch.toLowerCase()) ||
          t.description.toLowerCase().includes(drawerSearch.toLowerCase()) ||
          t.categoryLabel.toLowerCase().includes(drawerSearch.toLowerCase())
      )
    : [];

  const mainCategories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <>
      <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4 transition-all duration-300">
        {/* Floating Apple Liquid Glass Dynamic Island Dock */}
        <div className="liquid-dock rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-lg">
          {/* ZONE 1: SLEEK MINIMAL BRAND LOGO */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onNavigate('home');
                }
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none rounded-full transition-transform active:scale-95 no-underline"
              aria-label="PIXAL LAB Home"
            >
              {/* Minimal Liquid Glass Glyph */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1.5px] shadow-sm shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow shrink-0">
                <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center relative overflow-hidden">
                  <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-indigo-600 to-blue-500 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>

              {/* Typography */}
              <span className="font-display font-black text-base sm:text-lg tracking-tight leading-none text-[#1D1D1F] dark:text-[#F5F5F7]">
                PIXAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 ml-1">LAB</span>
              </span>
            </a>
          </div>

          {/* ZONE 2: CENTER APPLE PILL NAVIGATION (Desktop Only) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center apple-segmented p-1 rounded-full">
            <a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onNavigate('home');
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                currentView === 'home'
                  ? 'bg-white dark:bg-white/15 text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white font-medium'
              }`}
            >
              Home
            </a>
            <a
              href="/all-tools"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onNavigate('all-tools');
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                currentView === 'all-tools' || currentView === 'tool'
                  ? 'bg-white dark:bg-white/15 text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white font-medium'
              }`}
            >
              Image Tools
            </a>
            <a
              href="/games"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onNavigate('games');
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'games' || currentView === 'game' || currentView === 'puzzle'
                  ? 'bg-white dark:bg-white/15 text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white font-medium'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Games & Fun</span>
            </a>
            <a
              href="/study-material"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onNavigate('study-material');
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                currentView === 'study-material'
                  ? 'bg-white dark:bg-white/15 text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white font-medium'
              }`}
            >
              Free Study Material
            </a>
            <a
              href="/guides"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onNavigate('guides');
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                currentView === 'guides' || currentView === 'guide'
                  ? 'bg-white dark:bg-white/15 text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white font-medium'
              }`}
            >
              Guides
            </a>
          </nav>

          {/* ZONE 3: ACTIONS & THEME TOGGLE */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compact Dynamic Tools Chip */}
            <button
              onClick={() => onNavigate('all-tools')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/5 dark:border-white/10 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{TOOLS.length} Free Tools</span>
            </button>

            {/* Liquid Glass Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/5 dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] transition-all active:scale-95 shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] active:scale-95 transition-transform"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER LIQUID GLASS SIDEBAR DRAWER (MOBILE ONLY) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex justify-end">
          {/* Blurred Dark Backdrop Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-in fade-in duration-300"
            aria-hidden="true"
          />

          {/* Slide-Over Drawer Container */}
          <div className="relative z-[100] w-[85vw] max-w-sm h-full liquid-dock border-l border-white/20 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 ease-out overflow-hidden">
            {/* 1. STICKY DRAWER HEADER */}
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-2 shrink-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
                  <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
                    <div className="w-3 h-3 rounded-xs bg-indigo-500" />
                  </div>
                </div>
                <span className="font-display font-extrabold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                  PIXAL<span className="text-indigo-500">LAB</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {TOOLS.length} Tools
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Theme Toggle in Drawer */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] transition-all"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </button>

                {/* Close Drawer Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/10 dark:hover:bg-white/20 transition-all"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE DRAWER BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 2. DRAWER SEARCH INPUT */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  placeholder="Quick search all tools..."
                  className="w-full pl-8.5 pr-8 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/10 text-theme-primary placeholder-theme-muted border border-black/5 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                />
                {drawerSearch && (
                  <button
                    onClick={() => setDrawerSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* SEARCH RESULTS VIEW (if typing in search) */}
              {drawerSearch.trim() ? (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider px-1">
                    Found {searchResults.length} {searchResults.length === 1 ? 'tool' : 'tools'}
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-theme-muted">
                      No matching tools found.
                    </div>
                  ) : (
                    searchResults.map((tool) => (
                      <a
                        key={tool.id}
                        href={`/tool/${tool.id}`}
                        onClick={(e) => {
                          if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                            e.preventDefault();
                            handleToolClick(tool.id);
                          }
                        }}
                        className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-indigo-500/10 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-theme-primary group-hover:text-indigo-500 truncate">
                            {tool.name}
                          </div>
                          <div className="text-[10px] text-theme-muted truncate">
                            {tool.categoryLabel}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))
                  )}
                </div>
              ) : (
                <>
                  {/* 3. PRIMARY NAVIGATION PILLS */}
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavClick('home')}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        currentView === 'home'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-theme-primary hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>Home</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <button
                      onClick={() => handleNavClick('all-tools')}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        currentView === 'all-tools' || currentView === 'tool'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-theme-primary hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">1. Image Tools</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-400 font-mono">
                          {TOOLS.length}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <button
                      onClick={() => handleNavClick('games')}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        currentView === 'games' || currentView === 'game' || currentView === 'puzzle'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-theme-primary hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">2. Games & Fun</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">
                          8 Games
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <button
                      onClick={() => handleNavClick('study-material')}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        currentView === 'study-material'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-theme-primary hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">3. Free Study Material</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                          PDFs
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <button
                      onClick={() => handleNavClick('guides')}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        currentView === 'guides' || currentView === 'guide'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-theme-primary hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>How-To Guides</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <button
                      onClick={() => handleNavClick('about')}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        currentView === 'about'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-theme-primary hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>About & Privacy</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  </div>

                  {/* 4. EXPANDABLE CATEGORIES ACCORDION */}
                  <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-2">
                    <div className="text-[10px] font-bold text-theme-muted uppercase tracking-wider px-1">
                      Explore Categories
                    </div>

                    {mainCategories.map((cat) => {
                      const isExpanded = expandedCategory === cat.id;
                      const catTools = TOOLS.filter((t) => t.category === cat.id);

                      return (
                        <div
                          key={cat.id}
                          className="rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden bg-black/5 dark:bg-white/5 transition-all"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCategory(isExpanded ? null : cat.id)
                            }
                            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-bold text-theme-primary"
                          >
                            <span className="flex items-center gap-1.5">
                              <span>{cat.label}</span>
                              <span className="text-[10px] font-mono text-indigo-500 font-semibold">
                                ({catTools.length})
                              </span>
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-theme-muted" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-theme-muted" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-2 pb-2.5 pt-1 space-y-1 border-t border-black/5 dark:border-white/10 bg-white/30 dark:bg-black/30">
                              {catTools.map((tool) => (
                                <a
                                  key={tool.id}
                                  href={`/tool/${tool.id}`}
                                  onClick={(e) => {
                                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                                      e.preventDefault();
                                      handleToolClick(tool.id);
                                    }
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-theme-secondary hover:text-indigo-500 hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between group transition-colors"
                                >
                                  <span className="truncate pr-1">{tool.name}</span>
                                  <span className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    →
                                  </span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* 5. STICKY DRAWER FOOTER */}
            <div className="p-3.5 border-t border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shrink-0 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Zero Server Uploads · 100% In-Browser</span>
              </div>
              <p className="text-[10px] text-theme-muted leading-tight">
                HTML5 Canvas & Web API client-side execution. Your photos never leave your device.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
