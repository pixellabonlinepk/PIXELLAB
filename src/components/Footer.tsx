import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { TOOLS } from '../data/tools';

interface FooterProps {
  onNavigate: (view: string, toolId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 glass-panel bg-theme-footer text-theme-secondary text-xs mt-auto transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.5px] shadow-sm">
                <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
                  <div className="w-3 h-3 rounded-xs bg-indigo-500" />
                </div>
              </div>
              <span className="font-display font-extrabold text-base tracking-tight text-theme-primary">
                PIXAL<span className="text-indigo-500">LAB</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-4 text-theme-secondary">
              Every Image. More Possibilities. All {TOOLS.length} high-performance browser tools for compressing, resizing, editing, and converting images with authentic client-side privacy.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero server uploads · 100% In-Browser</span>
            </div>
          </div>

          {/* Col 2: Popular Power Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              Popular Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('tool', 'image-compressor')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'image-resizer')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Image Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'passport-photo-resizer')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Pakistan CNIC & Passport Photo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'image-to-pdf-converter')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Image to PDF Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'signature-maker')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Digital Signature Maker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'qr-code-generator')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  QR Code Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Clean 5 Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              Tool Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Optimize & Resize
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Convert & PDF Documents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Social, ID & Collage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Edit, Retouch & Watermark
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  QR, Color & Privacy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              Platform & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  About Pixal Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Privacy Policy & Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors text-left"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-center sm:text-left text-theme-muted">
          <div>
            © {new Date().getFullYear()} PIXAL LAB (https://pixallab.online). All rights reserved. Zero-Budget Client-Side Architecture.
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
