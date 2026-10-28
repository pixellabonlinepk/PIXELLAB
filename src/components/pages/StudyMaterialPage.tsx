import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Download,
  Eye,
  Search,
  Filter,
  Check,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Code,
  Cpu,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Brain,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import {
  STUDY_RESOURCES,
  STUDY_SUBJECTS,
  STUDY_LEVELS,
  StudyResource,
  StudySubject,
  StudyLevel,
} from '../../data/studyMaterialData';
import { generateStudyResourcePdf } from '../../utils/studyPdfGenerator';

interface StudyMaterialPageProps {
  onNavigate: (view: string, toolId?: string, guideSlug?: string) => void;
}

export const StudyMaterialPage: React.FC<StudyMaterialPageProps> = ({ onNavigate }) => {
  const [selectedSubject, setSelectedSubject] = useState<StudySubject | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<StudyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewResource, setPreviewResource] = useState<StudyResource | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Subject icon helper
  const getSubjectIcon = (subject: StudySubject) => {
    switch (subject) {
      case 'computer-science':
        return <Code className="w-4 h-4 text-indigo-500" />;
      case 'artificial-intelligence':
        return <Cpu className="w-4 h-4 text-cyan-500" />;
      case 'mathematics':
        return <Calculator className="w-4 h-4 text-blue-500" />;
      case 'physics':
        return <Atom className="w-4 h-4 text-amber-500" />;
      case 'chemistry':
        return <FlaskConical className="w-4 h-4 text-rose-500" />;
      case 'biology':
        return <Dna className="w-4 h-4 text-emerald-500" />;
      case 'logical-reasoning':
        return <Brain className="w-4 h-4 text-purple-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return STUDY_RESOURCES.filter((res) => {
      const matchSubject = selectedSubject === 'all' || res.subject === selectedSubject;
      const matchLevel = selectedLevel === 'all' || res.level === selectedLevel;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.subtitle.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.subjectLabel.toLowerCase().includes(q) ||
        res.keyTopics.some((t) => t.toLowerCase().includes(q)) ||
        res.keyFormulasOrConcepts.some((f) => f.toLowerCase().includes(q));

      return matchSubject && matchLevel && matchQuery;
    });
  }, [selectedSubject, selectedLevel, searchQuery]);

  const handleDownload = (res: StudyResource) => {
    setDownloadingId(res.id);
    try {
      generateStudyResourcePdf(res);
      setDownloadSuccessId(res.id);
      setTimeout(() => {
        setDownloadSuccessId(null);
      }, 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER HERO BANNER */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3.5 glass-panel text-indigo-500 border border-indigo-500/20 shadow-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>PIXAL LAB Open Education Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-theme-primary mb-3.5 tracking-tight [text-wrap:balance]">
          Free Study Material &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500">
            Academic Library
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-theme-secondary max-w-2xl mx-auto leading-relaxed">
          Open-access, high-resolution study notes, algorithm guides, and illustrated reference sheets across Computer Science, AI, Mathematics, Physics, Chemistry, Biology, and Logical Reasoning. 100% free with direct PDF download.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px] font-semibold text-theme-muted">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Zero Sign-In or Accounts Required</span>
          </span>
          <span className="flex items-center gap-1.5 text-indigo-500">
            <Download className="w-4 h-4 shrink-0" />
            <span>Instant Free PDF Downloads</span>
          </span>
          <span className="flex items-center gap-1.5 text-blue-500">
            <Layers className="w-4 h-4 shrink-0" />
            <span>High School & College Curricula</span>
          </span>
        </div>
      </div>

      {/* 2. SEARCH & CONTROLS TOOLBAR */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 mb-8 shadow-lg space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study material (e.g. Convolution, Snell's Law, SN2 Mechanism, Eigenvalues, ResNet)..."
            aria-label="Search study material"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs sm:text-sm text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary text-xs font-bold"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Row: Subject Tabs + Level Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-black/5 dark:border-white/10">
          {/* Subject Pills (Scrollable on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {STUDY_SUBJECTS.map((sub) => {
              const isSelected = selectedSubject === sub.id;
              const count =
                sub.id === 'all'
                  ? STUDY_RESOURCES.length
                  : STUDY_RESOURCES.filter((r) => r.subject === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-theme-secondary hover:text-theme-primary hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{sub.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-black/10 dark:bg-white/10 text-theme-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Level Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-theme-muted font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Level:</span>
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              aria-label="Filter by educational level"
              className="bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-theme-primary focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {STUDY_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. RESOURCE CARDS GRID */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-theme-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-theme-primary mb-1">
            No study material matching your filters
          </h3>
          <p className="text-xs text-theme-secondary mb-4">
            Try adjusting your search query or selecting a different academic subject.
          </p>
          <button
            onClick={() => {
              setSelectedSubject('all');
              setSelectedLevel('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isDownloading = downloadingId === res.id;
            const isSuccess = downloadSuccessId === res.id;

            return (
              <div
                key={res.id}
                className="glass-panel glass-panel-interactive rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-md group transition-all"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      {getSubjectIcon(res.subject)}
                      <span>{res.subjectLabel}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-theme-muted">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{res.estimatedPages} Pages</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base sm:text-lg font-bold font-display text-theme-primary mb-1.5 group-hover:text-indigo-500 transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-xs text-theme-muted font-medium mb-3 line-clamp-1 italic">
                    {res.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-theme-secondary leading-relaxed line-clamp-3 mb-4">
                    {res.description}
                  </p>

                  {/* Key Topics List (Top 3) */}
                  <div className="space-y-1.5 mb-5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block">
                      Core Topics Covered:
                    </span>
                    {res.keyTopics.slice(0, 3).map((topic, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-theme-secondary">
                        <span className="text-indigo-500 font-bold shrink-0">•</span>
                        <span className="line-clamp-1">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewResource(res)}
                    className="flex-1 py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-theme-primary flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(res)}
                    disabled={isDownloading}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Saved PDF!</span>
                      </>
                    ) : isDownloading ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Free PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CROSS-LINK BRIDGE TO HOW-TO GUIDES */}
      <div className="mt-12 glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="max-w-xl text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practical Guides & Step-by-Step Tutorials</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-theme-primary mb-1.5">
            Looking for Practical Image Editing Tutorials?
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            Read our step-by-step guides on making YouTube thumbnails, creating digital signatures, sizing passport photos, and splitting Instagram grids.
          </p>
        </div>

        <button
          onClick={() => onNavigate('guides')}
          className="shrink-0 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <span>Explore How-To Guides</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5. INTERACTIVE PREVIEW MODAL */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl p-6 overflow-y-auto shadow-2xl border border-black/10 dark:border-white/20 animate-in zoom-in-95 duration-200 relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    {previewResource.subjectLabel}
                  </span>
                  <span className="text-xs text-theme-muted font-mono">
                    {previewResource.levelLabel} · {previewResource.language}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-theme-primary">
                  {previewResource.title}
                </h2>
                <p className="text-xs text-theme-muted italic">{previewResource.subtitle}</p>
              </div>

              <button
                onClick={() => setPreviewResource(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-theme-primary flex items-center justify-center shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-theme-primary mb-1 text-xs uppercase tracking-wide">
                  Curriculum Overview
                </h4>
                <p className="text-theme-secondary leading-relaxed">
                  {previewResource.description}
                </p>
              </div>

              {/* Complete Topics */}
              <div>
                <h4 className="font-bold text-theme-primary mb-2 text-xs uppercase tracking-wide">
                  Topics in Full PDF ({previewResource.keyTopics.length})
                </h4>
                <div className="space-y-1.5">
                  {previewResource.keyTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-start gap-2"
                    >
                      <span className="text-indigo-500 font-bold shrink-0">{i + 1}.</span>
                      <span className="text-theme-secondary">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulas / Theorems Box */}
              <div>
                <h4 className="font-bold text-theme-primary mb-2 text-xs uppercase tracking-wide">
                  Key Mathematical Formulas & Theorems
                </h4>
                <div className="p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] space-y-2 border border-slate-800">
                  {previewResource.keyFormulasOrConcepts.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-slate-500">[{i + 1}]</span>
                      <span className="break-all">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-5 mt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
              <span className="text-[11px] text-theme-muted font-mono">
                {previewResource.estimatedPages} Pages · Est. {previewResource.estimatedSizeKB} KB
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-theme-primary hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleDownload(previewResource);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Free PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
