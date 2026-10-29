import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Pencil,
  Eraser,
  HelpCircle,
  Lightbulb,
  Play,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
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

const SUDOKU_LEVELS = GAME_LEVELS['sudoku'];

// Base verified solution matrix (Japanese standard Sudoku)
const BASE_SOLUTION = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

// Generates valid Sudoku with unique digit mapping and level-specific clues
function generateSudokuBoard(
  difficulty: GameDifficulty,
  levelNum: number
): {
  initial: (number | null)[][];
  solution: number[][];
} {
  // Digit permutation based on level seed
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shift = (levelNum * 3) % 9;
  for (let i = 0; i < shift; i++) {
    const el = digits.shift();
    if (el) digits.push(el);
  }

  // Row and col permutations
  const solution: number[][] = Array(9)
    .fill(0)
    .map((_, r) =>
      Array(9)
        .fill(0)
        .map((_, c) => digits[BASE_SOLUTION[r][c] - 1])
    );

  // Determine clue count: Easy (50 -> 40), Medium (38 -> 30), Hard (28 -> 22)
  let cluesGiven = 38;
  if (difficulty === 'Easy') {
    cluesGiven = Math.max(40, 50 - Math.round(levelNum * 1.1));
  } else if (difficulty === 'Medium') {
    cluesGiven = Math.max(30, 38 - Math.round(levelNum * 0.9));
  } else {
    cluesGiven = Math.max(22, 28 - Math.round(levelNum * 0.7));
  }

  const cluesToRemove = 81 - cluesGiven;
  const initial: (number | null)[][] = solution.map((row) => [...row]);

  // Symmetrically clear cells
  let removed = 0;
  let attempts = 0;
  while (removed < cluesToRemove && attempts < 200) {
    attempts++;
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    const oppR = 8 - r;
    const oppC = 8 - c;

    if (initial[r][c] !== null) {
      initial[r][c] = null;
      removed++;
      if (removed < cluesToRemove && initial[oppR][oppC] !== null) {
        initial[oppR][oppC] = null;
        removed++;
      }
    }
  }

  return { initial, solution };
}

