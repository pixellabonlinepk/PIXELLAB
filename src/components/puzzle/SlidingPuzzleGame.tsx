import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  Shuffle,
  ChevronRight,
  Lock,
  CheckCircle2,
  Clock,
  Footprints,
  Compass,
  MapPin,
  Layers,
  Star,
  X,
  Play,
  Flame,
} from 'lucide-react';
import {
  PUZZLE_IMAGES,
  PUZZLE_LEVELS,
  PUZZLE_CATEGORIES,
  PuzzleImage,
  PuzzleLevel,
} from '../../data/puzzleData';
import {
  shuffleBoard,
  makeMove,
  checkSolved,
  calculateProgress,
  getTileIndexForArrowKey,
  isAdjacent,
  getUnlockedLevel,
  saveUnlockedLevel,
  getBestRecord,
  saveRecord,
  formatTime,
  BestRecord,
} from '../../utils/puzzleSolver';
import { puzzleAudio } from '../../utils/puzzleAudio';

interface SlidingPuzzleGameProps {
  onBackToHome: () => void;
  onExploreTools: () => void;
}

export const SlidingPuzzleGame: React.FC<SlidingPuzzleGameProps> = ({
  onBackToHome,
  onExploreTools,
}) => {
  // Level & Image state
  const [currentLevelNum, setCurrentLevelNum] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedImage, setSelectedImage] = useState<PuzzleImage>(PUZZLE_IMAGES[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  // Difficulty & Grid
  const [gridSize, setGridSize] = useState<number>(3);
  const [board, setBoard] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(8);

  // Stats & Progress
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [bestRecord, setBestRecord] = useState<BestRecord | null>(null);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // UI Modals & Options
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(puzzleAudio.getSoundEnabled());
  const [showOriginalModal, setShowOriginalModal] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize unlocked level & best score
  useEffect(() => {
    const unlocked = getUnlockedLevel();
    setUnlockedLevel(unlocked);
  }, []);

  // Update best record when level changes
  useEffect(() => {
    const rec = getBestRecord(currentLevelNum);
    setBestRecord(rec);
  }, [currentLevelNum]);

  // Start fresh game for current level or custom settings
  const startNewGame = useCallback(
    (levelNum: number, chosenImage?: PuzzleImage, customGridSize?: number, chosenDiff?: 'Easy' | 'Medium' | 'Hard') => {
      // Clear existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const activeDiff = chosenDiff || difficulty;
      const lvl = PUZZLE_LEVELS.find((l) => l.level === levelNum) || PUZZLE_LEVELS[0];
      const gSize = customGridSize || lvl.gridSize;
      const img = chosenImage || PUZZLE_IMAGES.find((i) => i.id === lvl.recommendedImageId) || PUZZLE_IMAGES[0];

      setCurrentLevelNum(levelNum);
      setGridSize(gSize);
      setSelectedImage(img);
      setImageLoadError(false);

      // Scale scramble steps by difficulty
      const diffMultiplier = activeDiff === 'Easy' ? 0.6 : activeDiff === 'Hard' ? 1.4 : 1.0;
      const calculatedScramble = Math.max(3, Math.round(lvl.scrambleSteps * diffMultiplier));

      if (activeDiff === 'Easy') {
        setShowNumbers(true);
      } else if (activeDiff === 'Hard') {
        setShowNumbers(false);
      }

      const { board: newBoard, emptyIndex: newEmpty } = shuffleBoard(gSize, calculatedScramble);
      setBoard(newBoard);
      setEmptyIndex(newEmpty);
      setMoves(0);
      setSeconds(0);
      setIsTimerRunning(false);
      setHasStartedPlaying(false);
      setProgressPercent(calculateProgress(newBoard, gSize));
      setIsVictory(false);
      setIsNewRecord(false);
    },
    [difficulty]
  );

  // Initial load
  useEffect(() => {
    startNewGame(1);
  }, [startNewGame]);

  // Timer interval handling
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerRunning]);

  // Handle tile click
  const handleTileClick = (index: number) => {
    if (isVictory) return;

    // First user gesture: resume AudioContext if needed
    if (!hasStartedPlaying) {
      setHasStartedPlaying(true);
      setIsTimerRunning(true);
    }

    const res = makeMove(board, emptyIndex, index, gridSize);
    if (!res.valid) return;

    // Play tile click sound
    puzzleAudio.playMove();

    setBoard(res.newBoard);
    setEmptyIndex(res.newEmptyIndex);
    setMoves((prev) => prev + 1);
    setProgressPercent(res.progressPercent);

    // Check Victory
    if (res.solved) {
      handleVictory();
    }
  };

  // Handle Victory Condition
  const handleVictory = () => {
    setIsVictory(true);
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    puzzleAudio.playVictory();

    // Check best record
    const finalSeconds = seconds + 1;
    const finalMoves = moves + 1;
    const existing = getBestRecord(currentLevelNum);
    const isNew = !existing || finalSeconds < existing.bestTime || finalMoves < existing.bestMoves;
    setIsNewRecord(isNew);
    saveRecord(currentLevelNum, finalSeconds, finalMoves);
    setBestRecord(getBestRecord(currentLevelNum));

    // Unlock next level
    if (currentLevelNum >= unlockedLevel && currentLevelNum < 10) {
      const nextLevel = currentLevelNum + 1;
      saveUnlockedLevel(nextLevel);
      setUnlockedLevel(nextLevel);
      setTimeout(() => {
        puzzleAudio.playUnlock();
      }, 700);
    }
  };

  // Keyboard navigation listener (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVictory) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Prevent default arrow scrolling
        e.preventDefault();

        const targetTileIdx = getTileIndexForArrowKey(e.key, emptyIndex, gridSize);
        if (targetTileIdx !== null) {
          handleTileClick(targetTileIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emptyIndex, gridSize, isVictory, board]);

  // Toggle Sound
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    puzzleAudio.setSoundEnabled(next);
  };

  // Quick Game Handler (Random image + random level up to unlocked)
  const handleQuickGame = () => {
    const randomImg = PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)];
    const maxPlayableLevel = Math.max(1, Math.min(unlockedLevel, 10));
    const randomLevel = Math.floor(Math.random() * maxPlayableLevel) + 1;
    startNewGame(randomLevel, randomImg);
  };

  // Filtered Images for Picker
  const filteredImages = PUZZLE_IMAGES.filter(
    (img) => activeCategory === 'all' || img.category === activeCategory
  );

  // Active image source with fallback support
  const activeImageSource = imageLoadError ? selectedImage.fallbackSvg : selectedImage.src;

  const currentLevelData = PUZZLE_LEVELS.find((l) => l.level === currentLevelNum) || PUZZLE_LEVELS[0];

  return (
    <div className="w-full min-h-screen py-6 px-4 sm:px-6 lg:px-8 text-theme-primary">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP BAR / GAME HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 glass-panel text-theme-secondary hover:text-theme-primary transition-all active:scale-95 shadow-xs"
              aria-label="Back to Homepage"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Studio</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-theme-primary">
                  PIXAL<span className="text-indigo-500">LAB</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  Picture Puzzle Challenge
                </span>
              </div>
              <p className="text-xs text-theme-muted hidden sm:block">
                Slide tiles adjacent to the empty slot to reconstruct iconic scenes. 100% Client-Side.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
              {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDifficulty(d);
                    startNewGame(currentLevelNum, selectedImage, undefined, d);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    difficulty === d
                      ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Show / Hide Numbers Badge */}
            <button
              type="button"
              onClick={() => setShowNumbers((prev) => !prev)}
              title={showNumbers ? 'Hide tile numbers' : 'Show tile numbers helper'}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                showNumbers
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-xs'
                  : 'border-black/10 dark:border-white/10 text-theme-secondary hover:text-theme-primary glass-panel'
              }`}
            >
              {showNumbers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden md:inline">{showNumbers ? 'Numbers On' : 'Numbers Off'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                soundEnabled
                  ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                  : 'border-black/10 dark:border-white/10 text-theme-muted glass-panel'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>

            {/* How to Play Help */}
            <button
              type="button"
              onClick={() => setShowHowToPlay(true)}
              className="p-2 rounded-xl text-xs font-semibold border border-black/10 dark:border-white/10 text-theme-secondary hover:text-theme-primary glass-panel transition-all"
              title="How to play instructions"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">Rules</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN MAIN GAME LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT / CENTER: THE PUZZLE BOARD & LIVE STATS */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
            {/* INSTRUCTION & BEGINNER BANNER */}
            <div className="w-full max-w-[480px] mb-3 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2.5 text-xs text-theme-primary shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                💡
              </div>
              <div className="flex-1 leading-snug">
                <span className="font-bold text-indigo-400">
                  {gridSize === 2 ? 'Level 1 Very Easy: ' : 'Instruction: '}
                </span>
                <span>Move the tiles into the empty space to complete the picture.</span>
              </div>
            </div>

            {/* STATS STRIP */}
            <div className="w-full max-w-[480px] mb-4 grid grid-cols-4 gap-2 text-center select-none">
              <div className="glass-panel p-2.5 rounded-2xl border border-black/10 dark:border-white/10">
                <span className="text-[10px] font-semibold text-theme-muted uppercase tracking-wider block">
                  Time
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-theme-primary flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {formatTime(seconds)}
                </span>
              </div>

              <div className="glass-panel p-2.5 rounded-2xl border border-black/10 dark:border-white/10">
                <span className="text-[10px] font-semibold text-theme-muted uppercase tracking-wider block">
                  Moves
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-theme-primary flex items-center justify-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                  {moves}
                </span>
              </div>

              <div className="glass-panel p-2.5 rounded-2xl border border-black/10 dark:border-white/10">
                <span className="text-[10px] font-semibold text-theme-muted uppercase tracking-wider block">
                  Solved
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-emerald-500 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {progressPercent}%
                </span>
              </div>

              <div className="glass-panel p-2.5 rounded-2xl border border-black/10 dark:border-white/10">
                <span className="text-[10px] font-semibold text-theme-muted uppercase tracking-wider block">
                  Best Record
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-amber-500 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  {bestRecord ? `${formatTime(bestRecord.bestTime)} (${bestRecord.bestMoves}m)` : '—'}
                </span>
              </div>
            </div>

            {/* PUZZLE BOARD CONTAINER */}
            <div
              ref={boardContainerRef}
              className="relative w-full max-w-[480px] aspect-square rounded-3xl p-3 sm:p-4 glass-panel border border-black/10 dark:border-white/15 shadow-2xl shadow-indigo-500/10 flex flex-col items-center justify-center select-none"
            >
              {/* Fallback image preloader */}
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="hidden"
                onError={() => setImageLoadError(true)}
              />

              {/* GRID BOARD */}
              <div
                className="w-full h-full grid gap-1.5 sm:gap-2 rounded-2xl overflow-hidden touch-manipulation"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {board.map((tileId, index) => {
                  const isBlank = tileId === gridSize * gridSize - 1;
                  const movable = isAdjacent(emptyIndex, index, gridSize) && !isVictory;

                  // Target original coordinate of this tile slice in the source image
                  const origRow = Math.floor(tileId / gridSize);
                  const origCol = tileId % gridSize;

                  // Percentage position for background slice
                  const posX = gridSize > 1 ? (origCol / (gridSize - 1)) * 100 : 0;
                  const posY = gridSize > 1 ? (origRow / (gridSize - 1)) * 100 : 0;

                  if (isBlank) {
                    return (
                      <div
                        key={`blank-${index}`}
                        className="w-full h-full rounded-xl border border-dashed border-indigo-500/30 bg-black/15 dark:bg-black/40 flex items-center justify-center relative overflow-hidden"
                        aria-label="Empty slot"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 animate-pulse" />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={`tile-${tileId}`}
                      type="button"
                      onClick={() => handleTileClick(index)}
                      disabled={!movable}
                      aria-label={`Tile ${tileId + 1}${movable ? ', tap to move' : ''}`}
                      className={`w-full h-full rounded-xl relative overflow-hidden transition-all duration-150 border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        movable
                          ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] border-indigo-400/40 shadow-md shadow-indigo-500/20'
                          : 'cursor-default border-black/10 dark:border-white/10 opacity-95'
                      }`}
                      style={{
                        backgroundImage: `url(${activeImageSource})`,
                        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                        backgroundPosition: `${posX}% ${posY}%`,
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Optional Number Pill Badge for Accessibility & Beginners */}
                      {showNumbers && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono font-bold text-white shadow-xs">
                          {tileId + 1}
                        </span>
                      )}

                      {/* Movable tile subtle glow hint */}
                      {movable && (
                        <span className="absolute inset-0 bg-indigo-500/0 hover:bg-indigo-500/10 transition-colors" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* VICTORY OVERLAY INSIDE THE BOARD */}
              {isVictory && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center animate-fade-in z-30 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-1 flex items-center justify-center shadow-lg shadow-indigo-500/40 animate-bounce">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black font-display text-white mb-1">
                      Great Job! Puzzle Completed!
                    </h2>
                    <p className="text-xs text-indigo-200">
                      You solved <span className="font-semibold text-white">{selectedImage.title}</span> in{' '}
                      <span className="font-mono text-cyan-300 font-bold">{formatTime(seconds)}</span> with{' '}
                      <span className="font-mono text-cyan-300 font-bold">{moves}</span> moves!
                    </p>
                  </div>

                  {isNewRecord && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>New Personal Best Record!</span>
                    </div>
                  )}

                  {/* Victory Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {currentLevelNum < 10 && (
                      <button
                        type="button"
                        onClick={() => startNewGame(currentLevelNum + 1)}
                        className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <span>Next Level ({currentLevelNum + 1})</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => startNewGame(currentLevelNum, selectedImage, gridSize)}
                      className="py-2.5 px-4 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Play Again</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowImagePicker(true)}
                      className="py-2.5 px-4 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Choose Picture</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* QUICK CONTROLS UNDER BOARD */}
            <div className="w-full max-w-[480px] mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowOriginalModal(true)}
                className="flex-1 py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 glass-panel hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-theme-secondary hover:text-theme-primary flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>Show Original</span>
              </button>

              <button
                type="button"
                onClick={() => startNewGame(currentLevelNum, selectedImage, gridSize)}
                className="flex-1 py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 glass-panel hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-theme-secondary hover:text-theme-primary flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Restart</span>
              </button>

              <button
                type="button"
                onClick={handleQuickGame}
                className="flex-1 py-2 px-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-400 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Quick Game</span>
              </button>
            </div>

            <p className="text-[11px] text-theme-muted mt-3 text-center">
              💡 <span className="font-semibold">Keyboard Controls:</span> Use Arrow Keys (↑, ↓, ←, →) or tap adjacent tiles to slide.
            </p>
          </div>

          {/* RIGHT COLUMN: SIDEBAR CONTROLS & LEVEL SYSTEM */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* ACTIVE PICTURE CARD & PREVIEW */}
            <div className="glass-panel p-5 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  Active Picture
                </span>
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="text-xs font-bold text-indigo-500 hover:text-indigo-400 hover:underline"
                >
                  Change Picture →
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl border-2 border-indigo-500/40 bg-cover bg-center shrink-0 shadow-md cursor-pointer hover:scale-105 transition-transform relative group"
                  style={{ backgroundImage: `url(${activeImageSource})` }}
                  onClick={() => setShowOriginalModal(true)}
                  title="Click to view full original picture"
                >
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-black/80 backdrop-blur-xs text-[9px] font-bold text-cyan-300">
                    Goal
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-0.5">
                    Target Picture
                  </div>
                  <h3 className="text-sm font-bold text-theme-primary truncate">
                    {selectedImage.title}
                  </h3>
                  <p className="text-xs text-theme-secondary flex items-center gap-1">
                    <Compass className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="truncate">{selectedImage.location}</span>
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/5 dark:bg-white/10 text-theme-muted">
                    {selectedImage.categoryLabel}
                  </span>
                </div>
              </div>

              {/* GRID DIFFICULTY SWITCHER */}
              <div className="pt-2 border-t border-black/5 dark:border-white/10">
                <span className="text-[11px] font-semibold text-theme-secondary block mb-2">
                  Grid Size & Difficulty
                </span>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {[
                    { size: 2, label: '2 × 2', tag: 'Beginner' },
                    { size: 3, label: '3 × 3', tag: 'Easy' },
                    { size: 4, label: '4 × 4', tag: 'Medium' },
                    { size: 5, label: '5 × 5', tag: 'Master' },
                  ].map((lvl) => (
                    <button
                      key={lvl.size}
                      type="button"
                      onClick={() => {
                        setGridSize(lvl.size);
                        startNewGame(currentLevelNum, selectedImage, lvl.size);
                      }}
                      className={`p-1.5 sm:p-2 rounded-xl text-center border transition-all ${
                        gridSize === lvl.size
                          ? 'bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white font-bold border-indigo-400 shadow-md shadow-indigo-500/20'
                          : 'border-black/10 dark:border-white/10 glass-panel text-theme-secondary hover:text-theme-primary'
                      }`}
                    >
                      <div className="text-xs font-bold">{lvl.label}</div>
                      <div className="text-[9px] opacity-80">{lvl.tag}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LEVEL PROGRESSION JOURNEY */}
            <div className="glass-panel p-5 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  10 Playable Stages
                </span>
                <span className="text-xs font-mono font-semibold text-indigo-500">
                  {unlockedLevel}/10 Unlocked
                </span>
              </div>

              {/* Level List */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {PUZZLE_LEVELS.map((lvl) => {
                  const isLocked = lvl.level > unlockedLevel;
                  const isCurrent = lvl.level === currentLevelNum;
                  const img = PUZZLE_IMAGES.find((i) => i.id === lvl.recommendedImageId) || PUZZLE_IMAGES[0];
                  const rec = getBestRecord(lvl.level);

                  return (
                    <button
                      key={lvl.level}
                      type="button"
                      disabled={isLocked}
                      onClick={() => startNewGame(lvl.level, img, lvl.gridSize)}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                        isCurrent
                          ? 'bg-indigo-500/15 border-indigo-500/40 text-theme-primary shadow-xs'
                          : isLocked
                          ? 'opacity-40 border-black/5 dark:border-white/5 cursor-not-allowed bg-black/5 dark:bg-white/5'
                          : 'border-black/5 dark:border-white/10 glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-theme-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl bg-cover bg-center shrink-0 border border-black/10 dark:border-white/10"
                          style={{ backgroundImage: `url(${img.src})` }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span>{lvl.title}</span>
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-theme-muted truncate">
                            {lvl.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-theme-muted inline-block" />
                        ) : rec ? (
                          <div className="text-[10px] font-mono text-emerald-500 font-bold">
                            {formatTime(rec.bestTime)}
                          </div>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold">
                            {lvl.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* IMAGE PICKER MODAL */}
        {showImagePicker && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-3xl max-h-[90vh] glass-panel rounded-3xl border border-black/10 dark:border-white/15 p-6 shadow-2xl flex flex-col space-y-4 animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
                <div>
                  <h3 className="text-lg font-bold font-display text-theme-primary">
                    Select a Puzzle Picture
                  </h3>
                  <p className="text-xs text-theme-secondary">
                    Choose from {PUZZLE_IMAGES.length} landmark, nature, cartoon, and cultural photographs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImagePicker(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-theme-muted hover:text-theme-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {PUZZLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'border border-black/10 dark:border-white/10 text-theme-secondary hover:text-theme-primary'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Picture Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[55vh] pr-1">
                {filteredImages.map((img) => {
                  const isSelected = img.id === selectedImage.id;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        setSelectedImage(img);
                        setShowImagePicker(false);
                        startNewGame(currentLevelNum, img, gridSize);
                      }}
                      className={`group rounded-2xl border text-left overflow-hidden transition-all relative ${
                        isSelected
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                          : 'border-black/10 dark:border-white/10 hover:border-indigo-400/50'
                      }`}
                    >
                      <div
                        className="w-full h-32 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundImage: `url(${img.src})` }}
                      />
                      <div className="p-2.5 bg-black/70 dark:bg-black/90">
                        <div className="text-xs font-bold text-white truncate">
                          {img.title}
                        </div>
                        <div className="text-[10px] text-theme-muted truncate">
                          {img.location}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SHOW ORIGINAL MODAL */}
        {showOriginalModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg glass-panel rounded-3xl border border-black/10 dark:border-white/15 p-6 shadow-2xl space-y-4 animate-scale-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-theme-primary">
                    {selectedImage.title}
                  </h3>
                  <p className="text-xs text-theme-secondary flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{selectedImage.location}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOriginalModal(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-theme-muted hover:text-theme-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 max-h-[60vh] flex items-center justify-center bg-black">
                <img
                  src={activeImageSource}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[55vh] object-contain"
                />
              </div>

              <p className="text-xs text-theme-secondary leading-relaxed">
                {selectedImage.description}
              </p>

              <button
                type="button"
                onClick={() => setShowOriginalModal(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Return to Puzzle
              </button>
            </div>
          </div>
        )}

        {/* HOW TO PLAY MODAL */}
        {showHowToPlay && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel rounded-3xl border border-black/10 dark:border-white/15 p-6 shadow-2xl space-y-4 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-base font-bold text-theme-primary">
                    How to Play Sliding Puzzle
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHowToPlay(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-theme-muted hover:text-theme-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ol className="space-y-2.5 text-xs text-theme-secondary leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    <strong className="text-theme-primary">Select a picture & difficulty:</strong> Choose from 3×3 (easy), 4×4 (medium), or 5×5 (master).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    <strong className="text-theme-primary">Adjacent moves only:</strong> Tap or click any tile directly next to the empty space (above, below, left, or right) to slide it into the empty slot.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    <strong className="text-theme-primary">Keyboard controls:</strong> You can also use the Arrow keys (↑, ↓, ←, →) on your keyboard to shift tiles.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span>
                    <strong className="text-theme-primary">Complete to unlock:</strong> Reconstruct all pieces to reveal the full picture and unlock higher stages.
                  </span>
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Got It, Let's Play!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
