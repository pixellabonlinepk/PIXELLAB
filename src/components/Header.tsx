import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Compass, ShieldCheck } from 'lucide-react';
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
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 border-b backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-[#060913]/85 border-slate-800/60 text-white shadow-lg shadow-black/20'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* ZONE 1: BRAND LOGO */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <div
                  className={`w-full h-full rounded-[10px] flex items-center justify-center relative overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-950' : 'bg-slate-900'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 group-hover:scale-110 transition-transform" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400 opacity-90 group-hover:scale-110 transition-transform delay-75" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-violet-400 opacity-90 group-hover:scale-110 transition-transform delay-100" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 group-hover:scale-110 transition-transform delay-150" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-display font-extrabold text-xl tracking-tight ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    PIXAL
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                      LAB
                    </span>
                  </span>
                </div>
                <span
                  className={`text-[10px] tracking-wider uppercase font-semibold ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Every Image. More Possibilities.
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: PRIMARY NAVIGATION */}
          <nav
            className={`hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'home'
                  ? theme === 'dark'
                    ? 'text-white bg-slate-800/80 font-semibold'
                    : 'text-slate-900 bg-slate-100 font-bold'
                  : theme === 'dark'
                  ? 'hover:text-white hover:bg-slate-900/60'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('all-tools')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'all-tools'
                  ? theme === 'dark'
                    ? 'text-white bg-slate-800/80 font-semibold'
                    : 'text-slate-900 bg-slate-100 font-bold'
                  : theme === 'dark'
                  ? 'hover:text-white hover:bg-slate-900/60'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Tools ({TOOLS.length})
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'about'
                  ? theme === 'dark'
                    ? 'text-white bg-slate-800/80 font-semibold'
                    : 'text-slate-900 bg-slate-100 font-bold'
                  : theme === 'dark'
                  ? 'hover:text-white hover:bg-slate-900/60'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About & Privacy
            </button>
          </nav>

          {/* ZONE 3: THEME TOGGLE & QUICK ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* COMPACT THEME TOGGLE (Exact position where the small secondary search bar was) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white hover:bg-slate-800/90 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-xs'
              }`}
            >
              <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600 transition-transform -rotate-12" />
                )}
              </div>
              <span className="hidden sm:inline-block font-semibold">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            {/* Quick Explore Button */}
            <button
              onClick={() => onNavigate('all-tools')}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-lg hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all whitespace-nowrap shrink-0"
            >
              <Compass className="w-3.5 h-3.5" />
              Explore All Tools
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden py-4 border-t space-y-2 ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                theme === 'dark'
                  ? 'text-slate-200 hover:bg-slate-900'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('all-tools');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                theme === 'dark'
                  ? 'text-slate-200 hover:bg-slate-900'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              All Tools ({TOOLS.length})
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                theme === 'dark'
                  ? 'text-slate-200 hover:bg-slate-900'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              About & Privacy
            </button>

            {/* Mobile Theme Switcher Row */}
            <div className="pt-2 pb-1">
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium border ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-900 text-slate-200'
                    : 'border-slate-200 bg-slate-50 text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-600" />
                  )}
                  <span>Current Theme:</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                  {theme === 'dark' ? 'Dark (Tap to switch)' : 'Light (Tap to switch)'}
                </span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onNavigate('all-tools');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md"
              >
                Browse All {TOOLS.length} Tools
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Zero Server Upload Privacy Guarantee Subheader Banner */}
      <div
        className={`border-t py-1.5 px-4 text-center transition-colors ${
          theme === 'dark'
            ? 'bg-[#080d1e]/80 border-slate-800/50 text-slate-400'
            : 'bg-slate-100/70 border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>
            <strong
              className={`font-semibold ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              100% Client-Side Processing
            </strong>{' '}
            — Your images never leave your browser. Zero uploads, zero storage, complete privacy.
          </span>
        </div>
      </div>
    </header>
  );
};
