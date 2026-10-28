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
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

type SudokuDifficulty = 'Easy' | 'Medium' | 'Hard';

// Valid Sudoku Boards Generator using rotational symmetry and permutation shuffling
// This guarantees that all generated boards have valid, consistent solutions.
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

// Generate a valid solution board by randomly mapping digits 1-9 to a permutation
function generateSudoku(difficulty: SudokuDifficulty): {
  initial: (number | null)[][];
  solution: number[][];
} {
  // Digit permutation mapping
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  const solution: number[][] = Array(9)
    .fill(0)
    .map((_, r) =>
      Array(9)
        .fill(0)
        .map((_, c) => digits[BASE_SOLUTION[r][c] - 1])
    );

  // Determine clue count based on difficulty
  // Easy: ~38 clues (remove 43), Medium: ~30 clues (remove 51), Hard: ~24 clues (remove 57)
  const cluesToRemove = difficulty === 'Easy' ? 42 : difficulty === 'Medium' ? 50 : 56;

  const initial: (number | null)[][] = solution.map((row) => [...row]);

  // Symmetrically clear cells
  let removed = 0;
  const attempts = 120;
  for (let a = 0; a < attempts && removed < cluesToRemove; a++) {
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
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('Medium');
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
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize new game
  const startNewGame = useCallback((diff: SudokuDifficulty) => {
    const puzzle = generateSudoku(diff);
    setSolution(puzzle.solution);
    setBoard(puzzle.initial);

    // Initial mask true means cell is fixed and cannot be changed
    const mask = puzzle.initial.map((row) => row.map((cell) => cell !== null));
    setInitialMask(mask);

    // Empty candidate notes
    const emptyNotes = Array(9)
      .fill(0)
      .map(() =>
        Array(9)
          .fill(0)
          .map(() => new Set<number>())
      );
    setNotes(emptyNotes);

    setMistakes(0);
    setHintsLeft(3);
    setTimerSeconds(0);
    setIsVictory(false);
    setIsStarted(true);
    setSelectedCell(null);
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  // Timer interval
  useEffect(() => {
    if (!isStarted || isVictory) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isVictory]);

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
      if (!selectedCell || isVictory) return;
      const [r, c] = selectedCell;

      // Cannot modify initial clue cells
      if (initialMask[r][c]) return;

      if (pencilMode) {
        // Toggle note
        setNotes((prev) => {
          const next = prev.map((row) => row.map((cell) => new Set(cell)));
          const cellNotes = next[r][c];
          if (cellNotes.has(digit)) {
            cellNotes.delete(digit);
          } else {
            cellNotes.add(digit);
          }
          return next;
        });
        gameAudio.playMove();
        return;
      }

      // Value entry
      const expected = solution[r][c];
      const isCorrect = digit === expected;

      setBoard((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = digit;

        if (isCorrect) {
          gameAudio.playMove();
          if (checkCompletion(next)) {
            setIsVictory(true);
            gameAudio.playVictory();
          }
        } else {
          setMistakes((m) => m + 1);
          gameAudio.playError();
        }
        return next;
      });

      // Clear notes for this cell upon filling
      setNotes((prev) => {
        const next = prev.map((row) => row.map((cell) => new Set(cell)));
        next[r][c].clear();
        return next;
      });
    },
    [selectedCell, isVictory, initialMask, pencilMode, solution, checkCompletion]
  );

  // Erase active cell
  const handleErase = useCallback(() => {
    if (!selectedCell || isVictory) return;
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
  }, [selectedCell, isVictory, initialMask]);

  // Give a hint for current or random empty cell
  const handleHint = useCallback(() => {
    if (hintsLeft <= 0 || isVictory) return;

    let targetR = selectedCell ? selectedCell[0] : -1;
    let targetC = selectedCell ? selectedCell[1] : -1;

    // If selected cell is already correct or fixed, find the first empty cell
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
        setIsVictory(true);
        gameAudio.playVictory();
      }
      return next;
    });

    setSelectedCell([targetR, targetC]);
    setHintsLeft((prev) => prev - 1);
    gameAudio.playMatch();
  }, [hintsLeft, isVictory, selectedCell, initialMask, board, solution, checkCompletion]);

  // Keyboard navigation and numbers listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVictory) return;

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
  }, [selectedCell, isVictory, handleDigitInput, handleErase]);

  const selectedValue =
    selectedCell && board[selectedCell[0]]
      ? board[selectedCell[0]][selectedCell[1]]
      : null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      {/* Top Controls & Status Bar */}
      <div className="w-full flex items-center justify-between mb-4 glass-panel p-3.5 rounded-2xl gap-3 flex-wrap">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
          {(['Easy', 'Medium', 'Hard'] as SudokuDifficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                difficulty === d
                  ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                  : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Stats: Mistakes, Timer & Hints */}
        <div className="flex items-center gap-4 text-xs font-semibold">
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
            <span>Mistakes: {mistakes}</span>
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
        </div>
      </div>

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

              // Thick 3x3 block borders
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
                    // Candidate notes 3x3 subgrid
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
        {/* Tool Buttons: Pencil Notes, Erase, Restart */}
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
            onClick={() => startNewGame(difficulty)}
            className="px-4 py-2 rounded-xl text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary flex items-center gap-1.5 transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
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

      {/* VICTORY MODAL OVERLAY */}
      {isVictory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 sm:p-8 rounded-3xl text-center shadow-2xl border border-white/20 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-display text-theme-primary mb-1">
              Sudoku Solved!
            </h3>
            <p className="text-xs text-theme-secondary mb-4">
              Outstanding logical deduction. You completed the {difficulty} puzzle flawlessly!
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 bg-black/5 dark:bg-white/10 p-3 rounded-xl text-xs">
              <div>
                <span className="text-theme-muted block">Time</span>
                <span className="font-mono font-bold text-theme-primary">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
              <div>
                <span className="text-theme-muted block">Mistakes</span>
                <span className="font-bold text-theme-primary">{mistakes}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => startNewGame(difficulty)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Play Another Puzzle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
