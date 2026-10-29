// PIXAL LAB — Game Progression Type Definitions
// Defines universal 10-level progression and 3-difficulty architecture for all games.

export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface LevelMeta {
  level: number; // 1 to 10
  title: string;
  subtitle: string;
  objective: string;
  badge: string;
  targetScore?: number;
  timeLimitSeconds?: number;
  // Specific challenge parameters
  params?: Record<string, any>;
}

export interface LevelProgressRecord {
  completed: boolean;
  stars: number; // 0, 1, 2, or 3 stars
  bestScore?: number;
  bestTimeSeconds?: number;
  completedAt?: string;
}

export interface GameDifficultyProgress {
  difficulty: GameDifficulty;
  maxUnlockedLevel: number; // 1 to 10
  levels: Record<number, LevelProgressRecord>;
}

export interface GameProgressState {
  gameId: string;
  currentDifficulty: GameDifficulty;
  currentLevel: number;
  difficulties: {
    Easy: GameDifficultyProgress;
    Medium: GameDifficultyProgress;
    Hard: GameDifficultyProgress;
  };
}
