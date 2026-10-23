import React from 'react';
import { EducationalGuide } from '../../data/guidesData';
import { TOOLS } from '../../data/tools';
import {
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface GuideDetailPageProps {
  guide: EducationalGuide;
  onNavigate: (view: string, toolId?: string) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ guide, onNavigate }) => {
  const activeTool = TOOLS.find((t) => t.id === guide.toolId);
  const relatedTools = TOOLS.filter((t) => guide.relatedToolIds.includes(t.id));

  return (
    <article className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-theme-muted">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="hover:text-theme-primary transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-3 h-3 text-theme-muted" />
        <a
          href="/guides"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('guides');
          }}
          className="hover:text-theme-primary transition-colors"
        >
          Guides
        </a>
        <ChevronRight className="w-3 h-3 text-theme-muted" />
        <span className="text-theme-primary font-medium truncate max-w-[200px] sm:max-w-none">
          {guide.title}
        </span>
      </nav>

      {/* Guide Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 glass-panel text-indigo-500">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Practical Guide · {guide.readingTimeMinutes} min read</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-theme-primary tracking-tight mb-4 [text-wrap:balance]">
          {guide.h1}
        </h1>

        <p className="text-sm sm:text-base text-theme-secondary leading-relaxed mb-6">
          {guide.summary}
        </p>

        {/* Primary Interactive CTA: Launch Connected Tool */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-indigo-500/20 bg-indigo-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">
              Ready to create?
            </div>
            <div className="text-sm font-bold text-theme-primary">
              Use the free {guide.toolName} online
            </div>
            <div className="text-xs text-theme-muted">
              100% in-browser processing · Zero server uploads · Free forever
            </div>
          </div>

          <a
            href={`/tool/${guide.toolId}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('tool', guide.toolId);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <span>Open {guide.toolName}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Quick Reference Specifications Table */}
      <section className="mb-10">
        <h2 className="text-lg font-bold font-display text-theme-primary mb-3">
          Recommended Specifications & Standards
        </h2>
        <div className="glass-panel rounded-2xl overflow-hidden border border-black/5 dark:border-white/10">
          <dl className="divide-y divide-black/5 dark:divide-white/10 text-xs">
            {guide.specifications.map((spec, i) => (
              <div key={i} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 flex justify-between">
                <dt className="font-semibold text-theme-secondary">{spec.label}</dt>
                <dd className="font-mono sm:col-span-2 text-theme-primary font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Step-by-Step Instructions */}
      <section className="mb-10 space-y-6">
        <h2 className="text-xl font-bold font-display text-theme-primary mb-2">
          Step-by-Step Instructions
        </h2>

        <div className="space-y-4">
          {guide.steps.map((st) => (
            <div key={st.number} className="glass-panel rounded-2xl p-5 border border-black/5 dark:border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  0{st.number}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-theme-primary">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
                    {st.description}
                  </p>
                  {st.proTip && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                      <span className="font-bold shrink-0">Pro Tip:</span>
                      <span>{st.proTip}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {guide.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold font-display text-theme-primary mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-3">
            {guide.faqs.map((faq, i) => (
              <div key={i} className="glass-panel rounded-2xl p-4 sm:p-5 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-bold text-theme-primary mb-1.5">
                  {faq.question}
                </h3>
                <p className="text-xs text-theme-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools Grid */}
      {relatedTools.length > 0 && (
        <section className="pt-8 border-t border-black/5 dark:border-white/10">
          <h2 className="text-lg font-bold font-display text-theme-primary mb-4">
            Related Free Image Utilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTools.map((rt) => (
              <a
                key={rt.id}
                href={`/tool/${rt.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('tool', rt.id);
                }}
                className="glass-panel rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500/40 transition-all group"
              >
                <div>
                  <div className="text-xs font-bold text-theme-primary group-hover:text-indigo-500 transition-colors">
                    {rt.name}
                  </div>
                  <div className="text-[11px] text-theme-muted line-clamp-1">
                    {rt.tagline}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
