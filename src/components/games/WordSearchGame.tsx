import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  Search,
  BookOpen,
  Lightbulb,
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
  'bg-orange-500/30 text-orange-800 dark:text-orange-200 ring-2 ring-orange-500',
  'bg-blue-500/30 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500',
  'bg-violet-500/30 text-violet-800 dark:text-violet-200 ring-2 ring-violet-500',
  'bg-lime-500/30 text-lime-800 dark:text-lime-200 ring-2 ring-lime-500',
];

// Generate Grid with Guaranteed Placed Words
function generateWordSearch(
  size: number,
  wordList: string[],
  difficulty: GameDifficulty
): {
  grid: string[][];
  placedWords: PlacedWord[];
} {
  const grid: string[][] = Array(size)
    .fill('')
    .map(() => Array(size).fill(''));

  const placedWords: PlacedWord[] = [];

  // Allowed directions depending on difficulty
  let directions: [number, number][];
  if (difficulty === 'Easy') {
    directions = [
      [0, 1], // horizontal right
      [1, 0], // vertical down
    ];
  } else if (difficulty === 'Medium') {
    directions = [
      [0, 1], // horizontal right
      [1, 0], // vertical down
      [1, 1], // diagonal down-right
      [-1, 1], // diagonal up-right
    ];
  } else {
    // Hard: includes backward and all diagonals
    directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 1],
      [0, -1], // horizontal left
      [-1, 0], // vertical up
      [-1, -1], // diagonal up-left
      [1, -1], // diagonal down-left
    ];
  }

  // Try placing each word
  wordList.forEach((rawWord, idx) => {
    const word = rawWord.toUpperCase();
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const [dr, dc] = dir;

      // Calculate starting boundaries
      const minR = dr < 0 ? word.length - 1 : 0;
      const maxR = dr > 0 ? size - word.length : size - 1;
      const minC = dc < 0 ? word.length - 1 : 0;
      const maxC = dc > 0 ? size - word.length : size - 1;

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
  const gameId = 'word-search';
  const levelsMeta = GAME_LEVELS[gameId] || [];

  // Progression & Difficulty
  const [difficulty, setDifficulty] = useState<GameDifficulty>('Medium');
  const [progressState, setProgressState] = useState(() => loadGameProgress(gameId));
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);

  const currentLevelMeta = levelsMeta[currentLevelNumber - 1] || levelsMeta[0];

  // Grid & Words state
  const [gridSize, setGridSize] = useState<number>(10);
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<[number, number] | null>(null);
  const [currentSelection, setCurrentSelection] = useState<[number, number][]>([]);

  // Hints
  const maxHints = difficulty === 'Easy' ? 4 : difficulty === 'Medium' ? 2 : 1;
  const [hintsRemaining, setHintsRemaining] = useState<number>(maxHints);
  const [hintedWordCells, setHintedWordCells] = useState<[number, number][]>([]);

  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isLevelSolved, setIsLevelSolved] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize level
  const initLevel = useCallback(() => {
    const rawWords = (currentLevelMeta?.params?.words as string[]) || ['PIXEL', 'LENS', 'FOCUS'];
    let baseSize = (currentLevelMeta?.params?.gridSize as number) || 10;
    // Adjust size slightly per difficulty
    if (difficulty === 'Easy') baseSize = Math.max(8, baseSize - 1);
    if (difficulty === 'Hard') baseSize = Math.min(15, baseSize + 1);

    setGridSize(baseSize);
    const result = generateWordSearch(baseSize, rawWords, difficulty);
    setGrid(result.grid);
    setPlacedWords(result.placedWords);
    setIsSelecting(false);
    setSelectionStart(null);
    setCurrentSelection([]);
    setHintsRemaining(maxHints);
    setHintedWordCells([]);
    setTimerSeconds(0);
    setIsLevelSolved(false);
  }, [currentLevelMeta, difficulty, maxHints]);

  useEffect(() => {
    initLevel();
  }, [currentLevelNumber, difficulty, initLevel]);

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

  // Straight line cells calculation
  const getLineCells = (start: [number, number], end: [number, number]): [number, number][] => {
    const [r1, c1] = start;
    const [r2, c2] = end;
    const dr = r2 - r1;
    const dc = c2 - c1;

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

  // Complete level
  const triggerVictory = useCallback(
    (timeSec: number) => {
      setIsLevelSolved(true);
      gameAudio.playVictory();

      // Calculate Stars (1-3)
      let stars = 1;
      if (timeSec < 60) {
        stars = 3;
      } else if (timeSec < 150) {
        stars = 2;
      } else {
        stars = 1;
      }
      setEarnedStars(stars);

      const baseScore = 1500;
      const timeBonus = Math.max(0, 500 - timeSec * 2);
      const finalScore = baseScore + timeBonus;

      const { updatedState } = completeLevel(gameId, difficulty, currentLevelNumber, finalScore, stars);
      setProgressState(updatedState);
      setIsVictoryModalOpen(true);
    },
    [difficulty, currentLevelNumber]
  );

  // Touch and Click handling: Tap-to-select and Drag support
  const handleCellClick = (r: number, c: number) => {
    if (isLevelSolved || isPaused) return;

    if (!selectionStart) {
      // First tap
      setSelectionStart([r, c]);
      setCurrentSelection([[r, c]]);
      setIsSelecting(true);
      gameAudio.playMove();
    } else {
      // Second tap: complete line!
      const line = getLineCells(selectionStart, [r, c]);
      validateSelection(line);
    }
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (!isSelecting || !selectionStart || isLevelSolved || isPaused) return;
    const line = getLineCells(selectionStart, [r, c]);
    setCurrentSelection(line);
  };

  const validateSelection = (selection: [number, number][]) => {
    if (selection.length === 0) {
      setIsSelecting(false);
      setSelectionStart(null);
      setCurrentSelection([]);
      return;
    }

    const selectedLetters = selection.map(([r, c]) => grid[r]?.[c] || '').join('');
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
      gameAudio.playSnap();
      setPlacedWords(updated);

      const allFound = updated.every((w) => w.isFound);
      if (allFound) {
        triggerVictory(timerSeconds);
      }
    } else {
      gameAudio.playMove();
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setCurrentSelection([]);
  };

  const handleMouseUp = () => {
    if (isSelecting && currentSelection.length > 1) {
      validateSelection(currentSelection);
    }
  };

  // Provide a hint: reveals the starting letter and direction of an unfound word
  const triggerHint = () => {
    if (hintsRemaining <= 0 || isLevelSolved || isPaused) return;
    const unfound = placedWords.filter((w) => !w.isFound);
    if (unfound.length === 0) return;

    const pick = unfound[0];
    setHintedWordCells(pick.cells.slice(0, 2)); // Highlight first 2 cells
    setHintsRemaining((h) => h - 1);
    gameAudio.playSnap();

    setTimeout(() => {
      setHintedWordCells([]);
    }, 3500);
  };

  const foundCount = placedWords.filter((w) => w.isFound).length;
  const totalCount = placedWords.length;

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
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="max-w-4xl mx-auto flex flex-col items-center select-none"
    >
      {/* UNIVERSAL LEVEL HEADER BAR */}
      <div className="w-full mb-4">
        <LevelHeaderBar
          levelNumber={currentLevelNumber}
          levelTitle={currentLevelMeta?.title || `Level ${currentLevelNumber}`}
          difficulty={difficulty}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((p) => !p)}
          onRestartLevel={initLevel}
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
            Level {currentLevelNumber} of 10 · {currentLevelMeta?.title}
          </span>
          <p className="text-xs text-theme-muted mt-0.5">{currentLevelMeta?.objective}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Found Count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {foundCount} / {totalCount} Words
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-500/10 text-theme-secondary font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-theme-muted" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* Hint */}
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

      {/* MAIN GAME CONTAINER: GRID + WORD CHECKLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full items-start">
        {/* WORD SEARCH LETTER MATRIX (3 Cols) */}
        <div className="lg:col-span-3 flex justify-center">
          <div
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
            className="grid gap-1 sm:gap-1.5 p-3 sm:p-4 rounded-3xl glass-panel shadow-md border border-black/10 dark:border-white/15 max-w-full overflow-hidden"
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const isSelected = currentSelection.some(([sr, sc]) => sr === r && sc === c);
                const isHinted = hintedWordCells.some(([hr, hc]) => hr === r && hc === c);
                const foundWord = placedWords.find(
                  (w) => w.isFound && w.cells.some(([fr, fc]) => fr === r && fc === c)
                );

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    onMouseEnter={() => handleCellMouseEnter(r, c)}
                    className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl font-mono font-bold text-xs sm:text-base flex items-center justify-center transition-all select-none ${
                      isSelected
                        ? 'bg-indigo-600 text-white scale-105 shadow-xs ring-2 ring-indigo-400'
                        : isHinted
                        ? 'bg-amber-400 text-stone-900 animate-pulse ring-2 ring-amber-500 font-black'
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
        <div className="lg:col-span-1 glass-panel p-4 rounded-3xl border border-black/5 dark:border-white/10 w-full">
          <h4 className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-3">
            Target Lexicon ({foundCount}/{totalCount})
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
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

          <p className="text-[11px] text-theme-muted mt-3 italic border-t border-black/5 dark:border-white/10 pt-2">
            Tip: Click the first letter, then click the last letter of any straight word!
          </p>
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
        levelTitle={currentLevelMeta?.title || `Level ${currentLevelNumber}`}
        difficulty={difficulty}
        stars={earnedStars}
        stats={[
          { label: 'Words Found', value: totalCount },
          { label: 'Time Elapsed', value: formatTimer(timerSeconds) },
          { label: 'Score', value: 1500 + Math.max(0, 500 - timerSeconds * 2) },
        ]}
        onNextLevel={handleNextLevel}
        onReplayLevel={() => {
          setIsVictoryModalOpen(false);
          initLevel();
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
          initLevel();
        }}
        onOpenLevelSelector={() => {
          setIsPaused(false);
          setIsLevelSelectorOpen(true);
        }}
        howToPlayTips={[
          'Find all words listed in the Target Lexicon within the grid.',
          'Tap or click the starting letter, then tap the ending letter to highlight the word.',
          'Words can run horizontally, vertically, or diagonally depending on the difficulty setting.',
        ]}
      />
    </div>
  );
};
