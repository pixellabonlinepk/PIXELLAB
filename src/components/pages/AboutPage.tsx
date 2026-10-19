import React from 'react';
import { Cpu, Zap, Lock, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { TOOLS } from '../../data/tools';

interface AboutPageProps {
  onExploreTools: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onExploreTools }) => {
  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 glass-panel text-indigo-500">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About Pixal Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display mb-4 text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
          Every Image. More Possibilities.
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#6E6E73] dark:text-[#86868B]">
          Pixal Lab is a curated suite of {TOOLS.length} high-impact image processing utilities engineered from first principles to execute entirely inside your web browser. No cloud queues, no account signups, and zero remote data harvesting.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-[#1D1D1F] dark:text-[#F5F5F7]">
            100% Privacy by Design
          </h3>
          <p className="text-xs leading-relaxed text-[#6E6E73] dark:text-[#86868B]">
            Unlike legacy online converters that transmit private photos to unknown remote servers, Pixal Lab processes your files locally using client-side Web APIs and HTML5 Canvas. Your photos never leave your device.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-[#1D1D1F] dark:text-[#F5F5F7]">
            Zero-Budget Architecture
          </h3>
          <p className="text-xs leading-relaxed text-[#6E6E73] dark:text-[#86868B]">
            Built with zero external commercial API dependencies. Every compression algorithm, pixel resizer, and document compiler runs on your hardware, eliminating monthly fees for creators.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-[#1D1D1F] dark:text-[#F5F5F7]">
            Top {TOOLS.length} Power Tools
          </h3>
          <p className="text-xs leading-relaxed text-[#6E6E73] dark:text-[#86868B]">
            Consolidated to deliver only high-impact, high-utility tools: from high-volume batch resizing to official Pakistan CNIC passport standards, squad DP collages, and permanent QR matrices.
          </p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="glass-panel rounded-3xl p-8 space-y-4 mb-12">
        <h2 className="text-xl font-bold font-display text-[#1D1D1F] dark:text-[#F5F5F7]">
          Our Commitment to Creators
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-[#6E6E73] dark:text-[#86868B]">
          We believe basic photo and document utilities should not require watching full-screen advertisements, waiting in cloud render queues, or signing up for recurring monthly subscriptions. Pixal Lab provides fast, honest, and completely private browser software.
        </p>
        <div className="pt-2">
          <button
            onClick={onExploreTools}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-md active:scale-95"
          >
            Explore Top {TOOLS.length} Tools →
          </button>
        </div>
      </div>
    </div>
  );
};
