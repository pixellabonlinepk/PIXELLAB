import React from 'react';
import { Cpu, Zap, Lock, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { TOOLS } from '../../data/tools';

interface AboutPageProps {
  onExploreTools: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onExploreTools }) => {
  const { theme } = useTheme();

  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-cyan-300'
              : 'bg-white border-slate-200 text-cyan-700 shadow-xs'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>About Pixel Lab</span>
        </div>
        <h1
          className={`text-3xl sm:text-4xl font-extrabold font-display mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Every Image. More Possibilities.
        </h1>
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Pixel Lab is a professional suite of {TOOLS.length} image processing and graphic creation tools designed from the ground up to run entirely inside your web browser without expensive server subscriptions or invasive data collection.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3
            className={`text-base font-bold font-display ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            100% Privacy by Design
          </h3>
          <p
            className={`text-xs leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Most image converters upload your personal photos to remote cloud servers. Pixel Lab runs client-side JavaScript, Web Workers, and HTML5 Canvas directly on your computer or phone. Your photos never leave your device.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-500 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3
            className={`text-base font-bold font-display ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Zero-Budget Architecture
          </h3>
          <p
            className={`text-xs leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Built without costly third-party API dependencies. Every filter, convolution matrix, quantization algorithm, and crop engine leverages free web standards for instant response times and zero monthly fees for users.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-500 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3
            className={`text-base font-bold font-display ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {TOOLS.length} Essential Tools
          </h3>
          <p
            className={`text-xs leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            From everyday resizing and compressing to artistic filters, sharpening, watermarking, YouTube thumbnail creation, QR code generation, and PDF workflows — everything you need is available in one clean interface.
          </p>
        </div>
      </div>

      {/* Philosophy */}
      <div
        className={`p-8 rounded-3xl border space-y-4 mb-12 transition-colors ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border-slate-800'
            : 'bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-slate-50 border-slate-200 shadow-sm'
        }`}
      >
        <h2
          className={`text-xl font-bold font-display ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Our Commitment to Creators
        </h2>
        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          We believe that basic image utilities should not require creating accounts, solving captchas, watching full-screen advertisements, or waiting in line for remote cloud render queues. Pixel Lab empowers photographers, content creators, students, and developers with blazing-fast, honest tools.
        </p>
        <div className="pt-2">
          <button
            onClick={onExploreTools}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            Explore All {TOOLS.length} Tools →
          </button>
        </div>
      </div>
    </div>
  );
};
