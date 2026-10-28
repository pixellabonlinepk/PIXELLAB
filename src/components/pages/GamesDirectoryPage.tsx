import React, { useState, useMemo } from 'react';
import {
  Gamepad2,
  Sparkles,
  Search,
  Filter,
  Play,
  Clock,
  Trophy,
  Brain,
  ShieldCheck,
  ChevronRight,
  Puzzle,
  Grid3X3,
  X as XIcon,
  Layers,
  Eye,
  Compass,
} from 'lucide-react';
import {
  GAMES_CATALOG,
  GameCategory,
  GameDifficulty,
  GameItem,
} from '../../data/gamesData';

interface GamesDirectoryPageProps {
  onSelectGame: (slug: string) => void;
  onExploreTools: () => void;
}

export const GamesDirectoryPage: React.FC<GamesDirectoryPageProps> = ({
  onSelectGame,
  onExploreTools,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const CATEGORIES: { id: string; label: string }[] = [
    { id: 'all', label: 'All Games' },
    { id: 'Visual & Puzzle', label: 'Visual & Puzzle' },
    { id: 'Logic & Numbers', label: 'Logic & Numbers' },
    { id: 'Classic Casual', label: 'Classic Casual' },
    { id: 'Word & Memory', label: 'Word & Memory' },
  ];

  const DIFFICULTIES: { id: string; label: string }[] = [
    { id: 'all', label: 'All Levels' },
    { id: 'Easy', label: 'Easy' },
    { id: 'Medium', label: 'Medium' },
    { id: 'Hard', label: 'Hard' },
    { id: 'Adaptive', label: 'Adaptive' },
  ];

  // Filter games based on search, category, and difficulty
  const filteredGames = useMemo(() => {
    return GAMES_CATALOG.filter((game) => {
      const matchesCategory =
        selectedCategory === 'all' || game.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.tagline.toLowerCase().includes(q) ||
        game.shortDescription.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q) ||
        game.features.some((f) => f.toLowerCase().includes(q));

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  // Helper to render game card icon
  const renderCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Puzzle':
        return <Puzzle className="w-6 h-6" />;
      case 'Grid3X3':
        return <Grid3X3 className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'X':
        return <XIcon className="w-6 h-6" />;
      case 'Layers':
        return <Layers className="w-6 h-6" />;
      case 'Eye':
        return <Eye className="w-6 h-6" />;
      case 'Search':
        return <Search className="w-6 h-6" />;
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      default:
        return <Gamepad2 className="w-6 h-6" />;
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3.5 glass-panel text-indigo-500 border border-indigo-500/20 shadow-xs">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Section 2: Games & Fun</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-theme-primary mb-3.5 tracking-tight [text-wrap:balance]">
          Free Online{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500">
            Games & Fun
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-theme-secondary max-w-2xl mx-auto leading-relaxed">
          Play 8 browser-based games designed to sharpen spatial cognition, deduction, vocabulary, and visual memory. 100% free with zero downloads, zero ads, and zero server uploads.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-[11px] font-semibold text-theme-muted">
          <span className="px-3 py-1 rounded-full glass-panel flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-indigo-500" />
            <span>Brain Training & Logic</span>
          </span>
          <span className="px-3 py-1 rounded-full glass-panel flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-500" />
            <span>Instant In-Browser Play</span>
          </span>
          <span className="px-3 py-1 rounded-full glass-panel flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>No Account Required</span>
          </span>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS BAR */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl mb-8 border border-black/5 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games by title, rules, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-black/5 dark:bg-white/10 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Dropdown/Pills */}
          <div className="flex items-center gap-1 overflow-x-auto apple-segmented p-1 rounded-full max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Difficulty Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by difficulty"
              className="px-3 py-1.5 rounded-full text-xs font-semibold glass-panel text-theme-primary border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. GAMES GRID */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.slug)}
              className="glass-panel rounded-2xl p-5 border border-black/5 dark:border-white/10 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                    {game.category}
                  </span>
                  {game.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      {game.badge}
                    </span>
                  )}
                </div>

                {/* Game Icon & Gradient Accent */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}
                >
                  {renderCardIcon(game.icon)}
                </div>

                {/* Game Title & Description */}
                <h2 className="text-base sm:text-lg font-bold font-display text-theme-primary group-hover:text-indigo-500 transition-colors mb-1.5">
                  {game.title}
                </h2>
                <p className="text-xs text-theme-secondary leading-relaxed line-clamp-3 mb-4">
                  {game.shortDescription}
                </p>
              </div>

              <div>
                {/* Metadata Row */}
                <div className="flex items-center justify-between text-[11px] text-theme-muted border-t border-black/5 dark:border-white/10 pt-3 mb-4">
                  <span>Level: {game.difficulty}</span>
                  <span>{game.playerMode}</span>
                </div>

                {/* Play Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGame(game.slug);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-indigo-500/25 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 glass-panel rounded-3xl border border-black/5 dark:border-white/10 max-w-xl mx-auto px-6">
          <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 text-theme-muted mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-theme-primary mb-1">
            No games found
          </h3>
          <p className="text-xs text-theme-secondary mb-4">
            We couldn't find any games matching "{searchQuery}". Try searching for another keyword or clearing your filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* 4. BRAIN TRAINING & REASONING BENEFITS ACCORDION */}
      <div className="mt-16 glass-panel p-6 sm:p-8 rounded-3xl border border-black/5 dark:border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-theme-primary mb-2 text-center">
            Cognitive Benefits of Visual & Logic Games
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary text-center mb-8">
            Regular engagement with spatial puzzles and deduction challenges stimulates neural plasticity and working memory.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
                <Brain className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-theme-primary">Deductive Logic</h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Games like Sudoku and Tic-Tac-Toe require systematic elimination and prospective planning, strengthening prefrontal cortex problem-solving circuits.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-2">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-theme-primary">Visual-Spatial Memory</h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Sliding puzzles, Jigsaw assemblies, and Memory Match enhance mental rotation, spatial anchoring, and rapid pattern synthesis.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-theme-primary">Focused Attention</h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Word Search and Spot the Difference train sustained selective visual attention, suppressing distracting peripheral stimuli.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
