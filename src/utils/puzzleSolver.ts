// PIXAL LAB — Mathematical Sliding Puzzle Engine
// Implements 100% solvable random-walk shuffling, adjacency validation, and state tracking.

export interface MoveResult {
  valid: boolean;
  newBoard: number[];
  newEmptyIndex: number;
  solved: boolean;
  progressPercent: number;
}

export interface BestRecord {
  bestTime: number; // in seconds
  bestMoves: number;
}

// Generate an initial solved board of size N x N
export function generateSolvedBoard(gridSize: number): number[] {
  const total = gridSize * gridSize;
  return Array.from({ length: total }, (_, i) => i);
}

// Check if two coordinates are orthogonally adjacent
export function isAdjacent(index1: number, index2: number, gridSize: number): boolean {
  const r1 = Math.floor(index1 / gridSize);
  const c1 = index1 % gridSize;
  const r2 = Math.floor(index2 / gridSize);
  const c2 = index2 % gridSize;

  const manhattanDist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
  return manhattanDist === 1;
}

// Get all orthogonal neighbors of an index
export function getAdjacentIndices(index: number, gridSize: number): number[] {
  const r = Math.floor(index / gridSize);
  const c = index % gridSize;
  const neighbors: number[] = [];

  if (r > 0) neighbors.push((r - 1) * gridSize + c); // Up
  if (r < gridSize - 1) neighbors.push((r + 1) * gridSize + c); // Down
  if (c > 0) neighbors.push(r * gridSize + (c - 1)); // Left
  if (c < gridSize - 1) neighbors.push(r * gridSize + (c + 1)); // Right

  return neighbors;
}

