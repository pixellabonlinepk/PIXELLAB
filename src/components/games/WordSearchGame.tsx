import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  Search,
  BookOpen,
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

type WordDifficulty = 'Easy' | 'Medium' | 'Hard';

interface WordTheme {
  name: string;
  words: string[];
}

const THEMES: WordTheme[] = [
  {
    name: 'Digital Imaging',
    words: ['PIXEL', 'CANVAS', 'SHUTTER', 'LENS', 'FOCUS', 'FILTER', 'MATRIX', 'VECTOR', 'EXPOSURE'],
  },
  {
    name: 'Color Harmony',
    words: ['CYAN', 'MAGENTA', 'INDIGO', 'VIOLET', 'AMBER', 'EMERALD', 'COBALT', 'SEPIA', 'BRONZE'],
  },
  {
    name: 'Creative Tech',
    words: ['PYTHON', 'CODE', 'RENDER', 'SHADOW', 'GRAPHIC', 'TEXTURE', 'GRADIENT', 'LAYERS'],
  },
];

interface PlacedWord {
  word: string;
  startR: number;
  startC: number;
  endR: number;
  endC: number;
  cells: [number, number][];
  isFound: boolean;
  color: string;
}

const PASTEL_COLORS = [
  'bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 ring-2 ring-indigo-500',
  'bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500',
  'bg-pink-500/30 text-pink-800 dark:text-pink-200 ring-2 ring-pink-500',
  'bg-amber-500/30 text-amber-800 dark:text-amber-200 ring-2 ring-amber-500',
  'bg-cyan-500/30 text-cyan-800 dark:text-cyan-200 ring-2 ring-cyan-500',
  'bg-purple-500/30 text-purple-800 dark:text-purple-200 ring-2 ring-purple-500',
  'bg-rose-500/30 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500',
  'bg-teal-500/30 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500',
];

// Generate Grid with Guaranteed Placed Words
function generateWordSearch(
  size: number,
  wordList: string[]
): {
  grid: string[][];
  placedWords: PlacedWord[];
} {
  const grid: string[][] = Array(size)
    .fill('')
    .map(() => Array(size).fill(''));

  const placedWords: PlacedWord[] = [];
  const directions: [number, number][] = [
    [0, 1], // horizontal right
    [1, 0], // vertical down
    [1, 1], // diagonal down-right
    [-1, 1], // diagonal up-right
  ];

  // Try placing each word
  wordList.forEach((rawWord, idx) => {
    const word = rawWord.toUpperCase();
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 150) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const [dr, dc] = dir;

      // Calculate starting boundaries
      const minR = dr === -1 ? word.length - 1 : 0;
      const maxR = dr === 1 ? size - word.length : size - 1;
      const minC = 0;
      const maxC = size - word.length;

      if (maxR < minR || maxC < minC) continue;

      const r = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
      const c = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

      // Check collision
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const checkR = r + dr * i;
        const checkC = c + dc * i;
        const currentLetter = grid[checkR][checkC];
        if (currentLetter !== '' && currentLetter !== word[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        const cells: [number, number][] = [];
        for (let i = 0; i < word.length; i++) {
          const placeR = r + dr * i;
          const placeC = c + dc * i;
          grid[placeR][placeC] = word[i];
          cells.push([placeR, placeC]);
        }

        placedWords.push({
          word,
          startR: r,
          startC: c,
          endR: r + dr * (word.length - 1),
          endC: c + dc * (word.length - 1),
          cells,
          isFound: false,
          color: PASTEL_COLORS[idx % PASTEL_COLORS.length],
        });
        placed = true;
      }
    }
  });

  // Fill remaining empty cells with random letters
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return { grid, placedWords };
}

