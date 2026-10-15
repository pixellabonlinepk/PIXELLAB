import React from 'react';
import { ShieldCheck, Lock, CheckCircle, ServerOff, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const PrivacyPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border ${
            theme === 'dark'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Client-Side Privacy Policy</span>
        </div>
        <h1
          className={`text-3xl font-extrabold font-display mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Your Images Never Leave Your Device
        </h1>
        <p
          className={`text-xs sm:text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Last updated: October 2026. Pixal Lab guarantees 100% in-browser processing with zero remote file storage.
        </p>
      </div>

      <div
        className={`space-y-8 text-xs sm:text-sm ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}
      >
        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div
            className={`flex items-center gap-2 font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <ServerOff className="w-4 h-4 text-cyan-500" />
            <span>1. Zero Server Uploads</span>
          </div>
          <p
            className={`leading-relaxed text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Unlike traditional online file converters that transmit your files to backend servers, Pixal Lab performs all image manipulation, compression, resizing, filtering, and conversion using client-side HTML5 Canvas, Web Workers, and browser Blobs. No image data is ever transferred to our servers or stored on remote disks.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div
            className={`flex items-center gap-2 font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <EyeOff className="w-4 h-4 text-emerald-500" />
            <span>2. No Facial Recognition or Biometric Harvesting</span>
          </div>
          <p
            className={`leading-relaxed text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Passport resizer and WhatsApp DP maker tools only assist you in positioning geometric cropping frames. We do not extract biometric vectors, analyze facial features, or feed user photos into external training sets.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div
            className={`flex items-center gap-2 font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-indigo-500" />
            <span>3. Temporary Memory Cleanup</span>
          </div>
          <p
            className={`leading-relaxed text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            When you close the browser tab or click &quot;Replace Image&quot;, all temporary image URLs (<code className="font-mono text-cyan-500">URL.createObjectURL</code>) and canvas buffers are immediately garbage collected and cleared from your device memory.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div
            className={`flex items-center gap-2 font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-purple-500" />
            <span>4. No Account Required</span>
          </div>
          <p
            className={`leading-relaxed text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Pixal Lab does not ask for your email, credit card, phone number, or login credentials. All tools are unlocked and freely accessible without an account.
          </p>
        </div>
      </div>
    </div>
  );
};