// Count inversions among non-blank tiles (for mathematical verification)
export function countInversions(board: number[], blankTileId: number): number {
  let inversions = 0;
  const nonBlankTiles = board.filter((id) => id !== blankTileId);

  for (let i = 0; i < nonBlankTiles.length; i++) {
    for (let j = i + 1; j < nonBlankTiles.length; j++) {
      if (nonBlankTiles[i] > nonBlankTiles[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

// Verify mathematical solvability
export function isSolvable(board: number[], gridSize: number): boolean {
  const blankTileId = gridSize * gridSize - 1;
  const inversions = countInversions(board, blankTileId);

  if (gridSize % 2 !== 0) {
    // Odd grid: solvable iff inversions is even
    return inversions % 2 === 0;
  } else {
    // Even grid: solvable iff (inversions + blankRowFromBottom) is odd (where blankRowFromBottom is 1-indexed)
    const blankIndex = board.indexOf(blankTileId);
    const blankRowFromTop = Math.floor(blankIndex / gridSize);
    const blankRowFromBottom = gridSize - blankRowFromTop;
    return (inversions + blankRowFromBottom) % 2 === 1;
  }
}

// Check if board is in solved configuration
export function checkSolved(board: number[]): boolean {
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== i) return false;
  }
  return true;
}

// Calculate percentage of tiles correctly positioned
export function calculateProgress(board: number[], gridSize: number): number {
  const total = gridSize * gridSize;
  const blankId = total - 1;
  let correct = 0;

  for (let i = 0; i < total; i++) {
    // We count matching tiles excluding the blank
    if (board[i] === i && board[i] !== blankId) {
      correct++;
    }
  }

  return Math.round((correct / (total - 1)) * 100);
}

// Guaranteed Solvable Scramble using Random Walk from Solved State
export function shuffleBoard(gridSize: number, steps: number = 40): { board: number[]; emptyIndex: number } {
  const total = gridSize * gridSize;
  const board = generateSolvedBoard(gridSize);
  let emptyIndex = total - 1;
  let lastMovedTileIndex = -1;

  // For 2x2 beginner mode, clamp scramble steps between 2 and 4 for an extremely easy start
  const actualSteps = gridSize === 2 ? Math.min(Math.max(steps, 2), 4) : steps;

  for (let s = 0; s < actualSteps; s++) {
    const neighbors = getAdjacentIndices(emptyIndex, gridSize);
    // Filter out the tile that was just moved to prevent immediate backtrack
    const viableNeighbors = neighbors.filter((idx) => idx !== lastMovedTileIndex);
    const candidates = viableNeighbors.length > 0 ? viableNeighbors : neighbors;

    const chosenIdx = candidates[Math.floor(Math.random() * candidates.length)];

    // Swap empty with chosen neighbor
    board[emptyIndex] = board[chosenIdx];
    board[chosenIdx] = total - 1;

    lastMovedTileIndex = emptyIndex;
    emptyIndex = chosenIdx;
  }

  // Ensure the board is not already solved at start
  while (checkSolved(board)) {
    const neighbors = getAdjacentIndices(emptyIndex, gridSize);
    const chosenIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
    board[emptyIndex] = board[chosenIdx];
    board[chosenIdx] = total - 1;
    emptyIndex = chosenIdx;
  }

  return { board, emptyIndex };
}

// Execute player move
export function makeMove(
  board: number[],
  emptyIndex: number,
  tileIndex: number,
  gridSize: number
): MoveResult {
  if (!isAdjacent(emptyIndex, tileIndex, gridSize)) {
    return {
      valid: false,
      newBoard: board,
      newEmptyIndex: emptyIndex,
      solved: false,
      progressPercent: calculateProgress(board, gridSize),
    };
  }

  const newBoard = [...board];
  const blankId = gridSize * gridSize - 1;

  // Swap tile with empty slot
  newBoard[emptyIndex] = newBoard[tileIndex];
  newBoard[tileIndex] = blankId;

  const solved = checkSolved(newBoard);
  const progressPercent = calculateProgress(newBoard, gridSize);

  return {
    valid: true,
    newBoard,
    newEmptyIndex: tileIndex,
    solved,
    progressPercent,
  };
}

// Handle Keyboard Arrow Key Navigation
// Returns target tile index to move into empty slot if valid
export function getTileIndexForArrowKey(
  key: string,
  emptyIndex: number,
  gridSize: number
): number | null {
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  switch (key) {
    case 'ArrowUp':
      // Move tile below empty slot up
      return emptyRow < gridSize - 1 ? (emptyRow + 1) * gridSize + emptyCol : null;
    case 'ArrowDown':
      // Move tile above empty slot down
      return emptyRow > 0 ? (emptyRow - 1) * gridSize + emptyCol : null;
    case 'ArrowLeft':
      // Move tile to the right of empty slot left
      return emptyCol < gridSize - 1 ? emptyRow * gridSize + (emptyCol + 1) : null;
    case 'ArrowRight':
      // Move tile to the left of empty slot right
      return emptyCol > 0 ? emptyRow * gridSize + (emptyCol - 1) : null;
    default:
      return null;
  }
}

// Local Storage Progress and Best Records Management
const STORAGE_KEY_UNLOCKED = 'pixallab_puzzle_unlocked_level';
const STORAGE_KEY_RECORDS = 'pixallab_puzzle_records';

export function getUnlockedLevel(): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return 1;
}

export function saveUnlockedLevel(level: number): void {
  try {
    const current = getUnlockedLevel();
    if (level > current && level <= 10) {
      localStorage.setItem(STORAGE_KEY_UNLOCKED, level.toString());
    }
  } catch {
    // ignore
  }
}

export function getBestRecord(level: number): BestRecord | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (saved) {
      const records = JSON.parse(saved);
      if (records && records[level]) {
        return records[level];
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveRecord(level: number, timeSeconds: number, moves: number): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
    const records = saved ? JSON.parse(saved) : {};
    const existing = records[level];

    if (!existing) {
      records[level] = { bestTime: timeSeconds, bestMoves: moves };
    } else {
      records[level] = {
        bestTime: Math.min(existing.bestTime, timeSeconds),
        bestMoves: Math.min(existing.bestMoves, moves),
      };
    }
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  } catch {
    // ignore
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
