import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  Bot,
  Flame,
  Award,
  Crown,
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

type Player = 'X' | 'O';
type CellValue = Player | null;

const TICTACTOE_LEVELS = GAME_LEVELS['tic-tac-toe'];

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: CellValue[]): {
  winner: Player | 'Tie' | null;
  line: number[] | null;
} {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: 'Tie', line: null };
  }
  return { winner: null, line: null };
}

function minimax(
  newBoard: CellValue[],
  player: Player,
  depth: number,
  aiPlayer: Player,
  humanPlayer: Player
): { score: number; index?: number } {
  const availableSpots = newBoard
    .map((val, idx) => (val === null ? idx : null))
    .filter((val): val is number => val !== null);

  const { winner } = checkWinner(newBoard);
  if (winner === aiPlayer) return { score: 10 - depth };
  if (winner === humanPlayer) return { score: depth - 10 };
  if (availableSpots.length === 0 || winner === 'Tie') return { score: 0 };

  const moves: { score: number; index: number }[] = [];

  for (let i = 0; i < availableSpots.length; i++) {
    const spot = availableSpots[i];
    newBoard[spot] = player;

    if (player === aiPlayer) {
      const result = minimax(newBoard, humanPlayer, depth + 1, aiPlayer, humanPlayer);
      moves.push({ score: result.score, index: spot });
    } else {
      const result = minimax(newBoard, aiPlayer, depth + 1, aiPlayer, humanPlayer);
      moves.push({ score: result.score, index: spot });
    }

    newBoard[spot] = null;
  }

  let bestMove = 0;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

export const TicTacToeGame: React.FC = () => {
  const [progression, setProgression] = useState(() => loadGameProgress('tic-tac-toe'));
  const [difficulty, setDifficulty] = useState<GameDifficulty>(progression.currentDifficulty);
  const [currentLevelNum, setCurrentLevelNum] = useState<number>(progression.currentLevel);

  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Tie' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // Campaign objective tracker
  const [sessionWins, setSessionWins] = useState<number>(0);
  const [sessionDraws, setSessionDraws] = useState<number>(0);

  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [isPassAndPlay, setIsPassAndPlay] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);

  const currentLevelMeta =
    TICTACTOE_LEVELS.find((l) => l.level === currentLevelNum) || TICTACTOE_LEVELS[0];

  // AI smart probability calculated per level and difficulty
  const baseAiProb = currentLevelMeta.params?.aiSmartProb || 0.5;
  const targetWins = currentLevelMeta.params?.targetWins || 1;
  const targetWinsOrDraws = currentLevelMeta.params?.targetWinsOrDraws;

  const adjustedAiProb =
    difficulty === 'Easy'
      ? Math.max(0.1, baseAiProb * 0.75)
      : difficulty === 'Hard'
      ? Math.min(1.0, baseAiProb * 1.25)
      : baseAiProb;

  const initRound = useCallback(() => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    setWinningLine(null);
  }, []);

  const startLevel = useCallback(
    (lvlNum: number, diff: GameDifficulty) => {
      initRound();
      setSessionWins(0);
      setSessionDraws(0);
      setIsVictory(false);
      setIsPaused(false);
      setCurrentLevelNum(lvlNum);
      setDifficulty(diff);
    },
    [initRound]
  );

  useEffect(() => {
    startLevel(currentLevelNum, difficulty);
  }, [currentLevelNum, difficulty, startLevel]);

  // AI Turn handling
  useEffect(() => {
    if (isPassAndPlay || turn !== 'O' || winner !== null || isPaused || isVictory) return;

    const availableSpots = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (availableSpots.length === 0) return;

    const timer = setTimeout(() => {
      let chosenMove: number = availableSpots[0];

      if (Math.random() < adjustedAiProb) {
        // Smart move via Minimax
        const res = minimax([...board], 'O', 0, 'O', 'X');
        chosenMove = res.index !== undefined ? res.index : availableSpots[0];
      } else {
        // Random move
        chosenMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
      }

      const nextBoard = [...board];
      nextBoard[chosenMove] = 'O';
      setBoard(nextBoard);
      gameAudio.playMove();

      const result = checkWinner(nextBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinningLine(result.line);
        handleRoundEnd(result.winner, nextBoard);
      } else {
        setTurn('X');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    board,
    turn,
    winner,
    isPassAndPlay,
    isPaused,
    isVictory,
    adjustedAiProb,
  ]);

  const handleRoundEnd = (roundWinner: Player | 'Tie', _finalBoard: CellValue[]) => {
    if (isPassAndPlay) {
      if (roundWinner === 'Tie') gameAudio.playMatch();
      else gameAudio.playVictory();
      return;
    }

    if (roundWinner === 'X') {
      const nextWins = sessionWins + 1;
      setSessionWins(nextWins);
      gameAudio.playVictory();

      // Check level victory
      const needed = targetWinsOrDraws || targetWins;
      if (nextWins >= needed) {
        triggerLevelVictory(3);
      }
    } else if (roundWinner === 'Tie') {
      const nextDraws = sessionDraws + 1;
      setSessionDraws(nextDraws);
      gameAudio.playMatch();

      if (targetWinsOrDraws && sessionWins + nextDraws >= targetWinsOrDraws) {
        triggerLevelVictory(sessionWins > 0 ? 3 : 2);
      }
    } else {
      gameAudio.playError();
    }
  };

  const triggerLevelVictory = (stars: number) => {
    setEarnedStars(stars);
    setIsVictory(true);
    gameAudio.playVictory();

    const res = completeLevel(
      'tic-tac-toe',
      difficulty,
      currentLevelNum,
      sessionWins + 1,
      stars,
      false
    );
    setProgression(res.updatedState);
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner !== null || isPaused || isVictory) return;
    if (!isPassAndPlay && turn === 'O') return;

    const nextBoard = [...board];
    nextBoard[index] = turn;
    setBoard(nextBoard);
    gameAudio.playMove();

    const result = checkWinner(nextBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      handleRoundEnd(result.winner, nextBoard);
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center">
      {/* 1. LEVEL HEADER BAR */}
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
            <button
              type="button"
              onClick={() => {
                setIsPassAndPlay(!isPassAndPlay);
                initRound();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                isPassAndPlay
                  ? 'bg-indigo-600 text-white'
                  : 'glass-panel text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {isPassAndPlay ? <Users className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              <span>{isPassAndPlay ? '2-Player' : 'Campaign Bot'}</span>
            </button>

            {!isPassAndPlay && (
              <div className="flex items-center gap-1.5 text-indigo-500 font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>
                  Progress: {sessionWins}
                  {targetWinsOrDraws
                    ? `+${sessionDraws}/${targetWinsOrDraws}`
                    : `/${targetWins}`}{' '}
                  Needed
                </span>
              </div>
            )}
          </>
        }
      />

      {/* OBJECTIVE BANNER */}
      <div className="w-full glass-panel p-3 rounded-2xl mb-4 border border-indigo-500/20 text-xs text-theme-secondary text-center">
        <span className="font-bold text-indigo-500">Mission: </span>
        <span>{currentLevelMeta.objective}</span>
      </div>

      {/* STATUS BANNER */}
      <div className="mb-4 text-center">
        {winner === null ? (
          <p className="text-sm font-semibold text-theme-primary">
            Turn:{' '}
            <span className={turn === 'X' ? 'text-indigo-500 font-bold' : 'text-rose-500 font-bold'}>
              {isPassAndPlay
                ? `Player ${turn}'s Turn`
                : turn === 'X'
                ? 'Your Turn (X)'
                : 'Bot is analyzing...'}
            </span>
          </p>
        ) : winner === 'Tie' ? (
          <p className="text-sm font-bold text-amber-500">
            Stalemate! {targetWinsOrDraws ? 'Draw counts toward target!' : 'Round tied.'}
          </p>
        ) : (
          <p className="text-sm font-bold text-emerald-500 flex items-center justify-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>
              {isPassAndPlay
                ? `Player ${winner} won the round!`
                : winner === 'X'
                ? 'You won this round!'
                : 'Bot took this round.'}
            </span>
          </p>
        )}
      </div>

      {/* 3x3 TIC-TAC-TOE BOARD */}
      <div
        role="grid"
        aria-label="Tic-Tac-Toe Board"
        className="grid grid-cols-3 gap-3 p-3.5 rounded-3xl glass-panel shadow-lg border border-black/10 dark:border-white/15 max-w-xs sm:max-w-sm w-full aspect-square"
      >
        {board.map((cell, idx) => {
          const isWinningCell = winningLine && winningLine.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleCellClick(idx)}
              disabled={cell !== null || winner !== null || isPaused || isVictory}
              aria-label={`Square ${idx + 1}, currently ${cell || 'empty'}`}
              className={`rounded-2xl font-display font-black text-4xl sm:text-5xl flex items-center justify-center transition-all duration-200 select-none ${
                isWinningCell
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : cell === 'X'
                  ? 'bg-indigo-500/10 text-indigo-500'
                  : cell === 'O'
                  ? 'bg-rose-500/10 text-rose-500'
                  : 'bg-white/60 dark:bg-black/30 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
              }`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* ROUND ACTION BUTTONS */}
      {winner !== null && !isVictory && (
        <div className="mt-5 flex gap-3 animate-in fade-in">
          <button
            type="button"
            onClick={initRound}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Next Round in Level</span>
          </button>
        </div>
      )}

      {/* LEVEL SELECTOR MODAL */}
      <LevelSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        levels={TICTACTOE_LEVELS}
        currentLevel={currentLevelNum}
        currentDifficulty={difficulty}
        progressionState={progression}
        onSelectLevel={(lvl, diff) => {
          setDifficulty(diff);
          startLevel(lvl, diff);
        }}
        onResetDifficultyProgress={(diff) => {
          const updated = resetDifficultyProgress('tic-tac-toe', diff);
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
          'Place your X mark to create 3-in-a-row horizontally, vertically, or diagonally.',
          'Against high-level bots, forcing a strategic draw is considered optimal play!',
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
          { label: 'Rounds Won', value: sessionWins },
          { label: 'Draws Held', value: sessionDraws },
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
