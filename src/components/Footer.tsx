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

          {/* Col 2: Popular Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              Popular Tools
            </h4>
            <ul className="space-y-2">
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
                  href="/tool/image-resizer"
                  onClick={(e) => handleLinkClick(e, 'tool', 'image-resizer')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Image Resizer
                </a>
              </li>
              <li>
                <a
                  href="/tool/passport-photo-resizer"
                  onClick={(e) => handleLinkClick(e, 'tool', 'passport-photo-resizer')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Passport & ID Photo
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
                  href="/tool/qr-code-generator"
                  onClick={(e) => handleLinkClick(e, 'tool', 'qr-code-generator')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  QR Code Generator
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: How-To Guides (NEW for SEO & Crawlability) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              Guides & Tutorials
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/guide/how-to-make-a-youtube-thumbnail"
                  onClick={(e) => handleLinkClick(e, 'guide', 'how-to-make-a-youtube-thumbnail')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  YouTube Thumbnail Guide
                </a>
              </li>
              <li>
                <a
                  href="/guide/how-to-resize-an-image-online"
                  onClick={(e) => handleLinkClick(e, 'guide', 'how-to-resize-an-image-online')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Resize Without Distortion
                </a>
              </li>
              <li>
                <a
                  href="/guide/how-to-create-a-transparent-digital-signature"
                  onClick={(e) => handleLinkClick(e, 'guide', 'how-to-create-a-transparent-digital-signature')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Digital Signature Tutorial
                </a>
              </li>
              <li>
                <a
                  href="/guide/how-to-make-a-full-size-whatsapp-dp"
                  onClick={(e) => handleLinkClick(e, 'guide', 'how-to-make-a-full-size-whatsapp-dp')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  No-Crop WhatsApp DP
                </a>
              </li>
              <li>
                <a
                  href="/guide/how-to-split-an-image-for-instagram-grid"
                  onClick={(e) => handleLinkClick(e, 'guide', 'how-to-split-an-image-for-instagram-grid')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Instagram Grid Splitter
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  onClick={(e) => handleLinkClick(e, 'guides')}
                  className="text-indigo-500 hover:text-indigo-400 font-semibold transition-colors block pt-1"
                >
                  View All Guides →
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Tool Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              Explore Suite
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/all-tools"
                  onClick={(e) => handleLinkClick(e, 'all-tools')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  All 26 Image Tools
                </a>
              </li>
              <li>
                <a
                  href="/tool/batch-image-resizer"
                  onClick={(e) => handleLinkClick(e, 'tool', 'batch-image-resizer')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Batch Resizer Studio
                </a>
              </li>
              <li>
                <a
                  href="/tool/photo-collage-dp-maker"
                  onClick={(e) => handleLinkClick(e, 'tool', 'photo-collage-dp-maker')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Photo Collage Maker
                </a>
              </li>
              <li>
                <a
                  href="/tool/image-splitter"
                  onClick={(e) => handleLinkClick(e, 'tool', 'image-splitter')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Image Splitter & Slicer
                </a>
              </li>
              <li>
                <a
                  href="/tool/image-joiner"
                  onClick={(e) => handleLinkClick(e, 'tool', 'image-joiner')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  Image Joiner & Merger
                </a>
              </li>
              <li>
                <a
                  href="/tool/pdf-to-image-converter"
                  onClick={(e) => handleLinkClick(e, 'tool', 'pdf-to-image-converter')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  PDF to Image Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-theme-primary">
              Platform & Trust
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="text-theme-secondary hover:text-theme-primary transition-colors block"
                >
                  About Pixal Lab
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
