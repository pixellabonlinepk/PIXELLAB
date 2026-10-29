import React from 'react';
import {
  Play,
  RotateCcw,
  Grid,
  HelpCircle,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { GameDifficulty } from '../../../types/gameProgression';

interface PauseModalProps {
  isOpen: boolean;
  levelNumber: number;
  levelTitle: string;
  objective: string;
  difficulty: GameDifficulty;
  onResume: () => void;
  onRestartLevel: () => void;
  onOpenLevelSelector: () => void;
  howToPlayTips?: string[];
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  levelNumber,
  levelTitle,
  objective,
  difficulty,
  onResume,
  onRestartLevel,
  onOpenLevelSelector,
  howToPlayTips,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass-panel max-w-sm w-full p-6 sm:p-7 rounded-3xl text-center shadow-2xl border border-white/20 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-lg font-black font-display text-theme-primary">
              Game Paused
            </h3>
          </div>
          <button
            type="button"
            onClick={onResume}
            className="p-1 rounded-full text-theme-muted hover:text-theme-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level Details */}
        <div className="mb-5 text-left bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
              Level {levelNumber} of 10 ({difficulty})
            </span>
          </div>
          <h4 className="text-sm font-bold text-theme-primary mb-1">
            {levelTitle}
          </h4>
          <p className="text-xs text-theme-secondary">{objective}</p>
        </div>

        {/* Instructions Snippet if available */}
        {howToPlayTips && howToPlayTips.length > 0 && (
          <div className="mb-5 text-left space-y-1.5 border-b border-black/5 dark:border-white/10 pb-4">
            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block">
              Quick Tip
            </span>
            <p className="text-xs text-theme-secondary leading-relaxed">
              {howToPlayTips[0]}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Game</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRestartLevel}
              className="py-2.5 rounded-xl glass-panel text-theme-secondary hover:text-theme-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>

            <button
              type="button"
              onClick={onOpenLevelSelector}
              className="py-2.5 rounded-xl glass-panel text-theme-secondary hover:text-theme-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Select Level</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
