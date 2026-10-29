import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PIXAL LAB Error Boundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-12 p-6 sm:p-8 rounded-3xl glass-panel border border-rose-500/30 text-center shadow-xl animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-theme-primary mb-2">
            {this.props.fallbackTitle || 'Something went wrong in this module'}
          </h2>

          <p className="text-xs sm:text-sm text-theme-secondary mb-6 leading-relaxed max-w-md mx-auto">
            An unexpected error occurred while processing this operation. Your original files remain safe and have not been modified.
          </p>

          {this.state.error && (
            <div className="mb-6 p-3 rounded-xl bg-black/5 dark:bg-white/5 text-[11px] font-mono text-theme-muted text-left overflow-x-auto max-h-32 border border-black/5 dark:border-white/10">
              {this.state.error.message || 'Unknown application error'}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Try Again</span>
            </button>

            <button
              type="button"
              onClick={this.handleGoHome}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-panel text-theme-secondary hover:text-theme-primary font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
