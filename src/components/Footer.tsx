import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { TOOLS } from '../data/tools';

interface FooterProps {
  onNavigate: (view: string, toolId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, view: string, toolId?: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate(view, toolId);
  };

  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 glass-panel bg-theme-footer text-theme-secondary text-xs mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8 sm:mb-10">
          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, 'home')}
              className="inline-flex items-center gap-2 mb-3 group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.5px] shadow-sm">
                <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
                  <div className="w-3 h-3 rounded-xs bg-indigo-500" />
                </div>
              </div>
              <span className="font-display font-extrabold text-base tracking-tight text-theme-primary">
                PIXAL<span className="text-indigo-500">LAB</span>
              </span>
            </a>
            <p className="text-xs leading-relaxed mb-4 text-theme-secondary">
              Every Image. More Possibilities. All {TOOLS.length} high-performance browser tools for compressing, resizing, editing, and converting images with authentic client-side privacy.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero server uploads · 100% In-Browser</span>
            </div>
          </div>

          {/* Col 2: SECTION 1 - IMAGE TOOLS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              1. Image Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/all-tools"
                  onClick={(e) => handleLinkClick(e, 'all-tools')}
                  className="text-indigo-500 hover:text-indigo-400 font-bold transition-colors block"
                >
                  All 26 Image Tools →
                </a>
              </li>
              <li>
                <a
                  href="/tool/image-compressor"
                  onClick={(e) => handleLinkClick(e, 'tool', 'image-compressor')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Image Compressor
                </a>
              </li>
              <li>
                <a
                  href="/tool/passport-photo-resizer"
                  onClick={(e) => handleLinkClick(e, 'tool', 'passport-photo-resizer')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Passport & ID Photo Maker
                </a>
              </li>
              <li>
                <a
                  href="/tool/photo-collage-dp-maker"
                  onClick={(e) => handleLinkClick(e, 'tool', 'photo-collage-dp-maker')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Squad DP Collage Maker
                </a>
              </li>
              <li>
                <a
                  href="/tool/signature-maker"
                  onClick={(e) => handleLinkClick(e, 'tool', 'signature-maker')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Digital Signature Maker
                </a>
              </li>
              <li>
                <a
                  href="/tool/image-to-pdf-converter"
                  onClick={(e) => handleLinkClick(e, 'tool', 'image-to-pdf-converter')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Image to PDF Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: SECTION 2 - GAMES & FUN */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              2. Games & Fun
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/games"
                  onClick={(e) => handleLinkClick(e, 'games')}
                  className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors block"
                >
                  Games & Fun Hub →
                </a>
              </li>
              <li>
                <a
                  href="/games/sliding-picture-puzzle"
                  onClick={(e) => handleLinkClick(e, 'game', 'sliding-picture-puzzle')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  🧩 Sliding Picture Puzzle
                </a>
              </li>
              <li>
                <a
                  href="/games/sudoku"
                  onClick={(e) => handleLinkClick(e, 'game', 'sudoku')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  🔢 Classic Sudoku Master
                </a>
              </li>
              <li>
                <a
                  href="/games/2048"
                  onClick={(e) => handleLinkClick(e, 'game', '2048')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  🥞 2048 Number Merge
                </a>
              </li>
              <li>
                <a
                  href="/games/memory-match"
                  onClick={(e) => handleLinkClick(e, 'game', 'memory-match')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  ✨ Visual Memory Match
                </a>
              </li>
              <li>
                <a
                  href="/games/tic-tac-toe"
                  onClick={(e) => handleLinkClick(e, 'game', 'tic-tac-toe')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  ❌ Tic-Tac-Toe Pro (AI)
                </a>
              </li>
              <li>
                <a
                  href="/games/spot-the-difference"
                  onClick={(e) => handleLinkClick(e, 'game', 'spot-the-difference')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  👁️ Spot the Difference
                </a>
              </li>
              <li>
                <a
                  href="/games/word-search"
                  onClick={(e) => handleLinkClick(e, 'game', 'word-search')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  🔍 Word Search Explorer
                </a>
              </li>
              <li>
                <a
                  href="/games/jigsaw-puzzle"
                  onClick={(e) => handleLinkClick(e, 'game', 'jigsaw-puzzle')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  🖼️ Artistic Jigsaw Puzzle
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: SECTION 3 - FREE STUDY MATERIAL */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              3. Study Material
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/study-material"
                  onClick={(e) => handleLinkClick(e, 'study-material')}
                  className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors block"
                >
                  All 5 Subjects Hub →
                </a>
              </li>
              <li>
                <a
                  href="/study-material/biology"
                  onClick={(e) => handleLinkClick(e, 'study-material', 'biology')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block truncate"
                >
                  🧬 Biology Notes
                </a>
              </li>
              <li>
                <a
                  href="/study-material/physics"
                  onClick={(e) => handleLinkClick(e, 'study-material', 'physics')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block truncate"
                >
                  ⚛️ Physics Notes
                </a>
              </li>
              <li>
                <a
                  href="/study-material/chemistry"
                  onClick={(e) => handleLinkClick(e, 'study-material', 'chemistry')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block truncate"
                >
                  🧪 Chemistry Notes
                </a>
              </li>
              <li>
                <a
                  href="/study-material/computer-science"
                  onClick={(e) => handleLinkClick(e, 'study-material', 'computer-science')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block truncate"
                >
                  💻 Computer Science Notes
                </a>
              </li>
              <li>
                <a
                  href="/study-material/mathematics"
                  onClick={(e) => handleLinkClick(e, 'study-material', 'mathematics')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block truncate"
                >
                  📐 Mathematics Notes
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Platform & Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              Guides & Trust
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/guides"
                  onClick={(e) => handleLinkClick(e, 'guides')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block font-semibold"
                >
                  How-To Guides Directory
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  About PIXAL LAB
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLinkClick(e, 'privacy')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Privacy Policy & Cookies
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick(e, 'terms')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Contact & Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-center sm:text-left text-theme-muted">
          <div>
            © {new Date().getFullYear()} PIXAL LAB (https://www.pixallab.online). All rights reserved. Zero-Budget Client-Side Architecture.
          </div>
          <div className="flex items-center justify-center gap-1 shrink-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for creators worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
