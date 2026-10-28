import React from 'react';
import { SlidingPuzzleGame } from '../puzzle/SlidingPuzzleGame';

interface SlidingPuzzleWrapperProps {
  onBackToDirectory: () => void;
  onExploreTools: () => void;
}

export const SlidingPuzzleWrapper: React.FC<SlidingPuzzleWrapperProps> = ({
  onBackToDirectory,
  onExploreTools,
}) => {
  return (
    <div className="w-full">
      <SlidingPuzzleGame
        onBackToHome={onBackToDirectory}
        onExploreTools={onExploreTools}
      />
    </div>
  );
};
