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
      if (window.innerWidth >= 768 && open) setOpen(false);
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
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200" 
            : "bg-white/95 backdrop-blur-xl border-b border-gray-100"
        }`}
      >
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[100] focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-12 sm:h-14 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          aria-label="Simple Toolkit Home"
        >
          <div className="hidden sm:flex h-7 w-7 items-center justify-center bg-black transition-opacity">
            <span className="text-white text-sm font-bold">ST</span>
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-black">
            Simple Toolkit
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {navLinks.map(({ href, label, onClick }) => (
              <Link
                key={href}
                href={href}
                onClick={onClick}
                className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold tracking-tight transition-opacity ${
                  isActive(href)
                    ? "text-black"
                    : "text-gray-600 hover:text-black hover:opacity-70"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-black" aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/tools"
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            aria-label="Get started with the tools"
          >
            Get Started
          </Link>

          {/* Mobile menu toggle */}
          <button
            ref={toggleRef}
            type="button"
            className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2.5 text-black hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
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
          {/* Full-page backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            id="mobile-menu"
            className="md:hidden fixed inset-x-0 top-[3rem] z-50 mx-auto max-w-lg overflow-hidden bg-white border-x border-b border-gray-200 shadow-2xl animate-in slide-in-from-top-2 fade-in duration-200 focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <h2 id="mobile-menu-title" className="sr-only">Menu</h2>
            <nav className="flex flex-col" aria-label="Mobile Primary">
              {navLinks.map(({ href, label, onClick }, idx) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClick}
                  role="menuitem"
                  ref={idx === 0 ? firstLinkRef : idx === navLinks.length - 1 ? lastLinkRef : undefined}
                  className={`px-6 py-4 text-[15px] font-semibold transition-colors border-b border-gray-100 last:border-b-0 ${
                    isActive(href) 
                      ? "text-black bg-gray-50" 
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}

              {/* Mobile CTA */}
              <div className="p-4 bg-gray-50">
                <Link
                  href="/tools"
                  role="menuitem"
                  className="flex items-center justify-center w-full px-6 py-3.5 text-[15px] font-semibold text-white bg-black hover:bg-gray-900 transition-colors active:scale-[0.98]"
                  aria-label="Get started with the tools"
                >
                  Get Started
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