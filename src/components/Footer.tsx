import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TOOLS } from '../data/tools';

interface FooterProps {
  onNavigate: (view: string, toolId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

  return (
    <footer
      className={`border-t text-xs mt-auto transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#050811]/95 border-slate-800/80 text-slate-400 backdrop-blur-md'
          : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-slate-950 rounded-[6px] grid grid-cols-2 gap-0.5 p-1">
                  <div className="bg-indigo-500 rounded-xs" />
                  <div className="bg-cyan-400 rounded-xs" />
                  <div className="bg-violet-400 rounded-xs" />
                  <div className="bg-blue-500 rounded-xs" />
                </div>
              </div>
              <span
                className={`font-display font-extrabold text-base tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                PIXAL<span className="text-cyan-500">LAB</span>
              </span>
            </div>
            <p
              className={`text-xs leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Every Image. More Possibilities. Over {TOOLS.length} high-performance browser tools for compressing, resizing, cropping, filtering, and converting images with total privacy.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero server uploads · 100% In-Browser</span>
            </div>
          </div>

          {/* Col 2: Popular Tools */}
          <div>
            <h4
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Popular Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('tool', 'image-compressor')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'image-resizer')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Image Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'image-cropper')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Image Cropper
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'image-filters')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Artistic Filters
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'qr-code-generator')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  QR Code Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Tool Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Compress & Resize
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Edit & Adjust Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Social Media & Collages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  QR Codes & Palettes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  PDF Document Utilities
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Platform & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  About Pixal Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Privacy Policy (Zero Uploads)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-center sm:text-left ${
            theme === 'dark'
              ? 'border-slate-900 text-slate-500'
              : 'border-slate-200 text-slate-500'
          }`}
        >
          <div className="max-w-full break-words">
            © {new Date().getFullYear()} PIXAL LAB. All rights reserved. Built with HTML5 Canvas, Web Audio/Image APIs, and Zero-Budget Architecture.
          </div>
          <div className="flex items-center justify-center gap-1 shrink-0">
            <span>Crafted for creators everywhere with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
