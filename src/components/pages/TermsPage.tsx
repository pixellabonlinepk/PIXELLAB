import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 glass-panel text-indigo-500">
          <FileText className="w-4 h-4" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display mb-3 text-[#1D1D1F] dark:text-[#F5F5F7]">
          Terms of Use & Fair License
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#86868B]">
          Last revised: October 2026. Free, open, and transparent image processing utilities.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#6E6E73] dark:text-[#86868B]">
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            1. Service Provision
          </h3>
          <p className="leading-relaxed text-xs">
            Pixal Lab provides web-based client-side graphic processing software on an &quot;as-is&quot; and &quot;as-available&quot; basis. Because processing runs in your browser, performance depends on your device CPU, memory, and browser capabilities.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            2. Intellectual Property & Ownership
          </h3>
          <p className="leading-relaxed text-xs">
            You retain 100% full copyright and ownership of any images, graphics, memes, or documents processed through Pixal Lab. Pixal Lab claims zero rights or ownership over your output files.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            3. Acceptable Use
          </h3>
          <p className="leading-relaxed text-xs">
            Users agree not to utilize Pixal Lab for unlawful purposes, creating defamatory or non-consensual imagery, or distributing malicious files.
          </p>
        </div>
      </div>
    </div>
  );
};
