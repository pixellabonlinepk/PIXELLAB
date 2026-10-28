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
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface TileData {
  id: number;
  value: number;
  row: number;
  col: number;
}

// 4x4 Grid Helpers
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

function spawnRandomTile(grid: number[][]): number[][] {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const val = Math.random() < 0.9 ? 2 : 4;
  const next = grid.map((row) => [...row]);
  next[r][c] = val;
  return next;
}

// Check if any legal moves remain
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

// Slide and merge one row or column line
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
  } | null>(null);

  const [hasWon, setHasWon] = useState<boolean>(false);
  const [keepPlaying, setKeepPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Touch swipe tracking coordinates
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

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

  // Restart game
  const restartGame = useCallback(() => {
    let initial = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    initial = spawnRandomTile(initial);
    initial = spawnRandomTile(initial);
    setGrid(initial);
    setScore(0);
    setPreviousState(null);
    setHasWon(false);
    setKeepPlaying(false);
    setIsGameOver(false);
  }, []);

  // Move action in direction
  const move = useCallback(
    (dir: Direction) => {
      if (isGameOver) return;

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
        setPreviousState({ grid: grid.map((r) => [...r]), score });

        const withSpawn = spawnRandomTile(nextGrid);
        setGrid(withSpawn);
        setScore((s) => s + earnedPoints);

        if (earnedPoints > 0) {
          gameAudio.playMatch();
        } else {
          gameAudio.playMove();
        }

        // Check for 2048 victory
        if (!hasWon && !keepPlaying) {
          const reached2048 = withSpawn.some((row) => row.some((v) => v >= 2048));
          if (reached2048) {
            setHasWon(true);
            gameAudio.playVictory();
          }
        }

        // Check for game over
        if (!canMove(withSpawn)) {
          setIsGameOver(true);
          gameAudio.playError();
        }
      }
    },
    [grid, score, hasWon, keepPlaying, isGameOver]
  );

  // Undo 1 step
  const handleUndo = () => {
    if (!previousState) return;
    setGrid(previousState.grid);
    setScore(previousState.score);
    setPreviousState(null);
    setIsGameOver(false);
    gameAudio.playMove();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [move]);

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

    if (Math.max(absX, absY) < 25) return; // Ignore small taps

    if (absX > absY) {
      if (dx > 0) move('RIGHT');
      else move('LEFT');
    } else {
      if (dy > 0) move('DOWN');
      else move('UP');
    }
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
    <div className="max-w-md mx-auto flex flex-col items-center">
      {/* Top Header & Scoreboard */}
      <div className="w-full flex items-center justify-between mb-4 gap-3">
        <div>
          <span className="text-xs font-bold text-theme-muted uppercase tracking-wider block">
            Objective: 2048
          </span>
          <span className="text-2xl font-black font-display text-theme-primary">
            2048 Merge
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="glass-panel px-3.5 py-1.5 rounded-xl text-center border border-black/5 dark:border-white/10">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">Score</span>
            <span className="text-base font-black font-mono text-indigo-500">{score}</span>
          </div>

          <div className="glass-panel px-3.5 py-1.5 rounded-xl text-center border border-black/5 dark:border-white/10">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">Best</span>
            <span className="text-base font-black font-mono text-theme-primary">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* Action Bar: Undo, Restart */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handleUndo}
          disabled={!previousState}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo Move</span>
        </button>

        <button
          type="button"
          onClick={restartGame}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary flex items-center gap-1.5 transition-all shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {/* 4x4 GAME BOARD CONTAINER */}
      <div
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full aspect-square p-3 sm:p-3.5 rounded-3xl glass-panel shadow-lg border border-black/10 dark:border-white/15 grid grid-cols-4 gap-2.5 sm:gap-3 bg-stone-200/50 dark:bg-stone-900/50 select-none relative"
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

        {/* 2048 VICTORY OVERLAY */}
        {hasWon && !keepPlaying && (
          <div className="absolute inset-0 z-20 rounded-3xl bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in">
            <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
            <h3 className="text-2xl font-black font-display mb-1">You reached 2048!</h3>
            <p className="text-xs text-stone-300 mb-5">
              Outstanding strategy! Would you like to keep going for an even higher score?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setKeepPlaying(true)}
                className="px-4 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs shadow-md"
              >
                Keep Playing
              </button>
              <button
                type="button"
                onClick={restartGame}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Restart
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {isGameOver && (
          <div className="absolute inset-0 z-20 rounded-3xl bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in">
            <h3 className="text-2xl font-black font-display mb-1">Game Over!</h3>
            <p className="text-xs text-stone-300 mb-4">No valid moves remaining on the board.</p>
            <button
              type="button"
              onClick={restartGame}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
            >
              Try Again
            </button>
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
    </div>
  );
};