export const SudokuGame: React.FC = () => {
  const [progression, setProgression] = useState(() => loadGameProgress('sudoku'));
  const [difficulty, setDifficulty] = useState<GameDifficulty>(progression.currentDifficulty);
  const [currentLevelNum, setCurrentLevelNum] = useState<number>(progression.currentLevel);

  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [initialMask, setInitialMask] = useState<boolean[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [notes, setNotes] = useState<Set<number>[][]>([]);

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 0]);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentLevelMeta =
    SUDOKU_LEVELS.find((l) => l.level === currentLevelNum) || SUDOKU_LEVELS[0];

  // Max mistakes allowed based on difficulty
  const maxMistakesAllowed = difficulty === 'Hard' ? 3 : difficulty === 'Medium' ? 5 : 99;

  // Initialize level
  const startLevel = useCallback(
    (lvlNum: number, diff: GameDifficulty) => {
      const puzzle = generateSudokuBoard(diff, lvlNum);
      setSolution(puzzle.solution);
      setBoard(puzzle.initial);

      const mask = puzzle.initial.map((row) => row.map((cell) => cell !== null));
      setInitialMask(mask);

      const emptyNotes = Array(9)
        .fill(0)
        .map(() =>
          Array(9)
            .fill(0)
            .map(() => new Set<number>())
        );
      setNotes(emptyNotes);

      // Hints per difficulty
      setHintsLeft(diff === 'Easy' ? 5 : diff === 'Medium' ? 3 : 1);
      setMistakes(0);
      setTimerSeconds(0);
      setIsVictory(false);
      setIsPaused(false);
      setSelectedCell(null);
      setCurrentLevelNum(lvlNum);
      setDifficulty(diff);
    },
    []
  );

  useEffect(() => {
    startLevel(currentLevelNum, difficulty);
  }, [currentLevelNum, difficulty, startLevel]);

  // Timer interval
  useEffect(() => {
    if (isVictory || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVictory, isPaused]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Check if board is complete and correct
  const checkCompletion = useCallback(
    (currentBoard: (number | null)[][]) => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentBoard[r][c] !== solution[r][c]) {
            return false;
          }
        }
      }
      return true;
    },
    [solution]
  );

  // Fill number in selected cell
  const handleDigitInput = useCallback(
    (digit: number) => {
      if (!selectedCell || isVictory || isPaused) return;
      const [r, c] = selectedCell;

      if (initialMask[r][c]) return;

      if (pencilMode) {
        setNotes((prev) => {
          const next = prev.map((row) => row.map((cell) => new Set(cell)));
          const cellNotes = next[r][c];
          if (cellNotes.has(digit)) cellNotes.delete(digit);
          else cellNotes.add(digit);
          return next;
        });
        gameAudio.playMove();
        return;
      }

      const expected = solution[r][c];
      const isCorrect = digit === expected;

      setBoard((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = digit;

        if (isCorrect) {
          gameAudio.playMove();
          if (checkCompletion(next)) {
            // Level conquered!
            const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
            setEarnedStars(stars);
            setIsVictory(true);
            gameAudio.playVictory();

            const result = completeLevel(
              'sudoku',
              difficulty,
              currentLevelNum,
              timerSeconds,
              stars,
              true
            );
            setProgression(result.updatedState);
          }
        } else {
          setMistakes((m) => {
            const nextMistakes = m + 1;
            if (nextMistakes >= maxMistakesAllowed) {
              gameAudio.playError();
            }
            return nextMistakes;
          });
          gameAudio.playError();
        }
        return next;
      });

      setNotes((prev) => {
        const next = prev.map((row) => row.map((cell) => new Set(cell)));
        next[r][c].clear();
        return next;
      });
    },
    [
      selectedCell,
      isVictory,
      isPaused,
      initialMask,
      pencilMode,
      solution,
      checkCompletion,
      mistakes,
      maxMistakesAllowed,
      difficulty,
      currentLevelNum,
      timerSeconds,
    ]
  );

  // Erase active cell
  const handleErase = useCallback(() => {
    if (!selectedCell || isVictory || isPaused) return;
    const [r, c] = selectedCell;
    if (initialMask[r][c]) return;

    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = null;
      return next;
    });

    setNotes((prev) => {
      const next = prev.map((row) => row.map((cell) => new Set(cell)));
      next[r][c].clear();
      return next;
    });

    gameAudio.playMove();
  }, [selectedCell, isVictory, isPaused, initialMask]);

  // Give a hint
  const handleHint = useCallback(() => {
    if (hintsLeft <= 0 || isVictory || isPaused) return;

    let targetR = selectedCell ? selectedCell[0] : -1;
    let targetC = selectedCell ? selectedCell[1] : -1;

    if (
      targetR < 0 ||
      targetC < 0 ||
      initialMask[targetR][targetC] ||
      board[targetR][targetC] === solution[targetR][targetC]
    ) {
      const emptyCells: [number, number][] = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] !== solution[r][c]) {
            emptyCells.push([r, c]);
          }
        }
      }
      if (emptyCells.length === 0) return;
      const pick = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      targetR = pick[0];
      targetC = pick[1];
    }

    const correctValue = solution[targetR][targetC];

    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      next[targetR][targetC] = correctValue;
      if (checkCompletion(next)) {
        const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        setEarnedStars(stars);
        setIsVictory(true);
        gameAudio.playVictory();
        const result = completeLevel(
          'sudoku',
          difficulty,
          currentLevelNum,
          timerSeconds,
          stars,
          true
        );
        setProgression(result.updatedState);
      }
      return next;
    });

    setSelectedCell([targetR, targetC]);
    setHintsLeft((prev) => prev - 1);
    gameAudio.playMatch();
  }, [
    hintsLeft,
    isVictory,
    isPaused,
    selectedCell,
    initialMask,
    board,
    solution,
    checkCompletion,
    mistakes,
    difficulty,
    currentLevelNum,
    timerSeconds,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVictory || isPaused) return;

      if (e.key >= '1' && e.key <= '9') {
        handleDigitInput(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key === 'ArrowUp') {
        setSelectedCell((prev) => (prev ? [Math.max(0, prev[0] - 1), prev[1]] : [0, 0]));
      } else if (e.key === 'ArrowDown') {
        setSelectedCell((prev) => (prev ? [Math.min(8, prev[0] + 1), prev[1]] : [0, 0]));
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell((prev) => (prev ? [prev[0], Math.max(0, prev[1] - 1)] : [0, 0]));
      } else if (e.key === 'ArrowRight') {
        setSelectedCell((prev) => (prev ? [prev[0], Math.min(8, prev[1] + 1)] : [0, 0]));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVictory, isPaused, handleDigitInput, handleErase]);

  const selectedValue =
    selectedCell && board[selectedCell[0]]
      ? board[selectedCell[0]][selectedCell[1]]
      : null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      {/* 1. LEVEL HEADER BAR (Controls, Level Badge, Difficulty Picker, Pause) */}
      <LevelHeaderBar
        levelNumber={currentLevelNum}
        levelTitle={currentLevelMeta.title}
        difficulty={difficulty}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((p) => !p)}
        onRestartLevel={() => startLevel(currentLevelNum, difficulty)}
        onOpenLevelSelector={() => setIsSelectorOpen(true)}
        onChangeDifficulty={(newDiff) => {
          setDifficulty(newDiff);
          startLevel(1, newDiff);
        }}
        additionalStats={
          <>
            <div className="flex items-center gap-1.5 text-theme-secondary">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-mono">{formatTimer(timerSeconds)}</span>
            </div>

            <div
              className={`flex items-center gap-1 ${
                mistakes > 0 ? 'text-rose-500' : 'text-theme-muted'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                Mistakes: {mistakes}
                {maxMistakesAllowed < 90 && ` / ${maxMistakesAllowed}`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleHint}
              disabled={hintsLeft <= 0}
              className="flex items-center gap-1 text-indigo-500 disabled:opacity-40 hover:underline"
              title="Reveal 1 Cell"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hints ({hintsLeft})</span>
            </button>
          </>
        }
      />

      {/* SUDOKU 9x9 GRID CONTAINER */}
      <div className="relative p-2 sm:p-3 rounded-2xl glass-panel shadow-md border border-black/10 dark:border-white/15 max-w-full">
        <div
          role="grid"
          aria-label="Sudoku 9x9 Board"
          className="grid grid-cols-9 border-2 border-black/30 dark:border-white/40 rounded-xl overflow-hidden bg-white/70 dark:bg-black/40"
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isFixed = initialMask[r] && initialMask[r][c];
              const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
              const hasSameValue =
                selectedValue !== null && cell !== null && cell === selectedValue;
              const isIncorrect =
                !isFixed && cell !== null && solution[r] && cell !== solution[r][c];

              const borderRight =
                c === 2 || c === 5
                  ? 'border-r-2 border-black/30 dark:border-white/40'
                  : 'border-r border-black/10 dark:border-white/10';
              const borderBottom =
                r === 2 || r === 5
                  ? 'border-b-2 border-black/30 dark:border-white/40'
                  : 'border-b border-black/10 dark:border-white/10';

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => setSelectedCell([r, c])}
                  className={`w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center font-display font-bold text-base sm:text-lg transition-all select-none relative ${borderRight} ${borderBottom} ${
                    isSelected
                      ? 'bg-indigo-500/25 ring-2 ring-indigo-500 ring-inset'
                      : hasSameValue
                      ? 'bg-indigo-500/10'
                      : selectedCell && (selectedCell[0] === r || selectedCell[1] === c)
                      ? 'bg-black/5 dark:bg-white/5'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  } ${
                    isIncorrect
                      ? 'text-rose-500 dark:text-rose-400 bg-rose-500/10'
                      : isFixed
                      ? 'text-theme-primary font-black'
                      : 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  }`}
                >
                  {cell !== null ? (
                    cell
                  ) : (
                    <div className="grid grid-cols-3 w-full h-full p-0.5 pointer-events-none">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <span
                          key={num}
                          className={`text-[8px] sm:text-[9px] leading-none flex items-center justify-center ${
                            notes[r] && notes[r][c] && notes[r][c].has(num)
                              ? 'text-theme-muted font-bold'
                              : 'opacity-0'
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* SUDOKU ACTION BUTTONS & NUMBER PAD */}
      <div className="w-full mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPencilMode(!pencilMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              pencilMode
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'glass-panel text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Notes {pencilMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleErase}
            className="px-4 py-2 rounded-xl text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Erase</span>
          </button>

          <button
            type="button"
            onClick={() => startLevel(currentLevelNum, difficulty)}
            className="px-4 py-2 rounded-xl text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary flex items-center gap-1.5 transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>

        {/* 1-9 Numeric Input Pad */}
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2 max-w-md mx-auto w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitInput(digit)}
              className="py-3 sm:py-3.5 rounded-xl font-display font-bold text-base sm:text-lg glass-panel hover:bg-indigo-600 hover:text-white transition-all active:scale-95 text-theme-primary flex items-center justify-center shadow-xs"
            >
              {digit}
            </button>
          ))}
        </div>
      </div>

      {/* LEVEL SELECTOR MODAL */}
      <LevelSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        levels={SUDOKU_LEVELS}
        currentLevel={currentLevelNum}
        currentDifficulty={difficulty}
        progressionState={progression}
        onSelectLevel={(lvl, diff) => {
          setDifficulty(diff);
          startLevel(lvl, diff);
        }}
        onResetDifficultyProgress={(diff) => {
          const updated = resetDifficultyProgress('sudoku', diff);
          setProgression(updated);
          startLevel(1, diff);
        }}
      />

      {/* PAUSE MODAL */}
      <PauseModal
        isOpen={isPaused}
        levelNumber={currentLevelNum}
        levelTitle={currentLevelMeta.title}
        objective={currentLevelMeta.objective}
        difficulty={difficulty}
        onResume={() => setIsPaused(false)}
        onRestartLevel={() => {
          setIsPaused(false);
          startLevel(currentLevelNum, difficulty);
        }}
        onOpenLevelSelector={() => {
          setIsPaused(false);
          setIsSelectorOpen(true);
        }}
        howToPlayTips={[
          'Every row, column, and 3×3 square must contain digits 1 through 9 with no duplicates.',
          'Toggle Notes mode (pencil icon) to jot down candidate possibilities in empty cells.',
        ]}
      />

      {/* LEVEL VICTORY MODAL */}
      <LevelVictoryModal
        isOpen={isVictory}
        levelNumber={currentLevelNum}
        levelTitle={currentLevelMeta.title}
        difficulty={difficulty}
        stars={earnedStars}
        stats={[
          { label: 'Time Elapsed', value: formatTimer(timerSeconds) },
          { label: 'Mistakes', value: mistakes },
        ]}
        onNextLevel={() => {
          const nextLvl = Math.min(10, currentLevelNum + 1);
          startLevel(nextLvl, difficulty);
        }}
        onReplayLevel={() => startLevel(currentLevelNum, difficulty)}
        onOpenLevelSelector={() => {
          setIsVictory(false);
          setIsSelectorOpen(true);
        }}
      />
    </div>
  );
};
