import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  FileText,
  Download,
  Eye,
  Sparkles,
  BookOpen,
  Mail,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  StudySubjectSlug,
  SUBJECTS_DATA,
  STUDY_NOTES,
  StudyNoteRecord,
  getDrivePreviewUrl,
  getDriveDownloadUrl,
} from '../../data/studyMaterialData';
import { SubjectIllustration } from './SubjectIllustration';
import { generateStudyNotePdf } from '../../utils/studyPdfGenerator';

interface SubjectNotesPageProps {
  subjectSlug: StudySubjectSlug;
  onNavigate: (view: string, toolId?: string, guideSlug?: string) => void;
}

export const SubjectNotesPage: React.FC<SubjectNotesPageProps> = ({
  subjectSlug,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewNote, setPreviewNote] = useState<StudyNoteRecord | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestedTopic, setRequestedTopic] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Retrieve current subject metadata
  const subject = useMemo(() => {
    return SUBJECTS_DATA.find((s) => s.slug === subjectSlug) || SUBJECTS_DATA[0];
  }, [subjectSlug]);

  // Notes strictly assigned to this subject (SUBJECT-ONLY organization)
  const subjectNotes = useMemo(() => {
    return STUDY_NOTES.filter((note) => note.subject === subject.slug);
  }, [subject.slug]);

  // Filter notes by search query
  const filteredNotes = useMemo(() => {
    return subjectNotes.filter((note) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        note.title.toLowerCase().includes(q) ||
        (note.description && note.description.toLowerCase().includes(q))
      );
    });
  }, [subjectNotes, searchQuery]);

  // Other 4 subjects for quick jumping
  const otherSubjects = useMemo(() => {
    return SUBJECTS_DATA.filter((s) => s.slug !== subject.slug);
  }, [subject.slug]);

  const handleDownload = (note: StudyNoteRecord) => {
    if (note.pdfUrl) {
      const downloadUrl = getDriveDownloadUrl(note.pdfUrl);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      generateStudyNotePdf(note);
    }
  };

  const handleTopicRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedTopic.trim()) return;

    const mailSubject = encodeURIComponent(
      `[PIXAL LAB Study Material Request] ${subject.name}`
    );
    const mailBody = encodeURIComponent(
      `Hello PIXAL LAB Team,\n\nI would like to request study notes for:\nSubject: ${subject.name}\nTopic/Document: ${requestedTopic}\n\nThank you!`
    );
    window.location.href = `mailto:pixellab.online.pk@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestModalOpen(false);
      setRequestSubmitted(false);
      setRequestedTopic('');
    }, 2000);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      {/* 1. BREADCRUMBS & BACK BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-theme-muted font-medium flex-wrap"
        >
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
          <ChevronRight className="w-3.5 h-3.5 text-theme-muted shrink-0" />
          <a
            href="/study-material"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('study-material');
            }}
            className="hover:text-theme-primary transition-colors"
          >
            Free Study Material
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-theme-muted shrink-0" />
          <span className={`font-semibold ${subject.accent.text}`}>{subject.name} Notes</span>
        </nav>

        <a
          href="/study-material"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('study-material');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-theme-secondary hover:text-theme-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All 5 Subjects</span>
        </a>
      </div>

      {/* 2. SUBJECT HERO BANNER */}
      <div
        className={`relative glass-panel rounded-3xl p-6 sm:p-10 mb-8 border ${subject.accent.border} shadow-xl overflow-hidden`}
      >
        {/* Ambient Subject-specific Glow */}
        <div
          className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${subject.accent.bgGradient} rounded-full blur-3xl pointer-events-none -mr-20 -mt-20`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8">
          {/* Left Text Column */}
          <div className="max-w-3xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 border backdrop-blur-md shadow-xs">
              <span className={`w-2 h-2 rounded-full ${subject.accent.bgSubtle} border ${subject.accent.border}`} />
              <span className={subject.accent.text}>Subject Notes Archive</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-theme-primary mb-3 tracking-tight">
              {subject.name}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-primary via-indigo-500 to-cyan-500">
                Notes
              </span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-theme-muted mb-2 tracking-wide uppercase">
              {subject.tagline}
            </p>

            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed mb-5 max-w-2xl">
              {subject.fullDescription}
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs text-theme-muted">
              <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Free Open Access</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-500 font-semibold">
                <Download className="w-4 h-4 shrink-0" />
                <span>Direct PDF Downloads</span>
              </span>
            </div>
          </div>

          {/* Right Illustration Column */}
          <div className="shrink-0 p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-inner flex flex-col items-center">
            <SubjectIllustration slug={subject.slug} size="lg" />
            <div className="mt-3 text-center">
              <span className={`text-[11px] font-bold ${subject.accent.text} block`}>
                {subject.name} Collection
              </span>
              <span className="text-[10px] text-theme-muted">Official Study Resources</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH CONTROLS TOOLBAR */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 mb-8 shadow-md flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${subject.name} notes, topics, or chapters...`}
            aria-label={`Search ${subject.name} study notes`}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs sm:text-sm text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary text-xs font-bold"
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setRequestModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-theme-primary border border-black/10 dark:border-white/10 transition-colors shrink-0"
        >
          <Mail className="w-3.5 h-3.5 text-indigo-500" />
          <span>Request Topic</span>
        </button>
      </div>

      {/* 4. CONTENT DISPLAY: ACTIVE NOTES LISTING OR PROFESSIONAL EMPTY STATE */}
      {filteredNotes.length > 0 ? (
        /* Real Notes Grid (Organized in one continuous subject listing) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="glass-panel glass-panel-interactive rounded-3xl p-6 flex flex-col justify-between shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${subject.accent.badge}`}
                  >
                    {subject.name}
                  </span>
                  {note.fileSize && (
                    <span className="text-xs text-theme-muted font-mono flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{note.fileSize}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold font-display text-theme-primary mb-2 group-hover:text-indigo-500 transition-colors">
                  {note.title}
                </h3>

                {note.description && (
                  <p className="text-xs text-theme-secondary leading-relaxed line-clamp-3 mb-4">
                    {note.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewNote(note)}
                  className="flex-1 py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-theme-primary flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(note)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all ${subject.accent.button}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Professional Subject-Specific Empty State */
        <div className="glass-panel rounded-3xl p-8 sm:p-12 mb-12 border border-black/10 dark:border-white/10 shadow-lg text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-5 p-2">
            <SubjectIllustration slug={subject.slug} size="sm" />
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 border ${subject.accent.badge}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upcoming Notes Archive</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-theme-primary mb-3">
            New {subject.name} study notes are coming soon.
          </h2>

          <p className="text-xs sm:text-sm text-theme-secondary max-w-xl mx-auto leading-relaxed mb-6">
            Please check back later. Our comprehensive {subject.name} study notes and revision resources are currently being compiled. All materials will be available here for direct PDF download with no sign-in required.
          </p>

          {/* Subject Topics Overview */}
          <div className="text-left rounded-2xl p-5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 mb-8 max-w-lg mx-auto">
            <span className="text-xs font-bold text-theme-primary block mb-3 flex items-center gap-1.5">
              <CheckCircle2 className={`w-4 h-4 ${subject.accent.text}`} />
              <span>Upcoming {subject.name} Topics:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-theme-secondary">
              {subject.curriculumTopics.map((topic, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className={`${subject.accent.text} font-bold`}>•</span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setRequestModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Request {subject.name} Notes</span>
            </button>

            <a
              href="/study-material"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('study-material');
              }}
              className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs sm:text-sm font-semibold text-theme-primary transition-all"
            >
              Back to All Subjects
            </a>
          </div>
        </div>
      )}

      {/* 5. QUICK NAVIGATION TO OTHER 4 SUBJECTS */}
      <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-theme-primary">
              Explore More Subjects
            </h3>
            <p className="text-xs text-theme-secondary">
              Browse study materials and reference guides for other academic disciplines.
            </p>
          </div>

          <a
            href="/study-material"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('study-material');
            }}
            className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
          >
            <span>All Subjects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {otherSubjects.map((sub) => (
            <a
              key={sub.slug}
              href={`/study-material/${sub.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('study-material', sub.slug);
              }}
              className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform group border border-black/5 dark:border-white/10 hover:border-indigo-500/30"
            >
              <div className="mb-2 p-1.5 rounded-xl bg-black/5 dark:bg-white/5">
                <SubjectIllustration slug={sub.slug} size="sm" />
              </div>
              <span className="text-xs font-bold text-theme-primary group-hover:text-indigo-500 transition-colors">
                {sub.name} Notes
              </span>
              <span className="text-[10px] text-theme-muted truncate w-full mt-0.5">
                {sub.tagline}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 6. HOW-TO GUIDES BRIDGE BANNER */}
      <div className="mt-10 glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="max-w-xl text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practical Learning & Tutorials</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-display text-theme-primary mb-1">
            Need Step-by-Step Practical Image Guides?
          </h3>
          <p className="text-xs text-theme-secondary leading-relaxed">
            Read our free practical tutorials on YouTube thumbnails, transparent digital
            signatures, sizing passport photos, and image grid splitting.
          </p>
        </div>

        <a
          href="/guides"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('guides');
          }}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <span>View How-To Guides</span>
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* 7. PREVIEW NOTE MODAL (When Notes are Available) */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-black/10 dark:border-white/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10 mb-4">
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-2 inline-block ${subject.accent.badge}`}
                >
                  {subject.name} Notes
                </span>
                <h3 className="text-lg font-bold font-display text-theme-primary">
                  {previewNote.title}
                </h3>
              </div>

              <button
                onClick={() => setPreviewNote(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-theme-primary flex items-center justify-center shrink-0 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              {previewNote.description && (
                <p className="text-theme-secondary leading-relaxed">{previewNote.description}</p>
              )}
              {previewNote.pdfUrl && (
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[11px] text-theme-muted">
                  <span>Direct Google Drive / PDF Access: Verified virus-free and public.</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreviewNote(null)}
                className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-theme-primary hover:bg-black/5 dark:hover:bg-white/5"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDownload(previewNote)}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${subject.accent.button}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. REQUEST SPECIFIC TOPIC MODAL */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/10 dark:border-white/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-theme-primary">
                  Request {subject.name} Notes
                </h3>
                <p className="text-xs text-theme-muted">
                  Tell us which topic or chapter you need priority notes for.
                </p>
              </div>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-theme-primary flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {requestSubmitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-theme-primary">Request Prepared!</h4>
                <p className="text-xs text-theme-secondary mt-1">
                  Opening your email client to send your study material request to{' '}
                  <span className="font-mono text-indigo-500">pixellab.online.pk@gmail.com</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTopicRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-theme-primary mb-1">
                    Topic, Chapter, or Specific Document Title
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={requestedTopic}
                    onChange={(e) => setRequestedTopic(e.target.value)}
                    placeholder={`e.g. Chapter 3: Derivations, Formula Cheat Sheet, or Past Paper Revision...`}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-theme-primary hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
