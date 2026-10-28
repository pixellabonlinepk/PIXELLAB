import React from 'react';
import { getGameBySlug, GAMES_CATALOG } from '../../data/gamesData';
import { GameDetailLayout } from '../games/GameDetailLayout';
import { SlidingPuzzleWrapper } from '../games/SlidingPuzzleWrapper';
import { SudokuGame } from '../games/SudokuGame';
import { MemoryMatchGame } from '../games/MemoryMatchGame';
import { TicTacToeGame } from '../games/TicTacToeGame';
import { Game2048 } from '../games/Game2048';
import { SpotTheDifferenceGame } from '../games/SpotTheDifferenceGame';
import { WordSearchGame } from '../games/WordSearchGame';
import { JigsawPuzzleGame } from '../games/JigsawPuzzleGame';

interface IndividualGamePageProps {
  gameSlug: string;
  onNavigate: (view: string, idOrSlug?: string) => void;
}

export const IndividualGamePage: React.FC<IndividualGamePageProps> = ({
  gameSlug,
  onNavigate,
}) => {
  const game = getGameBySlug(gameSlug) || GAMES_CATALOG[0];

  const renderGameComponent = () => {
    switch (game.slug) {
      case 'sliding-picture-puzzle':
        return (
          <SlidingPuzzleWrapper
            onBackToDirectory={() => onNavigate('games')}
            onExploreTools={() => onNavigate('all-tools')}
          />
        );
      case 'sudoku':
        return <SudokuGame />;
      case 'memory-match':
        return <MemoryMatchGame />;
      case 'tic-tac-toe':
        return <TicTacToeGame />;
      case '2048':
        return <Game2048 />;
      case 'spot-the-difference':
        return <SpotTheDifferenceGame />;
      case 'word-search':
        return <WordSearchGame />;
      case 'jigsaw-puzzle':
        return <JigsawPuzzleGame />;
      default:
        return (
          <SlidingPuzzleWrapper
            onBackToDirectory={() => onNavigate('games')}
            onExploreTools={() => onNavigate('all-tools')}
          />
        );
    }
  };

  return (
    <GameDetailLayout
      game={game}
      onBackToDirectory={() => onNavigate('games')}
      onSelectGame={(slug) => onNavigate('game', slug)}
    >
      {renderGameComponent()}
    </GameDetailLayout>
  );
};
