import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Clock,
  Footprints,
  Camera,
  Palette,
  Image as ImageIcon,
  Compass,
  Sun,
  Eye,
  Layers,
  Crop,
  Sliders,
  Wand2,
  Maximize2,
  Check,
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

type MemoryDifficulty = 'Easy' | 'Medium' | 'Hard';

interface CardItem {
  id: number;
  pairId: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICON_COMPONENTS = [
  Camera,
  Palette,
  ImageIcon,
  Compass,
  Sun,
  Eye,
  Layers,
  Crop,
  Sliders,
  Wand2,
  Maximize2,
  Sparkles,
];

const ICON_NAMES = [
  'Camera',
  'Palette',
  'Photograph',
  'Compass',
  'Sunlight',
  'Acuity Eye',
  'Layers',
  'Crop Tool',
  'Sliders',
  'Magic Wand',
  'Maximize',
  'Sparkles',
];

export const MemoryMatchGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>('Medium');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getPairCount = (diff: MemoryDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 6; // 12 cards
      case 'Medium':
        return 8; // 16 cards
      case 'Hard':
        return 12; // 24 cards
    }
  };

  const initGame = useCallback((diff: MemoryDifficulty) => {
    const pairCount = getPairCount(diff);
    const chosenIcons = Array.from({ length: pairCount }, (_, i) => i);

    // Create pairs
    const deck: CardItem[] = [];
    chosenIcons.forEach((iconIndex, idx) => {
      deck.push({
        id: idx * 2,
        pairId: iconIndex,
        iconIndex,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idx * 2 + 1,
        pairId: iconIndex,
        iconIndex,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setIsLocked(false);
    setMoves(0);
    setMatchesCount(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setIsVictory(false);
  }, []);

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty, initGame]);

  // Timer runner
  useEffect(() => {
    if (!isTimerRunning || isVictory) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isVictory]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCardClick = (index: number) => {
    if (isLocked || isVictory) return;
    const card = cards[index];

    // Ignore already flipped or matched cards
    if (card.isFlipped || card.isMatched) return;

    // Start timer on first move
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    // Flip card
    gameAudio.playMove();
    const updatedCards = [...cards];
    updatedCards[index] = { ...card, isFlipped: true };
    setCards(updatedCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    // If second card flipped, evaluate pair
    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);

      const [firstIdx, secondIdx] = nextFlipped;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        setTimeout(() => {
          gameAudio.playMatch();
          setCards((prev) => {
            const matchedDeck = [...prev];
            matchedDeck[firstIdx] = { ...matchedDeck[firstIdx], isMatched: true };
            matchedDeck[secondIdx] = { ...matchedDeck[secondIdx], isMatched: true };

            const totalPairs = getPairCount(difficulty);
            const newMatches = matchesCount + 1;
            setMatchesCount(newMatches);

            if (newMatches === totalPairs) {
              setIsVictory(true);
              setIsTimerRunning(false);
              gameAudio.playVictory();
            }
            return matchedDeck;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 350);
      } else {
        // NO MATCH -> Flip back after brief glance
        setTimeout(() => {
          setCards((prev) => {
            const resetDeck = [...prev];
            resetDeck[firstIdx] = { ...resetDeck[firstIdx], isFlipped: false };
            resetDeck[secondIdx] = { ...resetDeck[secondIdx], isFlipped: false };
            return resetDeck;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const totalPairs = getPairCount(difficulty);

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      {/* Top Controls & Status Bar */}
      <div className="w-full flex items-center justify-between mb-6 glass-panel p-3.5 rounded-2xl gap-3 flex-wrap">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
          {(['Easy', 'Medium', 'Hard'] as MemoryDifficulty[]).map((d) => (
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
              {d} ({getPairCount(d) * 2})
            </button>
          ))}
        </div>

        {/* Stats: Moves, Pairs & Timer */}
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Pairs: {matchesCount}/{totalPairs}
            </span>
          </div>

          <button
            type="button"
            onClick={() => initGame(difficulty)}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-theme-muted hover:text-theme-primary transition-colors"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CARDS GRID */}
      <div
        className={`grid gap-2.5 sm:gap-3.5 w-full max-w-xl mx-auto ${
          difficulty === 'Easy'
            ? 'grid-cols-3 sm:grid-cols-4'
            : difficulty === 'Medium'
            ? 'grid-cols-4'
            : 'grid-cols-4 sm:grid-cols-6'
        }`}
      >
        {cards.map((card, idx) => {
          const IconComp = ICON_COMPONENTS[card.iconIndex];
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(idx)}
              disabled={card.isMatched || isLocked}
              aria-label={
                isRevealed
                  ? `${ICON_NAMES[card.iconIndex]} card revealed`
                  : `Hidden card at position ${idx + 1}`
              }
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 relative select-none shadow-xs transform active:scale-95 ${
                card.isMatched
                  ? 'bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-500 cursor-default'
                  : card.isFlipped
                  ? 'bg-indigo-600 border-2 border-indigo-400 text-white rotate-y-180'
                  : 'glass-panel hover:border-indigo-500/40 hover:-translate-y-0.5 text-theme-muted'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center p-2">
                  <IconComp className="w-7 h-7 sm:w-9 sm:h-9" />
                  {card.isMatched && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-current opacity-30 flex items-center justify-center text-[10px] font-mono">
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* VICTORY MODAL OVERLAY */}
      {isVictory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 sm:p-8 rounded-3xl text-center shadow-2xl border border-white/20 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-display text-theme-primary mb-1">
              Memory Master!
            </h3>
            <p className="text-xs text-theme-secondary mb-4">
              You uncovered all {totalPairs} pairs on {difficulty} difficulty!
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 bg-black/5 dark:bg-white/10 p-3 rounded-xl text-xs">
              <div>
                <span className="text-theme-muted block">Total Moves</span>
                <span className="font-bold text-theme-primary">{moves}</span>
              </div>
              <div>
                <span className="text-theme-muted block">Time Elapsed</span>
                <span className="font-mono font-bold text-theme-primary">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => initGame(difficulty)}
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
