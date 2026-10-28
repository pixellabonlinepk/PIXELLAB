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
import { GuidesIndexPage } from './components/pages/GuidesIndexPage';
import { GuideDetailPage } from './components/pages/GuideDetailPage';
import { SlidingPuzzleGame } from './components/puzzle/SlidingPuzzleGame';
import { GamesDirectoryPage } from './components/pages/GamesDirectoryPage';
import { IndividualGamePage } from './components/pages/IndividualGamePage';
import { ImageGamesPage } from './components/pages/ImageGamesPage';
import { StudyMaterialPage } from './components/pages/StudyMaterialPage';
import { PuzzleBanner } from './components/PuzzleBanner';
import { RatingWidget } from './components/RatingWidget';
import { TOOLS } from './data/tools';
import { getToolGuide } from './data/toolGuides';
import { TOOL_SEO_CONFIG } from './data/toolSeoConfig';
import { EDUCATIONAL_GUIDES } from './data/guidesData';
import { GAMES_CATALOG, getGameBySlug } from './data/gamesData';
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
    question: 'How is PIXAL LAB completely private with zero server uploads?',
    answer:
      'Unlike standard online image converters that transmit your files to remote cloud servers, PIXAL LAB processes your photos 100% locally on your computer or phone using modern HTML5 Canvas, WebGL, and WebAssembly APIs. Your personal images, sensitive documents, and photos never leave your device memory.',
  },
  {
    question: 'Are all tools on PIXAL LAB free to use without an account?',
    answer:
      `Yes! Every single tool in our ${TOOLS.length} professional image utility collection is completely free forever. You never have to create an account, enter credit card details, pay subscription fees, or deal with rate limits.`,
  },
  {
    question: 'Can I use PIXAL LAB on my iPhone, Android, or tablet?',
    answer:
      'Absolutely. PIXAL LAB is engineered with a mobile-first responsive architecture that adjusts smoothly to all screen sizes, including iOS Safari, Android Chrome, iPads, and high-resolution desktop displays.',
  },
  {
    question: 'What file formats and sizes are supported?',
    answer:
      'PIXAL LAB supports all common raster and vector formats including JPG/JPEG, PNG, WebP, SVG, and PDF documents, handling image resolutions up to 50 MB per file with instant real-time results.',
  },
  {
    question: 'Can I use images edited on PIXAL LAB for commercial or client work?',
    answer:
      'Yes. You retain 100% copyright and intellectual property rights over all images, collages, signatures, and QR codes processed on PIXAL LAB. We place zero watermarks on your exports.',
  },
];

