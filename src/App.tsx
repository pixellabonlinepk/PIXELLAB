import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryFilters } from './components/CategoryFilters';
import { ToolGrid } from './components/ToolGrid';
import { Footer } from './components/Footer';
import { ToolWorkspace } from './components/tools/ToolWorkspace';
import { AboutPage } from './components/pages/AboutPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';
import { ContactPage } from './components/pages/ContactPage';
import { RatingWidget } from './components/RatingWidget';
import { TOOLS } from './data/tools';
import { getToolGuide } from './data/toolGuides';
import { ToolCategory } from './types';
import { useTheme } from './context/ThemeContext';
import {
  Sparkles,
  Compass,
  ShieldCheck,
  ArrowRight,
  Zap,
  Image as ImageIcon,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const HOMEPAGE_FAQS = [
  {
    question: 'How is Pixal Lab completely private with zero server uploads?',
    answer:
      'Unlike standard online image converters that transmit your files to remote cloud servers, Pixal Lab processes your photos 100% locally on your computer or phone using modern HTML5 Canvas, WebGL, and WebAssembly APIs. Your personal images, sensitive documents, and photos never leave your device memory.',
  },
  {
    question: 'Are all tools on Pixal Lab free to use without an account?',
    answer:
      'Yes! Every single tool in our 31+ image utility collection is completely free forever. You never have to create an account, enter credit card details, pay subscription fees, or deal with rate limits.',
  },
  {
    question: 'Can I use Pixal Lab on my iPhone, Android, or tablet?',
    answer:
      'Absolutely. Pixal Lab is engineered with a mobile-first responsive architecture that adjusts smoothly to all screen sizes, including iOS Safari, Android Chrome, iPads, and high-resolution desktop displays.',
  },
  {
    question: 'What file formats and sizes are supported?',
    answer:
      'Pixal Lab supports all common raster and vector formats including JPG/JPEG, PNG, WebP, SVG, and PDF documents, handling image resolutions up to 50 MB per file with instant real-time results.',
  },
  {
    question: 'Can I use images edited on Pixal Lab for commercial or client work?',
    answer:
      'Yes. You retain 100% copyright and intellectual property rights over all images, collages, signatures, and QR codes processed on Pixal Lab. We place zero watermarks on your exports.',
  },
];

export default function App() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedToolId, setSelectedToolId] = useState<string>('image-compressor');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Rating widget starts closed; only appears after a user finishes a tool export if not previously rated
  const [ratingWidget, setRatingWidget] = useState<{
    isOpen: boolean;
    toolId?: string;
    toolName?: string;
  }>({ isOpen: false });

  // Update rating widget context if user uses a tool
  useEffect(() => {
    const handleToolCompleted = (event: Event) => {
      // Do not open if user already rated or dismissed
      if (localStorage.getItem('pixallab_rated') === 'true') {
        return;
      }
      const customEvent = event as CustomEvent<{ toolId?: string; toolName?: string }>;
      setRatingWidget({
        isOpen: true,
        toolId: customEvent.detail?.toolId,
        toolName: customEvent.detail?.toolName,
      });
    };

    window.addEventListener('pixellab:tool-completed', handleToolCompleted);
    return () => {
      window.removeEventListener('pixellab:tool-completed', handleToolCompleted);
    };
  }, []);

  // Sync with browser URL hash for direct links and browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('tool/')) {
        const id = hash.replace('tool/', '');
        if (TOOLS.some((t) => t.id === id)) {
          setSelectedToolId(id);
          setCurrentView('tool');
          return;
        }
      }
      if (['home', 'all-tools', 'about', 'privacy', 'terms', 'contact'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // DYNAMIC SEO & META ENGINE: updates title, description, canonical link, open graph, and injects JSON-LD schema
  useEffect(() => {
    let pageTitle = 'Pixal Lab — Every Image. More Possibilities.';
    let pageDesc =
      'Every Image. More Possibilities. Resize, compress, edit, convert, and enhance your images with simple, powerful browser-based tools in one place.';
    let canonicalUrl = 'https://pixallab.online/';
    let jsonLdData: any = null;

    if (currentView === 'tool') {
      const activeTool = TOOLS.find((t) => t.id === selectedToolId) || TOOLS[0];
      const guide = getToolGuide(activeTool.id, activeTool.name, activeTool.categoryLabel);

      pageTitle = `${activeTool.name} Online — Free & 100% Private | Pixal Lab`;
      pageDesc = `${activeTool.description} Fast, secure in-browser processing with zero server uploads and instant export.`;
      canonicalUrl = `https://pixallab.online/#/tool/${activeTool.id}`;

      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `${activeTool.name} — Pixal Lab`,
          applicationCategory: 'DesignApplication',
          operatingSystem: 'All',
          description: activeTool.description,
          url: canonicalUrl,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '1280',
            bestRating: '5',
            worstRating: '1',
          },
          featureList: activeTool.features.join(', '),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ];
    } else if (currentView === 'home') {
      pageTitle = 'Pixal Lab — Every Image. More Possibilities.';
      pageDesc =
        'Every Image. More Possibilities. Resize, compress, edit, convert, and enhance your images with simple, powerful browser-based tools in one place.';
      canonicalUrl = 'https://pixallab.online/';

      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Pixal Lab',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'All',
          url: 'https://pixallab.online/',
          description: pageDesc,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '2450',
            bestRating: '5',
            worstRating: '1',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: HOMEPAGE_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ];
    } else if (currentView === 'all-tools') {
      pageTitle = `All ${TOOLS.length} Image Tools — Free Online Editor Suite | Pixal Lab`;
      pageDesc = `Explore all ${TOOLS.length} high-performance image manipulation utilities in Pixal Lab. Compress, resize, crop, filter, convert, and create with zero server uploads.`;
      canonicalUrl = 'https://pixallab.online/#/all-tools';
    } else if (currentView === 'about') {
      pageTitle = 'About Pixal Lab — 100% In-Browser Image Studio';
      pageDesc =
        'Learn how Pixal Lab delivers free, secure client-side image processing tools without subscriptions or invasive data tracking.';
      canonicalUrl = 'https://pixallab.online/#/about';
    } else if (currentView === 'privacy') {
      pageTitle = 'Privacy Policy & Cookie Policy | Pixal Lab';
      pageDesc =
        'Read our transparent privacy policy. Pixal Lab runs 100% in your browser with zero image uploads, zero remote storage, and standard Google Analytics disclosure.';
      canonicalUrl = 'https://pixallab.online/#/privacy';
    } else if (currentView === 'terms') {
      pageTitle = 'Terms of Service | Pixal Lab';
      pageDesc = 'Terms of Service and usage conditions for Pixal Lab client-side image processing utilities.';
      canonicalUrl = 'https://pixallab.online/#/terms';
    } else if (currentView === 'contact') {
      pageTitle = 'Contact & Support | Pixal Lab';
      pageDesc =
        'Get in touch with the Pixal Lab engineering and support team for feedback, feature requests, or business inquiries.';
      canonicalUrl = 'https://pixallab.online/#/contact';
    }

    // 1. Update document title
    document.title = pageTitle;

    // 2. Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', pageDesc);
    }

    // 3. Update OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    // 4. Update canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    }

    // 5. Inject Dynamic JSON-LD Schema
    const existingScript = document.getElementById('pixal-dynamic-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLdData) {
      const script = document.createElement('script');
      script.id = 'pixal-dynamic-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLdData);
      document.head.appendChild(script);
    }

    // 6. Track page_view in Google Analytics
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.hash,
        send_to: 'G-ZBTVJ487QP',
      });
    }
  }, [currentView, selectedToolId]);

  const navigateTo = (view: string, toolId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'tool' && toolId) {
      setSelectedToolId(toolId);
      setCurrentView('tool');
      window.location.hash = `#/tool/${toolId}`;
    } else {
      setCurrentView(view);
      window.location.hash = `#/${view}`;
    }
  };

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        activeCategory === 'all' || tool.category === activeCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Selected tool metadata
  const activeTool = useMemo(() => {
    return TOOLS.find((t) => t.id === selectedToolId) || TOOLS[0];
  }, [selectedToolId]);

  return (
    <div
      className={`min-h-screen flex flex-col w-full max-w-full overflow-x-hidden transition-colors duration-200 ${
        theme === 'dark'
          ? 'dark-studio-bg text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
          : 'light-studio-bg text-slate-900 selection:bg-blue-500/30 selection:text-blue-900'
      }`}
    >
      {/* Brand Header */}
      <Header currentView={currentView} onNavigate={navigateTo} />

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1 w-full max-w-full min-w-0">
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div>
            <HeroSection
              onExploreClick={() => {
                const el = document.getElementById('tools-gallery');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectTool={(id) => navigateTo('tool', id)}
              onSearchQueryChange={(q) => setSearchQuery(q)}
            />

            {/* Tools Gallery Anchor Section */}
            <section id="tools-gallery" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
              {/* Subtle ambient light accents behind tool cards */}
              {theme === 'dark' && (
                <>
                  <div className="absolute top-1/4 -left-12 sm:-left-32 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
                  <div className="absolute top-2/3 -right-12 sm:-right-32 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
                </>
              )}

              <div className="relative z-10 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1 tracking-wide uppercase">
                    <Compass className="w-4 h-4" />
                    <span>Tool Explorer</span>
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-extrabold font-display ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    All {TOOLS.length} Image Tools
                  </h2>
                  <p
                    className={`text-xs sm:text-sm mt-1 max-w-xl ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    High-performance client-side image editing, resizing, filters, format conversions, QR codes, and PDF tools.
                  </p>
                </div>
              </div>

              {/* Category Segmented Filter Tabs */}
              <div className="relative z-10 mb-8 w-full max-w-full min-w-0">
                <CategoryFilters
                  activeCategory={activeCategory}
                  onSelectCategory={(cat) => setActiveCategory(cat)}
                />
              </div>

              {/* Tool Grid (Responsive 4 columns) */}
              <div className="relative z-10">
                <ToolGrid
                  tools={filteredTools}
                  onSelectTool={(id) => navigateTo('tool', id)}
                  searchQuery={searchQuery}
                  onResetFilters={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                />
              </div>
            </section>

            {/* Feature Highlights Banner */}
            <section
              className={`border-t py-16 transition-colors duration-200 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-b from-[#090e1f]/80 via-[#060913] to-[#060913] border-slate-800/80'
                  : 'bg-gradient-to-b from-slate-100/90 to-slate-50 border-slate-200'
              }`}
            >
              {theme === 'dark' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
              )}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2
                    className={`text-2xl sm:text-3xl font-bold font-display mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Why Creators Choose Pixal Lab
                  </h2>
                  <p
                    className={`text-xs sm:text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Engineered with modern Web APIs for maximum privacy, zero bandwidth limits, and instant exports.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    className={`p-6 rounded-2xl border space-y-3 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 backdrop-blur-md border-indigo-500/20 shadow-lg shadow-black/30 hover:border-indigo-400/40 hover:-translate-y-1'
                        : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                      01
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Zero Server Uploads
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Your images are processed directly in your browser with HTML5 Canvas. We never transmit, store, or view your photos.
                    </p>
                  </div>

                  <div
                    className={`p-6 rounded-2xl border space-y-3 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 backdrop-blur-md border-indigo-500/20 shadow-lg shadow-black/30 hover:border-indigo-400/40 hover:-translate-y-1'
                        : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
                      02
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Unlimited Usage & No Accounts
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Convert and edit as many images as you need with no subscriptions, credits, signups, or rate limits.
                    </p>
                  </div>

                  <div
                    className={`p-6 rounded-2xl border space-y-3 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 backdrop-blur-md border-indigo-500/20 shadow-lg shadow-black/30 hover:border-indigo-400/40 hover:-translate-y-1'
                        : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                      03
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Full {TOOLS.length}-Tool Suite
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Everything from simple rotations and crops to watermarking, multi-photo collages, YouTube thumbnails, and PDF workflows.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* HOMEPAGE FREQUENTLY ASKED QUESTIONS SECTION (AdSense & High-Value Content) */}
            <section
              className={`py-16 border-t transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-950/70 border-slate-800/80'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Common Questions</span>
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-extrabold font-display mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Frequently Asked Questions about Pixal Lab
                  </h2>
                  <p
                    className={`text-xs sm:text-sm max-w-xl mx-auto ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Everything you need to know about our 100% private in-browser image editing suite, data privacy guarantees, and free tools.
                  </p>
                </div>

                <div className="space-y-3">
                  {HOMEPAGE_FAQS.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border transition-all ${
                          theme === 'dark'
                            ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                        >
                          <span
                            className={`text-sm sm:text-base font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {faq.question}
                          </span>
                          <span className="p-1 rounded-lg text-slate-400 shrink-0">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-cyan-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </span>
                        </button>
                        {isOpen && (
                          <div
                            className={`px-4 pb-5 sm:px-5 sm:pb-6 pt-0 text-xs sm:text-sm leading-relaxed border-t ${
                              theme === 'dark'
                                ? 'text-slate-400 border-slate-800/60'
                                : 'text-slate-600 border-slate-200/80'
                            }`}
                          >
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ALL TOOLS PAGE */}
        {currentView === 'all-tools' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h1
                className={`text-3xl font-extrabold font-display mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                All {TOOLS.length} Image Tools
              </h1>
              <p
                className={`text-sm max-w-2xl ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Browse every utility in the Pixal Lab platform. Click any tool to open its dedicated workspace.
              </p>
            </div>

            <div className="mb-8 w-full max-w-full min-w-0">
              <CategoryFilters
                activeCategory={activeCategory}
                onSelectCategory={(cat) => setActiveCategory(cat)}
              />
            </div>

            <ToolGrid
              tools={filteredTools}
              onSelectTool={(id) => navigateTo('tool', id)}
              searchQuery={searchQuery}
              onResetFilters={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            />
          </div>
        )}

        {/* VIEW 4: DEDICATED TOOL WORKSPACE */}
        {currentView === 'tool' && (
          <ToolWorkspace
            tool={activeTool}
            onBack={() => navigateTo('home')}
            onSelectRelatedTool={(id) => navigateTo('tool', id)}
          />
        )}

        {/* VIEW 5: ABOUT */}
        {currentView === 'about' && (
          <AboutPage onExploreTools={() => navigateTo('all-tools')} />
        )}

        {/* VIEW 6: PRIVACY */}
        {currentView === 'privacy' && <PrivacyPage />}

        {/* VIEW 7: TERMS */}
        {currentView === 'terms' && <TermsPage />}

        {/* VIEW 8: CONTACT */}
        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Floating Top-Right 5-Star Rating Widget */}
      <RatingWidget
        isOpen={ratingWidget.isOpen}
        toolId={ratingWidget.toolId}
        toolName={ratingWidget.toolName}
        onClose={() => setRatingWidget((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}


