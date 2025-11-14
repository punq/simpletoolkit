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
  const [mountedEnter, setMountedEnter] = useState(false);
  const [donatePulseActive, setDonatePulseActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const titleize = (s: string) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

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
    const shareText = `I just used Simple PDF Toolkit — a privacy-first, client-side PDF ${currentTool} tool. Fast, local, and secure. Try it: ${url} #PDF #Privacy #SimplePDFToolkit`;
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
    const text = `I used Simple PDF Toolkit — a privacy-first, client-side PDF ${currentTool} tool. Try it:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=PDF,Privacy,SimplePDFToolkit`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    track('Share Twitter', { tool: currentTool });
  }, [currentTool]);

  const handleLinkedInShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = `Simple PDF Toolkit — privacy-first ${currentTool} tool`;
    const summary = `Fast, client-side PDF ${currentTool} tool. No uploads, no tracking. Try it:`;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    track('Share LinkedIn', { tool: currentTool });
  }, [currentTool]);

  const handleEmailShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const subject = `Try Simple PDF Toolkit — privacy-first ${currentTool} tool`;
    const body = `I used Simple PDF Toolkit's ${currentTool} tool — it runs entirely in your browser (no uploads). Try it here: ${url}`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    track('Share Email', { tool: currentTool });
  }, [currentTool]);

  // Cross-link suggestions to other tools
  const toolLinks: { name: string; slug: string; prompt: string }[] = [
    { name: 'Split PDFs', slug: 'split', prompt: 'Need to split next?' },
    { name: 'Compress PDFs', slug: 'compress', prompt: 'Need to compress?' },
    { name: 'Rearrange Pages', slug: 'rearrange', prompt: 'Need to rearrange?' },
    { name: 'Merge PDFs', slug: 'merge', prompt: 'Need to merge?' },
  ];
  const suggestions = toolLinks.filter(t => t.slug !== currentTool).slice(0, 2);

  // Short message for very small screens to avoid using too much space
  const shortMessage = sanitizedMessage.length > 70 ? sanitizedMessage.slice(0, 67).trim() + '…' : sanitizedMessage;
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

  // Small enter animation trigger + reduced-motion + short donate pulse
  useEffect(() => {
    const t = setTimeout(() => setMountedEnter(true), 10);

    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(Boolean(mq.matches));
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(Boolean(e.matches));
      try { mq.addEventListener('change', handler); } catch { mq.addListener(handler); }

      if (!mq.matches) {
        // short pulse on donate to draw attention initially
        setDonatePulseActive(true);
        const p = setTimeout(() => setDonatePulseActive(false), 3000);
        return () => {
          clearTimeout(t);
          clearTimeout(p);
          try { mq.removeEventListener('change', handler); } catch { mq.removeListener(handler); }
        };
      }

      return () => {
        clearTimeout(t);
        try { mq.removeEventListener('change', handler); } catch { mq.removeListener(handler); }
      };
    }

    return () => clearTimeout(t);
  }, []);

  // (No mobile pill auto-hide anymore; donate will be shown as an icon in the action row)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Success: ${sanitizedMessage}`}
      className={
        `relative mt-4 p-4 sm:p-6 bg-white dark:bg-zinc-900 rounded-xl border-l-4 border-black/10 dark:border-white/10 shadow-sm ring-1 ring-gray-100/60 dark:ring-zinc-800/60 max-w-full transition-transform duration-300 ease-out ` +
        (mountedEnter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1')
      }
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="shrink-0 h-9 w-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white" aria-hidden="true">✓</div>
          <div>
            <h3 className="text-slate-900 dark:text-slate-100 text-sm sm:text-base font-semibold">{titleize(currentTool)} — Done</h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm mt-0.5">{sanitizedMessage}</p>
          </div>
        </div>
        {/* Dismiss button - positioned top-right for better mobile UX */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 sm:top-4 sm:right-4"
            aria-label="Dismiss message"
            title="Dismiss"
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

        {/* Donate pill removed from absolute position; replaced by an icon button in the action row below */}
      </div>
      <div className="mt-3 space-y-2">
        {/* Condensed mobile line - only visible on small screens. Render only when message was truncated to avoid duplicate text nodes */}
        {sanitizedMessage.length > 70 && (
          <p className="text-sm text-slate-700 dark:text-slate-300 sm:hidden">{shortMessage}</p>
        )}

        {/* Full message + donation CTA visible on sm+ */}
        <p className="hidden sm:block text-slate-900 dark:text-slate-100 text-sm">
          {escalated ? (
            <span>
              You&#39;ve completed <strong>{operationsCount}</strong> operations. Amazing! If these tools save you time, consider{' '}
              <Link
                href="/donate"
                onClick={handleDonateClick}
                className="font-medium underline decoration-2 underline-offset-2 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-1 rounded-sm"
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
                className="font-medium underline decoration-2 underline-offset-2 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-1 rounded-sm"
              >
                making a small donation
              </Link>{' '}
              to help keep these tools free for everyone.
            </span>
          )}
        </p>

        {/* Compact operations count for mobile */}
        <p className="text-xs text-slate-600 dark:text-slate-400 sm:hidden">Done · {operationsCount}</p>
        <p className="hidden sm:block text-xs text-slate-600 dark:text-slate-400">You&#39;ve completed {operationsCount} operation{operationsCount === 1 ? '' : 's'}.</p>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex gap-2">
            <button
              onClick={handleShareCopy}
              className="w-10 h-10 flex items-center justify-center rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-slate-100 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              aria-label="Copy share message to clipboard"
              title="Copy link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="sr-only">Copy link</span>
            </button>

            <button
              onClick={handleTwitterShare}
              className="w-10 h-10 flex items-center justify-center rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-slate-100 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              aria-label="Share on Twitter"
              title="Share on Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.07 9.07 0 0 1-2.88 1.1A4.52 4.52 0 0 0 11.1 4.1a12.84 12.84 0 0 1-9.33-4.73 4.48 4.48 0 0 0 1.4 6.03A4.41 4.41 0 0 1 1.64 5.7v.06a4.52 4.52 0 0 0 3.63 4.43 4.5 4.5 0 0 1-2.04.08 4.53 4.53 0 0 0 4.22 3.14A9.07 9.07 0 0 1 1 19.54a12.78 12.78 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84l-.01-.58A9.22 9.22 0 0 0 23 3z" />
              </svg>
              <span className="sr-only">Share on Twitter</span>
            </button>

            <button
              onClick={handleLinkedInShare}
              className="w-10 h-10 flex items-center justify-center rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-slate-100 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              aria-label="Share on LinkedIn"
              title="Share on LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.002 2.5 2.5 0 0 1 0-5.002zM3 9h4v12H3zM9 9h3.8v1.6h.1c.5-.9 1.7-1.8 3.5-1.8 3.8 0 4.5 2.5 4.5 5.8V21H17v-5.2c0-1.3 0-3-1.8-3-1.8 0-2 1.4-2 2.9V21H9V9z" />
              </svg>
              <span className="sr-only">Share on LinkedIn</span>
            </button>

            {/* Donate action (coffee icon) - sits next to other icons */}
            <Link
              href="/donate"
              onClick={handleDonateClick}
              className={
                `w-10 h-10 flex items-center justify-center rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-transparent text-slate-900 dark:text-slate-100 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/40 transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,214,10,0.12)] ring-2 ring-transparent hover:ring-yellow-300/40 ` +
                (donatePulseActive && !prefersReducedMotion ? 'animate-pulse' : '')
              }
              aria-label="Donate — Buy me a coffee"
              title="Donate"
              style={{ boxShadow: '0 6px 18px rgba(255,214,10,0.06)' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
               </svg>
               <span className="sr-only">Donate — Buy me a coffee</span>
             </Link>

            <button
              onClick={handleEmailShare}
              className="w-10 h-10 flex items-center justify-center rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-slate-100 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              aria-label="Share via email"
              title="Share via email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16v16H4z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="sr-only">Share via Email</span>
            </button>
          </div>

          <div className="hidden sm:flex gap-2 flex-wrap">
            {suggestions.map(s => (
              <Link
                key={s.slug}
                href={`/tools/${s.slug}`}
                onClick={() => handleCrossLinkClick(s.slug)}
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-md border border-slate-200 dark:border-zinc-700 bg-white/90 dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-slate-100 shadow-sm active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                aria-label={s.prompt}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
                {s.prompt}
              </Link>
            ))}
          </div>
        </div>

        {/* Copy confirmation toast (temporary) */}
        {copied && (
          <div className="absolute right-4 bottom-3 bg-slate-900 text-white text-xs px-3 py-1 rounded-full shadow-md">
            Link copied
          </div>
        )}
        {adaptiveDuration > 0 && (
          <div className="h-1 w-full bg-slate-100 dark:bg-zinc-800 rounded overflow-hidden mt-2" aria-hidden="true">
            <div
              className="h-full bg-black dark:bg-white animate-[progressShrink_linear] origin-left"
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