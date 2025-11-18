"use client";

import Script from "next/script";
import React, { useEffect, useState } from "react";

/**
 * Client-side loader for Plausible that respects user consent.
 * - Reads NEXT_PUBLIC_PLAUSIBLE and NEXT_PUBLIC_PLAUSIBLE_JS_URL at build time
 * - Reads `analytics_consent` from localStorage at runtime
 */
export function PlausibleLoaderContent(enabled: boolean, consent: boolean | null, defaultConsent = false) {
  const plausibleJsUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_JS_URL || "https://plausible.io/js/pa-h9uphsLdTwdLeCKe911Cm.js";

  // If Plausible is not enabled, don't render the scripts.
  if (!enabled) return null;
  // If the user explicitly denied consent, block analytics.
  if (consent === false) return null;
  // If consent is missing (first visit) only allow analytics when the
  // deployment has requested default consent; otherwise require explicit
  // opt-in via the footer or consent UI.
  if (consent === null && !defaultConsent) return null;

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

  const enabled =
    process.env.NEXT_PUBLIC_PLAUSIBLE === "1" ||
    process.env.NEXT_PUBLIC_PLAUSIBLE === "true";
  const defaultConsent =
    process.env.NEXT_PUBLIC_PLAUSIBLE_DEFAULT_CONSENT === "1" ||
    process.env.NEXT_PUBLIC_PLAUSIBLE_DEFAULT_CONSENT === "true";
  useEffect(() => {
    const read = () => {
      try {
        const v = window.localStorage.getItem("analytics_consent");
        // If the value is missing and Plausible is enabled and the site
        // has been configured to allow default consent, persist that
        // preference. Otherwise leave it unset and require an explicit
        // opt-in from the user.
        if (v === null && enabled && defaultConsent) {
          try { window.localStorage.setItem("analytics_consent", "1"); } catch {}
          setConsent(true);
          // Ensure other listeners update
          try { window.dispatchEvent(new Event("analytics-consent-changed")); } catch {}
        } else {
          setConsent(v === "1");
        }
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
  }, [enabled, defaultConsent]);

  

  return PlausibleLoaderContent(enabled, consent, defaultConsent);
}
