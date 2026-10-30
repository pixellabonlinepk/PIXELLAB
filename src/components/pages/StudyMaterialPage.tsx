import React from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Download,
  FolderOpen,
} from 'lucide-react';
import {
  SUBJECTS_DATA,
  StudySubjectSlug,
} from '../../data/studyMaterialData';
import { SubjectCard } from '../study/SubjectCard';
import { SubjectNotesPage } from '../study/SubjectNotesPage';

interface StudyMaterialPageProps {
  selectedSubjectSlug?: string | null;
  onNavigate: (view: string, toolId?: string, guideSlug?: string) => void;
}

export const StudyMaterialPage: React.FC<StudyMaterialPageProps> = ({
  selectedSubjectSlug,
  onNavigate,
}) => {
  // If an individual subject is selected (e.g. /study-material/biology), render dedicated Subject Notes Page
  if (selectedSubjectSlug && SUBJECTS_DATA.some((s) => s.slug === selectedSubjectSlug)) {
    return (
      <SubjectNotesPage
        subjectSlug={selectedSubjectSlug as StudySubjectSlug}
        onNavigate={onNavigate}
      />
    );
  }

  // Otherwise, render Main Free Study Material Directory with the 5 Subject Cards ONLY
  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      {/* 1. HEADER HERO BANNER */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3.5 glass-panel text-indigo-500 border border-indigo-500/20 shadow-xs">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>PIXAL LAB Academic Library</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-theme-primary mb-4 tracking-tight [text-wrap:balance]">
          Free Study Material &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500">
            Academic Notes
          </span>
        </h1>

        <p className="text-xs sm:text-base text-theme-secondary max-w-2xl mx-auto leading-relaxed mb-6">
          Access high-yield curriculum study notes, formulas, diagrams, and revision sheets across
          five core subjects. 100% free with direct PDF access and zero sign-in required.
        </p>

        {/* Value Prop Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-theme-muted">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Zero Sign-In Required</span>
          </span>
          <span className="flex items-center gap-1.5 text-indigo-500">
            <Download className="w-4 h-4 shrink-0" />
            <span>Direct PDF Access</span>
          </span>
          <span className="flex items-center gap-1.5 text-blue-500">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>5 Primary Academic Subjects</span>
          </span>
        </div>
      </div>

      {/* 2. THE FIVE PRIMARY SUBJECT CARDS ONLY */}
      <section aria-labelledby="subjects-heading" className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="subjects-heading" className="text-xl sm:text-2xl font-bold font-display text-theme-primary">
              Select Your Subject
            </h2>
            <p className="text-xs sm:text-sm text-theme-secondary">
              Choose an academic subject below to view all available study notes and revision sheets.
            </p>
          </div>
          <span className="hidden sm:inline-flex text-xs font-semibold text-theme-muted">
            5 Core Disciplines
          </span>
        </div>

        {/* Responsive Grid: EXACTLY 5 Primary Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SUBJECTS_DATA.map((subject) => (
            <SubjectCard
              key={subject.slug}
              subject={subject}
              onSelect={(slug) => onNavigate('study-material', slug)}
            />
          ))}
        </div>
      </section>

      {/* 3. DIGITAL REPOSITORY & GOOGLE DRIVE ARCHITECTURE BANNER */}
      <section className="mb-14 glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500 mb-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Digital Repository Architecture</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-theme-primary mb-1">
              Cloud-Hosted Study PDFs Ready For Launch
            </h3>
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
              All PDF files are curated in dedicated subject folders and delivered with direct Google Drive preview and high-speed downloading. No subscriptions or account sign-ups are ever requested.
            </p>
          </div>

          <div className="shrink-0 text-xs font-semibold text-theme-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Curated & Updated Regularly</span>
          </div>
        </div>
      </section>

      {/* 4. CROSS-LINK BRIDGE TO HOW-TO GUIDES */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="max-w-xl text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practical Guides & Step-by-Step Tutorials</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-theme-primary mb-1.5">
            Looking for Practical Image Editing Tutorials?
          </h3>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            Read our step-by-step guides on making YouTube thumbnails, creating digital signatures, sizing passport photos, and splitting Instagram grids.
          </p>
        </div>

        <a
          href="/guides"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('guides');
          }}
          className="shrink-0 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <span>Explore How-To Guides</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
