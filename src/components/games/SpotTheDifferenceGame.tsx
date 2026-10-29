import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Eye,
  Lightbulb,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';
import { GameDifficulty } from '../../types/gameProgression';
import {
  loadGameProgress,
  completeLevel,
  resetDifficultyProgress,
} from '../../utils/gameProgressionStore';
import { GAME_LEVELS } from '../../data/gameLevelsData';
import { SPOT_SCENES, SpotScene, DifferenceZone } from '../../data/spotDifferenceScenes';
import { LevelHeaderBar } from './common/LevelHeaderBar';
import { LevelSelectorModal } from './common/LevelSelectorModal';
import { LevelVictoryModal } from './common/LevelVictoryModal';
import { PauseModal } from './common/PauseModal';

export const SpotTheDifferenceGame: React.FC = () => {
  const gameId = 'spot-the-difference';
  const levelsMeta = GAME_LEVELS[gameId] || [];

  // Progression & Difficulty
  const [difficulty, setDifficulty] = useState<GameDifficulty>('Medium');
  const [progressState, setProgressState] = useState(() => loadGameProgress(gameId));
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);

  // Difficulty parameters
  const maxHints = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 3 : 1;
  const radiusBonus = difficulty === 'Easy' ? 2 : difficulty === 'Medium' ? 0 : -1;
  const maxAllowedMistakes = difficulty === 'Easy' ? 99 : difficulty === 'Medium' ? 6 : 3;

  // Scene State
  const sceneIndex = Math.min(Math.max(currentLevelNumber - 1, 0), SPOT_SCENES.length - 1);
  const scene: SpotScene = SPOT_SCENES[sceneIndex];
  const currentLevelMeta = levelsMeta[currentLevelNumber - 1] || levelsMeta[0];

  const [foundDiffIds, setFoundDiffIds] = useState<number[]>([]);
  const [pulsingHintId, setPulsingHintId] = useState<number | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState<number>(maxHints);
  const [mistakes, setMistakes] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isLevelSolved, setIsLevelSolved] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset when level or difficulty changes
  const initScene = useCallback(() => {
    setFoundDiffIds([]);
    setPulsingHintId(null);
    setHintsRemaining(maxHints);
    setMistakes(0);
    setTimerSeconds(0);
    setIsLevelSolved(false);
  }, [maxHints]);

  useEffect(() => {
    initScene();
  }, [currentLevelNumber, difficulty, initScene]);

  // Stopwatch
  useEffect(() => {
    if (isPaused || isLevelSolved) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isLevelSolved]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Complete level
  const triggerVictory = useCallback(
    (timeSec: number, mistakeCount: number) => {
      setIsLevelSolved(true);
      gameAudio.playVictory();

      // Calculate Stars (1-3)
      let stars = 1;
      if (timeSec < 45 && mistakeCount <= 1) {
        stars = 3;
      } else if (timeSec < 90 && mistakeCount <= 3) {
        stars = 2;
      } else {
        stars = 1;
      }
      setEarnedStars(stars);

      const baseScore = 1000;
      const timeBonus = Math.max(0, 300 - timeSec * 3);
      const accuracyBonus = Math.max(0, 200 - mistakeCount * 40);
      const finalScore = baseScore + timeBonus + accuracyBonus;

      const { updatedState } = completeLevel(gameId, difficulty, currentLevelNumber, finalScore, stars);
      setProgressState(updatedState);
      setIsVictoryModalOpen(true);
    },
    [difficulty, currentLevelNumber]
  );

  // Click on either image canvas
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLevelSolved || isPaused) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let hit: DifferenceZone | null = null;
    for (const diff of scene.differences) {
      if (foundDiffIds.includes(diff.id)) continue;
      const effectiveRadius = Math.max(4, diff.radiusPct + radiusBonus);
      const dist = Math.sqrt(
        Math.pow(clickX - diff.xPct, 2) + Math.pow(clickY - diff.yPct, 2)
      );
      if (dist <= effectiveRadius) {
        hit = diff;
        break;
      }
    }

    if (hit) {
      gameAudio.playSnap();
      const updated = [...foundDiffIds, hit.id];
      setFoundDiffIds(updated);
      if (pulsingHintId === hit.id) setPulsingHintId(null);

      if (updated.length === scene.differences.length) {
        triggerVictory(timerSeconds, mistakes);
      }
    } else {
      gameAudio.playError();
      setMistakes((m) => {
        const next = m + 1;
        if (difficulty === 'Hard' && next >= maxAllowedMistakes) {
          // Add 10 seconds penalty on hard if mistakes exceed limit
          setTimerSeconds((t) => t + 10);
        }
        return next;
      });
    }
  };

  // Provide a hint
  const triggerHint = () => {
    if (hintsRemaining <= 0 || isLevelSolved || isPaused) return;
    const unfound = scene.differences.filter((d) => !foundDiffIds.includes(d.id));
    if (unfound.length === 0) return;

    const pick = unfound[0];
    setPulsingHintId(pick.id);
    setHintsRemaining((h) => h - 1);
    gameAudio.playMove();

    setTimeout(() => {
      setPulsingHintId(null);
    }, 4000);
  };

  // Next level
  const handleNextLevel = () => {
    setIsVictoryModalOpen(false);
    if (currentLevelNumber < 10) {
      setCurrentLevelNumber((l) => l + 1);
    }
  };

  // Select level from modal
  const handleSelectLevel = (lvl: number) => {
    setCurrentLevelNumber(lvl);
    setIsLevelSelectorOpen(false);
  };

  // Reset difficulty progress
  const handleResetDifficulty = () => {
    const updated = resetDifficultyProgress(gameId, difficulty);
    setProgressState(updated);
    setCurrentLevelNumber(1);
    setIsLevelSelectorOpen(false);
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto flex flex-col items-center">
      {/* UNIVERSAL LEVEL HEADER BAR */}
      <div className="w-full mb-4">
        <LevelHeaderBar
          levelNumber={currentLevelNumber}
          levelTitle={currentLevelMeta?.title || scene.title}
          difficulty={difficulty}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((p) => !p)}
          onRestartLevel={initScene}
          onOpenLevelSelector={() => setIsLevelSelectorOpen(true)}
          onChangeDifficulty={(d: GameDifficulty) => {
            setDifficulty(d);
            setCurrentLevelNumber(1);
          }}
        />
      </div>

      {/* LEVEL INFO & STATUS BAR */}
      <div className="w-full flex items-center justify-between mb-4 glass-panel p-3.5 rounded-2xl gap-3 flex-wrap">
        <div>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
            Level {currentLevelNumber} of 10 · {scene.title}
          </span>
          <p className="text-xs text-theme-muted mt-0.5">{scene.description}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Differences Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <Eye className="w-4 h-4" />
            <span>
              {foundDiffIds.length} / {scene.differences.length} Found
            </span>
          </div>

          {/* Mistakes Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-500/10 text-theme-secondary font-mono text-xs">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Mistakes:</span>
            <span>{mistakes}</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-500/10 text-theme-secondary font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-theme-muted" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* Hint Button */}
          <button
            type="button"
            onClick={triggerHint}
            disabled={hintsRemaining <= 0 || isLevelSolved}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-panel text-amber-500 hover:text-amber-600 disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-xs border border-amber-500/20"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint ({hintsRemaining})</span>
          </button>
        </div>
      </div>

      {/* DUAL IMAGE SIDE-BY-SIDE PANELS */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT IMAGE (ORIGINAL REFERENCE) */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-theme-muted mb-1.5 uppercase tracking-wide">
            Reference Scene
          </span>
          <div
            onClick={handleImageClick}
            className="w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-black/10 dark:border-white/10 shadow-md relative cursor-crosshair group select-none"
          >
            {scene.renderLeft()}

            {/* Found Markers */}
            {foundDiffIds.map((id) => {
              const diff = scene.differences.find((d) => d.id === id);
              if (!diff) return null;
              return (
                <div
                  key={`left-found-${id}`}
                  style={{
                    left: `${diff.xPct}%`,
                    top: `${diff.yPct}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-500/20 flex items-center justify-center animate-in zoom-in pointer-events-none"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              );
            })}

            {/* Pulsing Hint Ring */}
            {pulsingHintId && (
              <div
                style={{
                  left: `${scene.differences.find((d) => d.id === pulsingHintId)?.xPct}%`,
                  top: `${scene.differences.find((d) => d.id === pulsingHintId)?.yPct}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* RIGHT IMAGE (MODIFIED SCENE) */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-theme-muted mb-1.5 uppercase tracking-wide">
            Spot Differences Here
          </span>
          <div
            onClick={handleImageClick}
            className="w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-black/10 dark:border-white/10 shadow-md relative cursor-crosshair group select-none"
          >
            {scene.renderRight()}

            {/* Found Markers */}
            {foundDiffIds.map((id) => {
              const diff = scene.differences.find((d) => d.id === id);
              if (!diff) return null;
              return (
                <div
                  key={`right-found-${id}`}
                  style={{
                    left: `${diff.xPct}%`,
                    top: `${diff.yPct}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-500/20 flex items-center justify-center animate-in zoom-in pointer-events-none"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              );
            })}

            {/* Pulsing Hint Ring */}
            {pulsingHintId && (
              <div
                style={{
                  left: `${scene.differences.find((d) => d.id === pulsingHintId)?.xPct}%`,
                  top: `${scene.differences.find((d) => d.id === pulsingHintId)?.yPct}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping pointer-events-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* DISCOVERED DIFFERENCES LABELS */}
      <div className="w-full mt-4 glass-panel p-3.5 rounded-2xl">
        <span className="text-xs font-bold text-theme-muted uppercase tracking-wider block mb-2">
          Discovered Anomalies:
        </span>
        <div className="flex flex-wrap gap-2">
          {scene.differences.map((diff) => {
            const isFound = foundDiffIds.includes(diff.id);
            return (
              <span
                key={diff.id}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isFound
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-black/5 dark:bg-white/5 text-theme-muted opacity-60'
                }`}
              >
                {isFound ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{diff.label}</span>
                  </>
                ) : (
                  <span>??? (Undiscovered)</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* LEVEL SELECTOR MODAL */}
      <LevelSelectorModal
        isOpen={isLevelSelectorOpen}
        onClose={() => setIsLevelSelectorOpen(false)}
        levels={levelsMeta}
        currentLevel={currentLevelNumber}
        currentDifficulty={difficulty}
        progressionState={progressState}
        onSelectLevel={(lvl, diff) => {
          setDifficulty(diff);
          setCurrentLevelNumber(lvl);
          setIsLevelSelectorOpen(false);
        }}
        onResetDifficultyProgress={(diff) => {
          const updated = resetDifficultyProgress(gameId, diff);
          setProgressState(updated);
          setCurrentLevelNumber(1);
          setIsLevelSelectorOpen(false);
        }}
      />

      {/* VICTORY MODAL */}
      <LevelVictoryModal
        isOpen={isVictoryModalOpen}
        levelNumber={currentLevelNumber}
        levelTitle={currentLevelMeta?.title || scene.title}
        difficulty={difficulty}
        stars={earnedStars}
        stats={[
          { label: 'Time Elapsed', value: formatTimer(timerSeconds) },
          { label: 'Mistakes', value: mistakes },
          { label: 'Hints Left', value: hintsRemaining },
        ]}
        onNextLevel={handleNextLevel}
        onReplayLevel={() => {
          setIsVictoryModalOpen(false);
          initScene();
        }}
        onOpenLevelSelector={() => {
          setIsVictoryModalOpen(false);
          setIsLevelSelectorOpen(true);
        }}
      />

      {/* PAUSE MODAL */}
      <PauseModal
        isOpen={isPaused}
        levelNumber={currentLevelNumber}
        levelTitle={currentLevelMeta?.title || scene.title}
        objective={currentLevelMeta?.objective || ''}
        difficulty={difficulty}
        onResume={() => setIsPaused(false)}
        onRestartLevel={() => {
          setIsPaused(false);
          initScene();
        }}
        onOpenLevelSelector={() => {
          setIsPaused(false);
          setIsLevelSelectorOpen(true);
        }}
        howToPlayTips={[
          'Inspect both the Reference Scene and the Spot Differences panel carefully.',
          'Click directly on any anomalous color, missing detail, or modified shape.',
          'Use the Hint button if you are stuck searching for the remaining differences.',
        ]}
      />
    </div>
  );
};
