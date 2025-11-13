/**
 * Shared analytics utilities
 * Provides fail-safe event tracking for Plausible Analytics
 */

/**
 * Type definition for analytics properties
 */
export type AnalyticsProps = Record<string, string | number | boolean>;

const MAX_STRING_LENGTH = 200;

function sanitizeString(s: string): string {
  let out = s.trim();
  // redact emails
  out = out.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted]');
  // redact Windows-like absolute paths
  out = out.replace(/[A-Za-z]:\\[^\s]*/g, '[redacted_path]');
  // redact unix-like absolute paths
  out = out.replace(/\/([\w-_. ]+\/)+[\w-_. ]+/g, '[redacted_path]');
  // truncate long strings
  if (out.length > MAX_STRING_LENGTH) out = out.slice(0, MAX_STRING_LENGTH) + '…';
  return out;
}

function sanitizeProps(props?: Record<string, unknown>): AnalyticsProps | undefined {
  if (!props) return undefined;
  const out: AnalyticsProps = {};
  for (const key of Object.keys(props)) {
    const val = props[key as keyof typeof props];
    if (val === null || val === undefined) continue;
    const t = typeof val;
    if (t === 'string') out[key] = sanitizeString(val as string);
    else if (t === 'number' || t === 'boolean') out[key] = val as number | boolean;
    else {
      // fallback - stringify and sanitize
      try {
        const s = JSON.stringify(val);
        out[key] = sanitizeString(s);
      } catch {
        out[key] = '[unserializable]';
      }
    }
  }
  return out;
}

/**
 * Safely tracks an analytics event
 * - Only runs in the browser
 * - Sanitizes free-form string properties to avoid leaking PII
 * - Fails silently to ensure analytics never breaks UX
 */
export const track = (eventName: string, props?: Record<string, unknown>): void => {
  try {
    if (typeof window === 'undefined') return;

    const plausible = (window as unknown as { plausible?: (e: string, o?: { props?: AnalyticsProps }) => void }).plausible;
    if (typeof plausible !== 'function') return;

    const safeProps = sanitizeProps(props);
    // If caller provided props (even if sanitized result is empty), pass an empty props object
    if (props !== undefined) {
      plausible(eventName, { props: safeProps ?? {} });
    } else {
      plausible(eventName);
    }
  } catch {
    // Silently fail - don't break user experience
  }
};
