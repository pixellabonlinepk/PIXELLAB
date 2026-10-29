import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Pause,
  Play,
  Grid,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronDown,
} from 'lucide-react';
import { GameDifficulty } from '../../../types/gameProgression';
import { gameAudio } from '../../../utils/gameAudio';

interface LevelHeaderBarProps {
  levelNumber: number;
  levelTitle: string;
  difficulty: GameDifficulty;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestartLevel: () => void;
  onOpenLevelSelector: () => void;
  onChangeDifficulty: (newDiff: GameDifficulty) => void;
  additionalStats?: React.ReactNode;
}

export const LevelHeaderBar: React.FC<LevelHeaderBarProps> = ({
  levelNumber,
  levelTitle,
  difficulty,
  isPaused,
  onTogglePause,
  onRestartLevel,
  onOpenLevelSelector,
  onChangeDifficulty,
  additionalStats,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    gameAudio.getSoundEnabled()
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    gameAudio.setSoundEnabled(next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full glass-panel p-3 sm:p-3.5 rounded-2xl mb-4 border border-black/5 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Zone 1: Level Indicator & Title */}
      <div className="flex items-center gap-3">
        {/* Clickable Level Badge */}
        <button
          type="button"
          onClick={onOpenLevelSelector}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
          title="Open Level Selector"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Level {levelNumber}/10</span>
        </button>

        {/* Level Title & Difficulty Badge */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-theme-primary truncate">
              {levelTitle}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : difficulty === 'Medium'
                  ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}
            >
              {difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Additional In-Game Live Stats (Timer, Moves, Mistakes, etc.) */}
      {additionalStats && (
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-semibold">
          {additionalStats}
        </div>
      )}

      {/* Zone 3: Action Controls */}
      <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0">
        {/* Difficulty Selector Dropdown */}
        <div className="relative">
          <select
            value={difficulty}
            onChange={(e) => onChangeDifficulty(e.target.value as GameDifficulty)}
            aria-label="Select Game Difficulty"
            className="text-xs font-semibold glass-panel rounded-xl px-2.5 py-1.5 text-theme-primary border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-6 appearance-none shadow-xs"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <ChevronDown className="w-3 h-3 text-theme-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Pause / Resume */}
        <button
          type="button"
          onClick={onTogglePause}
          className={`p-2 rounded-xl transition-all shadow-xs active:scale-95 ${
            isPaused
              ? 'bg-amber-500 text-white'
              : 'glass-panel text-theme-secondary hover:text-theme-primary'
          }`}
          title={isPaused ? 'Resume Game' : 'Pause Game'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* Restart Current Level */}
        <button
          type="button"
          onClick={onRestartLevel}
          className="p-2 rounded-xl glass-panel text-theme-secondary hover:text-theme-primary transition-all shadow-xs active:scale-95"
          title="Restart Current Level"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Level Selector Modal Trigger */}
        <button
          type="button"
          onClick={onOpenLevelSelector}
          className="p-2 rounded-xl glass-panel text-theme-secondary hover:text-theme-primary transition-all shadow-xs active:scale-95"
          title="Select Level"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className={`p-2 rounded-xl glass-panel transition-all shadow-xs active:scale-95 ${
            soundEnabled
              ? 'text-indigo-500'
              : 'text-theme-muted hover:text-theme-primary'
          }`}
          title={soundEnabled ? 'Mute Game Sound' : 'Unmute Game Sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl glass-panel text-theme-secondary hover:text-theme-primary transition-all shadow-xs active:scale-95 hidden sm:inline-flex"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize className="w-3.5 h-3.5" />
          ) : (
            <Maximize className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
