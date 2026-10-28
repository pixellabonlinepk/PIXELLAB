import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  Bot,
  Flame,
  Award,
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

type Player = 'X' | 'O';
type CellValue = Player | null;
type GameMode = 'vs-ai' | 'pass-and-play';
type AIDifficulty = 'Easy' | 'Medium' | 'Hard';

const WINNING_COMBOS = [
  [0, 1, 2], // Row 0
  [3, 4, 5], // Row 1
  [6, 7, 8], // Row 2
  [0, 3, 6], // Col 0
  [1, 4, 7], // Col 1
  [2, 5, 8], // Col 2
  [0, 4, 8], // Diag 1
  [2, 4, 6], // Diag 2
];

function checkWinner(board: CellValue[]): { winner: Player | 'Tie' | null; line: number[] | null } {
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

// Minimax algorithm for unbeatable AI
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
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>('vs-ai');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('Hard');

  const [winner, setWinner] = useState<Player | 'Tie' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // Cumulative match score
  const [scores, setScores] = useState<{ xWins: number; oWins: number; ties: number }>({
    xWins: 0,
    oWins: 0,
    ties: 0,
  });

  const resetRound = useCallback(() => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    setWinningLine(null);
  }, []);

  const resetMatchScores = () => {
    resetRound();
    setScores({ xWins: 0, oWins: 0, ties: 0 });
  };

  // AI Move Engine
  useEffect(() => {
    if (gameMode !== 'vs-ai' || turn !== 'O' || winner !== null) return;

    const availableSpots = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (availableSpots.length === 0) return;

    const timer = setTimeout(() => {
      let chosenMove: number = availableSpots[0];

      if (aiDifficulty === 'Easy') {
        // Random move
        chosenMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
      } else if (aiDifficulty === 'Medium') {
        // 65% chance smart minimax, 35% random
        if (Math.random() < 0.65) {
          const res = minimax([...board], 'O', 0, 'O', 'X');
          chosenMove = res.index !== undefined ? res.index : availableSpots[0];
        } else {
          chosenMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
        }
      } else {
        // Hard / Unbeatable Minimax
        const res = minimax([...board], 'O', 0, 'O', 'X');
        chosenMove = res.index !== undefined ? res.index : availableSpots[0];
      }

      const nextBoard = [...board];
      nextBoard[chosenMove] = 'O';
      setBoard(nextBoard);
      gameAudio.playMove();

      const result = checkWinner(nextBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinningLine(result.line);
        if (result.winner === 'O') {
          setScores((s) => ({ ...s, oWins: s.oWins + 1 }));
          gameAudio.playError();
        } else if (result.winner === 'Tie') {
          setScores((s) => ({ ...s, ties: s.ties + 1 }));
          gameAudio.playMatch();
        }
      } else {
        setTurn('X');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [board, turn, gameMode, aiDifficulty, winner]);

  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner !== null) return;
    if (gameMode === 'vs-ai' && turn === 'O') return; // AI is thinking

    const nextBoard = [...board];
    nextBoard[index] = turn;
    setBoard(nextBoard);
    gameAudio.playMove();

    const result = checkWinner(nextBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'X') {
        setScores((s) => ({ ...s, xWins: s.xWins + 1 }));
        gameAudio.playVictory();
      } else if (result.winner === 'O') {
        setScores((s) => ({ ...s, oWins: s.oWins + 1 }));
        gameAudio.playVictory();
      } else if (result.winner === 'Tie') {
        setScores((s) => ({ ...s, ties: s.ties + 1 }));
        gameAudio.playMatch();
      }
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center">
      {/* Top Controls: Mode & Difficulty */}
      <div className="w-full flex items-center justify-between mb-6 glass-panel p-3.5 rounded-2xl gap-3 flex-wrap">
        {/* Play Mode Switcher */}
        <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
          <button
            type="button"
            onClick={() => {
              setGameMode('vs-ai');
              resetRound();
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              gameMode === 'vs-ai'
                ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>vs Computer</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setGameMode('pass-and-play');
              resetRound();
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              gameMode === 'pass-and-play'
                ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2 Players</span>
          </button>
        </div>

        {/* AI Difficulty (Only in vs-ai mode) */}
        {gameMode === 'vs-ai' ? (
          <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
            {(['Easy', 'Medium', 'Hard'] as AIDifficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setAiDifficulty(d);
                  resetRound();
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  aiDifficulty === d
                    ? 'bg-white dark:bg-white/15 text-indigo-500 font-bold shadow-xs'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {d === 'Hard' ? 'Master AI' : d}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-xs font-semibold text-theme-muted">Pass & Play</span>
        )}
      </div>

      {/* SESSION SCOREBOARD */}
      <div className="w-full grid grid-cols-3 gap-3 mb-6 text-center">
        <div
          className={`glass-panel p-3 rounded-2xl border transition-all ${
            turn === 'X' && !winner
              ? 'border-indigo-500 shadow-sm shadow-indigo-500/20'
              : 'border-black/5 dark:border-white/10'
          }`}
        >
          <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider block">
            {gameMode === 'vs-ai' ? 'You (X)' : 'Player 1 (X)'}
          </span>
          <span className="text-2xl font-black font-display text-theme-primary">
            {scores.xWins}
          </span>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-black/5 dark:border-white/10">
          <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider block">
            Ties
          </span>
          <span className="text-2xl font-black font-display text-theme-secondary">
            {scores.ties}
          </span>
        </div>

        <div
          className={`glass-panel p-3 rounded-2xl border transition-all ${
            turn === 'O' && !winner
              ? 'border-rose-500 shadow-sm shadow-rose-500/20'
              : 'border-black/5 dark:border-white/10'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
            {gameMode === 'vs-ai' ? 'Computer (O)' : 'Player 2 (O)'}
          </span>
          <span className="text-2xl font-black font-display text-theme-primary">
            {scores.oWins}
          </span>
        </div>
      </div>

      {/* STATUS BANNER */}
      <div className="mb-4 text-center">
        {winner === null ? (
          <p className="text-sm font-semibold text-theme-primary">
            Turn:{' '}
            <span
              className={turn === 'X' ? 'text-indigo-500 font-bold' : 'text-rose-500 font-bold'}
            >
              {gameMode === 'vs-ai'
                ? turn === 'X'
                  ? 'Your Turn (X)'
                  : 'Computer thinking...'
                : `Player ${turn}'s Turn`}
            </span>
          </p>
        ) : winner === 'Tie' ? (
          <p className="text-sm font-bold text-amber-500 flex items-center justify-center gap-1.5">
            <span>Stalemate! It's a draw.</span>
          </p>
        ) : (
          <p className="text-sm font-bold text-emerald-500 flex items-center justify-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>
              {gameMode === 'vs-ai'
                ? winner === 'X'
                  ? 'Congratulations! You Win!'
                  : 'Computer wins this round!'
                : `Player ${winner} Victorious!`}
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
              disabled={cell !== null || winner !== null}
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

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={resetRound}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Round</span>
        </button>

        <button
          type="button"
          onClick={resetMatchScores}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs glass-panel text-theme-muted hover:text-theme-primary transition-all active:scale-95"
        >
          <span>Reset Match Score</span>
        </button>
      </div>
    </div>
  );
};
