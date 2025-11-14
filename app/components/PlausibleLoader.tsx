"use client";

import Script from "next/script";
import React, { useEffect, useState } from "react";

/**
 * Client-side loader for Plausible that respects user consent.
 * - Reads NEXT_PUBLIC_PLAUSIBLE and NEXT_PUBLIC_PLAUSIBLE_JS_URL at build time
 * - Reads `analytics_consent` from localStorage at runtime
 */
export function PlausibleLoaderContent(enabled: boolean, consent: boolean | null) {
  const plausibleJsUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_JS_URL || "https://plausible.io/js/pa-h9uphsLdTwdLeCKe911Cm.js";

  if (!enabled) return null;
  if (consent === null) return null;
  if (!consent) return null;

  return (
    <>
      <Script src={plausibleJsUrl} strategy="afterInteractive" />
      <Script src="/plausible-init.js" strategy="afterInteractive" />
    </>
  );
}

export default function PlausibleLoader() {
  // Defer reading `localStorage` until after mount to avoid hydration
  // differences between server and client. Start as `null` and update
  // via effect/listeners.
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        const v = window.localStorage.getItem("analytics_consent");
        setConsent(v === "1");
      } catch {
        setConsent(false);
      }
    };

    // Initial read
    read();

    // Listen for consent changes (same-tab via custom event, cross-tab via storage event)
    const onChange = () => read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "analytics_consent") read();
    };

    window.addEventListener("analytics-consent-changed", onChange as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("analytics-consent-changed", onChange as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const enabled =
    process.env.NEXT_PUBLIC_PLAUSIBLE === "1" || process.env.NEXT_PUBLIC_PLAUSIBLE === "true";

  return PlausibleLoaderContent(enabled, consent);
}
