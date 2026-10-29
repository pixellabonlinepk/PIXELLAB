import React, { useState } from 'react';
import {
  X,
  Lock,
  Play,
  Star,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import {
  GameDifficulty,
  LevelMeta,
  GameProgressState,
} from '../../../types/gameProgression';

interface LevelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: LevelMeta[];
  currentLevel: number;
  currentDifficulty: GameDifficulty;
  progressionState: GameProgressState;
  onSelectLevel: (level: number, difficulty: GameDifficulty) => void;
  onResetDifficultyProgress: (difficulty: GameDifficulty) => void;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  isOpen,
  onClose,
  levels,
  currentLevel,
  currentDifficulty,
  progressionState,
  onSelectLevel,
  onResetDifficultyProgress,
}) => {
  const [activeTabDifficulty, setActiveTabDifficulty] =
    useState<GameDifficulty>(currentDifficulty);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const diffProg = progressionState.difficulties[activeTabDifficulty];
  const maxUnlocked = diffProg?.maxUnlockedLevel || 1;
  const completedCount = Object.values(diffProg?.levels || {}).filter(
    (l) => l.completed
  ).length;

  const handleLevelClick = (lvlNum: number) => {
    if (lvlNum <= maxUnlocked) {
      onSelectLevel(lvlNum, activeTabDifficulty);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="glass-panel max-w-2xl w-full rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/20 my-auto text-left relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                10 Progression Levels
              </span>
              <span className="text-xs text-theme-muted font-medium">
                Completed: {completedCount}/10
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-theme-primary">
              Select Mission Level
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Level Selector"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-theme-muted hover:text-theme-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Switcher Tabs */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
            {(['Easy', 'Medium', 'Hard'] as GameDifficulty[]).map((diff) => {
              const count = Object.values(
                progressionState.difficulties[diff]?.levels || {}
              ).filter((l) => l.completed).length;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    setActiveTabDifficulty(diff);
                    setShowResetConfirm(false);
                  }}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTabDifficulty === diff
                      ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  <span>{diff}</span>
                  <span className="text-[10px] opacity-75">({count}/10)</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="text-[11px] text-theme-muted hover:text-rose-500 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset {activeTabDifficulty} Progress</span>
          </button>
        </div>

        {/* Reset Confirmation Prompt */}
        {showResetConfirm && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Reset all progress and star records for <strong>{activeTabDifficulty}</strong> mode?
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onResetDifficultyProgress(activeTabDifficulty);
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all text-xs"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1 rounded-lg glass-panel text-theme-secondary hover:text-theme-primary text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 10 Level Cards Grid */}
        <div className="overflow-y-auto pr-1 space-y-2 flex-1 max-h-[55vh]">
          {levels.map((lvl) => {
            const isUnlocked = lvl.level <= maxUnlocked;
            const isCurrent =
              lvl.level === currentLevel &&
              activeTabDifficulty === currentDifficulty;
            const record = diffProg?.levels[lvl.level];
            const isCompleted = record?.completed;
            const stars = record?.stars || 0;

            return (
              <div
                key={lvl.level}
                onClick={() => isUnlocked && handleLevelClick(lvl.level)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  !isUnlocked
                    ? 'opacity-40 bg-black/5 dark:bg-white/5 border-transparent cursor-not-allowed select-none'
                    : isCurrent
                    ? 'glass-panel border-indigo-500 ring-2 ring-indigo-500/30 shadow-md cursor-pointer hover:border-indigo-400'
                    : isCompleted
                    ? 'glass-panel border-emerald-500/30 hover:border-emerald-500/60 shadow-xs cursor-pointer'
                    : 'glass-panel border-black/5 dark:border-white/10 hover:border-indigo-500/40 shadow-xs cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Level Number Pill */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-display font-black text-sm shrink-0 ${
                      !isUnlocked
                        ? 'bg-black/10 dark:bg-white/10 text-theme-muted'
                        : isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-black/5 dark:bg-white/10 text-theme-primary'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="w-4 h-4" /> : lvl.level}
                  </div>

                  {/* Level Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-theme-primary truncate">
                        {lvl.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-theme-muted hidden sm:inline">
                        • {lvl.badge}
                      </span>
                    </div>
                    <p className="text-xs text-theme-secondary truncate max-w-sm sm:max-w-md">
                      {lvl.objective}
                    </p>
                  </div>
                </div>

                {/* Right Status: Stars or Lock */}
                <div className="flex items-center gap-3 shrink-0">
                  {isUnlocked ? (
                    <div className="flex flex-col items-end gap-1">
                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-black/10 dark:text-white/15'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Best metric if completed */}
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Cleared</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-theme-muted font-medium flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Locked</span>
                    </span>
                  )}

                  {isUnlocked && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLevelClick(lvl.level);
                      }}
                      className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95"
                      title={`Play Level ${lvl.level}`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
