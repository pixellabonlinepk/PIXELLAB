import React from 'react';
import {
  Trophy,
  Star,
  Play,
  RotateCcw,
  Grid,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Crown,
} from 'lucide-react';
import { GameDifficulty } from '../../../types/gameProgression';

interface LevelVictoryModalProps {
  isOpen: boolean;
  levelNumber: number;
  levelTitle: string;
  difficulty: GameDifficulty;
  stars: number; // 1, 2, or 3
  stats: { label: string; value: string | number }[];
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenLevelSelector: () => void;
  onBackToDirectory?: () => void;
}

export const LevelVictoryModal: React.FC<LevelVictoryModalProps> = ({
  isOpen,
  levelNumber,
  levelTitle,
  difficulty,
  stars,
  stats,
  onNextLevel,
  onReplayLevel,
  onOpenLevelSelector,
  onBackToDirectory,
}) => {
  if (!isOpen) return null;

  const isFinalLevel = levelNumber >= 10;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass-panel max-w-sm sm:max-w-md w-full p-6 sm:p-8 rounded-3xl text-center shadow-2xl border border-white/20 animate-in zoom-in-95">
        {/* Animated Trophy / Crown Icon */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg ${
            isFinalLevel
              ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-900 shadow-yellow-500/30 animate-bounce'
              : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
          }`}
        >
          {isFinalLevel ? (
            <Crown className="w-10 h-10 fill-current" />
          ) : (
            <Trophy className="w-9 h-9" />
          )}
        </div>

        {/* Level Tag & Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            {difficulty} Mode
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/10 text-theme-muted">
            Level {levelNumber} of 10
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black font-display text-theme-primary mb-1">
          {isFinalLevel ? 'Grand Champion!' : 'Level Cleared!'}
        </h3>
        <p className="text-xs sm:text-sm text-theme-secondary mb-5">
          {isFinalLevel
            ? `Spectacular achievement! You have mastered all 10 levels on ${difficulty} mode!`
            : `Completed ${levelTitle} with precision!`}
        </p>

        {/* 3-Star Rating Showcase */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starNum) => (
            <div
              key={starNum}
              className={`transition-all duration-300 transform ${
                starNum <= stars ? 'scale-110' : 'opacity-25'
              }`}
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 ${
                  starNum <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                    : 'text-black/20 dark:text-white/20'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Key Level Performance Stats */}
        <div
          className={`grid gap-2 sm:gap-3 mb-6 bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl border border-black/5 dark:border-white/10 ${
            stats.length === 2
              ? 'grid-cols-2'
              : stats.length === 3
              ? 'grid-cols-3'
              : 'grid-cols-2'
          }`}
        >
          {stats.map((s, idx) => (
            <div key={idx} className="text-center">
              <span className="text-[10px] font-bold text-theme-muted uppercase block">
                {s.label}
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-theme-primary">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {!isFinalLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Next Level ({levelNumber + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLevelSelector}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900 font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>View Campaign Victory & Levels</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onReplayLevel}
              className="py-2.5 rounded-xl glass-panel text-theme-secondary hover:text-theme-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Level</span>
            </button>

            <button
              type="button"
              onClick={onOpenLevelSelector}
              className="py-2.5 rounded-xl glass-panel text-theme-secondary hover:text-theme-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