export const WordSearchGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<WordDifficulty>('Easy');
  const [themeIdx, setThemeIdx] = useState<number>(0);
  const [gridSize, setGridSize] = useState<number>(10);

  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<[number, number] | null>(null);
  const [currentSelection, setCurrentSelection] = useState<[number, number][]>([]);

  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTheme = THEMES[themeIdx];

  const getGridSize = (diff: WordDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 10;
      case 'Medium':
        return 12;
      case 'Hard':
        return 14;
    }
  };

  const startNewPuzzle = useCallback((diff: WordDifficulty, thIdx: number) => {
    const size = getGridSize(diff);
    setGridSize(size);
    const result = generateWordSearch(size, THEMES[thIdx].words);
    setGrid(result.grid);
    setPlacedWords(result.placedWords);
    setIsSelecting(false);
    setSelectionStart(null);
    setCurrentSelection([]);
    setTimerSeconds(0);
    setIsVictory(false);
  }, []);

  useEffect(() => {
    startNewPuzzle(difficulty, themeIdx);
  }, [difficulty, themeIdx, startNewPuzzle]);

  // Timer runner
  useEffect(() => {
    if (isVictory) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVictory]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate straight line cells between start and end
  const getLineCells = (start: [number, number], end: [number, number]): [number, number][] => {
    const [r1, c1] = start;
    const [r2, c2] = end;
    const dr = r2 - r1;
    const dc = c2 - c1;

    // Check if horizontal, vertical, or 45-degree diagonal
    const isHorizontal = dr === 0;
    const isVertical = dc === 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc);

    if (!isHorizontal && !isVertical && !isDiagonal) {
      return [start];
    }

    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const stepR = dr === 0 ? 0 : dr / steps;
    const stepC = dc === 0 ? 0 : dc / steps;

    const cells: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push([r1 + stepR * i, c1 + stepC * i]);
    }
    return cells;
  };

  const handleCellMouseDown = (r: number, c: number) => {
    if (isVictory) return;
    setIsSelecting(true);
    setSelectionStart([r, c]);
    setCurrentSelection([[r, c]]);
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (!isSelecting || !selectionStart || isVictory) return;
    const line = getLineCells(selectionStart, [r, c]);
    setCurrentSelection(line);
  };

  const handleMouseUp = () => {
    if (!isSelecting || currentSelection.length === 0 || isVictory) {
      setIsSelecting(false);
      return;
    }

    // Check if selection matches any placed word
    const selectedLetters = currentSelection.map(([r, c]) => grid[r][c]).join('');
    const reversedLetters = selectedLetters.split('').reverse().join('');

    let foundMatch = false;
    const updated = placedWords.map((item) => {
      if (item.isFound) return item;
      if (item.word === selectedLetters || item.word === reversedLetters) {
        foundMatch = true;
        return { ...item, isFound: true };
      }
      return item;
    });

    if (foundMatch) {
      gameAudio.playMatch();
      setPlacedWords(updated);

      const allFound = updated.every((w) => w.isFound);
      if (allFound) {
        setIsVictory(true);
        gameAudio.playVictory();
      }
    } else {
      gameAudio.playMove();
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setCurrentSelection([]);
  };

  const foundCount = placedWords.filter((w) => w.isFound).length;
  const totalCount = placedWords.length;

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="max-w-4xl mx-auto flex flex-col items-center select-none"
    >
      {/* Top Controls & Status Bar */}
      <div className="w-full flex items-center justify-between mb-4 glass-panel p-3.5 rounded-2xl gap-3 flex-wrap">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
          {(['Easy', 'Medium', 'Hard'] as WordDifficulty[]).map((d) => (
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
              {d} ({getGridSize(d)}×{getGridSize(d)})
            </button>
          ))}
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <select
            value={themeIdx}
            onChange={(e) => setThemeIdx(parseInt(e.target.value, 10))}
            className="text-xs font-semibold bg-black/5 dark:bg-white/10 rounded-lg px-2.5 py-1 text-theme-primary border-none focus:outline-none"
          >
            {THEMES.map((th, idx) => (
              <option key={th.name} value={idx}>
                {th.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-theme-secondary">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-mono">{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-500">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              Found: {foundCount} / {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => startNewPuzzle(difficulty, themeIdx)}
            className="p-1 rounded-full text-theme-muted hover:text-theme-primary transition-colors"
            title="New Puzzle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN GAME CONTAINER: GRID + WORD CHECKLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full items-start">
        {/* WORD SEARCH LETTER MATRIX (3 Cols) */}
        <div className="lg:col-span-3 flex justify-center">
          <div
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
            className="grid gap-1 sm:gap-1.5 p-3 rounded-2xl glass-panel shadow-md border border-black/10 dark:border-white/15 max-w-full"
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                // Check if in current mouse drag
                const isSelected = currentSelection.some(([sr, sc]) => sr === r && sc === c);

                // Check if cell belongs to a found word
                const foundWord = placedWords.find(
                  (w) => w.isFound && w.cells.some(([fr, fc]) => fr === r && fc === c)
                );

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onMouseDown={() => handleCellMouseDown(r, c)}
                    onMouseEnter={() => handleCellMouseEnter(r, c)}
                    className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl font-mono font-bold text-xs sm:text-base flex items-center justify-center transition-all select-none ${
                      isSelected
                        ? 'bg-indigo-600 text-white scale-105 shadow-xs'
                        : foundWord
                        ? `${foundWord.color} font-black`
                        : 'bg-white/60 dark:bg-black/30 hover:bg-black/5 dark:hover:bg-white/10 text-theme-primary'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* TARGET WORD CHECKLIST (1 Col) */}
        <div className="lg:col-span-1 glass-panel p-4 rounded-2xl border border-black/5 dark:border-white/10">
          <h4 className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-3">
            Target Words ({foundCount}/{totalCount})
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {placedWords.map((item, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center justify-between transition-all ${
                  item.isFound
                    ? 'line-through opacity-40 bg-black/5 dark:bg-white/5 text-theme-muted'
                    : 'text-theme-primary font-bold'
                }`}
              >
                <span>{item.word}</span>
                {item.isFound && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
            ))}
          </div>
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
              Word Search Cleared!
            </h3>
            <p className="text-xs text-theme-secondary mb-4">
              You uncovered all {totalCount} words in {formatTimer(timerSeconds)}!
            </p>

            <button
              type="button"
              onClick={() => startNewPuzzle(difficulty, (themeIdx + 1) % THEMES.length)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Play Next Theme
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
