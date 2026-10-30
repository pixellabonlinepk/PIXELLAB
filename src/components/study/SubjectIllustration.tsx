import React from 'react';
import { StudySubjectSlug } from '../../data/studyMaterialData';

interface SubjectIllustrationProps {
  slug: StudySubjectSlug;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SubjectIllustration: React.FC<SubjectIllustrationProps> = ({
  slug,
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
  };

  const containerClass = `relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`;

  switch (slug) {
    case 'biology':
      return (
        <div className={containerClass}>
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full relative z-10 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Biology scientific illustration"
          >
            <defs>
              <linearGradient id="bioGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" />
                <stop offset="0.5" stopColor="#10b981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="leafGrad" x1="30" y1="20" x2="90" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6ee7b7" />
                <stop offset="1" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Microscopic Cell Outer Membrane */}
            <circle cx="60" cy="60" r="48" stroke="url(#bioGrad)" strokeWidth="2.5" strokeDasharray="4 2" opacity="0.6" />
            <circle cx="60" cy="60" r="42" fill="url(#bioGrad)" fillOpacity="0.08" stroke="#10b981" strokeWidth="1.5" />

            {/* Cellular Nucleus with Chromatin */}
            <circle cx="60" cy="60" r="16" fill="#10b981" fillOpacity="0.25" stroke="#34d399" strokeWidth="2" />
            <circle cx="58" cy="58" r="6" fill="#059669" />
            <circle cx="65" cy="63" r="3" fill="#6ee7b7" />

            {/* Mitochondria & Ribosomes */}
            <ellipse cx="40" cy="45" rx="7" ry="4" transform="rotate(-25 40 45)" fill="#34d399" fillOpacity="0.4" stroke="#059669" strokeWidth="1" />
            <ellipse cx="80" cy="75" rx="8" ry="4" transform="rotate(30 80 75)" fill="#34d399" fillOpacity="0.4" stroke="#059669" strokeWidth="1" />
            <circle cx="45" cy="78" r="2.5" fill="#10b981" />
            <circle cx="75" cy="42" r="2.5" fill="#10b981" />
            <circle cx="82" cy="54" r="2" fill="#34d399" />

            {/* DNA Double Helix Spiral (Foreground) */}
            <path
              d="M32 30 C 45 45, 75 45, 88 30 M32 60 C 45 75, 75 75, 88 60 M32 90 C 45 105, 75 105, 88 90"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M32 30 C 45 15, 75 15, 88 30 M32 60 C 45 45, 75 45, 88 60 M32 90 C 45 75, 75 75, 88 90"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Base Pairs (Rungs) */}
            <line x1="42" y1="26" x2="42" y2="34" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="21" x2="60" y2="39" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
            <line x1="78" y1="26" x2="78" y2="34" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

            <line x1="42" y1="56" x2="42" y2="64" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="51" x2="60" y2="69" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
            <line x1="78" y1="56" x2="78" y2="64" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

            <line x1="42" y1="86" x2="42" y2="94" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="81" x2="60" y2="99" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
            <line x1="78" y1="86" x2="78" y2="94" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'physics':
      return (
        <div className={containerClass}>
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-xl animate-pulse" />
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full relative z-10 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Physics scientific illustration"
          >
            <defs>
              <linearGradient id="physGrad" x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#0284c7" />
                <stop offset="1" stopColor="#0369a1" />
              </linearGradient>
            </defs>

            {/* Atomic Orbit Ellipses */}
            <ellipse
              cx="60"
              cy="60"
              rx="46"
              ry="18"
              stroke="url(#physGrad)"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
            <ellipse
              cx="60"
              cy="60"
              rx="46"
              ry="18"
              stroke="url(#physGrad)"
              strokeWidth="2"
              fill="none"
              transform="rotate(60 60 60)"
              opacity="0.8"
            />
            <ellipse
              cx="60"
              cy="60"
              rx="46"
              ry="18"
              stroke="url(#physGrad)"
              strokeWidth="2"
              fill="none"
              transform="rotate(120 60 60)"
              opacity="0.8"
            />

            {/* Orbiting Electrons */}
            <circle cx="106" cy="60" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            <circle cx="37" cy="20" r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
            <circle cx="83" cy="100" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />

            {/* Nucleus with Glowing Protons & Neutrons */}
            <circle cx="60" cy="60" r="14" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="56" cy="57" r="5.5" fill="#0284c7" />
            <circle cx="65" cy="56" r="5.5" fill="#38bdf8" />
            <circle cx="61" cy="65" r="5" fill="#0369a1" />

            {/* Harmonic Wave Oscillating Background */}
            <path
              d="M10 98 Q 30 84, 60 98 T 110 98"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              opacity="0.5"
            />
          </svg>
        </div>
      );

    case 'chemistry':
      return (
        <div className={containerClass}>
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full relative z-10 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Chemistry scientific illustration"
          >
            <defs>
              <linearGradient id="chemGrad" x1="30" y1="20" x2="90" y2="105" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fb7185" />
                <stop offset="0.5" stopColor="#f43f5e" />
                <stop offset="1" stopColor="#e11d48" />
              </linearGradient>
            </defs>

            {/* Hexagonal Benzene Ring (Background Left) */}
            <polygon
              points="28,26 42,18 56,26 56,42 42,50 28,42"
              stroke="#fb7185"
              strokeWidth="1.8"
              fill="#fb7185"
              fillOpacity="0.08"
            />
            <circle cx="42" cy="34" r="8" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />

            {/* Molecular Bonds (Right) */}
            <circle cx="94" cy="32" r="5" fill="#fb7185" />
            <line x1="94" y1="37" x2="94" y2="52" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="94" cy="55" r="4" fill="#f43f5e" />
            <line x1="89" y1="55" x2="78" y2="60" stroke="#f43f5e" strokeWidth="2" />

            {/* Erlenmeyer Glass Flask */}
            <path
              d="M52 24 L68 24 M56 24 L56 46 L32 94 C 29 100, 34 106, 42 106 L78 106 C 86 106, 91 100, 88 94 L64 46 L64 24"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Flask Lip */}
            <rect x="52" y="21" width="16" height="4" rx="2" fill="#ffffff" />

            {/* Chemical Liquid Inside */}
            <path
              d="M40 78 Q 50 82, 60 76 T 80 78 L85 96 C 87 101, 83 104, 78 104 L42 104 C 37 104, 33 101, 35 96 Z"
              fill="url(#chemGrad)"
            />

            {/* Bubbling Reaction Effervescence */}
            <circle cx="50" cy="88" r="3" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="68" cy="92" r="2.5" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="62" cy="82" r="2" fill="#ffffff" fillOpacity="0.9" />
            <circle cx="56" cy="70" r="2.5" fill="#fb7185" />
            <circle cx="64" cy="62" r="3" fill="#fb7185" />
            <circle cx="58" cy="52" r="2" fill="#fb7185" />
          </svg>
        </div>
      );

    case 'computer-science':
      return (
        <div className={containerClass}>
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full relative z-10 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Computer Science illustration"
          >
            <defs>
              <linearGradient id="csGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="0.5" stopColor="#6366f1" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>

            {/* Circuit Traces (Background) */}
            <path
              d="M18 40 L34 40 L44 26 M18 80 L32 80 L42 92 M102 36 L88 36 L80 48 M102 84 L88 84"
              stroke="#818cf8"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
            <circle cx="44" cy="26" r="2.5" fill="#818cf8" />
            <circle cx="42" cy="92" r="2.5" fill="#818cf8" />
            <circle cx="80" cy="48" r="2.5" fill="#818cf8" />

            {/* Sleek Laptop / Desktop Monitor Body */}
            <rect
              x="26"
              y="28"
              width="68"
              height="48"
              rx="6"
              fill="#0f172a"
              stroke="url(#csGrad)"
              strokeWidth="2.5"
            />
            {/* Monitor Stand */}
            <path d="M54 76 L50 92 L70 92 L66 76" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5" />
            <rect x="42" y="92" width="36" height="4" rx="2" fill="#6366f1" />

            {/* Terminal Screen Header */}
            <rect x="28" y="30" width="64" height="10" rx="3" fill="#1e1b4b" />
            <circle cx="34" cy="35" r="1.8" fill="#ef4444" />
            <circle cx="40" cy="35" r="1.8" fill="#eab308" />
            <circle cx="46" cy="35" r="1.8" fill="#22c55e" />

            {/* Code Symbols & Binary Inside Terminal */}
            <path
              d="M38 52 L33 56 L38 60 M48 52 L53 56 L48 60 M42 62 L44 50"
              stroke="#818cf8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Binary Matrix Code lines */}
            <text x="60" y="52" fill="#38bdf8" fontSize="6" fontFamily="monospace" fontWeight="bold">
              01101
            </text>
            <text x="60" y="60" fill="#a855f7" fontSize="6" fontFamily="monospace" fontWeight="bold">
              10010
            </text>
            <text x="60" y="68" fill="#10b981" fontSize="6" fontFamily="monospace" fontWeight="bold">
              01011
            </text>
          </svg>
        </div>
      );

    case 'mathematics':
      return (
        <div className={containerClass}>
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full relative z-10 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Mathematics scientific illustration"
          >
            <defs>
              <linearGradient id="mathGrad" x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="0.5" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Coordinate Grid Planes */}
            <line x1="20" y1="90" x2="100" y2="90" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="100" x2="30" y2="20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <polygon points="102,90 96,87 96,93" fill="#f59e0b" />
            <polygon points="30,18 27,24 33,24" fill="#f59e0b" />

            {/* Parabolic Function Curve y = x^2 */}
            <path
              d="M32 30 Q 52 90, 96 35"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Pythagorean Right Triangle */}
            <polygon
              points="40,88 78,88 78,50"
              stroke="#d97706"
              strokeWidth="1.8"
              fill="#fbbf24"
              fillOpacity="0.12"
            />
            {/* Right Angle Indicator */}
            <rect x="70" y="80" width="8" height="8" stroke="#d97706" strokeWidth="1" fill="none" />

            {/* Mathematical Symbols: Pi, Integral, Summation */}
            {/* Integral Symbol */}
            <path
              d="M86 28 C 88 24, 91 24, 91 26 L91 42 C 91 44, 89 45, 87 45"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Pi symbol */}
            <path
              d="M50 34 L66 34 M54 34 L54 44 M62 34 L62 44"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Summation Sigma */}
            <path
              d="M96 66 L86 66 L92 73 L86 80 L96 80"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      );

    default:
      return null;
  }
};
