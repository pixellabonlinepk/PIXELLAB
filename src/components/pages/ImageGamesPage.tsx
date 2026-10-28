import React from 'react';
import { GamesDirectoryPage } from './GamesDirectoryPage';

interface ImageGamesPageProps {
  onNavigate: (view: string, idOrSlug?: string) => void;
}

export const ImageGamesPage: React.FC<ImageGamesPageProps> = ({ onNavigate }) => {
  return (
    <GamesDirectoryPage
      onSelectGame={(slug) => onNavigate('game', slug)}
      onExploreTools={() => onNavigate('all-tools')}
    />
  );
};
