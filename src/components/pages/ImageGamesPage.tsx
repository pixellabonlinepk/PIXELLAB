import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Volume2,
  Play,
  Clock,
  Layers,
  ArrowRight,
  Eye,
  Palette,
  Grid,
  CheckCircle2,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { SlidingPuzzleGame } from '../puzzle/SlidingPuzzleGame';

interface ImageGamesPageProps {
  onNavigate: (view: string, toolId?: string) => void;
}

export const ImageGamesPage: React.FC<ImageGamesPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'play-puzzle' | 'roadmap'>('play-puzzle');

  const UPCOMING_GAMES = [
    {
      id: 'spot-the-difference',
      title: 'Spot the Pixel Difference',
      category: 'Visual Acuity',
      tagline: 'Detect subtle digital modifications between photo pairs',
      description:
        'Compare two high-resolution photographs side-by-side. Spot micro-edits in lighting, color gradients, and hidden objects under timed pressure.',
      badge: 'Phase 2 · In Development',
      icon: Eye,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'visual-memory-match',
      title: 'Visual Memory Tile Match',
      category: 'Spatial Cognition',
      tagline: 'Test your spatial recall with aesthetic icon patterns',
      description:
        'A card-flip memory challenge featuring intricate photographic textures, color harmony palettes, and geometric patterns with progressive combo streaks.',
      badge: 'Phase 2 · In Development',
      icon: Grid,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'color-hue-spectrum',
      title: 'Color Hue Spectrum Sort',
      category: 'Chromatic Perception',
      tagline: 'Arrange scrambled color swatches into flawless spectrums',
      description:
        'Test your color acuity by organizing randomized gradient tiles into smooth chromatic spectrums across hue, saturation, and lightness channels.',
      badge: 'Phase 2 · In Development',
      icon: Palette,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'mosaic-jigsaw-studio',
      title: 'Artistic Mosaic Jigsaw',
      category: 'Pattern Synthesis',
      tagline: 'Reassemble high-definition fine art fragments',
      description:
        'Drag and snap multi-piece irregular jigsaw fragments to reconstruct famous cultural landmarks, scenic nature vistas, and digital abstract art.',
      badge: 'Phase 2 · In Development',
      icon: Layers,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. SECTION HEADER BANNER */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3.5 glass-panel text-indigo-500 border border-indigo-500/20 shadow-xs">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Section 2: Image Games Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-theme-primary mb-3.5 tracking-tight [text-wrap:balance]">
          Interactive Image Games &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500">
            Visual Puzzles
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-theme-secondary max-w-2xl mx-auto leading-relaxed">
          Sharpen spatial reasoning, visual attention, and problem-solving skills with client-side interactive browser games. Enjoy high-resolution imagery, adaptive difficulty, and sound effects.
        </p>

        {/* Segmented Mode Switcher */}
        <div className="inline-flex p-1 rounded-full apple-segmented mt-5 max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('play-puzzle')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'play-puzzle'
                ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-indigo-500" />
            <span>Play Picture Puzzle (Flagship)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Games Roadmap ({UPCOMING_GAMES.length})</span>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: FLAGSHIP PUZZLE GAME */}
      {activeTab === 'play-puzzle' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Embedded Sliding Puzzle Game */}
          <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10">
            <SlidingPuzzleGame
              onBackToHome={() => onNavigate('home')}
              onExploreTools={() => onNavigate('all-tools')}
            />
          </div>

          {/* Picture Puzzle Game Highlights Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="glass-panel rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-theme-primary">Guaranteed Solvable Shuffling</h3>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Every scrambled board is checked mathematically using inversion-parity counting so that every level can be solved.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs">
                <Volume2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-theme-primary">Interactive Audio & Keyboard</h3>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Enjoy audio feedback synthesized via Web Audio API or play completely silently. Use arrow keys or touch clicks.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-theme-primary">Personal Best Record Tracker</h3>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Your fastest times, move counts, and star ratings are safely saved in local storage with zero cloud accounts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: ROADMAP / FUTURE GAMES SECTION */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/20 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>Expansion Pipeline</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-theme-primary mb-2">
              Upcoming Visual & Image Games
            </h2>
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
              As part of our commitment to quality, each game is designed with original algorithms, tested for responsiveness, and audited for zero lag before release. Here is our upcoming roster:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UPCOMING_GAMES.map((game) => {
              const Icon = game.icon;
              return (
                <div
                  key={game.id}
                  className="glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
                          {game.category}
                        </span>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {game.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-theme-primary">
                      {game.title}
                    </h3>

                    <p className="text-xs text-theme-muted font-medium italic">
                      {game.tagline}
                    </p>

                    <p className="text-xs text-theme-secondary leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-theme-muted">Targeted for Phase 2 Release</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('play-puzzle')}
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Play Flagship Puzzle Instead</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
