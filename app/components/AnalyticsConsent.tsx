"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/app/utils/analytics";

export default function AnalyticsConsent() {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const v = window.localStorage.getItem('analytics_consent');
      return v === null;
    } catch {
      return false;
    }
  });

  const [highlight, setHighlight] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return !prefersReduced;
    } catch {
      return false;
    }
  });

  // Gentle attention animation: clear the highlight after a short period
  useEffect(() => {
    if (!highlight) return;
    const t = setTimeout(() => setHighlight(false), 6000);
    return () => clearTimeout(t);
  }, [highlight]);

  if (!visible) return null;

  const allow = () => {
    try {
      window.localStorage.setItem("analytics_consent", "1");
      // Notify other components in the same window to update
      try { window.dispatchEvent(new Event("analytics-consent-changed")); } catch {}
    } catch {}
    setVisible(false);
    try {
      track("Consent Granted");
    } catch {}
  };

  const deny = () => {
    try {
      window.localStorage.setItem("analytics_consent", "0");
      // Notify other components in the same window to update
      try { window.dispatchEvent(new Event("analytics-consent-changed")); } catch {}
    } catch {}
    setVisible(false);
    try { track("Consent Revoked"); } catch {}
  };


  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      aria-live="polite"
      aria-describedby="analytics-consent-desc"
      className="fixed inset-x-3 bottom-3 z-50 sm:bottom-6 flex justify-center"
    >
      <div className="flex items-center gap-2 sm:gap-3 bg-white/94 text-black dark:bg-black/94 dark:text-white border border-black/10 dark:border-white/10 shadow-sm rounded-full px-2.5 py-1 sm:px-4 sm:py-2 backdrop-blur-md whitespace-nowrap">
        <span className="sr-only">Analytics consent</span>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-sky-600 dark:bg-sky-400 flex-none" aria-hidden />
          <div id="analytics-consent-desc" className={`font-medium tracking-tight min-w-0 ${highlight ? 'animate-pulse' : ''}`}>
            <span className="text-sm sm:hidden truncate">Allow anonymous metrics?</span>
            <span className="hidden sm:inline text-sm">Help improve Simple Toolkit — send anonymous, non-identifying usage metrics</span>
          </div>
        </div>
        <Link href="/privacy" className="ml-2 hidden sm:inline text-xs underline underline-offset-2 text-black/70 dark:text-white/70">Details</Link>
        <div className="flex gap-2 ml-2">
          <button
            onClick={deny}
            aria-label="Decline analytics"
            className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm bg-transparent border border-black/10 dark:border-white/15 text-black/80 dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/50 dark:focus-visible:ring-white/50 flex-shrink-0"
          >
            No
          </button>
          <button
            onClick={allow}
            aria-label="Allow analytics"
            className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/80 dark:focus-visible:ring-white/80 shadow-sm flex-shrink-0"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
