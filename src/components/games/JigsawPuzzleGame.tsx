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
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';
import { PUZZLE_IMAGES, PuzzleImage } from '../../data/puzzleData';

type JigsawDifficulty = 3 | 4 | 5; // 3x3=9, 4x4=16, 5x5=25

export const JigsawPuzzleGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<JigsawDifficulty>(3);
  const [selectedImage, setSelectedImage] = useState<PuzzleImage>(PUZZLE_IMAGES[0]);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  // Board state: array of piece indices currently in each slot
  // Correct state is [0, 1, 2, ..., totalPieces - 1]
  const [slots, setSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalPieces = gridSize * gridSize;

  // Initialize and shuffle jigsaw pieces
  const initJigsaw = useCallback(
    (size: JigsawDifficulty) => {
      const pieces = Array.from({ length: size * size }, (_, i) => i);

      // Fisher-Yates shuffle ensuring at least some pieces start out of place
      let shuffled = [...pieces];
      let matches = 0;
      do {
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        matches = shuffled.filter((p, idx) => p === idx).length;
      } while (matches === shuffled.length); // Ensure not already solved

      setSlots(shuffled);
      setSelectedSlot(null);
      setMoves(0);
      setTimerSeconds(0);
      setIsVictory(false);
    },
    []
  );

  useEffect(() => {
    initJigsaw(gridSize);
  }, [gridSize, selectedImage, initJigsaw]);

  // Stopwatch
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

  // Click slot to select or swap
  const handleSlotClick = (slotIndex: number) => {
    if (isVictory) return;

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

      setSlots(newSlots);
      setSelectedSlot(null);
      setMoves((m) => m + 1);

      // Check if newly placed piece is in correct spot
      const justSolvedPiece = newSlots[slotIndex] === slotIndex;
      if (justSolvedPiece) {
        gameAudio.playSnap();
      } else {
        gameAudio.playMove();
      }

      // Check victory
      const allCorrect = newSlots.every((piece, idx) => piece === idx);
      if (allCorrect) {
        setIsVictory(true);
        gameAudio.playVictory();
      }
    }
  };

  const correctPiecesCount = slots.filter((p, idx) => p === idx).length;
  const progressPercent = Math.round((correctPiecesCount / totalPieces) * 100);

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      {/* Top Controls: Difficulty & Stats */}
      <div className="w-full flex items-center justify-between mb-4 glass-panel p-3.5 rounded-2xl gap-3 flex-wrap">
        {/* Difficulty Switcher */}
        <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
          {([3, 4, 5] as JigsawDifficulty[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setGridSize(sz)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                gridSize === sz
                  ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                  : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              {sz}×{sz} ({sz * sz} Pcs)
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-theme-secondary">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-mono">{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-theme-secondary">
            <Footprints className="w-3.5 h-3.5 text-indigo-500" />
            <span>Moves: {moves}</span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-500">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {correctPiecesCount}/{totalPieces} ({progressPercent}%)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-1 text-xs text-indigo-500 hover:underline"
          >
            {showOriginal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => initJigsaw(gridSize)}
            className="p-1 rounded-full text-theme-muted hover:text-theme-primary"
            title="Reshuffle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PHOTO THEME PICKER ROW */}
      <div className="w-full flex items-center justify-center gap-2 mb-4 overflow-x-auto py-1">
        {PUZZLE_IMAGES.slice(0, 4).map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setSelectedImage(img)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
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
      <div className="relative p-2.5 sm:p-3.5 rounded-3xl glass-panel shadow-lg border border-black/10 dark:border-white/15 max-w-full">
        <div
          role="grid"
          aria-label={`Jigsaw puzzle ${gridSize} by ${gridSize}`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
          className="grid gap-1 sm:gap-1.5 rounded-2xl overflow-hidden aspect-square w-[320px] sm:w-[420px] max-w-full bg-black/10 dark:bg-white/5"
        >
          {slots.map((pieceIdx, slotIdx) => {
            const isCorrect = pieceIdx === slotIdx;
            const isSelected = selectedSlot === slotIdx;

            // Calculate background position of the piece from source image
            const origRow = Math.floor(pieceIdx / gridSize);
            const origCol = pieceIdx % gridSize;
            const xPercent = (origCol / (gridSize - 1)) * 100;
            const yPercent = (origRow / (gridSize - 1)) * 100;

            return (
              <button
                key={slotIdx}
                type="button"
                onClick={() => handleSlotClick(slotIdx)}
                aria-label={`Slot ${slotIdx + 1}, piece ${pieceIdx + 1}`}
                style={{
                  backgroundImage: `url(${selectedImage.src || selectedImage.fallbackSvg})`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${xPercent}% ${yPercent}%`,
                }}
                className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-150 aspect-square select-none active:scale-95 ${
                  isSelected
                    ? 'ring-4 ring-indigo-500 z-10 scale-105 shadow-lg'
                    : isCorrect
                    ? 'border border-emerald-400/40 shadow-xs'
                    : 'border border-black/20 dark:border-white/20 hover:border-indigo-400'
                }`}
              >
                {/* Visual Lock Checkmark on correct snap */}
                {isCorrect && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500/80 text-white flex items-center justify-center pointer-events-none">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ORIGINAL IMAGE PREVIEW OVERLAY */}
        {showOriginal && (
          <div className="absolute inset-0 z-30 rounded-3xl bg-black/80 backdrop-blur-md p-4 flex flex-col items-center justify-center animate-in fade-in">
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
        Click one piece to select it, then click another piece to swap their positions.
      </p>

      {/* VICTORY MODAL OVERLAY */}
      {isVictory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 sm:p-8 rounded-3xl text-center shadow-2xl border border-white/20 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-display text-theme-primary mb-1">
              Artwork Restored!
            </h3>
            <p className="text-xs text-theme-secondary mb-4">
              Magnificent patience! You snapped all {totalPieces} jigsaw pieces in place!
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 bg-black/5 dark:bg-white/10 p-3 rounded-xl text-xs">
              <div>
                <span className="text-theme-muted block">Moves</span>
                <span className="font-bold text-theme-primary">{moves}</span>
              </div>
              <div>
                <span className="text-theme-muted block">Time</span>
                <span className="font-mono font-bold text-theme-primary">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => initJigsaw(gridSize)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
