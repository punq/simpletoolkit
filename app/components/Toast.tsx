"use client";

import React, { useEffect } from "react";

export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = prefersReduced ? 2000 : 3000;
    const t = setTimeout(onClose, timeout);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 bottom-20 z-50 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md shadow-md text-sm"
    >
      {message}
    </div>
  );
}
