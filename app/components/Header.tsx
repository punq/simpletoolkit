"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <span className="font-semibold tracking-tight">Simple Toolkit</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link 
            href="/tools/merge" 
            className="text-sm text-muted hover:text-foreground transition-all relative link-underline"
          >
            Merge PDFs
          </Link>
          <Link 
            href="/privacy" 
            className="text-sm text-muted hover:text-foreground transition-all relative link-underline"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}