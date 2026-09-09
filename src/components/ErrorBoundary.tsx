import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  resetButtonText?: string;
  onReset?: () => void;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary caught render error]:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      const title = this.props.fallbackTitle || 'Something went wrong, try again';
      const message =
        this.props.fallbackMessage ||
        (this.state.error?.message
          ? `An unexpected render error occurred: ${this.state.error.message}`
          : 'A component encountered an unexpected error while rendering.');
      const resetText = this.props.resetButtonText || 'Return to Dashboard';

      return (
        <div
          id="error-boundary-fallback"
          className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-rose-200 dark:border-rose-900/40 shadow-xl text-center max-w-lg mx-auto my-8 ${
            this.props.className || ''
          }`}
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              id="btn-error-boundary-reset"
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{resetText}</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
