import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SubjectInfo } from '../../data/studyMaterialData';
import { SubjectIllustration } from './SubjectIllustration';

interface SubjectCardProps {
  subject: SubjectInfo;
  onSelect: (slug: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onSelect }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(subject.slug);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(subject.slug);
    }
  };

  return (
    <div
      role="article"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 glass-panel border ${subject.accent.border} hover:border-${subject.accent.name}-500/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-${subject.accent.name}-500/40`}
      aria-label={`${subject.name} Notes — Explore study materials`}
    >
      {/* Background Accent Gradient Sheen */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${subject.accent.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />

      {/* TOP SECTION: ILLUSTRATION & BADGE */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-5">
          {/* Prominent Subject Scientific Illustration */}
          <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group-hover:scale-105 transition-transform duration-300">
            <SubjectIllustration slug={subject.slug} size="md" />
          </div>

          {/* Clean Subject Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight border ${subject.accent.badge}`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Study Notes</span>
          </span>
        </div>

        {/* SUBJECT TITLE & TAGLINE */}
        <h2 className="text-xl sm:text-2xl font-black font-display text-theme-primary mb-1 group-hover:text-theme-primary transition-colors flex items-center justify-between">
          <span>{subject.name}</span>
          <span
            className={`w-2.5 h-2.5 rounded-full ${subject.accent.bgSubtle} border ${subject.accent.border} group-hover:scale-125 transition-transform`}
          />
        </h2>

        <p className={`text-xs font-semibold ${subject.accent.text} mb-3 tracking-wide`}>
          {subject.tagline}
        </p>

        {/* SHORT DESCRIPTION */}
        <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed mb-5 line-clamp-3">
          {subject.shortDescription}
        </p>

        {/* CURRICULUM HIGHLIGHTS PILLS (3 Key Topics) */}
        <div className="space-y-1.5 mb-6 pt-3 border-t border-black/5 dark:border-white/10">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block mb-1">
            Subject Topics:
          </span>
          {subject.curriculumTopics.slice(0, 3).map((topic, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-theme-secondary">
              <span className={`w-1.5 h-1.5 rounded-full bg-current ${subject.accent.text}`} />
              <span className="truncate">{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM ACTION BUTTON */}
      <div className="relative z-10 pt-4 border-t border-black/5 dark:border-white/10">
        <a
          href={`/study-material/${subject.slug}`}
          onClick={(e) => {
            e.preventDefault();
            onSelect(subject.slug);
          }}
          className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 ${subject.accent.button}`}
          aria-label={`Explore ${subject.name} Notes`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>Explore Notes</span>
          <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};
