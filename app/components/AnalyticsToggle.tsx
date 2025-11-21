"use client";

import React, { useState } from "react";
import Toast from "./Toast";
import { track } from "@/app/utils/analytics";

export default function AnalyticsToggle() {
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(() => {
    try {
      const v = typeof window !== 'undefined' ? window.localStorage.getItem('analytics_consent') : null;
      if (v === null) return null;
      return v === '1';
    } catch {
      return null;
    }
  });
  const [toast, setToast] = useState<string | null>(null);


  const toggleAnalytics = () => {
    try {
      const next = !(analyticsConsent === true);
      window.localStorage.setItem('analytics_consent', next ? '1' : '0');
      window.dispatchEvent(new Event('analytics-consent-changed'));
      setAnalyticsConsent(next);
      try {
        if (next) track('Consent Granted');
        else track('Consent Revoked');
      } catch {}
      setToast(next ? 'Analytics enabled' : 'Analytics disabled');
    } catch {}
  };

  return (
    <>
      <div className="mt-4">
        <button
          type="button"
          onClick={toggleAnalytics}
          aria-pressed={analyticsConsent === true}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-transparent border border-gray-200 dark:border-zinc-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
        >
          <span className="font-medium">
            {analyticsConsent === true ? 'Analytics: On' : analyticsConsent === false ? 'Analytics: Off' : 'Analytics: Off'}
          </span>
        </button>
      </div>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </>
  );
}