export default function App() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedToolId, setSelectedToolId] = useState<string>('image-compressor');
  const [selectedGuideSlug, setSelectedGuideSlug] = useState<string>('how-to-make-a-youtube-thumbnail');
  const [selectedGameSlug, setSelectedGameSlug] = useState<string>('sliding-picture-puzzle');
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

  // Sync with browser URL clean pathname and hash fallback for direct links & back/forward navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const hash = window.location.hash.replace('#/', '').replace('#', '');

      // 1. Check clean path first (e.g. /tool/signature-maker, /guide/how-to-make-a-youtube-thumbnail)
      if (pathname.startsWith('tool/') || pathname.startsWith('tools/')) {
        const id = pathname.replace(/^tools?\//, '');
        if (TOOLS.some((t) => t.id === id)) {
          setSelectedToolId(id);
          setCurrentView('tool');
          return;
        }
      }

      if (pathname.startsWith('guide/') || pathname.startsWith('guides/')) {
        const slug = pathname.replace(/^guides?\//, '');
        const found = EDUCATIONAL_GUIDES.find((g) => g.slug === slug);
        if (found) {
          setSelectedGuideSlug(found.slug);
          setCurrentView('guide');
          return;
        }
      }

      if (pathname === 'guides') {
        setCurrentView('guides');
        return;
      }

      // Games & Fun: Individual Game Page (e.g. /games/sudoku, /games/sliding-picture-puzzle)
      if (pathname.startsWith('games/')) {
        const slug = pathname.replace(/^games\//, '').replace(/\/$/, '');
        const found = GAMES_CATALOG.find((g) => g.slug === slug || g.id === slug);
        if (found) {
          setSelectedGameSlug(found.slug);
          setCurrentView('game');
          return;
        }
      }

      // Games & Fun: Central Directory (/games)
      if (['games', 'games/', 'image-games'].includes(pathname)) {
        setCurrentView('games');
        return;
      }

      // Legacy direct puzzle link
      if (['puzzle', 'picture-puzzle'].includes(pathname)) {
        setSelectedGameSlug('sliding-picture-puzzle');
        setCurrentView('game');
        return;
      }

      if (['study-material', 'study', 'study-materials', 'free-study-material'].includes(pathname)) {
        setCurrentView('study-material');
        return;
      }

      if (['all-tools', 'tools'].includes(pathname)) {
        setCurrentView('all-tools');
        return;
      }

      if (['about', 'privacy', 'terms', 'contact'].includes(pathname)) {
        setCurrentView(pathname);
        return;
      }

      // 2. Check hash fallback for legacy bookmarks (e.g. #/tool/signature-maker)
      if (hash.startsWith('tool/')) {
        const id = hash.replace('tool/', '');
        if (TOOLS.some((t) => t.id === id)) {
          setSelectedToolId(id);
          setCurrentView('tool');
          return;
        }
      }

      if (hash.startsWith('guide/')) {
        const slug = hash.replace('guide/', '');
        const found = EDUCATIONAL_GUIDES.find((g) => g.slug === slug);
        if (found) {
          setSelectedGuideSlug(found.slug);
          setCurrentView('guide');
          return;
        }
      }

      if (hash.startsWith('games/')) {
        const slug = hash.replace('games/', '').replace(/\/$/, '');
        const found = GAMES_CATALOG.find((g) => g.slug === slug || g.id === slug);
        if (found) {
          setSelectedGameSlug(found.slug);
          setCurrentView('game');
          return;
        }
      }

      if (hash === 'guides') {
        setCurrentView('guides');
        return;
      }

      if (['games', 'image-games'].includes(hash)) {
        setCurrentView('games');
        return;
      }

      if (['puzzle', 'picture-puzzle'].includes(hash)) {
        setSelectedGameSlug('sliding-picture-puzzle');
        setCurrentView('game');
        return;
      }

      if (['study-material', 'study', 'study-materials', 'free-study-material'].includes(hash)) {
        setCurrentView('study-material');
        return;
      }

      if (['all-tools', 'tools'].includes(hash)) {
        setCurrentView('all-tools');
        return;
      }

      if (['home', 'about', 'privacy', 'terms', 'contact'].includes(hash)) {
        setCurrentView(hash);
        return;
      }

      // Default to home if on root path without hash
      if (!pathname && !hash) {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    handleUrlChange();
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // DYNAMIC SEO & META ENGINE: updates title, description, canonical link, open graph, and injects verified JSON-LD schema
  useEffect(() => {
    const DOMAIN = 'https://www.pixallab.online';
    let pageTitle = 'PIXAL LAB — Free Online Image Tools | Every Image. More Possibilities.';
    let pageDesc =
      'Use free online image tools with PIXAL LAB. Resize, compress, crop, convert, edit, and enhance images using simple browser-based tools with zero server uploads.';
    let canonicalUrl = `${DOMAIN}/`;
    let jsonLdData: any = null;

    if (currentView === 'tool') {
      const activeTool = TOOLS.find((t) => t.id === selectedToolId) || TOOLS[0];
      const seoData = TOOL_SEO_CONFIG[activeTool.id];
      const guide = getToolGuide(activeTool.id, activeTool.name, activeTool.categoryLabel);

      pageTitle = seoData ? seoData.seoTitle : `${activeTool.name} | PIXAL LAB`;
      pageDesc = seoData ? seoData.metaDescription : `${activeTool.description} Free, browser-based tool with zero server uploads.`;
      canonicalUrl = `${DOMAIN}/tool/${activeTool.id}`;

      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: `${activeTool.name} — PIXAL LAB`,
          applicationCategory: 'DesignApplication',
          operatingSystem: 'All',
          browserRequirements: 'Requires modern browser with HTML5 Canvas support',
          description: seoData ? seoData.introParagraph : activeTool.description,
          url: canonicalUrl,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: activeTool.features.join(', '),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${DOMAIN}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'All Tools',
              item: `${DOMAIN}/all-tools`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: activeTool.name,
              item: canonicalUrl,
            },
          ],
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
    } else if (currentView === 'guide') {
      const activeGuide = EDUCATIONAL_GUIDES.find((g) => g.slug === selectedGuideSlug) || EDUCATIONAL_GUIDES[0];
      pageTitle = activeGuide.seoTitle;
      pageDesc = activeGuide.metaDescription;
      canonicalUrl = `${DOMAIN}/guide/${activeGuide.slug}`;

      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: activeGuide.h1,
          description: activeGuide.summary,
          step: activeGuide.steps.map((s) => ({
            '@type': 'HowToStep',
            position: s.number,
            name: s.title,
            text: s.description,
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${DOMAIN}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Guides',
              item: `${DOMAIN}/guides`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: activeGuide.title,
              item: canonicalUrl,
            },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: activeGuide.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ];
    } else if (currentView === 'guides') {
      pageTitle = 'Free Image Guides & How-To Tutorials | PIXAL LAB';
      pageDesc = 'Learn how to resize images, make YouTube thumbnails, create transparent digital signatures, split Instagram grids, and prepare WhatsApp DPs.';
      canonicalUrl = `${DOMAIN}/guides`;

      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${DOMAIN}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Guides',
              item: canonicalUrl,
            },
          ],
        },
      ];
    } else if (currentView === 'home') {
      pageTitle = 'PIXAL LAB — Free Online Image Tools | Every Image. More Possibilities.';
      pageDesc =
        'Use free online image tools with PIXAL LAB. Resize, compress, crop, convert, edit, and enhance images using simple browser-based tools with zero server uploads.';
      canonicalUrl = `${DOMAIN}/`;

      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'PIXAL LAB',
          url: `${DOMAIN}/`,
          description: pageDesc,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${DOMAIN}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
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
      pageTitle = `All ${TOOLS.length} Free Image Tools — Online Editor Suite | PIXAL LAB`;
      pageDesc = `Explore all ${TOOLS.length} high-performance image manipulation utilities in PIXAL LAB. Compress, resize, crop, filter, convert, and create with zero server uploads.`;
      canonicalUrl = `${DOMAIN}/all-tools`;
    } else if (currentView === 'about') {
      pageTitle = 'About PIXAL LAB — 100% In-Browser Image Studio';
      pageDesc =
        'Learn how PIXAL LAB delivers free, secure client-side image processing tools without subscriptions or invasive data tracking.';
      canonicalUrl = `${DOMAIN}/about`;
    } else if (currentView === 'privacy') {
      pageTitle = 'Privacy Policy & Cookie Policy | PIXAL LAB';
      pageDesc =
        'Read our transparent privacy policy. PIXAL LAB runs 100% in your browser with zero image uploads, zero remote storage, and standard Google Analytics disclosure.';
      canonicalUrl = `${DOMAIN}/privacy`;
    } else if (currentView === 'terms') {
      pageTitle = 'Terms of Service | PIXAL LAB';
      pageDesc = 'Terms of Service and usage conditions for PIXAL LAB client-side image processing utilities.';
      canonicalUrl = `${DOMAIN}/terms`;
    } else if (currentView === 'contact') {
      pageTitle = 'Contact & Support | PIXAL LAB';
      pageDesc =
        'Get in touch with the PIXAL LAB engineering and support team for feedback, feature requests, or questions.';
      canonicalUrl = `${DOMAIN}/contact`;
    } else if (currentView === 'games') {
      pageTitle = 'Games & Fun — Free Online Brain & Visual Puzzles | PIXAL LAB';
      pageDesc =
        'Play 8 free online games on PIXAL LAB Games & Fun. Enjoy Sliding Picture Puzzle, Sudoku, Memory Match, 2048, Tic-Tac-Toe, Spot the Difference, Word Search, and Jigsaw Puzzle.';
      canonicalUrl = `${DOMAIN}/games`;
      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'PIXAL LAB — Games & Fun Hub',
          url: canonicalUrl,
          description: pageDesc,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${DOMAIN}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Games & Fun',
              item: canonicalUrl,
            },
          ],
        },
      ];
    } else if (currentView === 'game' || currentView === 'puzzle') {
      const activeGame =
        GAMES_CATALOG.find((g) => g.slug === selectedGameSlug) || GAMES_CATALOG[0];
      pageTitle = activeGame.seoTitle;
      pageDesc = activeGame.seoDescription;
      canonicalUrl = `${DOMAIN}/games/${activeGame.slug}`;
      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: `${activeGame.title} — PIXAL LAB`,
          description: activeGame.shortDescription,
          gamePlatform: 'Web Browser',
          applicationCategory: 'Game',
          operatingSystem: 'All',
          url: canonicalUrl,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${DOMAIN}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Games & Fun',
              item: `${DOMAIN}/games`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: activeGame.title,
              item: canonicalUrl,
            },
          ],
        },
      ];
    } else if (currentView === 'study-material') {
      pageTitle = 'Free Study Material & Academic Reference Library | PIXAL LAB';
      pageDesc =
        'Download free open-access academic reference notes, algorithms, and illustrated formula sheets across Computer Science, AI, Physics, Mathematics, Chemistry, Biology, and Logic.';
      canonicalUrl = `${DOMAIN}/study-material`;
      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'PIXAL LAB — Free Study Material Library',
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'All',
          url: canonicalUrl,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${DOMAIN}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Free Study Material',
              item: canonicalUrl,
            },
          ],
        },
      ];
    }

    // 1. Update document title
    document.title = pageTitle;

    // 2. Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', pageDesc);
    }

    // 3. Update OpenGraph & Twitter tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', pageTitle);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', pageDesc);

    // 4. Update canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    }

    // 5. Inject Dynamic JSON-LD Schema (free of fabricated ratings)
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
        page_location: canonicalUrl,
        page_path: window.location.pathname,
        send_to: 'G-ZBTVJ487QP',
      });
    }
  }, [currentView, selectedToolId, selectedGuideSlug, selectedGameSlug]);

  const navigateTo = (view: string, toolId?: string, guideSlug?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let cleanPath = '/';
    if (view === 'tool' && toolId) {
      setSelectedToolId(toolId);
      setCurrentView('tool');
      cleanPath = `/tool/${toolId}`;
    } else if (view === 'guide' && guideSlug) {
      setSelectedGuideSlug(guideSlug);
      setCurrentView('guide');
      cleanPath = `/guide/${guideSlug}`;
    } else if (view === 'games' || view === 'image-games') {
      setCurrentView('games');
      cleanPath = '/games';
    } else if (view === 'game' && toolId) {
      setSelectedGameSlug(toolId);
      setCurrentView('game');
      cleanPath = `/games/${toolId}`;
    } else if (view === 'puzzle' || view === 'picture-puzzle') {
      setSelectedGameSlug('sliding-picture-puzzle');
      setCurrentView('game');
      cleanPath = '/games/sliding-picture-puzzle';
    } else if (view === 'study-material' || view === 'study' || view === 'study-materials') {
      setCurrentView('study-material');
      cleanPath = '/study-material';
    } else if (view === 'all-tools' || view === 'tools') {
      setCurrentView('all-tools');
      cleanPath = '/all-tools';
    } else if (view === 'home') {
      setCurrentView('home');
      cleanPath = '/';
    } else {
      setCurrentView(view);
      cleanPath = `/${view}`;
    }

    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', cleanPath);
    } else {
      window.location.hash = `#${cleanPath}`;
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
      className={`min-h-screen flex flex-col w-full max-w-full overflow-x-hidden transition-colors duration-250 ${
        theme === 'dark'
          ? 'liquid-bg-dark text-[#F5F5F7]'
          : 'liquid-bg-light text-[#1D1D1F]'
      }`}
    >
      {/* Floating Apple Liquid Dynamic Island Header */}
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
              onSelectTool={(id) => {
                if (id === 'puzzle' || id === 'games') {
                  navigateTo('games');
                } else if (id === 'study-material') {
                  navigateTo('study-material');
                } else {
                  navigateTo('tool', id);
                }
              }}
              onSearchQueryChange={(q) => setSearchQuery(q)}
            />

            {/* Tools Gallery Anchor Section */}
            <section id="tools-gallery" className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-8 sm:pt-6 sm:pb-10">
              <div className="relative z-10 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 mb-1 tracking-wide uppercase">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Tool Explorer</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Explore {TOOLS.length} Pro Image Utilities
                  </h2>
                  <p className="text-xs sm:text-sm mt-1 max-w-xl text-[#6E6E73] dark:text-[#86868B]">
                    High-performance client-side photo utilities. Compress, resize, crop, convert, and craft with zero server uploads.
                  </p>
                </div>
              </div>

              {/* Category Segmented Filter Tabs */}
              <div className="relative z-10 mb-4 sm:mb-6 w-full max-w-full min-w-0">
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
            <section className="border-t border-black/5 dark:border-white/10 py-8 sm:py-12 relative overflow-hidden">
              <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1D1D1F] dark:text-[#F5F5F7] mb-2">
                    Why Creators Choose PIXAL LAB
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#86868B]">
                    Engineered with modern Web APIs for maximum privacy, zero bandwidth limits, and instant exports.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-panel rounded-3xl p-6 space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                      01
                    </div>
                    <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Zero Server Uploads
                    </h3>
                    <p className="text-xs leading-relaxed text-[#6E6E73] dark:text-[#86868B]">
                      Your images are processed directly in your browser with HTML5 Canvas. We never transmit, store, or view your photos.
                    </p>
                  </div>

                  <div className="glass-panel rounded-3xl p-6 space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                      02
                    </div>
                    <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Unlimited & Free Forever
                    </h3>
                    <p className="text-xs leading-relaxed text-[#6E6E73] dark:text-[#86868B]">
                      Convert and edit as many images as you need with no subscriptions, credits, signups, or artificial rate limits.
                    </p>
                  </div>

                  <div className="glass-panel rounded-3xl p-6 space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                      03
                    </div>
                    <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {TOOLS.length} Pro Browser Utilities
                    </h3>
                    <p className="text-xs leading-relaxed text-[#6E6E73] dark:text-[#86868B]">
                      Everything from intelligent compression and resizing to Pakistan CNIC passport photos, group collages, EXIF cleaning, and PDF conversions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* HOMEPAGE FREQUENTLY ASKED QUESTIONS SECTION (AdSense & High-Value Content) */}
            <section className="py-8 sm:py-12 border-t border-black/5 dark:border-white/10">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 mb-3">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Common Questions</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1D1D1F] dark:text-[#F5F5F7] mb-2">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs sm:text-sm max-w-xl mx-auto text-[#6E6E73] dark:text-[#86868B]">
                    Everything you need to know about our in-browser image suite, data privacy guarantees, and free tools.
                  </p>
                </div>

                <div className="space-y-3">
                  {HOMEPAGE_FAQS.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="glass-panel rounded-2xl overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                        >
                          <span className="text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                            {faq.question}
                          </span>
                          <span className="text-[#6E6E73] dark:text-[#86868B] shrink-0">
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-indigo-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 text-xs sm:text-sm leading-relaxed border-t border-black/5 dark:border-white/10 text-[#6E6E73] dark:text-[#86868B] pt-3">
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
                Browse every utility in the PIXAL LAB platform. Click any tool to open its dedicated workspace.
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

        {/* VIEW 9: GUIDES DIRECTORY */}
        {currentView === 'guides' && (
          <GuidesIndexPage
            onNavigate={navigateTo}
            onSelectGuide={(slug) => navigateTo('guide', undefined, slug)}
          />
        )}

        {/* VIEW 10: INDIVIDUAL EDUCATIONAL GUIDE */}
        {currentView === 'guide' && (
          <GuideDetailPage
            guide={EDUCATIONAL_GUIDES.find((g) => g.slug === selectedGuideSlug) || EDUCATIONAL_GUIDES[0]}
            onNavigate={navigateTo}
          />
        )}

        {/* VIEW 11: SECTION 2 — GAMES & FUN DIRECTORY */}
        {currentView === 'games' && (
          <GamesDirectoryPage
            onSelectGame={(slug) => navigateTo('game', slug)}
            onExploreTools={() => navigateTo('all-tools')}
          />
        )}

        {/* VIEW 12: INDIVIDUAL PLAYABLE GAME PAGE */}
        {(currentView === 'game' || currentView === 'puzzle') && (
          <IndividualGamePage
            gameSlug={selectedGameSlug}
            onNavigate={navigateTo}
          />
        )}

        {/* VIEW 12: SECTION 3 — FREE STUDY MATERIAL */}
        {currentView === 'study-material' && (
          <StudyMaterialPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Floating Top-Right 5-Star Rating Widget */}
      <RatingWidget
        isOpen={ratingWidget.isOpen}
        toolId={ratingWidget.toolId}
        toolName={ratingWidget.toolName}
        onClose={() => setRatingWidget((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Bottom Picture Puzzle Promotional Banner */}
      <PuzzleBanner
        currentView={currentView}
        onPlayNow={() => navigateTo('puzzle')}
      />

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}


