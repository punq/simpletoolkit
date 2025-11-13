"use client";

import React, { useEffect, useState } from "react";
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
      className="fixed inset-x-4 bottom-4 z-50 sm:bottom-6 flex justify-center"
    >
      <div className="flex items-center gap-3 bg-white text-black dark:bg-black dark:text-white border border-black/10 dark:border-white/10 shadow-sm rounded-full px-3 py-2 max-h-12">
        <span className="sr-only">Analytics consent</span>
        <div className={`text-sm font-medium ${highlight ? 'animate-pulse' : ''}`}>Help improve Simple Toolkit</div>
        <div className="flex gap-2 ml-2">
          <button
            onClick={deny}
            aria-label="Decline analytics"
            className="px-3 py-1 rounded-md bg-transparent text-sm text-black dark:text-white border border-transparent hover:border-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/80"
          >
            No
          </button>
          <button
            onClick={allow}
            aria-label="Allow analytics"
            className="px-3 py-1 rounded-md bg-black text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/80"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
