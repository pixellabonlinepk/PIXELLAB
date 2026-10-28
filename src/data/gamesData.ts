// PIXAL LAB — Games & Fun Data Registry
// High-quality catalog with metadata, instructions, rules, tips, and SEO configurations.

export type GameCategory =
  | 'Visual & Puzzle'
  | 'Logic & Numbers'
  | 'Classic Casual'
  | 'Word & Memory';

export type GameDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Adaptive';

export interface GameItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  playerMode: 'Solo Player' | '1 or 2 Players' | 'Solo vs AI';
  badge?: string;
  icon: string; // Lucide icon identifier
  color: string; // Tailwind gradient
  shortDescription: string;
  longDescription: string;
  features: string[];
  howToPlay: string[];
  rules: string[];
  tips: string[];
  seoTitle: string;
  seoDescription: string;
  estimatedMinutes: string;
}

export const GAMES_CATALOG: GameItem[] = [
  {
    id: 'sliding-picture-puzzle',
    slug: 'sliding-picture-puzzle',
    title: 'Sliding Picture Puzzle',
    tagline: 'Reorder scrambled photographic tiles into complete imagery',
    category: 'Visual & Puzzle',
    difficulty: 'Adaptive',
    playerMode: 'Solo Player',
    badge: 'Flagship Game',
    icon: 'Puzzle',
    color: 'from-indigo-500 to-purple-600',
    shortDescription:
      'Challenge spatial cognition by sliding high-resolution image tiles into order across multiple difficulty levels, timer tracking, and sound effects.',
    longDescription:
      'The PIXAL LAB Sliding Picture Puzzle combines visual pattern recognition with algorithmic solvability. Choose from curated photography categories or play with custom dimensions from 3x3 up to 6x6. Every puzzle arrangement is mathematically guaranteed solvable using parity inversion calculations.',
    features: [
      'Mathematically validated solvable boards (zero impossible states)',
      'Adaptive difficulty spanning 3×3 (8-puzzle) up to 6×6 grids',
      'Curated nature, architecture, and technology photo gallery',
      'Real-time stopwatch, move counter, and best score persistence',
      'Synthesized sound effects and optional tile number hint overlay',
    ],
    howToPlay: [
      'Click or tap any tile adjacent to the empty slot to slide it into the empty space.',
      'On desktop keyboards, use Arrow Keys to slide adjacent tiles directionally.',
      'Study the target thumbnail in the top-right to identify edge pieces and corners first.',
      'Arrange tiles row-by-row from top to bottom until all fragments click into their target position.',
    ],
    rules: [
      'Only tiles sharing a direct horizontal or vertical edge with the empty square can move.',
      'Tiles cannot jump over one another or move diagonally.',
      'The puzzle is solved when all numeric positions match the original photograph.',
    ],
    tips: [
      'Solve row 1 first, then row 2, and finish the bottom two rows together as a unit.',
      'Toggle the tile numbers overlay if you need guidance with intricate photographic textures.',
      'Plan moves in sequences rather than moving tiles reactively to minimize total moves.',
    ],
    seoTitle: 'Sliding Picture Puzzle Online | Free Photo Tile Game | PIXAL LAB',
    seoDescription:
      'Play the free Sliding Picture Puzzle on PIXAL LAB. Slide photo tiles into place across 3x3 to 6x6 difficulties with move counters, timers, and zero ads.',
    estimatedMinutes: '3-8 min',
  },
  {
    id: 'sudoku',
    slug: 'sudoku',
    title: 'Classic Sudoku Master',
    tagline: 'Sharpen logic deduction on authentic 9x9 numerical grids',
    category: 'Logic & Numbers',
    difficulty: 'Medium',
    playerMode: 'Solo Player',
    badge: 'Brain Teaser',
    icon: 'Grid3X3',
    color: 'from-blue-500 to-cyan-600',
    shortDescription:
      'Play authentic 9x9 Sudoku puzzles across Easy, Medium, and Hard difficulty levels with real-time error checking, notes pencil mode, and helpful hints.',
    longDescription:
      'Sudoku Master provides mathematically verified 9×9 grids adhering strictly to classic Japanese logic standards. Featuring dynamic pencil-mode candidate notes, duplicate conflict highlights, smart hint guidance, and clean input controls for both touchscreen and keyboard navigation.',
    features: [
      'Pure deductive logic with mathematically validated unique solutions',
      '3 distinct difficulty presets: Easy, Medium, and Expert Hard',
      'Dual input modes: direct digit entry and candidate notes (pencil marks)',
      'Instant row, column, and 3×3 box conflict visualization',
      'Undo move stack and smart hint assistant for challenging boards',
    ],
    howToPlay: [
      'Select an empty cell on the 9×9 grid using mouse click, touch, or arrow keys.',
      'Enter digits 1 through 9 using the on-screen keypad or numeric keys on your keyboard.',
      'Toggle Notes mode (pencil icon) to jot down multiple possible candidates in a cell.',
      'Use the Erase tool or Backspace key to clear numbers from editable cells.',
    ],
    rules: [
      'Every horizontal row must contain digits 1 to 9 without repetition.',
      'Every vertical column must contain digits 1 to 9 without repetition.',
      'Each of the nine 3×3 sub-grids (boxes) must contain digits 1 to 9 exactly once.',
      'Clue cells provided at game start are locked and cannot be edited.',
    ],
    tips: [
      'Look for rows or boxes that already have 6 or 7 numbers filled in to identify easy targets.',
      'Use pencil marks to track the "naked pairs" where two cells in a block can only be the same two numbers.',
      'Eliminate numbers by scanning intersecting rows and columns across neighboring 3x3 blocks.',
    ],
    seoTitle: 'Free Online Sudoku | Play 9x9 Number Logic Game | PIXAL LAB',
    seoDescription:
      'Play free online Sudoku on PIXAL LAB. Enjoy 9x9 puzzles across Easy, Medium, and Hard with pencil notes, mistake highlights, hints, and zero paywalls.',
    estimatedMinutes: '5-15 min',
  },
  {
    id: 'memory-match',
    slug: 'memory-match',
    title: 'Visual Memory Match',
    tagline: 'Test spatial recall and concentration with aesthetic visual pairs',
    category: 'Word & Memory',
    difficulty: 'Easy',
    playerMode: 'Solo Player',
    badge: 'Popular',
    icon: 'Sparkles',
    color: 'from-pink-500 to-rose-600',
    shortDescription:
      'Exercise your working memory and visual retention by flipping cards to find matching pairs of icons across customizable grid layouts.',
    longDescription:
      'Visual Memory Match strengthens visual-spatial memory through tactile card-flipping gameplay. Choose from 12-card, 16-card, or 24-card layouts with rich graphic themes. Features smooth 3D flip animations, rapid-click protection, move tracking, and accuracy ratings.',
    features: [
      'Adjustable card counts: Easy (12 cards), Medium (16 cards), and Hard (24 cards)',
      'Smooth 3D perspective flip animations with zero layout shift',
      'Anti-spam click protection preventing invalid simultaneous flips',
      'Real-time moves counter, stopwatch timer, and star performance scoring',
      'Local sound synthesis for flips, successful pairs, and game completion',
    ],
    howToPlay: [
      'Click or tap any facedown card to flip it over and reveal its icon.',
      'Select a second card to see if it matches the first card.',
      'If the two cards match, they lock in place with a glowing checkmark.',
      'If they do not match, both cards flip back facedown after a brief glance.',
      'Continue until all pairs have been uncovered in the fewest possible moves.',
    ],
    rules: [
      'Only two cards can be flipped simultaneously.',
      'You cannot click on already matched pairs.',
      'Timer starts upon your first card flip.',
    ],
    tips: [
      'Form spatial mental anchors by remembering which icons were revealed in the four corners.',
      'Say the name of each uncovered symbol out loud to reinforce auditory and visual memory pathways.',
      'Pace your flips systematically rather than randomly guessing.',
    ],
    seoTitle: 'Visual Memory Match Online | Free Card Flip Brain Game | PIXAL LAB',
    seoDescription:
      'Train your brain with Visual Memory Match on PIXAL LAB. Flip cards, match creative icons, beat your best time, and sharpen memory on any device.',
    estimatedMinutes: '2-5 min',
  },
  {
    id: 'tic-tac-toe',
    slug: 'tic-tac-toe',
    title: 'Tic-Tac-Toe Pro',
    tagline: 'Classic 3x3 strategy with unbeatable Minimax AI & 2-player modes',
    category: 'Classic Casual',
    difficulty: 'Adaptive',
    playerMode: '1 or 2 Players',
    badge: 'Minimax AI',
    icon: 'X',
    color: 'from-amber-500 to-orange-600',
    shortDescription:
      'Play the timeless 3x3 strategy game against an intelligent computer AI powered by the Minimax algorithm or challenge a friend in local two-player pass-and-play.',
    longDescription:
      'Tic-Tac-Toe Pro elevates the classic grid game with clean interactive design and genuine multi-level AI. Challenge the Easy bot for casual fun, Medium for balanced competition, or the mathematically unbeatable Minimax engine that guarantees optimal defense on every turn.',
    features: [
      'Versatile play modes: Single Player vs Computer or Local 2-Player Pass & Play',
      'Genuine AI difficulties: Casual (random), Balanced (defensive), and Master (Minimax)',
      'Winning line vector animations across horizontal, vertical, and diagonal matches',
      'Cumulative session scoreboard tracking X Wins, O Wins, and Cat/Ties',
      'Instant round resets and zero gameplay lag',
    ],
    howToPlay: [
      'Select your game mode: Single Player (vs AI) or 2-Player Local.',
      'Player X always goes first by placing their mark on any empty square.',
      'Player O (or the computer) responds by marking an available square.',
      'The first player to align 3 consecutive marks horizontally, vertically, or diagonally wins.',
      'If all nine squares fill with no three-in-a-row, the game ends in a tie.',
    ],
    rules: [
      'Players alternate turns placing one mark per turn on an unoccupied square.',
      'Once placed, a mark cannot be moved or replaced.',
      'The game immediately concludes as soon as a 3-in-a-row condition is met.',
    ],
    tips: [
      'Controlling the center square gives you four possible winning lines (row, column, two diagonals).',
      'Occupying corners sets up lethal "forks" where you create two simultaneous winning threats.',
      'Against the Master AI, optimal play from both sides will always culminate in a strategic tie.',
    ],
    seoTitle: 'Free Online Tic-Tac-Toe Pro | Play vs AI or 2 Players | PIXAL LAB',
    seoDescription:
      'Play Tic-Tac-Toe Pro on PIXAL LAB. Challenge our smart Minimax AI across 3 difficulty levels or pass-and-play locally with friends. Clean, responsive, and free.',
    estimatedMinutes: '1-3 min',
  },
  {
    id: '2048',
    slug: '2048',
    title: '2048 Number Merge',
    tagline: 'Slide and merge exponential tiles to reach the legendary 2048 milestone',
    category: 'Logic & Numbers',
    difficulty: 'Medium',
    playerMode: 'Solo Player',
    badge: 'High Score',
    icon: 'Layers',
    color: 'from-emerald-500 to-teal-600',
    shortDescription:
      'Swipe, slide, and combine matching numeric tiles on a 4x4 grid. Plan ahead, rack up huge combo scores, and unlock the golden 2048 tile.',
    longDescription:
      '2048 Number Merge brings the iconic numerical puzzle to PIXAL LAB with silky smooth animations, keyboard arrow bindings, mobile touch swipe gestures, high-score memory, and a reliable one-step undo option for tactical recovery.',
    features: [
      'Standard 4×4 grid following strict single-merge-per-turn rules',
      'Dual controls: Desktop Arrow Keys / WASD and mobile touch screen swipe gestures',
      'High-score persistence saved securely in local browser storage',
      '1-step Undo button allowing tactical error correction without losing score',
      'Dynamic tile color gradients that evolve as your numbers multiply',
    ],
    howToPlay: [
      'Slide tiles in any of 4 directions: Up, Down, Left, or Right using arrow keys, WASD, or swipe gestures.',
      'When two tiles with identical numbers collide, they merge into a single tile with double the value.',
      'After every move, a new tile (either 2 or 4) spawns in a random unoccupied cell.',
      'Keep merging until you successfully forge the coveted 2048 tile, or keep going for record scores!',
    ],
    rules: [
      'A valid move requires at least one tile to slide or merge.',
      'Tiles can only merge once per slide.',
      'The game ends when the board fills completely and no adjacent tiles share matching numbers.',
    ],
    tips: [
      'Pick one corner (such as bottom-right) and keep your highest tile anchored there at all times.',
      'Build a monotonic descending snake pattern along the bottom row: e.g. 512, 256, 128, 64.',
      'Avoid swiping in the opposite direction of your anchor corner unless absolutely necessary.',
    ],
    seoTitle: '2048 Game Online | Play 2048 Number Puzzle Free | PIXAL LAB',
    seoDescription:
      'Play 2048 online for free on PIXAL LAB. Slide matching number tiles, reach 2048, track high scores, and enjoy responsive touch and keyboard controls.',
    estimatedMinutes: '5-20 min',
  },
  {
    id: 'spot-the-difference',
    slug: 'spot-the-difference',
    title: 'Spot the Difference',
    tagline: 'Inspect side-by-side scenes to detect subtle visual modifications',
    category: 'Visual & Puzzle',
    difficulty: 'Medium',
    playerMode: 'Solo Player',
    badge: 'Visual Acuity',
    icon: 'Eye',
    color: 'from-violet-500 to-indigo-600',
    shortDescription:
      'Carefully inspect paired visual scenes to detect 5 subtle differences in lighting, textures, objects, and colors before time runs out.',
    longDescription:
      'Spot the Difference trains fine visual acuity and attention to detail. Compare two high-definition vector scenes rendered side-by-side. Tap or click on either image to confirm differences, earn accuracy bonuses, use smart hints, and progress across themed scenarios.',
    features: [
      '3 rich themed illustrated scenes: Studio Desk, City Park Skyline, and Creator Lab',
      '5 mathematically mapped difference zones per scene with millimeter-exact hitbox detection',
      'Interactive visual feedback with glowing target rings and synthesized success chimes',
      'Gentle hint compass to assist when you are stuck on the final hidden variation',
      'Progress counter and accuracy timer with level completion celebration',
    ],
    howToPlay: [
      'Examine the left and right scene illustrations side by side.',
      'Look for missing elements, altered colors, shifted angles, or different shapes.',
      'Click or tap directly on the suspected area on either the left or right image.',
      'Finding a valid difference marks both images with a glowing circle and advances your counter.',
      'Locate all 5 differences to complete the scene and unlock the next setting.',
    ],
    rules: [
      'Differences can be selected on either the original or the modified image.',
      'Repeatedly clicking an already discovered difference will not grant additional points.',
      'Clicking empty areas without differences triggers a brief misclick ripple.',
    ],
    tips: [
      'Divide the scene into quadrants and scan systematically from top-left to bottom-right.',
      'Look closely at small background details like wall clocks, signs, shadows, and small props.',
      'Cross your eyes slightly to overlay both images if you enjoy the stereoscopic 3D scanning technique!',
    ],
    seoTitle: 'Spot the Difference Online | Free Visual Acuity Game | PIXAL LAB',
    seoDescription:
      'Find 5 differences between side-by-side illustrations on PIXAL LAB. Spot the Difference challenges visual memory, focus, and detail recognition for free.',
    estimatedMinutes: '3-7 min',
  },
  {
    id: 'word-search',
    slug: 'word-search',
    title: 'Word Search Explorer',
    tagline: 'Discover hidden photography, tech, and color terms in dense letter grids',
    category: 'Word & Memory',
    difficulty: 'Medium',
    playerMode: 'Solo Player',
    badge: 'Vocabulary',
    icon: 'Search',
    color: 'from-cyan-500 to-teal-600',
    shortDescription:
      'Uncover hidden words nestled horizontally, vertically, and diagonally across dynamic letter matrices with drag-to-select interaction.',
    longDescription:
      'Word Search Explorer blends classic vocabulary discovery with modern web interactions. Explore curated word themes centered on digital photography, color theory, and creative technology. Featuring fluid drag-selection for both mouse and touch, word strike-throughs, and dynamic grid generation.',
    features: [
      'Interactive letter matrices across Easy (10×10), Medium (12×12), and Hard (14×14) sizes',
      '3 curated vocabulary themes: Digital Imaging, Color Harmony, and Creative Tech',
      'Fluid selection trail supporting both mouse drag and multi-point touch interaction',
      'Color-coded highlighter overlays for found words with checklist strike-throughs',
      'Instant new puzzle randomization with guaranteed target word presence',
    ],
    howToPlay: [
      'Review the target word list displayed alongside the letter grid.',
      'Scan the grid for the first letter of a target word.',
      'Click/touch and drag across the letters from the first letter to the last letter of the word.',
      'Release your mouse or finger; if the selected sequence matches a word, it highlights permanently.',
      'Find every word in the checklist to conquer the puzzle!',
    ],
    rules: [
      'Words can be laid out horizontally (left-to-right), vertically (top-to-bottom), or diagonally.',
      'In Hard mode, words may also be written in reverse orientation.',
      'Letters may overlap and belong to more than one intersecting word.',
    ],
    tips: [
      'Scan the grid for rare consonants such as Z, X, Q, K, or double letters like LL or SS.',
      'Focus on finding one specific word at a time rather than letting your gaze wander aimlessly.',
      'Use a ruler or finger to scan individual lines horizontally across the grid.',
    ],
    seoTitle: 'Free Word Search Online | Interactive Letter Puzzle | PIXAL LAB',
    seoDescription:
      'Play Word Search Explorer online for free on PIXAL LAB. Find hidden photography, color, and tech words with drag-and-select touch controls and timer stats.',
    estimatedMinutes: '4-10 min',
  },
  {
    id: 'jigsaw-puzzle',
    slug: 'jigsaw-puzzle',
    title: 'Artistic Jigsaw Puzzle',
    tagline: 'Snap fragmented picture pieces into place to restore vibrant artwork',
    category: 'Visual & Puzzle',
    difficulty: 'Adaptive',
    playerMode: 'Solo Player',
    badge: 'Art & Craft',
    icon: 'Compass',
    color: 'from-teal-500 to-emerald-600',
    shortDescription:
      'Assemble scenic photographic fragments into complete masterpieces using tactile drag-and-drop piece snapping across 9, 16, or 25-piece puzzles.',
    longDescription:
      'Artistic Jigsaw Puzzle delivers a serene, tactile puzzle experience inside your browser. Select from scenic landscape photography or abstract compositions. Pieces render with realistic interlocking borders, audio snap confirmations when placed correctly, and full reference preview overlays.',
    features: [
      'Multiple grid complexities: 3×3 (9 pieces), 4×4 (16 pieces), and 5×5 (25 pieces)',
      'Scenic photography collection featuring Alpine Peaks, City Sunsets, and Ocean Coasts',
      'Tactile drag-and-drop and click-to-swap piece manipulation for mobile and desktop',
      'Satisfying snap-into-place audio feedback and lock indicator upon correct placement',
      'Original image preview overlay modal for reference during gameplay',
    ],
    howToPlay: [
      'Choose an image theme and your desired puzzle complexity (9, 16, or 25 pieces).',
      'Inspect the shuffled pieces in the piece staging tray or on the board.',
      'Drag any piece into its estimated target slot, or click a piece and click a slot to swap.',
      'When a piece is placed in its true target location, it snaps securely into place.',
      'Connect all pieces to complete the artwork and view your completion time and move count.',
    ],
    rules: [
      'Once a piece snaps into its permanently correct coordinate, it is locked in place.',
      'All pieces must be positioned in their exact matching coordinates to achieve victory.',
      'The timer measures the elapsed duration from your first interaction to full assembly.',
    ],
    tips: [
      'Begin by identifying the 4 corner pieces and outer border pieces first.',
      'Group remaining interior pieces by distinct color zones (e.g. blue sky, green trees, water).',
      'Toggle the Reference Preview modal if you need to double-check intricate texture details.',
    ],
    seoTitle: 'Artistic Jigsaw Puzzle Online | Free Photo Jigsaw | PIXAL LAB',
    seoDescription:
      'Play Artistic Jigsaw Puzzle online for free on PIXAL LAB. Piece together scenic nature and city photos across 9 to 25 pieces with tactile piece snapping.',
    estimatedMinutes: '3-12 min',
  },
];

export function getGameBySlug(slug: string): GameItem | undefined {
  return GAMES_CATALOG.find((g) => g.slug === slug || g.id === slug);
}
