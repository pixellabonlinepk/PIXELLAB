import React from 'react';
import { ShieldCheck, Lock, CheckCircle, ServerOff, EyeOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 glass-panel text-emerald-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Client-Side Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display mb-3 text-[#1D1D1F] dark:text-[#F5F5F7]">
          Your Images Never Leave Your Device
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#86868B]">
          Last updated: October 2026. Pixal Lab guarantees 100% in-browser processing with zero remote file storage.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#6E6E73] dark:text-[#86868B]">
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
            <ServerOff className="w-4 h-4 text-cyan-500" />
            <span>1. Zero Server Uploads</span>
          </div>
          <p className="leading-relaxed text-xs">
            Unlike traditional online file converters that transmit your files to backend servers, Pixal Lab performs all image manipulation, compression, resizing, filtering, and conversion using client-side HTML5 Canvas, Web Workers, and browser Blobs. No image data is ever transferred to our servers or stored on remote disks.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
            <EyeOff className="w-4 h-4 text-emerald-500" />
            <span>2. No Facial Recognition or Biometric Harvesting</span>
          </div>
          <p className="leading-relaxed text-xs">
            Passport resizer and WhatsApp DP maker tools only assist you in positioning geometric cropping frames. We do not extract biometric vectors, analyze facial features, or feed user photos into external training sets.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
            <Lock className="w-4 h-4 text-indigo-500" />
            <span>3. Temporary Memory Cleanup</span>
          </div>
          <p className="leading-relaxed text-xs">
            When you close the browser tab or click &quot;Replace Image&quot;, all temporary image URLs (<code className="font-mono text-indigo-500">URL.createObjectURL</code>) and canvas buffers are immediately garbage collected and cleared from your device memory.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
            <CheckCircle className="w-4 h-4 text-purple-500" />
            <span>4. No Account Required</span>
          </div>
          <p className="leading-relaxed text-xs">
            Pixal Lab does not ask for your email, credit card, phone number, or login credentials. All tools are unlocked and freely accessible without an account.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>5. Cookies, Analytics & Google AdSense Compliance</span>
          </div>
          <div className="space-y-2.5 leading-relaxed text-xs">
            <p>
              Pixal Lab uses industry-standard, anonymized analytics via Google Analytics (gtag.js) to understand visitor aggregate traffic trends, browser compatibility, and popular utility usage. No personally identifiable information or image content is ever transmitted to analytics services.
            </p>
            <p>
              To maintain our free tools for users worldwide, we may partner with third-party advertising networks, including Google AdSense. Google and third-party vendors use cookies (such as the DoubleClick cookie) to serve ads based on prior visits to our website and other sites across the internet. Users may opt out of personalized advertising by visiting Google Ads Settings (www.google.com/settings/ads) or through aboutads.info.
            </p>
            <p>
              We also utilize local storage on your browser strictly for preserving your theme preference (Light/Dark) and remembering that you have rated a tool, ensuring a seamless user experience without server-side tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
