import React from 'react';

export interface DifferenceZone {
  id: number;
  xPct: number; // percentage 0-100 from left
  yPct: number; // percentage 0-100 from top
  radiusPct: number; // detection radius
  label: string;
}

export interface SpotScene {
  id: string;
  title: string;
  description: string;
  differences: DifferenceZone[];
  renderLeft: () => React.ReactNode;
  renderRight: () => React.ReactNode;
}

export const SPOT_SCENES: SpotScene[] = [
  // 1. Photographer's Studio
  {
    id: 'studio-desk',
    title: 'The Photographer’s Studio',
    description: 'A cozy editing desk with cameras, lenses, monitor, coffee mug, and desk plants.',
    differences: [
      { id: 1, xPct: 24, yPct: 35, radiusPct: 8, label: 'Wall Art Graphic Accent' },
      { id: 2, xPct: 52, yPct: 42, radiusPct: 8, label: 'Monitor Screen Horizon Line' },
      { id: 3, xPct: 78, yPct: 72, radiusPct: 8, label: 'Camera Lens Color Ring' },
      { id: 4, xPct: 15, yPct: 76, radiusPct: 8, label: 'Coffee Mug Steam Swirl' },
      { id: 5, xPct: 88, yPct: 32, radiusPct: 8, label: 'Studio Desk Clock Hand' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#1e1e2d" />
        <rect x="60" y="40" width="70" height="90" rx="4" fill="#2a2a3e" stroke="#4f46e5" strokeWidth="2" />
        <circle cx="95" cy="85" r="18" fill="#ec4899" />
        <polygon points="75,115 115,115 95,95" fill="#3b82f6" />
        <circle cx="350" cy="95" r="24" fill="#252538" stroke="#6366f1" strokeWidth="2" />
        <line x1="350" y1="95" x2="350" y2="82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="350" y1="95" x2="362" y2="95" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
        <rect x="0" y="190" width="400" height="110" fill="#2d3748" />
        <line x1="0" y1="190" x2="400" y2="190" stroke="#4a5568" strokeWidth="3" />
        <rect x="150" y="60" width="120" height="90" rx="6" fill="#111827" stroke="#94a3b8" strokeWidth="2" />
        <rect x="156" y="66" width="108" height="78" fill="#1e293b" />
        <path d="M 156 120 Q 210 90 264 120 L 264 144 L 156 144 Z" fill="#6366f1" />
        <circle cx="180" cy="90" r="10" fill="#fbbf24" />
        <rect x="200" y="150" width="20" height="30" fill="#94a3b8" />
        <rect x="180" y="180" width="60" height="6" rx="3" fill="#94a3b8" />
        <rect x="50" y="210" width="24" height="30" rx="4" fill="#ef4444" />
        <path d="M 74 216 Q 84 224 74 232" fill="none" stroke="#ef4444" strokeWidth="3" />
        <path d="M 58 198 Q 62 190 58 182" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <rect x="290" y="200" width="45" height="35" rx="5" fill="#0f172a" />
        <rect x="305" y="194" width="15" height="6" rx="2" fill="#0f172a" />
        <circle cx="312" cy="217" r="14" fill="#334155" stroke="#3b82f6" strokeWidth="3" />
        <circle cx="312" cy="217" r="7" fill="#1e293b" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#1e1e2d" />
        <rect x="60" y="40" width="70" height="90" rx="4" fill="#2a2a3e" stroke="#4f46e5" strokeWidth="2" />
        {/* Diff 1: circle is yellow instead of pink */}
        <circle cx="95" cy="85" r="18" fill="#fbbf24" />
        <polygon points="75,115 115,115 95,95" fill="#3b82f6" />
        {/* Diff 5: clock minute hand points down at 6 instead of 3 */}
        <circle cx="350" cy="95" r="24" fill="#252538" stroke="#6366f1" strokeWidth="2" />
        <line x1="350" y1="95" x2="350" y2="82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="350" y1="95" x2="350" y2="108" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
        <rect x="0" y="190" width="400" height="110" fill="#2d3748" />
        <line x1="0" y1="190" x2="400" y2="190" stroke="#4a5568" strokeWidth="3" />
        {/* Diff 2: horizon peak shifted lower */}
        <rect x="150" y="60" width="120" height="90" rx="6" fill="#111827" stroke="#94a3b8" strokeWidth="2" />
        <rect x="156" y="66" width="108" height="78" fill="#1e293b" />
        <path d="M 156 130 Q 210 115 264 130 L 264 144 L 156 144 Z" fill="#6366f1" />
        <circle cx="180" cy="90" r="10" fill="#fbbf24" />
        <rect x="200" y="150" width="20" height="30" fill="#94a3b8" />
        <rect x="180" y="180" width="60" height="6" rx="3" fill="#94a3b8" />
        {/* Diff 4: steam curl is missing */}
        <rect x="50" y="210" width="24" height="30" rx="4" fill="#ef4444" />
        <path d="M 74 216 Q 84 224 74 232" fill="none" stroke="#ef4444" strokeWidth="3" />
        {/* Diff 3: red ring instead of blue ring */}
        <rect x="290" y="200" width="45" height="35" rx="5" fill="#0f172a" />
        <rect x="305" y="194" width="15" height="6" rx="2" fill="#0f172a" />
        <circle cx="312" cy="217" r="14" fill="#334155" stroke="#ef4444" strokeWidth="3" />
        <circle cx="312" cy="217" r="7" fill="#1e293b" />
      </svg>
    ),
  },

  // 2. City Waterfront Sunset
  {
    id: 'city-park',
    title: 'City Skyline & Waterfront',
    description: 'A vibrant waterfront skyline with sailboats, hot air balloon, park bench, and sunset glow.',
    differences: [
      { id: 1, xPct: 82, yPct: 22, radiusPct: 8, label: 'Hot Air Balloon Color' },
      { id: 2, xPct: 38, yPct: 62, radiusPct: 8, label: 'Sailboat Flag Color' },
      { id: 3, xPct: 14, yPct: 20, radiusPct: 8, label: 'Skyscraper Antenna Beacon' },
      { id: 4, xPct: 62, yPct: 86, radiusPct: 8, label: 'Quay Streetlight Glow' },
      { id: 5, xPct: 45, yPct: 18, radiusPct: 8, label: 'Cloud Density' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#skyGrad1)" />
        <ellipse cx="180" cy="55" rx="35" ry="14" fill="#ffffff" opacity="0.75" />
        <ellipse cx="205" cy="50" rx="25" ry="16" fill="#ffffff" opacity="0.85" />
        <circle cx="328" cy="66" r="18" fill="#ef4444" />
        <rect x="325" y="87" width="6" height="5" fill="#78350f" />
        <rect x="40" y="80" width="35" height="120" fill="#1e1b4b" />
        <line x1="57" y1="80" x2="57" y2="60" stroke="#ef4444" strokeWidth="2" />
        <circle cx="57" cy="58" r="3" fill="#ef4444" />
        <rect x="85" y="110" width="40" height="90" fill="#312e81" />
        <rect x="135" y="95" width="50" height="105" fill="#1e1b4b" />
        <rect x="0" y="200" width="400" height="100" fill="#0369a1" />
        <path d="M 0 215 Q 100 205 200 215 T 400 215" stroke="#38bdf8" strokeWidth="2" fill="none" />
        <polygon points="140,195 125,170 140,170" fill="#ffffff" />
        <polygon points="142,195 155,175 142,175" fill="#f43f5e" />
        <polygon points="120,196 160,196 150,205 130,205" fill="#78350f" />
        <path d="M 180 300 L 260 240 L 400 240 L 400 300 Z" fill="#334155" />
        <circle cx="248" cy="258" r="8" fill="#fef08a" opacity="0.9" />
        <line x1="248" y1="266" x2="248" y2="285" stroke="#0f172a" strokeWidth="3" />
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
        {/* Diff 5: smaller cloud */}
        <ellipse cx="180" cy="55" rx="18" ry="8" fill="#ffffff" opacity="0.6" />
        {/* Diff 1: blue hot air balloon */}
        <circle cx="328" cy="66" r="18" fill="#3b82f6" />
        <rect x="325" y="87" width="6" height="5" fill="#78350f" />
        {/* Diff 3: green beacon */}
        <rect x="40" y="80" width="35" height="120" fill="#1e1b4b" />
        <line x1="57" y1="80" x2="57" y2="60" stroke="#10b981" strokeWidth="2" />
        <circle cx="57" cy="58" r="3" fill="#10b981" />
        <rect x="85" y="110" width="40" height="90" fill="#312e81" />
        <rect x="135" y="95" width="50" height="105" fill="#1e1b4b" />
        <rect x="0" y="200" width="400" height="100" fill="#0369a1" />
        <path d="M 0 215 Q 100 205 200 215 T 400 215" stroke="#38bdf8" strokeWidth="2" fill="none" />
        <polygon points="140,195 125,170 140,170" fill="#ffffff" />
        {/* Diff 2: emerald green flag */}
        <polygon points="142,195 155,175 142,175" fill="#10b981" />
        <polygon points="120,196 160,196 150,205 130,205" fill="#78350f" />
        <path d="M 180 300 L 260 240 L 400 240 L 400 300 Z" fill="#334155" />
        {/* Diff 4: cyan lamp glow */}
        <circle cx="248" cy="258" r="8" fill="#38bdf8" opacity="0.9" />
        <line x1="248" y1="266" x2="248" y2="285" stroke="#0f172a" strokeWidth="3" />
      </svg>
    ),
  },

  // 3. Digital Creator Lab
  {
    id: 'creator-lab',
    title: 'Digital Creator Lab',
    description: 'A futuristic workstation with dual curved monitors, synthesizer keyboard, and audio interface.',
    differences: [
      { id: 1, xPct: 22, yPct: 30, radiusPct: 8, label: 'Left Monitor Waveform' },
      { id: 2, xPct: 78, yPct: 30, radiusPct: 8, label: 'Right Monitor Code Color' },
      { id: 3, xPct: 50, yPct: 75, radiusPct: 8, label: 'Keyboard Key Accent' },
      { id: 4, xPct: 86, yPct: 80, radiusPct: 8, label: 'Headphone Cable Color' },
      { id: 5, xPct: 15, yPct: 75, radiusPct: 8, label: 'Audio Knob Indicator' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#0b0f19" />
        {/* Wall LED strip */}
        <rect x="0" y="20" width="400" height="4" fill="#6366f1" opacity="0.8" />
        {/* Dual Monitors */}
        <rect x="40" y="60" width="140" height="90" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <path d="M 50 110 Q 70 80 90 120 T 130 95 T 170 110" fill="none" stroke="#06b6d4" strokeWidth="3" />
        <rect x="220" y="60" width="140" height="90" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <line x1="235" y1="80" x2="310" y2="80" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="95" x2="280" y2="95" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="110" x2="330" y2="110" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
        {/* Desk */}
        <rect x="0" y="180" width="400" height="120" fill="#182234" />
        {/* Audio Interface */}
        <rect x="40" y="210" width="50" height="35" rx="4" fill="#334155" />
        <circle cx="65" cy="227" r="8" fill="#0f172a" />
        <line x1="65" y1="227" x2="65" y2="221" stroke="#ef4444" strokeWidth="2" />
        {/* Keyboard Synth */}
        <rect x="140" y="205" width="120" height="40" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        <rect x="150" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="165" y="212" width="10" height="24" fill="#6366f1" />
        <rect x="180" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="195" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="210" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="225" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="240" y="212" width="10" height="24" fill="#ffffff" />
        {/* Headphones & Wire */}
        <circle cx="340" cy="230" r="14" fill="#475569" stroke="#64748b" strokeWidth="2" />
        <path d="M 340 244 Q 350 265 320 250" fill="none" stroke="#ef4444" strokeWidth="3" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#0b0f19" />
        <rect x="0" y="20" width="400" height="4" fill="#6366f1" opacity="0.8" />
        {/* Diff 1: waveform is yellow instead of cyan */}
        <rect x="40" y="60" width="140" height="90" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <path d="M 50 110 Q 70 80 90 120 T 130 95 T 170 110" fill="none" stroke="#eab308" strokeWidth="3" />
        {/* Diff 2: first code line is rose pink */}
        <rect x="220" y="60" width="140" height="90" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <line x1="235" y1="80" x2="310" y2="80" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="95" x2="280" y2="95" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="110" x2="330" y2="110" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
        <rect x="0" y="180" width="400" height="120" fill="#182234" />
        {/* Diff 5: knob line points right */}
        <rect x="40" y="210" width="50" height="35" rx="4" fill="#334155" />
        <circle cx="65" cy="227" r="8" fill="#0f172a" />
        <line x1="65" y1="227" x2="72" y2="227" stroke="#10b981" strokeWidth="2" />
        {/* Diff 3: keyboard key is rose instead of purple */}
        <rect x="140" y="205" width="120" height="40" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        <rect x="150" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="165" y="212" width="10" height="24" fill="#f43f5e" />
        <rect x="180" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="195" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="210" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="225" y="212" width="10" height="24" fill="#ffffff" />
        <rect x="240" y="212" width="10" height="24" fill="#ffffff" />
        {/* Diff 4: headphone wire is cyan */}
        <circle cx="340" cy="230" r="14" fill="#475569" stroke="#64748b" strokeWidth="2" />
        <path d="M 340 244 Q 350 265 320 250" fill="none" stroke="#06b6d4" strokeWidth="3" />
      </svg>
    ),
  },

  // 4. Cozy Coffee Bistro
  {
    id: 'coffee-bistro',
    title: 'Cozy Artisan Coffee Bistro',
    description: 'Warm cafe counter with chalkboard menu, pastry glass case, espresso machine, and decorative plants.',
    differences: [
      { id: 1, xPct: 25, yPct: 28, radiusPct: 8, label: 'Menu Board Price' },
      { id: 2, xPct: 80, yPct: 40, radiusPct: 8, label: 'Espresso Gauge Needle' },
      { id: 3, xPct: 45, yPct: 75, radiusPct: 8, label: 'Pastry Tier Donut Topping' },
      { id: 4, xPct: 15, yPct: 70, radiusPct: 8, label: 'Potted Plant Leaf' },
      { id: 5, xPct: 85, yPct: 82, radiusPct: 8, label: 'Takeaway Cup Sleeve' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#3e2723" />
        <rect x="40" y="30" width="120" height="80" rx="4" fill="#1b120c" stroke="#8d6e63" strokeWidth="3" />
        <text x="55" y="60" fill="#f5f5f5" fontSize="12" fontFamily="sans-serif">ESPRESSO</text>
        <text x="130" y="60" fill="#f59e0b" fontSize="12" fontFamily="sans-serif">$3</text>
        <text x="55" y="85" fill="#f5f5f5" fontSize="12" fontFamily="sans-serif">LATTE</text>
        <text x="130" y="85" fill="#f59e0b" fontSize="12" fontFamily="sans-serif">$4</text>
        <rect x="280" y="50" width="80" height="100" rx="6" fill="#78909c" stroke="#37474f" strokeWidth="2" />
        <circle cx="320" cy="85" r="14" fill="#ffffff" stroke="#263238" strokeWidth="2" />
        <line x1="320" y1="85" x2="320" y2="76" stroke="#d32f2f" strokeWidth="2" />
        <rect x="0" y="170" width="400" height="130" fill="#5d4037" />
        <rect x="140" y="180" width="100" height="60" rx="6" fill="#e0e0e0" opacity="0.3" stroke="#bcaaa4" strokeWidth="2" />
        <ellipse cx="170" cy="210" rx="14" ry="8" fill="#d7ccc8" />
        <ellipse cx="170" cy="208" rx="10" ry="5" fill="#ec4899" />
        <ellipse cx="210" cy="210" rx="14" ry="8" fill="#d7ccc8" />
        <ellipse cx="210" cy="208" rx="10" ry="5" fill="#795548" />
        <rect x="30" y="210" width="30" height="35" rx="3" fill="#ffb74d" />
        <circle cx="45" cy="195" r="16" fill="#2e7d32" />
        <circle cx="55" cy="188" r="12" fill="#388e3c" />
        <polygon points="325,230 355,230 350,280 330,280" fill="#ffffff" />
        <polygon points="327,245 353,245 351,265 329,265" fill="#8d6e63" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#3e2723" />
        {/* Diff 1: Latte price is $5 */}
        <rect x="40" y="30" width="120" height="80" rx="4" fill="#1b120c" stroke="#8d6e63" strokeWidth="3" />
        <text x="55" y="60" fill="#f5f5f5" fontSize="12" fontFamily="sans-serif">ESPRESSO</text>
        <text x="130" y="60" fill="#f59e0b" fontSize="12" fontFamily="sans-serif">$3</text>
        <text x="55" y="85" fill="#f5f5f5" fontSize="12" fontFamily="sans-serif">LATTE</text>
        <text x="130" y="85" fill="#f59e0b" fontSize="12" fontFamily="sans-serif">$5</text>
        {/* Diff 2: gauge needle points right */}
        <rect x="280" y="50" width="80" height="100" rx="6" fill="#78909c" stroke="#37474f" strokeWidth="2" />
        <circle cx="320" cy="85" r="14" fill="#ffffff" stroke="#263238" strokeWidth="2" />
        <line x1="320" y1="85" x2="328" y2="85" stroke="#d32f2f" strokeWidth="2" />
        <rect x="0" y="170" width="400" height="130" fill="#5d4037" />
        {/* Diff 3: donut topping is cyan */}
        <rect x="140" y="180" width="100" height="60" rx="6" fill="#e0e0e0" opacity="0.3" stroke="#bcaaa4" strokeWidth="2" />
        <ellipse cx="170" cy="210" rx="14" ry="8" fill="#d7ccc8" />
        <ellipse cx="170" cy="208" rx="10" ry="5" fill="#06b6d4" />
        <ellipse cx="210" cy="210" rx="14" ry="8" fill="#d7ccc8" />
        <ellipse cx="210" cy="208" rx="10" ry="5" fill="#795548" />
        {/* Diff 4: extra plant flower bud */}
        <rect x="30" y="210" width="30" height="35" rx="3" fill="#ffb74d" />
        <circle cx="45" cy="195" r="16" fill="#2e7d32" />
        <circle cx="55" cy="188" r="12" fill="#388e3c" />
        <circle cx="45" cy="180" r="5" fill="#ec4899" />
        {/* Diff 5: sleeve is emerald */}
        <polygon points="325,230 355,230 350,280 330,280" fill="#ffffff" />
        <polygon points="327,245 353,245 351,265 329,265" fill="#10b981" />
      </svg>
    ),
  },

  // 5. Cyberpunk Neon Alley
  {
    id: 'cyber-alley',
    title: 'Cyberpunk Neon Alley',
    description: 'A rain-slicked futuristic street with glowing neon kanji, cybernetic billboards, and hovering drones.',
    differences: [
      { id: 1, xPct: 20, yPct: 25, radiusPct: 8, label: 'Neon Kanzen Kanji Color' },
      { id: 2, xPct: 80, yPct: 20, radiusPct: 8, label: 'Drone Optical Sensor' },
      { id: 3, xPct: 52, yPct: 50, radiusPct: 8, label: 'Hologram Pyramid Symbol' },
      { id: 4, xPct: 75, yPct: 75, radiusPct: 8, label: 'Puddle Reflection Color' },
      { id: 5, xPct: 25, yPct: 85, radiusPct: 8, label: 'Cyber Cat Collar Glow' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#090a10" />
        <rect x="30" y="40" width="20" height="80" fill="#151726" stroke="#ec4899" strokeWidth="2" />
        <text x="35" y="70" fill="#ec4899" fontSize="16" fontWeight="bold">光</text>
        <text x="35" y="105" fill="#ec4899" fontSize="16" fontWeight="bold">電</text>
        <rect x="300" y="45" width="40" height="20" rx="8" fill="#1e293b" />
        <circle cx="320" cy="55" r="5" fill="#06b6d4" />
        <line x1="290" y1="45" x2="350" y2="45" stroke="#64748b" strokeWidth="2" />
        <polygon points="200,100 230,160 170,160" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0.8" />
        <circle cx="200" cy="135" r="8" fill="#ec4899" opacity="0.8" />
        <path d="M 0 190 L 400 190 L 400 300 L 0 300 Z" fill="#0d111a" />
        <ellipse cx="300" cy="240" rx="40" ry="12" fill="#a855f7" opacity="0.3" />
        <path d="M 80 260 L 95 240 L 110 260 Z" fill="#1e293b" />
        <circle cx="95" cy="235" r="8" fill="#1e293b" />
        <circle cx="95" cy="240" r="2.5" fill="#06b6d4" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#090a10" />
        {/* Diff 1: kanji is yellow neon */}
        <rect x="30" y="40" width="20" height="80" fill="#151726" stroke="#facc15" strokeWidth="2" />
        <text x="35" y="70" fill="#facc15" fontSize="16" fontWeight="bold">光</text>
        <text x="35" y="105" fill="#facc15" fontSize="16" fontWeight="bold">電</text>
        {/* Diff 2: drone sensor is red */}
        <rect x="300" y="45" width="40" height="20" rx="8" fill="#1e293b" />
        <circle cx="320" cy="55" r="5" fill="#ef4444" />
        <line x1="290" y1="45" x2="350" y2="45" stroke="#64748b" strokeWidth="2" />
        {/* Diff 3: inner circle is green */}
        <polygon points="200,100 230,160 170,160" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0.8" />
        <circle cx="200" cy="135" r="8" fill="#10b981" opacity="0.8" />
        <path d="M 0 190 L 400 190 L 400 300 L 0 300 Z" fill="#0d111a" />
        {/* Diff 4: puddle reflection is cyan */}
        <ellipse cx="300" cy="240" rx="40" ry="12" fill="#06b6d4" opacity="0.4" />
        <path d="M 80 260 L 95 240 L 110 260 Z" fill="#1e293b" />
        <circle cx="95" cy="235" r="8" fill="#1e293b" />
        {/* Diff 5: collar is amber */}
        <circle cx="95" cy="240" r="2.5" fill="#f59e0b" />
      </svg>
    ),
  },

  // 6. Alpine Mountain Cabin
  {
    id: 'alpine-cabin',
    title: 'Alpine Mountain Cabin',
    description: 'A cozy timber cabin surrounded by pine trees, snowy peaks, and curling chimney smoke.',
    differences: [
      { id: 1, xPct: 60, yPct: 15, radiusPct: 8, label: 'Chimney Smoke Plume' },
      { id: 2, xPct: 85, yPct: 45, radiusPct: 8, label: 'Pine Tree Star Topper' },
      { id: 3, xPct: 40, yPct: 62, radiusPct: 8, label: 'Cabin Window Glow' },
      { id: 4, xPct: 52, yPct: 78, radiusPct: 8, label: 'Door Wreath Ornament' },
      { id: 5, xPct: 20, yPct: 85, radiusPct: 8, label: 'Snowman Scarf Color' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#1e293b" />
        <polygon points="50,150 150,50 250,150" fill="#334155" />
        <polygon points="120,70 150,50 180,70" fill="#f8fafc" />
        <polygon points="200,160 300,60 400,160" fill="#475569" />
        <polygon points="270,90 300,60 330,90" fill="#f8fafc" />
        {/* Chimney & Smoke */}
        <rect x="230" y="110" width="16" height="30" fill="#78350f" />
        <path d="M 238 105 Q 230 80 245 60 Q 235 40 250 20" fill="none" stroke="#cbd5e1" strokeWidth="3" opacity="0.8" />
        {/* Cabin */}
        <polygon points="140,140 210,95 280,140" fill="#b91c1c" />
        <rect x="150" y="140" width="120" height="70" fill="#78350f" />
        <rect x="165" y="155" width="25" height="25" fill="#fef08a" stroke="#451a03" strokeWidth="2" />
        <rect x="205" y="160" width="24" height="50" fill="#451a03" />
        <circle cx="217" cy="180" r="6" fill="#15803d" />
        {/* Trees */}
        <polygon points="340,160 320,200 360,200" fill="#166534" />
        <polygon points="340,140 325,170 355,170" fill="#166534" />
        {/* Snow ground */}
        <path d="M 0 210 Q 200 190 400 210 L 400 300 L 0 300 Z" fill="#e2e8f0" />
        {/* Snowman */}
        <circle cx="70" cy="245" r="16" fill="#ffffff" />
        <circle cx="70" cy="225" r="11" fill="#ffffff" />
        <rect x="62" y="233" width="16" height="4" rx="2" fill="#ef4444" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#1e293b" />
        <polygon points="50,150 150,50 250,150" fill="#334155" />
        <polygon points="120,70 150,50 180,70" fill="#f8fafc" />
        <polygon points="200,160 300,60 400,160" fill="#475569" />
        <polygon points="270,90 300,60 330,90" fill="#f8fafc" />
        {/* Diff 1: smoke curls left */}
        <rect x="230" y="110" width="16" height="30" fill="#78350f" />
        <path d="M 238 105 Q 260 80 235 60 Q 255 40 220 20" fill="none" stroke="#cbd5e1" strokeWidth="3" opacity="0.8" />
        <polygon points="140,140 210,95 280,140" fill="#b91c1c" />
        <rect x="150" y="140" width="120" height="70" fill="#78350f" />
        {/* Diff 3: window is dark blue */}
        <rect x="165" y="155" width="25" height="25" fill="#1e3a8a" stroke="#451a03" strokeWidth="2" />
        <rect x="205" y="160" width="24" height="50" fill="#451a03" />
        {/* Diff 4: wreath is red bow */}
        <circle cx="217" cy="180" r="6" fill="#dc2626" />
        {/* Diff 2: star on pine tree */}
        <polygon points="340,160 320,200 360,200" fill="#166534" />
        <polygon points="340,140 325,170 355,170" fill="#166534" />
        <polygon points="340,132 342,137 347,137 343,140 345,145 340,142 335,145 337,140 333,137 338,137" fill="#facc15" />
        <path d="M 0 210 Q 200 190 400 210 L 400 300 L 0 300 Z" fill="#e2e8f0" />
        {/* Diff 5: scarf is cyan */}
        <circle cx="70" cy="245" r="16" fill="#ffffff" />
        <circle cx="70" cy="225" r="11" fill="#ffffff" />
        <rect x="62" y="233" width="16" height="4" rx="2" fill="#06b6d4" />
      </svg>
    ),
  },

  // 7. Tropical Coral Reef
  {
    id: 'coral-reef',
    title: 'Tropical Coral Reef',
    description: 'A sunlit underwater paradise featuring sea anemones, clownfish, starfish, and sea turtles.',
    differences: [
      { id: 1, xPct: 25, yPct: 35, radiusPct: 8, label: 'Clownfish Stripe Count' },
      { id: 2, xPct: 75, yPct: 30, radiusPct: 8, label: 'Sea Turtle Shell Pattern' },
      { id: 3, xPct: 80, yPct: 80, radiusPct: 8, label: 'Starfish Arm Color' },
      { id: 4, xPct: 45, yPct: 82, radiusPct: 8, label: 'Giant Clam Pearl' },
      { id: 5, xPct: 15, yPct: 75, radiusPct: 8, label: 'Anemone Branch Density' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="oceanGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#oceanGrad1)" />
        {/* Fish */}
        <ellipse cx="100" cy="110" rx="25" ry="14" fill="#f97316" />
        <polygon points="122,110 135,98 135,122" fill="#f97316" />
        <rect x="92" y="98" width="6" height="24" rx="2" fill="#ffffff" />
        <circle cx="85" cy="108" r="3" fill="#0f172a" />
        {/* Turtle */}
        <ellipse cx="290" cy="90" rx="30" ry="20" fill="#15803d" />
        <circle cx="325" cy="85" r="9" fill="#16a34a" />
        <polygon points="280,75 295,85 285,95" fill="#facc15" />
        {/* Sea Bed */}
        <path d="M 0 240 Q 150 210 400 230 L 400 300 L 0 300 Z" fill="#d97706" opacity="0.6" />
        {/* Anemone */}
        <path d="M 50 250 L 40 200 M 55 250 L 55 190 M 60 250 L 70 200" stroke="#ec4899" strokeWidth="5" strokeLinecap="round" />
        {/* Clam */}
        <ellipse cx="180" cy="255" rx="26" ry="14" fill="#a855f7" />
        <circle cx="180" cy="252" r="6" fill="#ffffff" />
        {/* Starfish */}
        <polygon points="320,240 326,252 338,252 328,260 332,272 320,264 308,272 312,260 302,252 314,252" fill="#ef4444" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="oceanGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#oceanGrad2)" />
        {/* Diff 1: two white stripes on fish */}
        <ellipse cx="100" cy="110" rx="25" ry="14" fill="#f97316" />
        <polygon points="122,110 135,98 135,122" fill="#f97316" />
        <rect x="88" y="98" width="5" height="24" rx="2" fill="#ffffff" />
        <rect x="104" y="100" width="5" height="20" rx="2" fill="#ffffff" />
        <circle cx="82" cy="108" r="3" fill="#0f172a" />
        {/* Diff 2: turtle shell has cyan badge */}
        <ellipse cx="290" cy="90" rx="30" ry="20" fill="#15803d" />
        <circle cx="325" cy="85" r="9" fill="#16a34a" />
        <polygon points="280,75 295,85 285,95" fill="#06b6d4" />
        <path d="M 0 240 Q 150 210 400 230 L 400 300 L 0 300 Z" fill="#d97706" opacity="0.6" />
        {/* Diff 5: anemone is yellow */}
        <path d="M 50 250 L 40 200 M 55 250 L 55 190 M 60 250 L 70 200" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
        {/* Diff 4: golden pearl */}
        <ellipse cx="180" cy="255" rx="26" ry="14" fill="#a855f7" />
        <circle cx="180" cy="252" r="6" fill="#facc15" />
        {/* Diff 3: starfish is electric purple */}
        <polygon points="320,240 326,252 338,252 328,260 332,272 320,264 308,272 312,260 302,252 314,252" fill="#a855f7" />
      </svg>
    ),
  },

  // 8. Botanical Greenhouse
  {
    id: 'botanical-greenhouse',
    title: 'Botanical Glass Greenhouse',
    description: 'An architectural glasshouse filled with monstera, hanging orchids, watering can, and warm sunlight.',
    differences: [
      { id: 1, xPct: 50, yPct: 15, radiusPct: 8, label: 'Hanging Lantern Hue' },
      { id: 2, xPct: 20, yPct: 45, radiusPct: 8, label: 'Monstera Leaf Fenestration' },
      { id: 3, xPct: 80, yPct: 55, radiusPct: 8, label: 'Orchid Flower Tone' },
      { id: 4, xPct: 48, yPct: 82, radiusPct: 8, label: 'Watering Can Spout' },
      { id: 5, xPct: 82, yPct: 85, radiusPct: 8, label: 'Terracotta Pot Band' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f0fdf4" />
        {/* Glasshouse Frame */}
        <line x1="200" y1="0" x2="0" y2="150" stroke="#065f46" strokeWidth="3" />
        <line x1="200" y1="0" x2="400" y2="150" stroke="#065f46" strokeWidth="3" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="#065f46" strokeWidth="2" opacity="0.4" />
        {/* Lantern */}
        <line x1="200" y1="0" x2="200" y2="45" stroke="#065f46" strokeWidth="2" />
        <rect x="190" y="45" width="20" height="25" rx="3" fill="#fef08a" stroke="#065f46" strokeWidth="2" />
        {/* Monstera */}
        <path d="M 80 200 C 40 120 70 80 110 130 C 130 160 100 200 80 200 Z" fill="#059669" />
        {/* Orchids */}
        <circle cx="320" cy="160" r="12" fill="#ec4899" />
        <circle cx="335" cy="150" r="10" fill="#f472b6" />
        {/* Bench */}
        <rect x="0" y="210" width="400" height="90" fill="#e2e8f0" />
        {/* Watering can */}
        <rect x="180" y="235" width="30" height="25" rx="4" fill="#0284c7" />
        <line x1="210" y1="240" x2="230" y2="230" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        {/* Pot */}
        <polygon points="310,230 350,230 345,280 315,280" fill="#c2410c" />
        <rect x="307" y="230" width="46" height="8" rx="2" fill="#ea580c" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f0fdf4" />
        <line x1="200" y1="0" x2="0" y2="150" stroke="#065f46" strokeWidth="3" />
        <line x1="200" y1="0" x2="400" y2="150" stroke="#065f46" strokeWidth="3" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="#065f46" strokeWidth="2" opacity="0.4" />
        {/* Diff 1: lantern is cyan */}
        <line x1="200" y1="0" x2="200" y2="45" stroke="#065f46" strokeWidth="2" />
        <rect x="190" y="45" width="20" height="25" rx="3" fill="#38bdf8" stroke="#065f46" strokeWidth="2" />
        {/* Diff 2: cutouts in leaf */}
        <path d="M 80 200 C 40 120 70 80 110 130 C 130 160 100 200 80 200 Z" fill="#059669" />
        <circle cx="85" cy="140" r="4" fill="#f0fdf4" />
        {/* Diff 3: orchid is electric violet */}
        <circle cx="320" cy="160" r="12" fill="#8b5cf6" />
        <circle cx="335" cy="150" r="10" fill="#a78bfa" />
        <rect x="0" y="210" width="400" height="90" fill="#e2e8f0" />
        {/* Diff 4: watering can has rose handle */}
        <rect x="180" y="235" width="30" height="25" rx="4" fill="#0284c7" />
        <line x1="210" y1="240" x2="230" y2="230" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        <path d="M 180 240 Q 165 248 180 256" stroke="#f43f5e" strokeWidth="3" fill="none" />
        {/* Diff 5: pot band is dark charcoal */}
        <polygon points="310,230 350,230 345,280 315,280" fill="#c2410c" />
        <rect x="307" y="230" width="46" height="8" rx="2" fill="#334155" />
      </svg>
    ),
  },

  // 9. Astronomy Observatory
  {
    id: 'space-observatory',
    title: 'Deep Space Observatory',
    description: 'A mountaintop dome gazing into galaxies, nebulae, star clusters, and mission control monitors.',
    differences: [
      { id: 1, xPct: 80, yPct: 20, radiusPct: 8, label: 'Saturn Ring Angle' },
      { id: 2, xPct: 30, yPct: 15, radiusPct: 8, label: 'Supernova Starburst Rays' },
      { id: 3, xPct: 48, yPct: 40, radiusPct: 8, label: 'Telescope Lens Shutter' },
      { id: 4, xPct: 20, yPct: 75, radiusPct: 8, label: 'Star Chart Constellation' },
      { id: 5, xPct: 78, yPct: 80, radiusPct: 8, label: 'Radar Scope Sweep Line' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#050814" />
        {/* Nebula & Stars */}
        <circle cx="120" cy="50" r="8" fill="#ffffff" />
        <line x1="120" y1="35" x2="120" y2="65" stroke="#ffffff" strokeWidth="2" />
        <line x1="105" y1="50" x2="135" y2="50" stroke="#ffffff" strokeWidth="2" />
        {/* Saturn */}
        <circle cx="320" cy="60" r="16" fill="#f59e0b" />
        <ellipse cx="320" cy="60" rx="30" ry="6" fill="none" stroke="#fde68a" strokeWidth="3" />
        {/* Observatory Dome slit */}
        <path d="M 120 180 C 120 100 280 100 280 180 Z" fill="#1e293b" />
        <rect x="185" y="105" width="30" height="75" fill="#0f172a" />
        {/* Telescope */}
        <line x1="170" y1="160" x2="225" y2="110" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
        <circle cx="225" cy="110" r="8" fill="#38bdf8" />
        {/* Floor & Consoles */}
        <rect x="0" y="180" width="400" height="120" fill="#0f172a" />
        <rect x="40" y="210" width="80" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <circle cx="65" cy="235" r="3" fill="#38bdf8" />
        <circle cx="95" cy="245" r="3" fill="#38bdf8" />
        <line x1="65" y1="235" x2="95" y2="245" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Radar */}
        <rect x="280" y="210" width="80" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <circle cx="320" cy="240" r="20" fill="#022c22" stroke="#10b981" strokeWidth="2" />
        <line x1="320" y1="240" x2="335" y2="225" stroke="#10b981" strokeWidth="2" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#050814" />
        {/* Diff 2: starburst has diagonal rays */}
        <circle cx="120" cy="50" r="8" fill="#ffffff" />
        <line x1="120" y1="35" x2="120" y2="65" stroke="#ffffff" strokeWidth="2" />
        <line x1="105" y1="50" x2="135" y2="50" stroke="#ffffff" strokeWidth="2" />
        <line x1="110" y1="40" x2="130" y2="60" stroke="#ec4899" strokeWidth="2" />
        {/* Diff 1: saturn ring tilted at angle */}
        <circle cx="320" cy="60" r="16" fill="#f59e0b" />
        <ellipse cx="320" cy="60" rx="30" ry="6" fill="none" stroke="#fde68a" strokeWidth="3" transform="rotate(-25 320 60)" />
        <path d="M 120 180 C 120 100 280 100 280 180 Z" fill="#1e293b" />
        <rect x="185" y="105" width="30" height="75" fill="#0f172a" />
        {/* Diff 3: lens is golden orange */}
        <line x1="170" y1="160" x2="225" y2="110" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
        <circle cx="225" cy="110" r="8" fill="#f59e0b" />
        <rect x="0" y="180" width="400" height="120" fill="#0f172a" />
        {/* Diff 4: extra star in constellation */}
        <rect x="40" y="210" width="80" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <circle cx="65" cy="235" r="3" fill="#38bdf8" />
        <circle cx="95" cy="245" r="3" fill="#38bdf8" />
        <circle cx="80" cy="225" r="3" fill="#ec4899" />
        <line x1="65" y1="235" x2="80" y2="225" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="80" y1="225" x2="95" y2="245" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Diff 5: radar line points straight down */}
        <rect x="280" y="210" width="80" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <circle cx="320" cy="240" r="20" fill="#022c22" stroke="#10b981" strokeWidth="2" />
        <line x1="320" y1="240" x2="320" y2="260" stroke="#10b981" strokeWidth="2" />
      </svg>
    ),
  },

  // 10. Retro Arcade Lounge
  {
    id: 'retro-arcade',
    title: 'Retro 80s Arcade Lounge',
    description: 'The Grandmaster Challenge! A buzzing 80s arcade packed with glowing CRT cabinets, joysticks, and coin slots.',
    differences: [
      { id: 1, xPct: 22, yPct: 30, radiusPct: 8, label: 'Space Raider Marquee Title' },
      { id: 2, xPct: 75, yPct: 32, radiusPct: 8, label: 'Pac-Hero Ghost Color' },
      { id: 3, xPct: 22, yPct: 65, radiusPct: 8, label: 'Left Joystick Ball Knob' },
      { id: 4, xPct: 78, yPct: 65, radiusPct: 8, label: 'Right Action Buttons' },
      { id: 5, xPct: 50, yPct: 85, radiusPct: 8, label: 'Neon Floor Carpet Tile' },
    ],
    renderLeft: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#110d24" />
        {/* Left Cabinet: Space Raider */}
        <polygon points="40,50 140,50 130,220 50,220" fill="#2e1065" stroke="#7c3aed" strokeWidth="3" />
        <rect x="55" y="60" width="70" height="25" fill="#f43f5e" />
        <text x="60" y="77" fill="#ffffff" fontSize="10" fontWeight="bold">SPACE</text>
        <rect x="55" y="95" width="70" height="65" rx="4" fill="#000000" stroke="#3b82f6" strokeWidth="2" />
        <polygon points="90,115 80,135 100,135" fill="#10b981" />
        <line x1="75" y1="180" x2="75" y2="195" stroke="#94a3b8" strokeWidth="4" />
        <circle cx="75" cy="180" r="7" fill="#ef4444" />
        {/* Right Cabinet: Pac-Hero */}
        <polygon points="260,50 360,50 350,220 270,220" fill="#831843" stroke="#db2777" strokeWidth="3" />
        <rect x="275" y="60" width="70" height="25" fill="#facc15" />
        <text x="282" y="77" fill="#000000" fontSize="10" fontWeight="bold">CHOMP</text>
        <rect x="275" y="95" width="70" height="65" rx="4" fill="#000000" stroke="#facc15" strokeWidth="2" />
        <circle cx="300" cy="125" r="12" fill="#ef4444" />
        <circle cx="330" cy="185" r="5" fill="#06b6d4" />
        <circle cx="342" cy="185" r="5" fill="#06b6d4" />
        {/* Carpet */}
        <rect x="0" y="220" width="400" height="80" fill="#18181b" />
        <polygon points="180,240 220,240 230,270 170,270" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#110d24" />
        {/* Left Cabinet */}
        <polygon points="40,50 140,50 130,220 50,220" fill="#2e1065" stroke="#7c3aed" strokeWidth="3" />
        {/* Diff 1: Marquee is Cyan RETRO */}
        <rect x="55" y="60" width="70" height="25" fill="#06b6d4" />
        <text x="60" y="77" fill="#ffffff" fontSize="10" fontWeight="bold">RETRO</text>
        <rect x="55" y="95" width="70" height="65" rx="4" fill="#000000" stroke="#3b82f6" strokeWidth="2" />
        <polygon points="90,115 80,135 100,135" fill="#10b981" />
        {/* Diff 3: Joystick is Yellow */}
        <line x1="75" y1="180" x2="75" y2="195" stroke="#94a3b8" strokeWidth="4" />
        <circle cx="75" cy="180" r="7" fill="#facc15" />
        {/* Right Cabinet */}
        <polygon points="260,50 360,50 350,220 270,220" fill="#831843" stroke="#db2777" strokeWidth="3" />
        <rect x="275" y="60" width="70" height="25" fill="#facc15" />
        <text x="282" y="77" fill="#000000" fontSize="10" fontWeight="bold">CHOMP</text>
        <rect x="275" y="95" width="70" height="65" rx="4" fill="#000000" stroke="#facc15" strokeWidth="2" />
        {/* Diff 2: Ghost is Cyan */}
        <circle cx="300" cy="125" r="12" fill="#06b6d4" />
        {/* Diff 4: Action buttons are Pink & Green */}
        <circle cx="330" cy="185" r="5" fill="#ec4899" />
        <circle cx="342" cy="185" r="5" fill="#10b981" />
        <rect x="0" y="220" width="400" height="80" fill="#18181b" />
        {/* Diff 5: Carpet tile is neon pink */}
        <polygon points="180,240 220,240 230,270 170,270" fill="#831843" stroke="#f43f5e" strokeWidth="2" />
      </svg>
    ),
  },
];
