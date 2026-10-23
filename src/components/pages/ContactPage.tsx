import React, { useState } from 'react';
import { Send, Mail, Copy, Check, MessageSquare, ExternalLink, RefreshCw } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Tool Request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedType, setCopiedType] = useState<'email' | 'message' | null>(null);

  const SUPPORT_EMAIL = 'pixellab.online.pk@gmail.com';

  const generateMailtoUrl = () => {
    const emailSubject = `[Pixal Lab] ${subject} from ${name.trim() || 'User'}`;
    const emailBody = `Hi Pixal Lab Team,\n\n${message}\n\n---\nSender Name: ${name}\nSender Email: ${email || 'Not provided'}\nSent from Pixal Lab (https://pixallab.online)`;
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // Launch genuine mailto client
    const mailtoUrl = generateMailtoUrl();
    window.location.href = mailtoUrl;

    // Show honest feedback status
    setSubmitted(true);
  };

  const copyToClipboard = (text: string, type: 'email' | 'message') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 glass-panel text-indigo-500">
          <MessageSquare className="w-4 h-4" />
          <span>Support & Direct Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display mb-3 text-[#1D1D1F] dark:text-[#F5F5F7]">
          Get in Touch with Pixal Lab
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#86868B] leading-relaxed">
          Have an idea for a new image tool, noticed a bug, or have a suggestion? We process all client-side tools locally and read every creator message directly at{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-indigo-500 hover:underline font-semibold"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>

      <div className="max-w-xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
        {submitted ? (
          <div className="py-4 space-y-5">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Email Draft Prepared
              </h3>
              <p className="text-xs leading-relaxed max-w-md mx-auto text-[#6E6E73] dark:text-[#86868B]">
                Your device's default mail application was triggered with your draft addressed to{' '}
                <span className="font-mono font-semibold text-theme-primary">{SUPPORT_EMAIL}</span>.
              </p>
            </div>

            {/* Practical Fallback Actions */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-3">
              <div className="text-xs font-semibold text-theme-primary">
                Didn't open automatically? Use these options:
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={generateMailtoUrl()}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Email Client</span>
                </a>

                <button
                  type="button"
                  onClick={() => copyToClipboard(SUPPORT_EMAIL, 'email')}
                  className="py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-xs font-semibold text-theme-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'email' ? 'Email Copied!' : 'Copy Email'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(`Subject: [Pixal Lab] ${subject}\n\n${message}\n\nFrom: ${name} (${email})`, 'message')}
                className="w-full py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedType === 'message' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'message' ? 'Message Text Copied!' : 'Copy Message Text to Paste Manually'}</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Compose Another Message</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1 text-[#1D1D1F] dark:text-[#F5F5F7]">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#86868B] focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-[#1D1D1F] dark:text-[#F5F5F7]">
                Your Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#86868B] focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-[#1D1D1F] dark:text-[#F5F5F7]">
                Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
              >
                <option value="Feedback / Tool Request" className="bg-white dark:bg-slate-900 text-black dark:text-white">New Tool Request / Idea</option>
                <option value="Bug Report" className="bg-white dark:bg-slate-900 text-black dark:text-white">Bug Report</option>
                <option value="General Question" className="bg-white dark:bg-slate-900 text-black dark:text-white">General Question</option>
                <option value="Other Inquiries" className="bg-white dark:bg-slate-900 text-black dark:text-white">Other Inquiries</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-[#1D1D1F] dark:text-[#F5F5F7]">
                Message or Suggestion <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your feedback, tool request, or bug report..."
                className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#86868B] focus:ring-2 focus:ring-indigo-500/30 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via Email Client</span>
            </button>
            <p className="text-[11px] text-center text-theme-muted">
              Sends directly to {SUPPORT_EMAIL} with zero middleman servers.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
