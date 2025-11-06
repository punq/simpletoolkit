"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full max-w-xl p-6 border border-red-200 rounded bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-red-700 dark:text-red-500 mb-4">
            The PDF tool encountered an unexpected error. Please refresh the page and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Refresh Page
          </button>
          {this.state.error && (
            <details className="mt-4 text-xs text-red-600 dark:text-red-400">
              <summary className="cursor-pointer">Technical details</summary>
              <pre className="mt-2 overflow-auto p-2 bg-white dark:bg-black rounded">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
