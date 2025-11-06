/**
 * Shared analytics utilities
 * Provides fail-safe event tracking for Plausible Analytics
 */

/**
 * Type definition for analytics properties
 */
export type AnalyticsProps = Record<string, string | number | boolean>;

/**
 * Safely tracks an analytics event
 * Fails silently to ensure analytics never breaks user experience
 * @param eventName - Name of the event to track
 * @param props - Optional properties to attach to the event
 */
export const track = (eventName: string, props?: AnalyticsProps): void => {
  try {
    // Only run in browser context
    if (typeof window === "undefined") return;
    
    const w = window as any;
    
    // Check if Plausible is loaded
    if (typeof w.plausible !== "function") return;
    
    // Track with or without props
    if (props) {
      w.plausible(eventName, { props });
    } else {
      w.plausible(eventName);
    }
  } catch (error) {
    // Silently fail - analytics must never break UX
    // In development, you could log: console.warn('Analytics error:', error);
  }
};
