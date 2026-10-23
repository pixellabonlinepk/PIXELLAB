import React from 'react';
import { EDUCATIONAL_GUIDES } from '../../data/guidesData';
import { BookOpen, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface GuidesIndexPageProps {
  onNavigate: (view: string, toolId?: string) => void;
  onSelectGuide: (slug: string) => void;
}

export const GuidesIndexPage: React.FC<GuidesIndexPageProps> = ({ onNavigate, onSelectGuide }) => {
  return (
    <div className="py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 glass-panel text-indigo-500">
          <BookOpen className="w-4 h-4" />
          <span>Educational Resources & Tutorials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-theme-primary mb-3">
          Free Image Guides & How-To Tutorials
        </h1>
        <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
          Clear, step-by-step instructions on image editing, dimension standards, aspect ratios, digital signatures, and web optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {EDUCATIONAL_GUIDES.map((guide) => (
          <a
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            onClick={(e) => {
              e.preventDefault();
              onSelectGuide(guide.slug);
            }}
            className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all group cursor-pointer shadow-md"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-theme-muted mb-3">
                <span className="font-semibold text-indigo-500">Tutorial</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.readingTimeMinutes} min read</span>
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold font-display text-theme-primary group-hover:text-indigo-500 transition-colors mb-2">
                {guide.title}
              </h2>

              <p className="text-xs text-theme-secondary leading-relaxed line-clamp-3 mb-4">
                {guide.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-theme-primary">
              <span className="text-theme-muted text-[11px]">Uses {guide.toolName}</span>
              <span className="inline-flex items-center gap-1 text-indigo-500 group-hover:translate-x-1 transition-transform">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
