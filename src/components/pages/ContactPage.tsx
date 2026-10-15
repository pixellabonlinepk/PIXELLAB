import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ContactPage: React.FC = () => {
  const { theme } = useTheme();
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
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-cyan-300'
              : 'bg-white border-slate-200 text-cyan-700 shadow-xs'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Support & Feedback</span>
        </div>
        <h1
          className={`text-3xl font-extrabold font-display mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Get in Touch with Pixal Lab
        </h1>
        <p
          className={`text-xs sm:text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Have an idea for a new image tool? Found a bug? Send us a note or email us directly at{' '}
          <a
            href="mailto:pixellab.online.pk@gmail.com"
            className="text-cyan-500 hover:underline font-semibold"
          >
            pixellab.online.pk@gmail.com
          </a>
        </p>
      </div>

      <div
        className={`max-w-xl mx-auto border rounded-2xl p-6 sm:p-8 shadow-xl transition-colors ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}
      >
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3
              className={`text-base font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Message Received!
            </h3>
            <p
              className={`text-xs max-w-sm mx-auto ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Thank you for reaching out to the Pixal Lab team. We appreciate your feedback and suggestions!
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`text-xs font-semibold block mb-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label
                className={`text-xs font-semibold block mb-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com (optional)"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label
                className={`text-xs font-semibold block mb-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Message or Feature Request
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what tool you'd like to see added or report an issue..."
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
