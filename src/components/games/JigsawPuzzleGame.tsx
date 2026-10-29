import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Layers,
  Footprints,
  Compass,
  Hash,
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';
import { GameDifficulty } from '../../types/gameProgression';
import {
  loadGameProgress,
  completeLevel,
  resetDifficultyProgress,
} from '../../utils/gameProgressionStore';
import { GAME_LEVELS } from '../../data/gameLevelsData';
import { PUZZLE_IMAGES, PuzzleImage } from '../../data/puzzleData';
import { LevelHeaderBar } from './common/LevelHeaderBar';
import { LevelSelectorModal } from './common/LevelSelectorModal';
import { LevelVictoryModal } from './common/LevelVictoryModal';
import { PauseModal } from './common/PauseModal';

export const JigsawPuzzleGame: React.FC = () => {
  const gameId = 'jigsaw-puzzle';
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

  // Grid Dimensions per Level
  const cols = (currentLevelMeta?.params?.cols as number) || 3;
  const rows = (currentLevelMeta?.params?.rows as number) || 3;
  const totalPieces = cols * rows;

  // Selected Image
  const recommendedImgId = (currentLevelMeta?.params?.imageId as string) || 'tropical-beach';
  const defaultImg = PUZZLE_IMAGES.find((img) => img.id === recommendedImgId) || PUZZLE_IMAGES[0];
  const [selectedImage, setSelectedImage] = useState<PuzzleImage>(defaultImg);

  // When level changes, update default image if match found
  useEffect(() => {
    const match = PUZZLE_IMAGES.find((img) => img.id === recommendedImgId);
    if (match) setSelectedImage(match);
  }, [recommendedImgId]);

  // Assists
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showNumbers, setShowNumbers] = useState<boolean>(() => difficulty === 'Easy');
  const [showGhost, setShowGhost] = useState<boolean>(() => difficulty === 'Easy');

  // Board state: array of piece indices currently in each slot
  // Correct state is [0, 1, 2, ..., totalPieces - 1]
  const [slots, setSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isLevelSolved, setIsLevelSolved] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize and shuffle jigsaw pieces
  const initJigsaw = useCallback(() => {
    const pieces = Array.from({ length: totalPieces }, (_, i) => i);

    let shuffled = [...pieces];
    let matches = 0;
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      matches = shuffled.filter((p, idx) => p === idx).length;
    } while (matches === shuffled.length && totalPieces > 1);

    setSlots(shuffled);
    setSelectedSlot(null);
    setMoves(0);
    setTimerSeconds(0);
    setIsLevelSolved(false);
  }, [totalPieces]);

  useEffect(() => {
    initJigsaw();
  }, [currentLevelNumber, difficulty, selectedImage, initJigsaw]);

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
    (finalMoves: number, finalTime: number) => {
      setIsLevelSolved(true);
      gameAudio.playVictory();

      // Calculate Stars (1-3)
      let stars = 1;
      const parMoves = totalPieces * 2;
      if (finalMoves <= parMoves && finalTime < totalPieces * 8) {
        stars = 3;
      } else if (finalMoves <= parMoves * 1.5) {
        stars = 2;
      } else {
        stars = 1;
      }
      setEarnedStars(stars);

      const baseScore = 2000;
      const efficiencyBonus = Math.max(0, (parMoves * 2 - finalMoves) * 50);
      const timeBonus = Math.max(0, 400 - finalTime * 3);
      const score = baseScore + efficiencyBonus + timeBonus;

      const { updatedState } = completeLevel(gameId, difficulty, currentLevelNumber, score, stars);
      setProgressState(updatedState);
      setIsVictoryModalOpen(true);
    },
    [difficulty, currentLevelNumber, totalPieces]
  );

  // Click slot to select or swap
  const handleSlotClick = (slotIndex: number) => {
    if (isLevelSolved || isPaused) return;

    if (selectedSlot === null) {
      setSelectedSlot(slotIndex);
      gameAudio.playMove();
    } else if (selectedSlot === slotIndex) {
      // Deselect
      setSelectedSlot(null);
    } else {
      // Swap pieces
      const newSlots = [...slots];
      const temp = newSlots[selectedSlot];
      newSlots[selectedSlot] = newSlots[slotIndex];
      newSlots[slotIndex] = temp;

      const newMoves = moves + 1;
      setSlots(newSlots);
      setSelectedSlot(null);
      setMoves(newMoves);

      const justSolvedPiece = newSlots[slotIndex] === slotIndex;
      if (justSolvedPiece) {
        gameAudio.playSnap();
      } else {
        gameAudio.playMove();
      }

      // Check victory
      const allCorrect = newSlots.every((piece, idx) => piece === idx);
      if (allCorrect) {
        triggerVictory(newMoves, timerSeconds);
      }
    }
  };

  const correctPiecesCount = slots.filter((p, idx) => p === idx).length;
  const progressPercent =
    totalPieces > 0 ? Math.round((correctPiecesCount / totalPieces) * 100) : 0;

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
    <div ref={containerRef} className="max-w-3xl mx-auto flex flex-col items-center select-none">
      {/* UNIVERSAL LEVEL HEADER BAR */}
      <div className="w-full mb-4">
        <LevelHeaderBar
          levelNumber={currentLevelNumber}
          levelTitle={currentLevelMeta?.title || `Level ${currentLevelNumber}`}
          difficulty={difficulty}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((p) => !p)}
          onRestartLevel={initJigsaw}
          onOpenLevelSelector={() => setIsLevelSelectorOpen(true)}
          onChangeDifficulty={(d: GameDifficulty) => {
            setDifficulty(d);
            setCurrentLevelNumber(1);
            if (d === 'Easy') {
              setShowNumbers(true);
              setShowGhost(true);
            } else {
              setShowNumbers(false);
              setShowGhost(false);
            }
          }}
        />
      </div>

      {/* TOP CONTROLS: STATS & ASSISTS */}
      <div className="w-full flex items-center justify-between mb-4 glass-panel p-3.5 rounded-2xl gap-3 flex-wrap">
        <div>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
            Level {currentLevelNumber} of 10 · {currentLevelMeta?.title}
          </span>
          <p className="text-xs text-theme-muted mt-0.5">
            {cols}×{rows} Grid ({totalPieces} Pieces) · {selectedImage.title}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-500/10 text-theme-secondary font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-500/10 text-theme-secondary font-mono">
            <Footprints className="w-3.5 h-3.5 text-indigo-500" />
            <span>Moves: {moves}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {correctPiecesCount}/{totalPieces} ({progressPercent}%)
            </span>
          </div>

          {/* Ghost overlay toggle */}
          <button
            type="button"
            onClick={() => setShowGhost((g) => !g)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              showGhost ? 'bg-indigo-600 text-white' : 'glass-panel text-theme-secondary'
            }`}
            title="Toggle Ghost Backdrop"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>

          {/* Numbers toggle */}
          <button
            type="button"
            onClick={() => setShowNumbers((n) => !n)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              showNumbers ? 'bg-indigo-600 text-white' : 'glass-panel text-theme-secondary'
            }`}
            title="Toggle Piece Number Guides"
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Nums</span>
          </button>

          {/* Reference Modal toggle */}
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-1 text-xs text-indigo-500 hover:underline px-2"
          >
            {showOriginal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* PHOTO THEME PICKER ROW */}
      <div className="w-full flex items-center justify-start gap-2 mb-4 overflow-x-auto py-1 scrollbar-none">
        {PUZZLE_IMAGES.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setSelectedImage(img)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedImage.id === img.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'glass-panel text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <span>{img.title}</span>
          </button>
        ))}
      </div>

      {/* JIGSAW PUZZLE BOARD CONTAINER */}
      <div className="relative p-3 sm:p-4 rounded-3xl glass-panel shadow-lg border border-black/10 dark:border-white/15 max-w-full">
        {/* Ghost image background guide */}
        {showGhost && (
          <div
            style={{
              backgroundImage: `url(${selectedImage.src || selectedImage.fallbackSvg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="absolute inset-4 rounded-2xl opacity-20 pointer-events-none transition-opacity"
          />
        )}

        <div
          role="grid"
          aria-label={`Jigsaw puzzle ${cols} by ${rows}`}
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            aspectRatio: `${cols} / ${rows}`,
          }}
          className="grid gap-1 sm:gap-1.5 rounded-2xl overflow-hidden w-[320px] sm:w-[460px] max-w-full bg-black/10 dark:bg-white/5 relative z-10"
        >
          {slots.map((pieceIdx, slotIdx) => {
            const isCorrect = pieceIdx === slotIdx;
            const isSelected = selectedSlot === slotIdx;

            // Calculate background position of the piece from source image
            const origRow = Math.floor(pieceIdx / cols);
            const origCol = pieceIdx % cols;
            const xPercent = cols > 1 ? (origCol / (cols - 1)) * 100 : 0;
            const yPercent = rows > 1 ? (origRow / (rows - 1)) * 100 : 0;

            return (
              <button
                key={slotIdx}
                type="button"
                onClick={() => handleSlotClick(slotIdx)}
                aria-label={`Slot ${slotIdx + 1}, piece ${pieceIdx + 1}`}
                style={{
                  backgroundImage: `url(${selectedImage.src || selectedImage.fallbackSvg})`,
                  backgroundSize: `${cols * 100}% ${rows * 100}%`,
                  backgroundPosition: `${xPercent}% ${yPercent}%`,
                }}
                className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-150 aspect-square select-none active:scale-95 ${
                  isSelected
                    ? 'ring-4 ring-indigo-500 z-20 scale-105 shadow-xl'
                    : isCorrect
                    ? 'border-2 border-emerald-400/60 shadow-xs'
                    : 'border border-black/20 dark:border-white/20 hover:border-indigo-400'
                }`}
              >
                {/* Number Overlay for Assist */}
                {showNumbers && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-black/60 text-white pointer-events-none">
                    {pieceIdx + 1}
                  </span>
                )}

                {/* Visual Lock Checkmark on correct snap */}
                {isCorrect && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500/90 text-white flex items-center justify-center pointer-events-none shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ORIGINAL IMAGE PREVIEW OVERLAY */}
        {showOriginal && (
          <div className="absolute inset-0 z-30 rounded-3xl bg-black/85 backdrop-blur-md p-4 flex flex-col items-center justify-center animate-in fade-in">
            <img
              src={selectedImage.src || selectedImage.fallbackSvg}
              alt={selectedImage.title}
              className="max-h-[80%] rounded-xl object-contain shadow-2xl mb-3"
            />
            <button
              type="button"
              onClick={() => setShowOriginal(false)}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-stone-900 shadow-md"
            >
              Close Reference
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-theme-muted mt-3 text-center">
        Click a piece to select it, then click another piece to swap their positions.
      </p>

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
          { label: 'Moves', value: moves },
          { label: 'Time Elapsed', value: formatTimer(timerSeconds) },
          { label: 'Pieces Snapped', value: totalPieces },
        ]}
        onNextLevel={handleNextLevel}
        onReplayLevel={() => {
          setIsVictoryModalOpen(false);
          initJigsaw();
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
          initJigsaw();
        }}
        onOpenLevelSelector={() => {
          setIsPaused(false);
          setIsLevelSelectorOpen(true);
        }}
        howToPlayTips={[
          'Click a piece to select it, then click another piece to swap their positions.',
          'Pieces in the correct position show a green checkmark and lock outline.',
          'Use Guide or Nums buttons for assistance if assembling high piece counts.',
        ]}
      />
    </div>
  );
};
