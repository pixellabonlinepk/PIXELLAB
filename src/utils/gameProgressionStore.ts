// PIXAL LAB — Game Progression & Local Storage Store
// Safe, offline-ready persistent progression engine for all 8 games.

import {
  GameDifficulty,
  GameProgressState,
  GameDifficultyProgress,
  LevelProgressRecord,
} from '../types/gameProgression';

const STORAGE_PREFIX = 'pixallab_game_prog_v2_';

function createInitialDifficultyProgress(diff: GameDifficulty): GameDifficultyProgress {
  const levels: Record<number, LevelProgressRecord> = {};
  for (let l = 1; l <= 10; l++) {
    levels[l] = {
      completed: false,
      stars: 0,
    };
  }
  return {
    difficulty: diff,
    maxUnlockedLevel: 1, // Level 1 is unlocked initially
    levels,
  };
}

export function createDefaultProgressState(gameId: string): GameProgressState {
  return {
    gameId,
    currentDifficulty: 'Medium',
    currentLevel: 1,
    difficulties: {
      Easy: createInitialDifficultyProgress('Easy'),
      Medium: createInitialDifficultyProgress('Medium'),
      Hard: createInitialDifficultyProgress('Hard'),
    },
  };
}

/**
 * Loads game progress from browser localStorage.
 * Ensures backward compatibility, fallback values, and data integrity.
 */
export function loadGameProgress(gameId: string): GameProgressState {
  if (typeof window === 'undefined') {
    return createDefaultProgressState(gameId);
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${gameId}`);
    if (!raw) {
      return createDefaultProgressState(gameId);
    }

    const parsed = JSON.parse(raw);
    const defaults = createDefaultProgressState(gameId);

    // Merge loaded data with defaults to guard against missing fields
    const currentDifficulty: GameDifficulty = ['Easy', 'Medium', 'Hard'].includes(
      parsed.currentDifficulty
    )
      ? parsed.currentDifficulty
      : 'Medium';

    const mergedDifficulties: GameProgressState['difficulties'] = {
      Easy: parsed.difficulties?.Easy || defaults.difficulties.Easy,
      Medium: parsed.difficulties?.Medium || defaults.difficulties.Medium,
      Hard: parsed.difficulties?.Hard || defaults.difficulties.Hard,
    };

    // Ensure maxUnlockedLevel is at least 1 and capped at 10
    (['Easy', 'Medium', 'Hard'] as GameDifficulty[]).forEach((diff) => {
      if (!mergedDifficulties[diff].maxUnlockedLevel || mergedDifficulties[diff].maxUnlockedLevel < 1) {
        mergedDifficulties[diff].maxUnlockedLevel = 1;
      }
      if (mergedDifficulties[diff].maxUnlockedLevel > 10) {
        mergedDifficulties[diff].maxUnlockedLevel = 10;
      }
      // Ensure all 10 levels exist in dictionary
      for (let l = 1; l <= 10; l++) {
        if (!mergedDifficulties[diff].levels[l]) {
          mergedDifficulties[diff].levels[l] = { completed: false, stars: 0 };
        }
      }
    });

    const currentLevel =
      typeof parsed.currentLevel === 'number' && parsed.currentLevel >= 1 && parsed.currentLevel <= 10
        ? parsed.currentLevel
        : 1;

    return {
      gameId,
      currentDifficulty,
      currentLevel,
      difficulties: mergedDifficulties,
    };
  } catch (err) {
    console.warn(`Failed to parse saved progression for ${gameId}, falling back to defaults`, err);
    return createDefaultProgressState(gameId);
  }
}

/**
 * Saves game progress to browser localStorage.
 */
export function saveGameProgress(state: GameProgressState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${state.gameId}`, JSON.stringify(state));
  } catch (err) {
    console.warn(`Failed to persist progression for ${state.gameId}`, err);
  }
}

/**
 * Completes a level, updates stars and records, and unlocks the next level if applicable.
 */
export function completeLevel(
  gameId: string,
  difficulty: GameDifficulty,
  level: number,
  scoreOrTime: number,
  starsEarned: number,
  isTimeMetric: boolean = false
): {
  nextLevelUnlocked: boolean;
  isGameCompleted: boolean;
  updatedState: GameProgressState;
} {
  const state = loadGameProgress(gameId);
  const diffProg = state.difficulties[difficulty];

  const prevRecord = diffProg.levels[level] || { completed: false, stars: 0 };
  const stars = Math.max(prevRecord.stars || 0, Math.min(3, Math.max(1, starsEarned)));

  let bestScore = prevRecord.bestScore;
  let bestTimeSeconds = prevRecord.bestTimeSeconds;

  if (isTimeMetric) {
    // For time, lower is better
    bestTimeSeconds = bestTimeSeconds ? Math.min(bestTimeSeconds, scoreOrTime) : scoreOrTime;
  } else {
    // For score/moves, higher is better (or best recorded)
    bestScore = bestScore ? Math.max(bestScore, scoreOrTime) : scoreOrTime;
  }

  diffProg.levels[level] = {
    completed: true,
    stars,
    bestScore,
    bestTimeSeconds,
    completedAt: new Date().toISOString(),
  };

  let nextLevelUnlocked = false;
  if (level < 10) {
    const nextLvl = level + 1;
    if (diffProg.maxUnlockedLevel < nextLvl) {
      diffProg.maxUnlockedLevel = nextLvl;
      nextLevelUnlocked = true;
    }
  }

  const isGameCompleted = level === 10;

  state.currentDifficulty = difficulty;
  state.currentLevel = level < 10 ? level + 1 : 10;

  saveGameProgress(state);

  return {
    nextLevelUnlocked,
    isGameCompleted,
    updatedState: state,
  };
}

/**
 * Resets progress for a specific difficulty mode.
 */
export function resetDifficultyProgress(
  gameId: string,
  difficulty: GameDifficulty
): GameProgressState {
  const state = loadGameProgress(gameId);
  state.difficulties[difficulty] = createInitialDifficultyProgress(difficulty);
  state.currentLevel = 1;
  saveGameProgress(state);
  return state;
}

/**
 * Resets all progress for all 3 difficulties of a game.
 */
export function resetAllGameProgress(gameId: string): GameProgressState {
  const fresh = createDefaultProgressState(gameId);
  saveGameProgress(fresh);
  return fresh;
}
