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
  Zap,
  Brush,
  Aperture,
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

const MEMORY_LEVELS = GAME_LEVELS['memory-match'];

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
  Zap,
  Brush,
  Aperture,
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
  'Lighting',
  'Brush',
  'Aperture',
];

export const MemoryMatchGame: React.FC = () => {
  const [progression, setProgression] = useState(() => loadGameProgress('memory-match'));
  const [difficulty, setDifficulty] = useState<GameDifficulty>(progression.currentDifficulty);
  const [currentLevelNum, setCurrentLevelNum] = useState<number>(progression.currentLevel);

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentLevelMeta =
    MEMORY_LEVELS.find((l) => l.level === currentLevelNum) || MEMORY_LEVELS[0];
  const pairCount = currentLevelMeta.params?.pairCount || 6;

  // Flip glance duration per difficulty
  const flipGlanceDuration =
    difficulty === 'Easy' ? 1200 : difficulty === 'Medium' ? 800 : 500;

  // Initialize deck for current level
  const initLevel = useCallback(
    (lvlNum: number, diff: GameDifficulty) => {
      const lvlMeta = MEMORY_LEVELS.find((l) => l.level === lvlNum) || MEMORY_LEVELS[0];
      const pCount = lvlMeta.params?.pairCount || 6;
      const chosenIcons = Array.from({ length: pCount }, (_, i) => i % ICON_COMPONENTS.length);

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

      // Fisher-Yates Shuffle
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
      setIsPaused(false);
      setCurrentLevelNum(lvlNum);
      setDifficulty(diff);
    },
    []
  );

  useEffect(() => {
    initLevel(currentLevelNum, difficulty);
  }, [currentLevelNum, difficulty, initLevel]);

  // Stopwatch runner
  useEffect(() => {
    if (!isTimerRunning || isVictory || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isVictory, isPaused]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCardClick = (index: number) => {
    if (isLocked || isVictory || isPaused) return;
    const card = cards[index];

    if (card.isFlipped || card.isMatched) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    gameAudio.playMove();
    const updatedCards = [...cards];
    updatedCards[index] = { ...card, isFlipped: true };
    setCards(updatedCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

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

            const newMatches = matchesCount + 1;
            setMatchesCount(newMatches);

            if (newMatches === pairCount) {
              const maxTargetMoves = currentLevelMeta.params?.maxTargetMoves || pairCount * 2.5;
              const stars =
                moves + 1 <= maxTargetMoves
                  ? 3
                  : moves + 1 <= maxTargetMoves * 1.4
                  ? 2
                  : 1;

              setEarnedStars(stars);
              setIsVictory(true);
              setIsTimerRunning(false);
              gameAudio.playVictory();

              const res = completeLevel(
                'memory-match',
                difficulty,
                currentLevelNum,
                moves + 1,
                stars,
                false
              );
              setProgression(res.updatedState);
            }
            return matchedDeck;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 300);
      } else {
        // MISMATCH
        setTimeout(() => {
          setCards((prev) => {
            const resetDeck = [...prev];
            resetDeck[firstIdx] = { ...resetDeck[firstIdx], isFlipped: false };
            resetDeck[secondIdx] = { ...resetDeck[secondIdx], isFlipped: false };
            return resetDeck;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, flipGlanceDuration);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      {/* 1. LEVEL HEADER BAR */}
      <LevelHeaderBar
        levelNumber={currentLevelNum}
        levelTitle={currentLevelMeta.title}
        difficulty={difficulty}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((p) => !p)}
        onRestartLevel={() => initLevel(currentLevelNum, difficulty)}
        onOpenLevelSelector={() => setIsSelectorOpen(true)}
        onChangeDifficulty={(newDiff) => {
          setDifficulty(newDiff);
          initLevel(1, newDiff);
        }}
        additionalStats={
          <>
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
                Pairs: {matchesCount}/{pairCount}
              </span>
            </div>
          </>
        }
      />

      {/* CARDS GRID */}
      <div
        className={`grid gap-2.5 sm:gap-3.5 w-full mx-auto ${
          pairCount <= 4
            ? 'grid-cols-2 sm:grid-cols-4 max-w-md'
            : pairCount <= 8
            ? 'grid-cols-3 sm:grid-cols-4 max-w-lg'
            : pairCount <= 12
            ? 'grid-cols-4 sm:grid-cols-6 max-w-2xl'
            : 'grid-cols-4 sm:grid-cols-7 max-w-3xl'
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
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 relative select-none shadow-xs transform active:scale-95 ${
                card.isMatched
                  ? 'bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-500 cursor-default'
                  : card.isFlipped
                  ? 'bg-indigo-600 border-2 border-indigo-400 text-white'
                  : 'glass-panel hover:border-indigo-500/40 hover:-translate-y-0.5 text-theme-muted'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center p-2">
                  <IconComp className="w-6 h-6 sm:w-8 sm:h-8" />
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

      {/* LEVEL SELECTOR MODAL */}
      <LevelSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        levels={MEMORY_LEVELS}
        currentLevel={currentLevelNum}
        currentDifficulty={difficulty}
        progressionState={progression}
        onSelectLevel={(lvl, diff) => {
          setDifficulty(diff);
          initLevel(lvl, diff);
        }}
        onResetDifficultyProgress={(diff) => {
          const updated = resetDifficultyProgress('memory-match', diff);
          setProgression(updated);
          initLevel(1, diff);
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
          initLevel(currentLevelNum, difficulty);
        }}
        onOpenLevelSelector={() => {
          setIsPaused(false);
          setIsSelectorOpen(true);
        }}
        howToPlayTips={[
          'Flip cards two at a time to discover matching pairs of visual icons.',
          'Memorize corner icons first as visual anchors.',
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
          { label: 'Total Moves', value: moves },
          { label: 'Time', value: formatTimer(timerSeconds) },
          { label: 'Pairs Found', value: `${pairCount}/${pairCount}` },
        ]}
        onNextLevel={() => {
          const nextLvl = Math.min(10, currentLevelNum + 1);
          initLevel(nextLvl, difficulty);
        }}
        onReplayLevel={() => initLevel(currentLevelNum, difficulty)}
        onOpenLevelSelector={() => {
          setIsVictory(false);
          setIsSelectorOpen(true);
        }}
      />
    </div>
  );
};
