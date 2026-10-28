import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Eye,
  Lightbulb,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

interface DifferenceZone {
  id: number;
  xPct: number; // percentage 0-100 from left
  yPct: number; // percentage 0-100 from top
  radiusPct: number; // detection radius
  label: string;
}

interface SpotScene {
  id: string;
  title: string;
  description: string;
  differences: DifferenceZone[];
  renderLeft: () => React.ReactNode;
  renderRight: () => React.ReactNode;
}

// 3 Curated Crisp SVG Illustrated Scenes
const SCENES: SpotScene[] = [
  {
    id: 'studio-desk',
    title: 'The Photographer’s Studio',
    description: 'A cozy editing desk with cameras, lenses, monitor, coffee mug, and desk plants.',
    differences: [
      { id: 1, xPct: 24, yPct: 35, radiusPct: 7, label: 'Wall Art Graphic Accent' },
      { id: 2, xPct: 52, yPct: 42, radiusPct: 6, label: 'Monitor Screen Horizon Line' },
      { id: 3, xPct: 78, yPct: 68, radiusPct: 7, label: 'Camera Lens Color Ring' },
      { id: 4, xPct: 15, yPct: 76, radiusPct: 6, label: 'Coffee Mug Steam Swirl' },
      { id: 5, xPct: 88, yPct: 32, radiusPct: 6, label: 'Studio Desk Clock Hand' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#1e1e2d" />
        {/* Wall poster */}
        <rect x="60" y="40" width="70" height="90" rx="4" fill="#2a2a3e" stroke="#4f46e5" strokeWidth="2" />
        <circle cx="95" cy="85" r="18" fill="#ec4899" />
        <polygon points="75,115 115,115 95,95" fill="#3b82f6" />
        {/* Desk clock */}
        <circle cx="350" cy="95" r="24" fill="#252538" stroke="#6366f1" strokeWidth="2" />
        <line x1="350" y1="95" x2="350" y2="82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="350" y1="95" x2="362" y2="95" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
        {/* Desk surface */}
        <rect x="0" y="190" width="400" height="110" fill="#2d3748" />
        <line x1="0" y1="190" x2="400" y2="190" stroke="#4a5568" strokeWidth="3" />
        {/* Computer monitor */}
        <rect x="150" y="60" width="120" height="90" rx="6" fill="#111827" stroke="#94a3b8" strokeWidth="2" />
        <rect x="156" y="66" width="108" height="78" fill="#1e293b" />
        <path d="M 156 120 Q 210 90 264 120 L 264 144 L 156 144 Z" fill="#6366f1" />
        <circle cx="180" cy="90" r="10" fill="#fbbf24" />
        <rect x="200" y="150" width="20" height="30" fill="#94a3b8" />
        <rect x="180" y="180" width="60" height="6" rx="3" fill="#94a3b8" />
        {/* Coffee Mug */}
        <rect x="50" y="210" width="24" height="30" rx="4" fill="#ef4444" />
        <path d="M 74 216 Q 84 224 74 232" fill="none" stroke="#ef4444" strokeWidth="3" />
        <path d="M 58 198 Q 62 190 58 182" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* DSLR Camera with Lens */}
        <rect x="290" y="200" width="45" height="35" rx="5" fill="#0f172a" />
        <rect x="305" y="194" width="15" height="6" rx="2" fill="#0f172a" />
        <circle cx="312" cy="217" r="14" fill="#334155" stroke="#3b82f6" strokeWidth="3" />
        <circle cx="312" cy="217" r="7" fill="#1e293b" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#1e1e2d" />
        {/* Wall poster (Diff 1: circle is yellow instead of pink) */}
        <rect x="60" y="40" width="70" height="90" rx="4" fill="#2a2a3e" stroke="#4f46e5" strokeWidth="2" />
        <circle cx="95" cy="85" r="18" fill="#fbbf24" />
        <polygon points="75,115 115,115 95,95" fill="#3b82f6" />
        {/* Desk clock (Diff 5: clock minute hand points at 6 instead of 3) */}
        <circle cx="350" cy="95" r="24" fill="#252538" stroke="#6366f1" strokeWidth="2" />
        <line x1="350" y1="95" x2="350" y2="82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="350" y1="95" x2="350" y2="108" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
        {/* Desk surface */}
        <rect x="0" y="190" width="400" height="110" fill="#2d3748" />
        <line x1="0" y1="190" x2="400" y2="190" stroke="#4a5568" strokeWidth="3" />
        {/* Computer monitor (Diff 2: horizon mountain peak is shifted) */}
        <rect x="150" y="60" width="120" height="90" rx="6" fill="#111827" stroke="#94a3b8" strokeWidth="2" />
        <rect x="156" y="66" width="108" height="78" fill="#1e293b" />
        <path d="M 156 130 Q 210 115 264 130 L 264 144 L 156 144 Z" fill="#6366f1" />
        <circle cx="180" cy="90" r="10" fill="#fbbf24" />
        <rect x="200" y="150" width="20" height="30" fill="#94a3b8" />
        <rect x="180" y="180" width="60" height="6" rx="3" fill="#94a3b8" />
        {/* Coffee Mug (Diff 4: steam curl is missing) */}
        <rect x="50" y="210" width="24" height="30" rx="4" fill="#ef4444" />
        <path d="M 74 216 Q 84 224 74 232" fill="none" stroke="#ef4444" strokeWidth="3" />
        {/* DSLR Camera with Lens (Diff 3: red ring instead of blue ring) */}
        <rect x="290" y="200" width="45" height="35" rx="5" fill="#0f172a" />
        <rect x="305" y="194" width="15" height="6" rx="2" fill="#0f172a" />
        <circle cx="312" cy="217" r="14" fill="#334155" stroke="#ef4444" strokeWidth="3" />
        <circle cx="312" cy="217" r="7" fill="#1e293b" />
      </svg>
    ),
  },
  {
    id: 'city-park',
    title: 'City Skyline & Waterfront',
    description: 'A vibrant waterfront skyline with sailboats, hot air balloon, park bench, and sunset glow.',
    differences: [
      { id: 1, xPct: 82, yPct: 22, radiusPct: 7, label: 'Hot Air Balloon Color' },
      { id: 2, xPct: 35, yPct: 65, radiusPct: 6, label: 'Sailboat Flag Color' },
      { id: 3, xPct: 18, yPct: 38, radiusPct: 7, label: 'Skyscraper Antenna Light' },
      { id: 4, xPct: 58, yPct: 82, radiusPct: 6, label: 'Park Bench Slats' },
      { id: 5, xPct: 45, yPct: 18, radiusPct: 6, label: 'Cloud Density' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#skyGrad)" />
        {/* Clouds */}
        <ellipse cx="180" cy="55" rx="35" ry="14" fill="#ffffff" opacity="0.75" />
        <ellipse cx="205" cy="50" rx="25" ry="16" fill="#ffffff" opacity="0.85" />
        {/* Hot air balloon */}
        <circle cx="328" cy="66" r="18" fill="#ef4444" />
        <rect x="325" y="87" width="6" height="5" fill="#78350f" />
        {/* Skyline */}
        <rect x="40" y="80" width="35" height="120" fill="#1e1b4b" />
        <line x1="57" y1="80" x2="57" y2="60" stroke="#ef4444" strokeWidth="2" />
        <circle cx="57" cy="58" r="3" fill="#ef4444" />
        <rect x="85" y="110" width="40" height="90" fill="#312e81" />
        <rect x="135" y="95" width="50" height="105" fill="#1e1b4b" />
        {/* Waterfront */}
        <rect x="0" y="200" width="400" height="100" fill="#0369a1" />
        <path d="M 0 215 Q 100 205 200 215 T 400 215" stroke="#38bdf8" strokeWidth="2" fill="none" />
        {/* Sailboat */}
        <polygon points="140,195 125,170 140,170" fill="#ffffff" />
        <polygon points="142,195 155,175 142,175" fill="#f43f5e" />
        <polygon points="120,196 160,196 150,205 130,205" fill="#78350f" />
        {/* Foreground park quay */}
        <path d="M 180 300 L 260 240 L 400 240 L 400 300 Z" fill="#334155" />
        {/* Bench */}
        <rect x="225" y="246" width="32" height="6" rx="2" fill="#d97706" />
        <rect x="225" y="254" width="32" height="6" rx="2" fill="#d97706" />
        <rect x="228" y="260" width="4" height="12" fill="#0f172a" />
        <rect x="251" y="260" width="4" height="12" fill="#0f172a" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#skyGrad2)" />
        {/* Clouds (Diff 5: cloud shape shifted) */}
        <ellipse cx="180" cy="55" rx="20" ry="10" fill="#ffffff" opacity="0.6" />
        {/* Hot air balloon (Diff 1: balloon is blue instead of red) */}
        <circle cx="328" cy="66" r="18" fill="#3b82f6" />
        <rect x="325" y="87" width="6" height="5" fill="#78350f" />
        {/* Skyline (Diff 3: Antenna light is green instead of red) */}
        <rect x="40" y="80" width="35" height="120" fill="#1e1b4b" />
        <line x1="57" y1="80" x2="57" y2="60" stroke="#10b981" strokeWidth="2" />
        <circle cx="57" cy="58" r="3" fill="#10b981" />
        <rect x="85" y="110" width="40" height="90" fill="#312e81" />
        <rect x="135" y="95" width="50" height="105" fill="#1e1b4b" />
        {/* Waterfront */}
        <rect x="0" y="200" width="400" height="100" fill="#0369a1" />
        <path d="M 0 215 Q 100 205 200 215 T 400 215" stroke="#38bdf8" strokeWidth="2" fill="none" />
        {/* Sailboat (Diff 2: small sail is emerald instead of red) */}
        <polygon points="140,195 125,170 140,170" fill="#ffffff" />
        <polygon points="142,195 155,175 142,175" fill="#10b981" />
        <polygon points="120,196 160,196 150,205 130,205" fill="#78350f" />
        {/* Foreground park quay */}
        <path d="M 180 300 L 260 240 L 400 240 L 400 300 Z" fill="#334155" />
        {/* Bench (Diff 4: bench has only one slat) */}
        <rect x="225" y="246" width="32" height="6" rx="2" fill="#d97706" />
        <rect x="228" y="254" width="4" height="16" fill="#0f172a" />
        <rect x="251" y="254" width="4" height="16" fill="#0f172a" />
      </svg>
    ),
  },
];

export const SpotTheDifferenceGame: React.FC = () => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [foundDiffIds, setFoundDiffIds] = useState<number[]>([]);
  const [pulsingHintId, setPulsingHintId] = useState<number | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const scene = SCENES[currentSceneIdx];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when scene changes
  useEffect(() => {
    setFoundDiffIds([]);
    setPulsingHintId(null);
    setTimerSeconds(0);
    setIsVictory(false);
  }, [currentSceneIdx]);

  // Stopwatch
  useEffect(() => {
    if (isVictory) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVictory]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Click on image coordinate
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isVictory) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let hit: DifferenceZone | null = null;
    for (const diff of scene.differences) {
      if (foundDiffIds.includes(diff.id)) continue;
      const dist = Math.sqrt(
        Math.pow(clickX - diff.xPct, 2) + Math.pow(clickY - diff.yPct, 2)
      );
      if (dist <= diff.radiusPct) {
        hit = diff;
        break;
      }
    }

    if (hit) {
      gameAudio.playMatch();
      const updated = [...foundDiffIds, hit.id];
      setFoundDiffIds(updated);
      if (pulsingHintId === hit.id) setPulsingHintId(null);

      if (updated.length === scene.differences.length) {
        setIsVictory(true);
        gameAudio.playVictory();
      }
    } else {
      gameAudio.playError();
    }
  };

  // Provide a hint
  const triggerHint = () => {
    if (hintsRemaining <= 0 || isVictory) return;
    const unfound = scene.differences.filter((d) => !foundDiffIds.includes(d.id));
    if (unfound.length === 0) return;

    const pick = unfound[0];
    setPulsingHintId(pick.id);
    setHintsRemaining((h) => h - 1);
    gameAudio.playMove();

    setTimeout(() => {
      setPulsingHintId(null);
    }, 4000);
  };

  const nextScene = () => {
    const nextIdx = (currentSceneIdx + 1) % SCENES.length;
    setCurrentSceneIdx(nextIdx);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Header & Status Bar */}
      <div className="w-full flex items-center justify-between mb-4 glass-panel p-3.5 rounded-2xl gap-3 flex-wrap">
        <div>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
            Scene {currentSceneIdx + 1} of {SCENES.length}
          </span>
          <h3 className="text-base font-bold text-theme-primary">{scene.title}</h3>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-theme-secondary">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-mono">{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-500">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              Found: {foundDiffIds.length} / {scene.differences.length}
            </span>
          </div>

          <button
            type="button"
            onClick={triggerHint}
            disabled={hintsRemaining <= 0 || isVictory}
            className="flex items-center gap-1 text-indigo-500 hover:underline disabled:opacity-40"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint ({hintsRemaining})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFoundDiffIds([]);
              setPulsingHintId(null);
              setTimerSeconds(0);
              setIsVictory(false);
            }}
            className="p-1 rounded-full text-theme-muted hover:text-theme-primary"
            title="Reset Scene"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SIDE-BY-SIDE INTERACTIVE SCENES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
        {/* Left Scene (Original) */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-theme-muted mb-1.5">Original Image</span>
          <div
            onClick={handleImageClick}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-black/10 dark:border-white/10 cursor-crosshair shadow-sm select-none"
          >
            {scene.renderLeft()}

            {/* Found Difference Rings */}
            {scene.differences.map((diff) => {
              const isFound = foundDiffIds.includes(diff.id);
              const isHint = pulsingHintId === diff.id;
              if (!isFound && !isHint) return null;

              return (
                <div
                  key={diff.id}
                  style={{
                    left: `${diff.xPct}%`,
                    top: `${diff.yPct}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute rounded-full pointer-events-none transition-all ${
                    isFound
                      ? 'w-10 h-10 border-2 border-emerald-400 bg-emerald-500/20 ring-4 ring-emerald-500/30'
                      : 'w-12 h-12 border-2 border-amber-400 bg-amber-500/20 animate-ping ring-4 ring-amber-400/40'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Right Scene (Modified) */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-theme-muted mb-1.5">Modified Image</span>
          <div
            onClick={handleImageClick}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-black/10 dark:border-white/10 cursor-crosshair shadow-sm select-none"
          >
            {scene.renderRight()}

            {/* Found Difference Rings */}
            {scene.differences.map((diff) => {
              const isFound = foundDiffIds.includes(diff.id);
              const isHint = pulsingHintId === diff.id;
              if (!isFound && !isHint) return null;

              return (
                <div
                  key={diff.id}
                  style={{
                    left: `${diff.xPct}%`,
                    top: `${diff.yPct}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute rounded-full pointer-events-none transition-all ${
                    isFound
                      ? 'w-10 h-10 border-2 border-emerald-400 bg-emerald-500/20 ring-4 ring-emerald-500/30'
                      : 'w-12 h-12 border-2 border-amber-400 bg-amber-500/20 animate-ping ring-4 ring-amber-400/40'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-xs text-theme-muted text-center max-w-lg mb-4">
        Tap or click directly on any difference you spot on either the left or right image.
      </p>

      {/* VICTORY MODAL OVERLAY */}
      {isVictory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 sm:p-8 rounded-3xl text-center shadow-2xl border border-white/20 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-display text-theme-primary mb-1">
              All 5 Found!
            </h3>
            <p className="text-xs text-theme-secondary mb-4">
              Eagle eyes! You identified every subtle modification in {formatTimer(timerSeconds)}.
            </p>

            <button
              type="button"
              onClick={nextScene}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Play Next Scene</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
