import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 glass-panel text-indigo-500">
          <MessageSquare className="w-4 h-4" />
          <span>Support & Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display mb-3 text-[#1D1D1F] dark:text-[#F5F5F7]">
          Get in Touch with Pixal Lab
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#86868B]">
          Have an idea for a photo tool? Found a bug? Contact us directly at{' '}
          <a
            href="mailto:pixellab.online.pk@gmail.com"
            className="text-indigo-500 hover:underline font-semibold"
          >
            pixellab.online.pk@gmail.com
          </a>
        </p>
      </div>

      <div className="max-w-xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Message Received!
            </h3>
            <p className="text-xs max-w-sm mx-auto text-[#6E6E73] dark:text-[#86868B]">
              Thank you for reaching out to the Pixal Lab team. We appreciate your feedback and suggestions!
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1 text-[#1D1D1F] dark:text-[#F5F5F7]">
                Your Name
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
                Email Address
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
                Message or Suggestion
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your feedback, new tool request, or bug report..."
                className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#86868B] focus:ring-2 focus:ring-indigo-500/30 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
