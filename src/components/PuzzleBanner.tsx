import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface PuzzleBannerProps {
  currentView: string;
  onPlayNow: () => void;
}

export const PuzzleBanner: React.FC<PuzzleBannerProps> = ({
  currentView,
  onPlayNow,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('pixallab_puzzle_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Never show on the game page itself or if dismissed in this session
    if (isDismissed || currentView === 'puzzle') {
      setIsVisible(false);
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          // Appear after scrolling 350px down; hide when near top (< 180px)
          if (scrollY > 350) {
            setIsVisible(true);
          } else if (scrollY < 180) {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDismissed, currentView]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
    try {
      sessionStorage.setItem('pixallab_puzzle_banner_dismissed', 'true');
    } catch {
      // safe fallback
    }
  };

  const handlePlayClick = () => {
    onPlayNow();
  };

  // Do not render anything if dismissed or currently on puzzle page
  if (isDismissed || currentView === 'puzzle') {
    return null;
  }

  return (
    <aside
      aria-label="Picture Puzzle Challenge Promotion"
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] sm:max-w-xl w-auto transition-all duration-300 ease-out ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative bg-[#090D1A]/95 dark:bg-[#070A14]/95 text-white backdrop-blur-xl border border-indigo-500/35 hover:border-indigo-400/50 rounded-2xl shadow-2xl shadow-indigo-950/60 p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3.5 group">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-sky-500/5 to-transparent pointer-events-none" />

        {/* 1. MINIATURE PICTURE PUZZLE GRID ICON (2x2 with empty tile) */}
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-950 to-slate-900 border border-indigo-500/30 p-1 shrink-0 grid grid-cols-2 grid-rows-2 gap-0.5 shadow-inner cursor-pointer"
          onClick={handlePlayClick}
          title="Play PIXAL LAB Picture Puzzle Challenge"
        >
          {/* Tile 1: Top-left picture slice */}
          <div className="rounded-xs bg-gradient-to-br from-indigo-500 to-blue-600" />
          {/* Tile 2: Top-right picture slice */}
          <div className="rounded-xs bg-gradient-to-br from-cyan-400 to-blue-500" />
          {/* Tile 3: Bottom-left picture slice */}
          <div className="rounded-xs bg-gradient-to-br from-purple-500 to-indigo-600" />
          {/* Tile 4: Bottom-right empty slot with subtle dashed accent */}
          <div className="rounded-xs border border-dashed border-cyan-400/50 bg-black/40 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-cyan-400/60 animate-pulse" />
          </div>
        </div>

        {/* 2. TEXT COPY */}
        <div className="min-w-0 pr-1 select-none cursor-pointer" onClick={handlePlayClick}>
          {/* Small Label */}
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
            <span>PIXAL LAB MINI GAME</span>
          </div>

          {/* Main Heading */}
          <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-snug truncate">
            Ready for a Picture Puzzle?
          </h4>

          {/* Supporting Text (Hidden on extra small screens for clean compact look) */}
          <p className="text-[11px] text-slate-300 leading-tight hidden md:block truncate">
            Take a break and solve beautiful picture puzzles.
          </p>
        </div>

        {/* 3. PRIMARY CTA BUTTON */}
        <button
          type="button"
          onClick={handlePlayClick}
          aria-label="Play Picture Puzzle Challenge now"
          className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1 whitespace-nowrap active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span>PLAY NOW</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* 4. DISMISS / CLOSE BUTTON */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss game promotion"
          title="Dismiss"
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
