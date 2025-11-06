"use client";

import { useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SuccessMessageProps {
  /** The success message to display */
  message: string;
  /** Callback when message is dismissed */
  onClose?: () => void;
  /** Duration in ms before auto-hiding. Set to 0 to disable. */
  autoHideDuration?: number;
  /** Optional tracking event name for analytics */
  trackingEvent?: string;
}

// Maximum allowed duration to prevent potential DoS
const MAX_DURATION = 30000;

/**
 * A reusable success message component with donation CTA
 * Follows accessibility best practices and provides consistent styling
 */
function SuccessMessage({ 
  message, 
  onClose, 
  autoHideDuration = 10000,
  trackingEvent 
}: SuccessMessageProps) {
  // Sanitize inputs
  const sanitizedDuration = Math.min(Math.max(0, autoHideDuration), MAX_DURATION);
  const sanitizedMessage = message?.slice(0, 200) || 'Operation completed successfully';
  const router = useRouter();

  // Track donation clicks
  const handleDonateClick = useCallback(() => {
    try {
      if (typeof window !== "undefined" && trackingEvent) {
        const w = window as any;
        if (typeof w.plausible === "function") {
          w.plausible(trackingEvent, { 
            props: { source: "success_message" } 
          });
        }
      }
    } catch (_err) {
      // Swallow tracking errors - analytics must never break UX
    }
  }, [trackingEvent]);

  // Handle auto-hide with cleanup
  useEffect(() => {
    let mounted = true;
    
    if (onClose && sanitizedDuration > 0) {
      const timer = setTimeout(() => {
        if (mounted) {
          onClose();
        }
      }, sanitizedDuration);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
  }, [onClose, sanitizedDuration]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900 shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-green-800 dark:text-green-200 text-sm font-medium flex items-center gap-2">
          <span aria-hidden="true">✨</span>
          {sanitizedMessage}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 transition-colors"
            aria-label="Dismiss message"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-green-700 dark:text-green-300 text-sm mt-2">
        If this tool helped you, please consider{" "}
        <Link 
          href="/donate" 
          onClick={handleDonateClick}
          className="font-medium underline hover:text-green-900 dark:hover:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded-sm"
          aria-label="Make a donation to support free tools"
        >
          making a small donation
        </Link>
        {" "}to help keep these tools free for everyone.
      </p>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(SuccessMessage);