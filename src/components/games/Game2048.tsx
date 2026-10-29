import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Undo2,
  Flame,
  Infinity as InfinityIcon,
  Award,
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';
import { GameDifficulty } from '../../types/gameProgression';
import {
  loadGameProgress,
  completeLevel,
  resetDifficultyProgress,
} from '../../utils/gameProgressionStore';
import { GAME_LEVELS } from '../../data/gameLevelsData';
import { LevelHeaderBar } from './common/LevelHeaderBar';
import { LevelSelectorModal } from './common/LevelSelectorModal';
import { LevelVictoryModal } from './common/LevelVictoryModal';
import { PauseModal } from './common/PauseModal';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

function getEmptyCells(grid: number[][]): [number, number][] {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) {
        empty.push([r, c]);
      }
    }
  }
  return empty;
}

function spawnRandomTile(grid: number[][], fourProb: number = 0.1): number[][] {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const val = Math.random() < (1 - fourProb) ? 2 : 4;
  const next = grid.map((row) => [...row]);
  next[r][c] = val;
  return next;
}

function canMove(grid: number[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
    }
  }
  return false;
}

function slideLine(line: number[]): { newLine: number[]; points: number } {
  const nonZero = line.filter((v) => v !== 0);
  const result: number[] = [];
  let points = 0;
  let i = 0;

  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const mergedVal = nonZero[i] * 2;
      result.push(mergedVal);
      points += mergedVal;
      i += 2;
    } else {
      result.push(nonZero[i]);
      i += 1;
    }
  }

  while (result.length < 4) {
    result.push(0);
  }

  return { newLine: result, points };
}

