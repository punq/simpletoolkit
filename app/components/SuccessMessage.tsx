"use client";

import { useEffect, useCallback, memo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { track } from '@/app/utils/analytics';

interface SuccessMessageProps {
  /** The success message to display */
  message: string;
  /** Callback when message is dismissed */
  onClose?: () => void;
  /** Duration in ms before auto-hiding. Set to 0 to disable. */
  autoHideDuration?: number;
  /** Optional base tracking event name for analytics */
  trackingEvent?: string;
  /** Optional unique operation id to dedupe counting across remounts */
  operationId?: string;
  /** Optional explicit tool name (otherwise inferred from path) */
  tool?: string;
  /** Optional threshold for stronger donation CTA */
  escalationThreshold?: number;
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
  autoHideDuration = 0, // default: persist until dismissed
  trackingEvent,
  operationId,
  tool,
  escalationThreshold,
}: SuccessMessageProps) {
  // Sanitize inputs
  const sanitizedDuration = Math.min(Math.max(0, autoHideDuration), MAX_DURATION);
  const sanitizedMessage = message?.slice(0, 200) || 'Operation completed successfully';
  const pathname = usePathname();

  const [operationsCount, setOperationsCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Determine tool name from prop or path (e.g., /tools/merge)
  const currentTool = tool || (() => {
    if (!pathname) return 'tool';
    const parts = pathname.split('/').filter(Boolean);
    const idx = parts.findIndex(p => p === 'tools');
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    return parts[parts.length - 1] || 'tool';
  })();

  // Constant should be declared before any use for lint correctness
  const DONATION_ESCALATION_THRESHOLD = 3;

  // Increment & load operations count from localStorage (with dedupe via operationId)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seenKey = 'spt_ops_seen_ids';
      const seenRaw = window.sessionStorage.getItem(seenKey) || '[]';
      let seen: string[] = [];
      try { seen = JSON.parse(seenRaw); } catch { seen = []; }

      const opId = operationId || `${currentTool}-default`;
      const alreadyCounted = operationId ? seen.includes(opId) : false;

      const totalKey = 'spt_ops_total';
      const totalPrev = parseInt(window.localStorage.getItem(totalKey) || '0', 10) || 0;
      const toolKey = `spt_ops_by_tool:${currentTool}`;
      const toolPrev = parseInt(window.localStorage.getItem(toolKey) || '0', 10) || 0;

      let totalNext = totalPrev;
      let toolNext = toolPrev;
      if (!alreadyCounted) {
        totalNext = totalPrev + 1;
        toolNext = toolPrev + 1;
        window.localStorage.setItem(totalKey, String(totalNext));
        window.localStorage.setItem(toolKey, String(toolNext));
        if (operationId) {
          const updated = Array.from(new Set([...seen, opId])).slice(-100);
          window.sessionStorage.setItem(seenKey, JSON.stringify(updated));
        }
        track('Operation Count Incremented', { total: totalNext, tool: currentTool, toolCount: toolNext });
        if (trackingEvent) {
          track(trackingEvent + ' Shown', { tool: currentTool });
        }
      }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setOperationsCount(totalNext);

      const thresholdLocal = typeof escalationThreshold === 'number' ? Math.max(1, escalationThreshold) : DONATION_ESCALATION_THRESHOLD;
      if (totalNext === thresholdLocal) {
        track('Donation Escalated', { threshold: thresholdLocal });
      }
    } catch {
      // Ignore storage errors
    }
  }, [trackingEvent, currentTool, operationId, escalationThreshold]);

  // Track donation clicks
  const handleDonateClick = useCallback(() => {
    track('Donate Click', { source: 'success_message', tool: currentTool });
  }, [currentTool]);

  const handleShareCopy = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const shareText = `Try this privacy-first PDF ${currentTool} tool on Simple PDF Toolkit: ${url}`;
    try {
      // Prefer native share when available
      if ('share' in navigator && typeof (navigator as unknown as { share?: unknown }).share === 'function') {
        await (navigator as unknown as { share: (data: { title?: string; text?: string; url?: string }) => Promise<void> }).share({ title: `PDF ${currentTool} — Simple PDF Toolkit`, text: shareText, url });
        track('Share Web', { tool: currentTool });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      track('Share Copy', { tool: currentTool });
    } catch {
      // fallback: create a temporary input
      try {
        const el = document.createElement('textarea');
        el.value = shareText;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        track('Share Copy Fallback', { tool: currentTool });
      } catch {
        track('Share Copy Failed', { tool: currentTool });
      }
    }
  }, [currentTool]);

  const handleTwitterShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const text = `Privacy-first PDF ${currentTool} done in my browser via Simple PDF Toolkit.`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    track('Share Twitter', { tool: currentTool });
  }, [currentTool]);

  // Cross-link suggestions to other tools
  const toolLinks: { name: string; slug: string; prompt: string }[] = [
    { name: 'Split PDFs', slug: 'split', prompt: 'Need to split next?' },
    { name: 'Compress PDFs', slug: 'compress', prompt: 'Need to compress?' },
    { name: 'Rearrange Pages', slug: 'rearrange', prompt: 'Need to rearrange?' },
    { name: 'Merge PDFs', slug: 'merge', prompt: 'Need to merge?' },
  ];
  const suggestions = toolLinks.filter(t => t.slug !== currentTool).slice(0, 2);

  const handleCrossLinkClick = (slug: string) => {
    track('Cross Tool Click', { from: currentTool, to: slug });
  };

  const threshold = typeof escalationThreshold === 'number' ? Math.max(1, escalationThreshold) : DONATION_ESCALATION_THRESHOLD;
  const escalated = operationsCount >= threshold;

  // Adaptive reading-time auto hide (only if duration > 0 or explicitly provided)
  const adaptiveDuration = (() => {
    if (sanitizedDuration === 0) return 0; // persist mode
    // If caller passed explicit duration, respect it; else compute reading time
    if (autoHideDuration && autoHideDuration > 0) return sanitizedDuration;
    const words = sanitizedMessage.split(/\s+/).filter(Boolean).length;
    // reading time @ ~220 wpm plus 3s buffer, capped
    const readingMs = Math.round((words / 220) * 60000) + 3000;
    return Math.min(readingMs, MAX_DURATION);
  })();

  // Handle auto-hide with cleanup (only when adaptiveDuration > 0)
  useEffect(() => {
    let mounted = true;
    
    if (onClose && adaptiveDuration > 0) {
      const timer = setTimeout(() => {
        if (mounted) {
          onClose();
        }
      }, adaptiveDuration);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
  }, [onClose, adaptiveDuration]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Success: ${sanitizedMessage}`}
      className="mt-4 p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border-l-4 border-green-500 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-800/60 max-w-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="shrink-0 h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-300" aria-hidden="true">✓</div>
          <div>
            <h3 className="text-green-800 dark:text-green-200 text-sm sm:text-base font-semibold">Success</h3>
            <p className="text-green-700 dark:text-green-300 text-sm mt-0.5">{sanitizedMessage}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="self-start sm:self-auto rounded-md p-2 text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            aria-label="Dismiss message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
      <div className="mt-3 space-y-2">
        <p className="text-green-800 dark:text-green-200 text-sm">
          {escalated ? (
            <span>
              You&#39;ve completed <strong>{operationsCount}</strong> operations. Amazing! If these tools save you time, consider{' '}
              <Link
                href="/donate"
                onClick={handleDonateClick}
                className="font-medium underline decoration-2 underline-offset-2 hover:text-green-900 dark:hover:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded-sm"
              >
                supporting future development
              </Link>
              .
            </span>
          ) : (
            <span>
              If this tool helped you, please consider{' '}
              <Link
                href="/donate"
                onClick={handleDonateClick}
                className="font-medium underline decoration-2 underline-offset-2 hover:text-green-900 dark:hover:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded-sm"
              >
                making a small donation
              </Link>{' '}
              to help keep these tools free for everyone.
            </span>
          )}
        </p>
        <p className="text-xs text-green-700 dark:text-green-300">You&#39;ve completed {operationsCount} operation{operationsCount === 1 ? '' : 's'}.</p>
        <div className="flex flex-wrap gap-2 mt-1">
          <button
            onClick={handleShareCopy}
            className="text-xs px-3 py-2 rounded-md border border-green-300 dark:border-green-700 bg-white/80 dark:bg-transparent hover:bg-green-50 dark:hover:bg-green-900/30 text-green-800 dark:text-green-200 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            aria-label="Copy share message to clipboard"
          >
            {copied ? 'Copied!' : 'Share this tool'}
          </button>
          <button
            onClick={handleTwitterShare}
            className="text-xs px-3 py-2 rounded-md border border-green-300 dark:border-green-700 bg-white/80 dark:bg-transparent hover:bg-green-50 dark:hover:bg-green-900/30 text-green-800 dark:text-green-200 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            aria-label="Share on Twitter"
          >
            Tweet
          </button>
          {suggestions.map(s => (
            <Link
              key={s.slug}
              href={`/tools/${s.slug}`}
              onClick={() => handleCrossLinkClick(s.slug)}
              className="text-xs px-3 py-2 rounded-md border border-green-300 dark:border-green-700 bg-white/80 dark:bg-transparent hover:bg-green-50 dark:hover:bg-green-900/30 text-green-800 dark:text-green-200 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label={s.prompt}
            >
              {s.prompt}
            </Link>
          ))}
        </div>
        {adaptiveDuration > 0 && (
          <div className="h-1 w-full bg-green-100 dark:bg-green-900/30 rounded overflow-hidden mt-2" aria-hidden="true">
            <div
              className="h-full bg-green-500 dark:bg-green-400 animate-[progressShrink_linear] origin-left"
              style={{ animationDuration: adaptiveDuration + 'ms' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(SuccessMessage);