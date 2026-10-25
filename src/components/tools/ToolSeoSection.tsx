import React, { useState } from 'react';
import {
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  FileCheck,
  Zap,
  Lock,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { getToolGuide } from '../../data/toolGuides';
import { TOOL_SEO_CONFIG } from '../../data/toolSeoConfig';
import { TOOLS } from '../../data/tools';

interface ToolSeoSectionProps {
  tool: ToolMetadata;
  onSelectRelatedTool: (id: string) => void;
  onNavigateHome?: () => void;
  onNavigateAllTools?: () => void;
}

export const ToolSeoSection: React.FC<ToolSeoSectionProps> = ({
  tool,
  onSelectRelatedTool,
  onNavigateHome,
  onNavigateAllTools,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const guide = getToolGuide(tool.id, tool.name, tool.categoryLabel);
  const seoConfig = TOOL_SEO_CONFIG[tool.id];

  // Resolve related tools from SEO configuration or fallback to same category
  const relatedTools: ToolMetadata[] = React.useMemo(() => {
    if (seoConfig?.relatedToolIds?.length) {
      const found = seoConfig.relatedToolIds
        .map((id) => TOOLS.find((t) => t.id === id))
        .filter((t): t is ToolMetadata => Boolean(t));
      if (found.length >= 3) return found.slice(0, 4);
    }
    // Fallback: other tools in same category or popular tools
    return TOOLS.filter((t) => t.id !== tool.id).slice(0, 4);
  }, [seoConfig, tool.id]);

  return (
    <section aria-label="Tool Guide, FAQs & Information" className="mt-12 pt-10 border-t border-black/5 dark:border-white/10 w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* 1. CRAWLABLE BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-theme-muted">
          <li>
            <a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  if (onNavigateHome) onNavigateHome();
                  else window.location.assign('/');
                }
              }}
              className="hover:text-indigo-500 transition-colors"
            >
              Home
            </a>
          </li>
          <li aria-hidden="true" className="opacity-40">/</li>
          <li>
            <a
              href="/all-tools"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  if (onNavigateAllTools) onNavigateAllTools();
                  else window.location.assign('/all-tools');
                }
              }}
              className="hover:text-indigo-500 transition-colors"
            >
              Tools
            </a>
          </li>
          <li aria-hidden="true" className="opacity-40">/</li>
          <li className="text-theme-secondary">
            {tool.categoryLabel}
          </li>
          <li aria-hidden="true" className="opacity-40">/</li>
          <li className="text-theme-primary font-bold truncate max-w-[220px] sm:max-w-none" aria-current="page">
            {tool.name}
          </li>
        </ol>
      </nav>

      {/* 2. STEP-BY-STEP "HOW TO USE" GUIDE */}
      <div className="mb-10">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Step-by-Step Workflow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-theme-primary mb-2">
            How to Use {tool.name}
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary max-w-2xl">
            Quick, reliable steps to get optimal results directly inside your browser with zero image distortion and instant export.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {guide.steps.map((st) => (
            <div key={st.step} className="glass-panel rounded-2xl p-5 border border-black/5 dark:border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                  0{st.step}
                </div>
                <h3 className="text-sm font-bold text-theme-primary mb-1.5">
                  {st.title}
                </h3>
                <p className="text-xs text-theme-secondary leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TECHNICAL SPECIFICATIONS & PRIVACY GUARANTEE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Architecture & Privacy Card */}
        <div className="glass-panel rounded-2xl p-6 border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-theme-primary">
                100% Client-Side Privacy Architecture
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed mb-4">
              {guide.howItWorks}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-3 border-t border-black/5 dark:border-white/10">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Remote Storage • Zero Bandwidth Limits</span>
          </div>
        </div>

        {/* Real Features & Specifications Card */}
        <div className="glass-panel rounded-2xl p-6 border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="w-5 h-5 text-indigo-500 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-theme-primary">
                Technical Specifications & Capabilities
              </h3>
            </div>
            <ul className="space-y-2 mb-4">
              {tool.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-theme-secondary">
                  <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-black/5 dark:border-white/10 text-[11px]">
            <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
              <span className="text-theme-muted block text-[10px]">Supported Formats</span>
              <span className="font-semibold text-theme-primary">{tool.acceptedFormats.join(', ')}</span>
            </div>
            <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
              <span className="text-theme-muted block text-[10px]">Maximum File Size</span>
              <span className="font-semibold text-theme-primary">Up to {tool.maxFileSizeMB} MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      {guide.faqs && guide.faqs.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold font-display text-theme-primary">
              Frequently Asked Questions ({guide.faqs.length})
            </h3>
          </div>
          <div className="space-y-3">
            {guide.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs sm:text-sm font-semibold text-theme-primary">
                      {faq.question}
                    </span>
                    <span className="text-theme-muted shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-theme-secondary leading-relaxed border-t border-black/5 dark:border-white/10 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. CRAWLABLE RELATED TOOLS GRID */}
      <div className="pt-8 border-t border-black/5 dark:border-white/10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-display text-theme-primary">
              Related Image & Creative Utilities
            </h3>
            <p className="text-xs text-theme-secondary">
              Discover complementary tools in the PIXAL LAB in-browser studio.
            </p>
          </div>
          <a
            href="/all-tools"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                if (onNavigateAllTools) onNavigateAllTools();
                else window.location.assign('/all-tools');
              }
            }}
            className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 shrink-0 hidden sm:inline-flex items-center gap-1"
          >
            <span>All Tools</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedTools.map((rel) => (
            <a
              key={rel.id}
              href={`/tool/${rel.id}`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onSelectRelatedTool(rel.id);
                }
              }}
              className="glass-panel glass-panel-interactive rounded-2xl p-4 text-left transition-all block group no-underline border border-black/5 dark:border-white/10"
              aria-label={`Open ${rel.name}: ${rel.tagline}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">
                  {rel.categoryLabel}
                </span>
                <span className="text-[10px] text-theme-muted">Free</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-theme-primary group-hover:text-indigo-500 transition-colors mb-1 truncate">
                {rel.name}
              </div>
              <div className="text-[11px] text-theme-secondary line-clamp-2 leading-snug">
                {rel.tagline}
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Launch Tool</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
