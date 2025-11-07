"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { track } from "@/app/utils/analytics";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const lastLinkRef = useRef<HTMLAnchorElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = useMemo(
    () => [
      { href: "/tools", label: "Tools" },
      { href: "/donate", label: "Donate", onClick: () => track("Donate Header Click", { location: open ? "header-mobile" : "header" }) },
      { href: "/privacy", label: "Privacy" },
    ],
    [open]
  );

  const isActive = (href: string) => {
    if (!pathname) return false;
    // Consider nested routes active as well (e.g., /tools/merge)
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Close mobile menu on route change
  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape, basic focus trap when open
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;

    // Move focus to first link for accessibility
    const t = setTimeout(() => firstLinkRef.current?.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
      if (e.key === "Tab") {
        const first = firstLinkRef.current;
        const last = lastLinkRef.current;
        if (!first || !last) return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Prevent background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      // Restore keyboard focus to the toggle button
      toggleRef.current?.focus();
    };
  }, [open]);

  // Close the menu if resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  // Elevate header on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200" 
            : "bg-gradient-to-b from-blue-50/80 to-white/80 backdrop-blur-xl border-b border-blue-100/50"
        }`}
      >
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-lg focus-visible:ring-offset-2"
          aria-label="Simple Toolkit Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0066cc] to-[#0052a3] shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-white text-lg font-bold">ST</span>
          </div>
          <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Simple Toolkit
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/60 px-2 py-1.5 shadow-sm border border-gray-200/60" aria-label="Primary">
            {navLinks.map(({ href, label, onClick }) => (
              <Link
                key={href}
                href={href}
                onClick={onClick}
                className={`relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? "text-white bg-[#0066cc] shadow-sm"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/tools"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0066cc] to-[#0052a3] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] focus-visible:ring-offset-2"
            aria-label="Get started with the tools"
          >
            Get Started
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </Link>

          {/* Mobile menu toggle */}
          <button
            ref={toggleRef}
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {/* Hamburger / Close icon with smooth transition */}
            <svg
              className="h-6 w-6 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
      </header>
    
      {/* Mobile menu portal - rendered outside header at document level */}
      {mounted && open && createPortal(
        <>
          {/* Full-page backdrop with blur - Google style */}
          <div
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            id="mobile-menu"
            className="md:hidden fixed left-4 right-4 top-[4.5rem] z-50 overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 animate-in slide-in-from-top-4 fade-in duration-300 focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <h2 id="mobile-menu-title" className="sr-only">Menu</h2>
            <nav className="flex flex-col p-2" aria-label="Mobile Primary">
              {navLinks.map(({ href, label, onClick }, idx) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClick}
                  role="menuitem"
                  ref={idx === 0 ? firstLinkRef : idx === navLinks.length - 1 ? lastLinkRef : undefined}
                  className={`rounded-xl px-4 py-3.5 text-base font-medium transition-all ${
                    isActive(href) 
                      ? "text-white bg-gradient-to-r from-[#0066cc] to-[#0052a3] shadow-sm" 
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}

              {/* Mobile CTA */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <Link
                  href="/tools"
                  role="menuitem"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0066cc] to-[#0052a3] px-4 py-3.5 text-base font-semibold text-white shadow-md hover:shadow-lg transition-all"
                  aria-label="Get started with the tools"
                >
                  Get Started
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                </Link>
              </div>
            </nav>
          </div>
        </>,
        document.body
      )}
    </>
  );
}