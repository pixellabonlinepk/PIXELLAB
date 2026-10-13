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
import { ToolCategory } from './types';
import { useTheme } from './context/ThemeContext';
import { Sparkles, Compass, ShieldCheck, ArrowRight, Zap, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedToolId, setSelectedToolId] = useState<string>('image-compressor');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Rating widget is visible immediately on initial page load and refresh (including homepage)
  const [ratingWidget, setRatingWidget] = useState<{
    isOpen: boolean;
    toolId?: string;
    toolName?: string;
  }>({ isOpen: true });

  // Update rating widget context if user uses a tool
  useEffect(() => {
    const handleToolCompleted = (event: Event) => {
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
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'dark'
          ? 'dark-studio-bg text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
          : 'light-studio-bg text-slate-900 selection:bg-blue-500/30 selection:text-blue-900'
      }`}
    >
      {/* Brand Header */}
      <Header currentView={currentView} onNavigate={navigateTo} />

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1">
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
            <section id="tools-gallery" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Subtle ambient light accents behind tool cards */}
              {theme === 'dark' && (
                <>
                  <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                  <div className="absolute top-2/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
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
              <div className="relative z-10 mb-8">
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
                    Why Creators Choose Pixel Lab
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
                Browse every utility in the Pixel Lab platform. Click any tool to open its dedicated workspace.
              </p>
            </div>

            <div className="mb-8">
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


