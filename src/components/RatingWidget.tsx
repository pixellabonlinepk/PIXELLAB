import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle2, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface RatingWidgetProps {
  isOpen: boolean;
  toolId?: string;
  toolName?: string;
  onClose: () => void;
  onSubmitSuccess?: (rating: number, toolId?: string) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Outstanding!',
};

export const RatingWidget: React.FC<RatingWidgetProps> = ({
  isOpen,
  toolId,
  toolName,
  onClose,
  onSubmitSuccess,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Reset or load existing tool rating when opened
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setSelectedRating(0);
      setHoveredRating(0);

      // Check if user already rated this specific tool
      if (toolId) {
        try {
          const allRatings = JSON.parse(localStorage.getItem('pixellab_tool_ratings') || '{}');
          if (allRatings[toolId]?.rating) {
            setSelectedRating(allRatings[toolId].rating);
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  }, [isOpen, toolId]);

  if (!isOpen) return null;

  const activeRating = hoveredRating || selectedRating;

  const handleSelectStar = (star: number) => {
    setSelectedRating(star);
  };

  const handleDismiss = () => {
    // Save dismissal timestamp so it doesn't immediately prompt again
    try {
      localStorage.setItem('pixellab_rating_dismissed', new Date().toISOString());
    } catch {
      // storage unavailable
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating === 0) return;

    try {
      // Retrieve existing tool ratings map
      const existing = JSON.parse(localStorage.getItem('pixellab_tool_ratings') || '{}');
      const targetId = toolId || 'general';

      existing[targetId] = {
        toolId: targetId,
        toolName: toolName || 'Pixal Lab Tool',
        rating: selectedRating,
        timestamp: new Date().toISOString(),
        storageType: 'local-only',
      };

      // Persist in localStorage
      localStorage.setItem('pixellab_tool_ratings', JSON.stringify(existing));
      localStorage.setItem('pixellab_rating_dismissed', new Date().toISOString());
    } catch {
      // storage unavailable
    }

    setIsSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(selectedRating, toolId);
    }

    // Auto-close after user sees brief thank-you message
    setTimeout(() => {
      onClose();
    }, 2400);
  };

  const { theme } = useTheme();

  return (
    <aside
      aria-label="Rate your experience"
      className={`fixed top-24 sm:top-28 right-3 sm:right-6 z-40 w-[calc(100vw-24px)] max-w-xs sm:w-80 border rounded-2xl p-4 backdrop-blur-xl animate-in slide-in-from-top-3 fade-in duration-200 transition-colors ${
        theme === 'dark'
          ? 'bg-[#0b1022]/95 border-indigo-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(99,102,241,0.15)] text-white'
          : 'bg-white/95 border-slate-200 shadow-xl shadow-slate-300/60 text-slate-900'
      }`}
    >
      {/* Top ambient color bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-t-2xl" />

      {isSubmitted ? (
        /* THANK YOU VIEW */
        <div className="py-2 flex flex-col items-center text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div
              className={`text-xs font-bold font-display ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              Thank you for rating!
            </div>
            <div
              className={`text-[11px] mt-0.5 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Saved <span className="text-amber-500 font-semibold">{selectedRating} stars</span> for your experience.
            </div>
          </div>
          <div
            className={`text-[10px] flex items-center gap-1 ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <Shield className="w-3 h-3 text-cyan-500 shrink-0" />
            <span>Stored locally on this device</span>
          </div>
        </div>
      ) : (
        /* COMPACT RATING FORM */
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Header Row: Title and Close button */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-left">
              <h4
                className={`text-xs font-bold font-display flex items-center gap-1.5 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>Rate Your Experience</span>
              </h4>
              <p
                className={`text-[10px] ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {toolName ? `Using ${toolName}` : 'How is Pixal Lab working for you?'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close rating widget"
              className={`p-1 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 5 Clickable Stars Row */}
          <div>
            <div
              className="flex items-center justify-between px-1"
              onMouseLeave={() => setHoveredRating(0)}
              role="radiogroup"
              aria-label="5 Star Rating"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isHighlighted = star <= activeRating;
                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={selectedRating === star}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    onClick={() => handleSelectStar(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onFocus={() => setHoveredRating(star)}
                    onBlur={() => setHoveredRating(0)}
                    className="p-1 rounded-md transition-transform hover:scale-125 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors duration-150 ${
                        isHighlighted
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                          : theme === 'dark'
                          ? 'text-slate-600 fill-transparent hover:text-slate-400'
                          : 'text-slate-300 fill-transparent hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Dynamic label */}
            <div className="h-4 mt-1 text-center">
              {activeRating > 0 ? (
                <span
                  className={`text-[11px] font-semibold font-display ${
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                  }`}
                >
                  {activeRating} {activeRating === 1 ? 'Star' : 'Stars'} · {RATING_LABELS[activeRating]}
                </span>
              ) : (
                <span
                  className={`text-[10px] ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  Select 1 to 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={selectedRating === 0}
              className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
            >
              Submit Rating
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className={`px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Later
            </button>
          </div>
        </form>
      )}
    </aside>
  );
};
