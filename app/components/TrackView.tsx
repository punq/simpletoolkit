"use client";

import { useEffect } from "react";
import { track, type AnalyticsProps } from "@/app/utils/analytics";

interface TrackViewProps {
  event: string;
  props?: AnalyticsProps;
}

/**
 * Tiny client-side tracker that fires a single analytics event on mount.
 * Safe: no-ops when Plausible isn't enabled. Returns null and renders nothing.
 */
export default function TrackView({ event, props }: TrackViewProps) {
  useEffect(() => {
    if (event) track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
