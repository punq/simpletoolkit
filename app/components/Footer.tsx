"use client";

import React, { useState } from "react";
import Link from "next/link";
import Toast from "./Toast";
import { Shield, Mail, Github } from "lucide-react";

export default function Footer() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  // showToast remains for features like copying email

  return (
    <>
      <footer className="w-full mt-6 border-t border-gray-200 dark:border-zinc-800 bg-transparent">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between gap-4 text-xs sm:text-[12px] text-gray-600 dark:text-gray-300">
          <div className="flex w-full justify-center sm:justify-start gap-2 sm:gap-4">
            {/* Apple-style: stacked icon + label on mobile, uppercase text-only links on desktop */}
            <Link
              href="/privacy"
              className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-md transition active:scale-95 hover:opacity-90 sm:flex-row sm:gap-2"
              aria-label="Privacy"
            >
              <Shield size={20} className="text-gray-600 dark:text-gray-300 mb-1 sm:hidden" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300 sm:text-sm sm:mb-0 sm:ml-0 sm:inline">Privacy</span>
            </Link>

            <a
              href={`mailto:simpletoolkitapp@gmail.com?subject=${encodeURIComponent('Issue with Simple Toolkit')}&body=${encodeURIComponent('Please describe the issue and steps to reproduce:')}`}
              onClick={async (e) => {
                e.preventDefault();
                const mailto = `mailto:simpletoolkitapp@gmail.com?subject=${encodeURIComponent('Issue with Simple Toolkit')}&body=${encodeURIComponent('Please describe the issue and steps to reproduce:')}`;
                try {
                  window.location.href = mailto;
                } catch {}
                try {
                  await navigator.clipboard.writeText('simpletoolkitapp@gmail.com');
                  showToast('Email copied: simpletoolkitapp@gmail.com');
                } catch {
                  showToast('Use this email: simpletoolkitapp@gmail.com');
                }
              }}
              className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-md transition active:scale-95 hover:opacity-90 sm:flex-row sm:gap-2"
              aria-label="Contact via email"
            >
              <Mail size={20} className="text-gray-600 dark:text-gray-300 mb-1 sm:hidden" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300 sm:text-sm sm:mb-0 sm:ml-0 sm:inline">Contact</span>
            </a>

            <a
              href="https://github.com/punq/simpletoolkit/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-md transition active:scale-95 hover:opacity-90 sm:flex-row sm:gap-2"
              aria-label="Report an issue on GitHub"
            >
              <Github size={20} className="text-gray-600 dark:text-gray-300 mb-1 sm:hidden" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300 sm:text-sm sm:mb-0 sm:ml-0 sm:inline">Report</span>
            </a>
          </div>
          <div />
        </div>
      </footer>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </>
  );
}
