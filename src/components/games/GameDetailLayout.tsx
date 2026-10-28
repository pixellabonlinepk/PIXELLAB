import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  HelpCircle,
  Clock,
  Sparkles,
  Gamepad2,
  Share2,
  Check,
  RotateCcw,
} from 'lucide-react';
import { GameItem, GAMES_CATALOG } from '../../data/gamesData';
import { gameAudio } from '../../utils/gameAudio';

interface GameDetailLayoutProps {
  game: GameItem;
  onBackToDirectory: () => void;
  onSelectGame: (slug: string) => void;
  children: React.ReactNode;
}

export const GameDetailLayout: React.FC<GameDetailLayoutProps> = ({
  game,
  onBackToDirectory,
  onSelectGame,
  children,
}) => {
  const [activeTab, setActiveTab] = useState<'how-to-play' | 'rules' | 'tips'>('how-to-play');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(gameAudio.getSoundEnabled());
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    gameAudio.setSoundEnabled(next);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `https://www.pixallab.online/games/${game.slug}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
        });
      }
    }
  };

  // Find 3 other related games from catalog
  const relatedGames = GAMES_CATALOG.filter((g) => g.id !== game.id).slice(0, 3);

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-theme-muted">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="hover:text-indigo-500 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            type="button"
            onClick={onBackToDirectory}
            className="hover:text-indigo-500 transition-colors font-medium"
          >
            Games & Fun
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-theme-primary font-semibold truncate max-w-[180px] sm:max-w-none">
            {game.title}
          </span>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="px-3 py-1.5 rounded-full text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Games Directory</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
            className={`p-1.5 rounded-full text-xs font-semibold glass-panel transition-all active:scale-95 shadow-xs ${
              soundEnabled
                ? 'text-indigo-500 hover:text-indigo-600'
                : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share Game URL"
            className="px-3 py-1.5 rounded-full text-xs font-semibold glass-panel text-theme-secondary hover:text-theme-primary transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. GAME HEADER */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              {game.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/10 text-theme-muted">
              {game.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/10 text-theme-muted">
              {game.playerMode}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-theme-primary tracking-tight">
            {game.title}
          </h1>
          <p className="text-xs sm:text-sm text-theme-secondary mt-1.5 max-w-2xl">
            {game.shortDescription}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-xs text-theme-muted shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Avg Session: {game.estimatedMinutes}</span>
          </div>
          <span className="opacity-30">•</span>
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-indigo-500" />
            <span>In-Browser Client</span>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE GAME PLAYABLE STAGE */}
      <div className="mb-10 w-full">{children}</div>

      {/* 4. GAME DOCUMENTATION & RULES TABS */}
      <div className="glass-panel rounded-2xl p-5 sm:p-7 mb-10 shadow-sm border border-black/5 dark:border-white/10">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base sm:text-lg font-bold text-theme-primary">
              Game Guide & Strategy
            </h2>
          </div>

          <div className="flex items-center gap-1 apple-segmented p-1 rounded-full">
            <button
              type="button"
              onClick={() => setActiveTab('how-to-play')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'how-to-play'
                  ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                  : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              How to Play
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'rules'
                  ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                  : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              Official Rules
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tips')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'tips'
                  ? 'bg-white dark:bg-white/15 text-theme-primary shadow-xs'
                  : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              Pro Tips
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'how-to-play' && (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed mb-4">
              {game.longDescription}
            </p>
            <ol className="space-y-2.5">
              {game.howToPlay.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-theme-primary">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-3">
            <ul className="space-y-2.5">
              {game.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-theme-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-3">
            <ul className="space-y-2.5">
              {game.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-theme-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 5. RELATED GAMES RECOMMENDATION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold font-display text-theme-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>More Games & Fun on PIXAL LAB</span>
          </h3>
          <button
            type="button"
            onClick={onBackToDirectory}
            className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
          >
            <span>View All Games</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedGames.map((relGame) => (
            <div
              key={relGame.id}
              onClick={() => onSelectGame(relGame.slug)}
              className="glass-panel p-4 rounded-xl cursor-pointer hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                    {relGame.category}
                  </span>
                  <span className="text-[10px] font-medium text-theme-muted bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {relGame.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-theme-primary group-hover:text-indigo-500 transition-colors">
                  {relGame.title}
                </h4>
                <p className="text-xs text-theme-muted mt-1 line-clamp-2">
                  {relGame.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-indigo-500">
                <span>Play Now</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
