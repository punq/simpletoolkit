"use client";

import React, { useState } from "react";
import Link from "next/link";
import { track } from "@/app/utils/analytics";
import Toast from "./Toast";

export default function Footer() {
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const v = window.localStorage.getItem('analytics_consent');
      return v === '1' ? true : v === '0' ? false : null;
    } catch {
      return false;
    }
  });

  const toggle = () => {
    try {
      const next = !(analyticsConsent === true);
      window.localStorage.setItem("analytics_consent", next ? "1" : "0");
      window.dispatchEvent(new Event("analytics-consent-changed"));
      setAnalyticsConsent(next);
      try {
        if (next) track("Consent Granted");
        else track("Consent Revoked");
      } catch {}
    } catch {}
  };

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  // Wrap toggle so we also show toast
  const toggleWithToast = () => {
    try {
      const next = !(analyticsConsent === true);
      toggle();
      showToast(next ? "Analytics enabled" : "Analytics disabled");
    } catch {
      // ignore
    }
  };

  return (
    <>
      <footer className="w-full mt-6 border-t border-gray-100 dark:border-zinc-900 bg-transparent">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-black dark:text-white">Simple Toolkit</span>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleWithToast}
              aria-pressed={analyticsConsent === true}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-transparent text-gray-700 dark:text-gray-300 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
            >
              <span className="text-sm">Analytics</span>
              <span className="text-xs font-medium text-black dark:text-white">{analyticsConsent === true ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>
      </footer>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </>
  );
}
