import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TOOLS } from '../data/tools';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, toolId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4 transition-all duration-300">
      {/* Floating Apple Liquid Glass Dynamic Island Dock */}
      <div className="liquid-dock rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        {/* ZONE 1: SLEEK MINIMAL BRAND LOGO */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none rounded-full transition-transform active:scale-95"
            aria-label="Pixal Lab Home"
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
          </button>
        </div>

        {/* ZONE 2: CENTER APPLE PILL NAVIGATION */}
        <nav className="hidden md:flex items-center apple-segmented p-1 rounded-full">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
              currentView === 'home'
                ? 'bg-white dark:bg-white/15 text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white font-medium'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('all-tools')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
              currentView === 'all-tools'
                ? 'bg-white dark:bg-white/15 text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white font-medium'
            }`}
          >
            Tools
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
              currentView === 'about'
                ? 'bg-white dark:bg-white/15 text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white font-medium'
            }`}
          >
            About
          </button>
        </nav>

        {/* ZONE 3: ACTIONS & THEME TOGGLE */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Compact "12 Free Tools" Chip */}
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

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F5F7]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED LIQUID MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 liquid-dock rounded-3xl p-3 space-y-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-sm font-semibold rounded-2xl transition-colors ${
              currentView === 'home'
                ? 'bg-black/5 dark:bg-white/15 text-indigo-600 dark:text-white'
                : 'text-[#6E6E73] dark:text-[#86868B] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('all-tools');
              setMobileMenuOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-sm font-semibold rounded-2xl transition-colors ${
              currentView === 'all-tools'
                ? 'bg-black/5 dark:bg-white/15 text-indigo-600 dark:text-white'
                : 'text-[#6E6E73] dark:text-[#86868B] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            All {TOOLS.length} Tools
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-sm font-semibold rounded-2xl transition-colors ${
              currentView === 'about'
                ? 'bg-black/5 dark:bg-white/15 text-indigo-600 dark:text-white'
                : 'text-[#6E6E73] dark:text-[#86868B] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            About & Privacy Policy
          </button>
        </div>
      )}
    </header>
  );
};
