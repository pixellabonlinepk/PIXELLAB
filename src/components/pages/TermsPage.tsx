import React from 'react';
import { FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const TermsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-300'
              : 'bg-white border-slate-200 text-slate-700 shadow-xs'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-500" />
          <span>Terms of Service</span>
        </div>
        <h1
          className={`text-3xl font-extrabold font-display mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Terms of Use & Fair License
        </h1>
        <p
          className={`text-xs sm:text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Last revised: October 2026. Free, open, and transparent image processing utilities.
        </p>
      </div>

      <div
        className={`space-y-6 text-xs sm:text-sm ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}
      >
        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <h3
            className={`text-sm font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            1. Service Provision
          </h3>
          <p
            className={`leading-relaxed text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Pixal Lab provides web-based client-side graphic processing software on an &quot;as-is&quot; and &quot;as-available&quot; basis. Because processing runs in your browser, performance depends on your device CPU, memory, and browser capabilities.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <h3
            className={`text-sm font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            2. Intellectual Property & Ownership
          </h3>
          <p
            className={`leading-relaxed text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            You retain 100% full copyright and ownership of any images, graphics, memes, or documents processed through Pixal Lab. Pixal Lab claims zero rights or ownership over your output files.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <h3
            className={`text-sm font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            3. Acceptable Use
          </h3>
          <p
            className={`leading-relaxed text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            You agree not to use the tools to create illicit, infringing, defamatory, or abusive content. Pixal Lab is designed for legitimate creative, photography, and graphic design tasks.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <h3
            className={`text-sm font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            4. Official Document Disclaimer
          </h3>
          <p
            className={`leading-relaxed text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            While the Passport Photo Resizer provides standard pixel and millimeter dimensions (such as US 2×2 inches or Schengen 35×45mm), government passport agencies impose strict guidelines regarding head size, lighting, and expression. Please verify official government requirements before submitting visa or passport applications.
          </p>
        </div>
      </div>
    </div>
  );
};