export const Game2048: React.FC = () => {
  const gameId = '2048';
  const levelsMeta = GAME_LEVELS[gameId] || [];

  // Difficulty & Progression State
  const [difficulty, setDifficulty] = useState<GameDifficulty>('Medium');
  const [progressState, setProgressState] = useState(() => loadGameProgress(gameId));
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [gameMode, setGameMode] = useState<'campaign' | 'endless'>('campaign');

  const currentLevelMeta = levelsMeta[currentLevelNumber - 1] || levelsMeta[0];

  // Board State
  const [grid, setGrid] = useState<number[][]>(() => {
    let initial = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    initial = spawnRandomTile(initial);
    initial = spawnRandomTile(initial);
    return initial;
  });

  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [undosRemaining, setUndosRemaining] = useState<number>(3);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pixallab_2048_best');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [previousState, setPreviousState] = useState<{
    grid: number[][];
    score: number;
    moves: number;
  } | null>(null);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [levelCleared, setLevelCleared] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Difficulty parameters
  const fourProbability = difficulty === 'Easy' ? 0.05 : difficulty === 'Medium' ? 0.1 : 0.2;
  const initialUndos = difficulty === 'Easy' ? 999 : difficulty === 'Medium' ? 3 : 1;

  // Level objectives
  const targetTile = (currentLevelMeta?.params?.targetTile as number) || 2048;
  const targetScore = (currentLevelMeta?.params?.targetScore as number) || 20000;
  const maxMoves = (currentLevelMeta?.params?.maxMoves as number) || undefined;

  // Highest tile on board currently
  const highestTile = Math.max(...grid.flat());

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      try {
        localStorage.setItem('pixallab_2048_best', score.toString());
      } catch {
        // storage quota
      }
    }
  }, [score, bestScore]);

  // Timer
  useEffect(() => {
    if (isPaused || isGameOver || levelCleared) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver, levelCleared]);

  // Format timer
  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Reset or initialize board for level
  const initBoard = useCallback(() => {
    let initial = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    initial = spawnRandomTile(initial, fourProbability);
    initial = spawnRandomTile(initial, fourProbability);
    setGrid(initial);
    setScore(0);
    setMoves(0);
    setUndosRemaining(initialUndos);
    setPreviousState(null);
    setIsGameOver(false);
    setLevelCleared(false);
    setTimerSeconds(0);
  }, [fourProbability, initialUndos]);

  // When level, difficulty, or mode changes
  useEffect(() => {
    initBoard();
  }, [currentLevelNumber, difficulty, gameMode, initBoard]);

  // Handle Level Victory
  const triggerVictory = useCallback(
    (finalScore: number, finalMoves: number) => {
      setLevelCleared(true);
      gameAudio.playVictory();

      // Calculate Stars (1-3)
      let stars = 1;
      if (highestTile >= targetTile * 2 || (maxMoves && finalMoves <= maxMoves * 0.75)) {
        stars = 3;
      } else if (highestTile >= targetTile) {
        stars = 2;
        if (finalScore >= targetScore) stars = 3;
      } else {
        stars = 1;
      }
      setEarnedStars(stars);

      const { updatedState } = completeLevel(gameId, difficulty, currentLevelNumber, finalScore, stars);
      setProgressState(updatedState);
      setIsVictoryModalOpen(true);
    },
    [difficulty, currentLevelNumber, highestTile, targetTile, maxMoves, targetScore]
  );

  // Move action in direction
  const move = useCallback(
    (dir: Direction) => {
      if (isGameOver || isPaused || (gameMode === 'campaign' && levelCleared)) return;

      let changed = false;
      let earnedPoints = 0;
      const nextGrid = grid.map((r) => [...r]);

      if (dir === 'LEFT') {
        for (let r = 0; r < 4; r++) {
          const { newLine, points } = slideLine(grid[r]);
          earnedPoints += points;
          for (let c = 0; c < 4; c++) {
            if (nextGrid[r][c] !== newLine[c]) changed = true;
            nextGrid[r][c] = newLine[c];
          }
        }
      } else if (dir === 'RIGHT') {
        for (let r = 0; r < 4; r++) {
          const reversed = [...grid[r]].reverse();
          const { newLine, points } = slideLine(reversed);
          earnedPoints += points;
          const restored = newLine.reverse();
          for (let c = 0; c < 4; c++) {
            if (nextGrid[r][c] !== restored[c]) changed = true;
            nextGrid[r][c] = restored[c];
          }
        }
      } else if (dir === 'UP') {
        for (let c = 0; c < 4; c++) {
          const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
          const { newLine, points } = slideLine(col);
          earnedPoints += points;
          for (let r = 0; r < 4; r++) {
            if (nextGrid[r][c] !== newLine[r]) changed = true;
            nextGrid[r][c] = newLine[r];
          }
        }
      } else if (dir === 'DOWN') {
        for (let c = 0; c < 4; c++) {
          const col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
          const { newLine, points } = slideLine(col);
          earnedPoints += points;
          const restored = newLine.reverse();
          for (let r = 0; r < 4; r++) {
            if (nextGrid[r][c] !== restored[r]) changed = true;
            nextGrid[r][c] = restored[r];
          }
        }
      }

      if (changed) {
        // Save undo point
        setPreviousState({ grid: grid.map((r) => [...r]), score, moves });

        const withSpawn = spawnRandomTile(nextGrid, fourProbability);
        const newScore = score + earnedPoints;
        const newMoves = moves + 1;
        setGrid(withSpawn);
        setScore(newScore);
        setMoves(newMoves);

        if (earnedPoints > 0) {
          gameAudio.playMatch();
        } else {
          gameAudio.playMove();
        }

        // Campaign Mode Objective Check
        if (gameMode === 'campaign' && !levelCleared) {
          const maxBoardTile = Math.max(...withSpawn.flat());
          const reachedTargetTile = maxBoardTile >= targetTile;
          const reachedTargetScore = newScore >= targetScore;

          if (reachedTargetTile || reachedTargetScore) {
            triggerVictory(newScore, newMoves);
            return;
          }
        }

        // Check for game over
        if (!canMove(withSpawn)) {
          setIsGameOver(true);
          gameAudio.playError();
        }
      }
    },
    [
      grid,
      score,
      moves,
      isGameOver,
      isPaused,
      gameMode,
      levelCleared,
      fourProbability,
      targetTile,
      targetScore,
      triggerVictory,
    ]
  );

  // Undo 1 step
  const handleUndo = () => {
    if (!previousState || undosRemaining <= 0) return;
    setGrid(previousState.grid);
    setScore(previousState.score);
    setMoves(previousState.moves);
    setPreviousState(null);
    if (difficulty !== 'Easy') {
      setUndosRemaining((u) => u - 1);
    }
    setIsGameOver(false);
    gameAudio.playMove();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isLevelSelectorOpen || isVictoryModalOpen) return;

      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        move('UP');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        move('DOWN');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        move('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        move('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, isPaused, isLevelSelectorOpen, isVictoryModalOpen]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < 25) return;

    if (absX > absY) {
      if (dx > 0) move('RIGHT');
      else move('LEFT');
    } else {
      if (dy > 0) move('DOWN');
      else move('UP');
    }
  };

  // Switch level
  const handleSelectLevel = (lvl: number) => {
    setCurrentLevelNumber(lvl);
    setIsLevelSelectorOpen(false);
  };

  // Next level from victory modal
  const handleNextLevel = () => {
    setIsVictoryModalOpen(false);
    if (currentLevelNumber < 10) {
      setCurrentLevelNumber((l) => l + 1);
    }
  };

  // Reset difficulty progress
  const handleResetDifficulty = () => {
    const updated = resetDifficultyProgress(gameId, difficulty);
    setProgressState(updated);
    setCurrentLevelNumber(1);
    setIsLevelSelectorOpen(false);
  };

  // Tile Color Styling
  const getTileStyles = (val: number): string => {
    switch (val) {
      case 2:
        return 'bg-amber-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100';
      case 4:
        return 'bg-amber-200 text-stone-800 dark:bg-stone-700 dark:text-amber-300';
      case 8:
        return 'bg-orange-400 text-white shadow-xs';
      case 16:
        return 'bg-orange-500 text-white shadow-xs';
      case 32:
        return 'bg-rose-500 text-white shadow-xs';
      case 64:
        return 'bg-rose-600 text-white shadow-md';
      case 128:
        return 'bg-yellow-400 text-stone-900 font-extrabold shadow-md';
      case 256:
        return 'bg-yellow-500 text-stone-900 font-extrabold shadow-md';
      case 512:
        return 'bg-emerald-500 text-white font-extrabold shadow-lg';
      case 1024:
        return 'bg-cyan-500 text-white font-extrabold shadow-lg';
      case 2048:
        return 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black shadow-xl ring-2 ring-yellow-400';
      default:
        return val > 2048
          ? 'bg-purple-700 text-white font-black shadow-xl'
          : 'bg-black/5 dark:bg-white/5 text-transparent';
    }
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto flex flex-col items-center">
      {/* UNIVERSAL LEVEL HEADER BAR */}
      <div className="w-full mb-4">
        <LevelHeaderBar
          levelNumber={currentLevelNumber}
          levelTitle={currentLevelMeta?.title || `Level ${currentLevelNumber}`}
          difficulty={difficulty}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((p) => !p)}
          onRestartLevel={initBoard}
          onOpenLevelSelector={() => setIsLevelSelectorOpen(true)}
          onChangeDifficulty={(d: GameDifficulty) => {
            setDifficulty(d);
            setCurrentLevelNumber(1);
          }}
        />
      </div>

      {/* MODE PICKER: CAMPAIGN VS ENDLESS */}
      <div className="w-full flex items-center justify-between mb-4 glass-panel p-2.5 rounded-2xl gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 apple-segmented p-1 rounded-full">
          <button
            type="button"
            onClick={() => setGameMode('campaign')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              gameMode === 'campaign'
                ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>10-Level Campaign</span>
          </button>
          <button
            type="button"
            onClick={() => setGameMode('endless')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              gameMode === 'endless'
                ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            <InfinityIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Endless Sandbox</span>
          </button>
        </div>

        {/* Live Objective Badge */}
        {gameMode === 'campaign' && currentLevelMeta && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-theme-muted">Target:</span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              Tile: {targetTile}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
              Score: {targetScore.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* TOP STATS & SCOREBOARD */}
      <div className="w-full flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="glass-panel px-3.5 py-1.5 rounded-xl text-center border border-black/5 dark:border-white/10">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">Score</span>
            <span className="text-base font-black font-mono text-indigo-500">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="glass-panel px-3.5 py-1.5 rounded-xl text-center border border-black/5 dark:border-white/10">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">High Tile</span>
            <span className="text-base font-black font-mono text-emerald-500">
              {highestTile > 0 ? highestTile : '-'}
            </span>
          </div>
          <div className="glass-panel px-3.5 py-1.5 rounded-xl text-center border border-black/5 dark:border-white/10">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">Moves</span>
            <span className="text-base font-black font-mono text-theme-primary">{moves}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="glass-panel px-3.5 py-1.5 rounded-xl text-center border border-black/5 dark:border-white/10">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">Best</span>
            <span className="text-base font-black font-mono text-theme-primary">
              {bestScore.toLocaleString()}
            </span>
          </div>
          <div className="glass-panel px-3.5 py-1.5 rounded-xl text-center border border-black/5 dark:border-white/10">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">Time</span>
            <span className="text-base font-black font-mono text-theme-secondary">
              {formatTimer(timerSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BAR: UNDO WITH COUNTER */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handleUndo}
          disabled={!previousState || undosRemaining <= 0}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>
            Undo Move ({difficulty === 'Easy' ? '∞' : `${undosRemaining} left`})
          </span>
        </button>

        <button
          type="button"
          onClick={initBoard}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary flex items-center gap-1.5 transition-all shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Board</span>
        </button>
      </div>

      {/* 4x4 GAME BOARD CONTAINER */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-md aspect-square p-3 sm:p-3.5 rounded-3xl glass-panel shadow-lg border border-black/10 dark:border-white/15 grid grid-cols-4 gap-2.5 sm:gap-3 bg-stone-200/50 dark:bg-stone-900/50 select-none relative"
      >
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-2xl flex items-center justify-center font-display font-black text-xl sm:text-3xl transition-transform duration-100 ${getTileStyles(
                val
              )}`}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}

        {/* GAME OVER OVERLAY */}
        {isGameOver && (
          <div className="absolute inset-0 z-20 rounded-3xl bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in">
            <h3 className="text-2xl font-black font-display mb-1">Game Over!</h3>
            <p className="text-xs text-stone-300 mb-4">No valid moves remaining on the board.</p>
            <div className="flex gap-2">
              {previousState && undosRemaining > 0 && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="px-4 py-2 rounded-xl bg-white/20 text-white font-bold text-xs"
                >
                  Undo Last Move
                </button>
              )}
              <button
                type="button"
                onClick={initBoard}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE / ON-SCREEN D-PAD CONTROLS */}
      <div className="mt-5 flex flex-col items-center gap-1.5 sm:hidden">
        <button
          type="button"
          onClick={() => move('UP')}
          aria-label="Slide Up"
          className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center active:scale-90 transition-all text-theme-primary shadow-xs"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => move('LEFT')}
            aria-label="Slide Left"
            className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center active:scale-90 transition-all text-theme-primary shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => move('DOWN')}
            aria-label="Slide Down"
            className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center active:scale-90 transition-all text-theme-primary shadow-xs"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => move('RIGHT')}
            aria-label="Slide Right"
            className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center active:scale-90 transition-all text-theme-primary shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <span className="text-[10px] text-theme-muted mt-1">
          Tip: You can also swipe directly on the board!
        </span>
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
        levelTitle={currentLevelMeta?.title || `Level ${currentLevelNumber}`}
        difficulty={difficulty}
        stars={earnedStars}
        stats={[
          { label: 'Score', value: score.toLocaleString() },
          { label: 'Moves', value: moves },
          { label: 'Time', value: formatTimer(timerSeconds) },
          { label: 'High Tile', value: highestTile },
        ]}
        onNextLevel={handleNextLevel}
        onReplayLevel={() => {
          setIsVictoryModalOpen(false);
          initBoard();
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
        levelTitle={currentLevelMeta?.title || `Level ${currentLevelNumber}`}
        objective={currentLevelMeta?.objective || ''}
        difficulty={difficulty}
        onResume={() => setIsPaused(false)}
        onRestartLevel={() => {
          setIsPaused(false);
          initBoard();
        }}
        onOpenLevelSelector={() => {
          setIsPaused(false);
          setIsLevelSelectorOpen(true);
        }}
        howToPlayTips={[
          'Use arrow keys, WASD, or swipe on mobile to slide and merge matching numerical tiles.',
          'Build chains in descending order towards one corner to keep open space for new spawns.',
        ]}
      />
    </div>
  );
};
