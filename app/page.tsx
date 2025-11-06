import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Toolkit — Fast, Private Browser Tools | No Signup Required",
  description:
    "Professional browser-based tools for PDF merging, splitting, and more. 100% private, no uploads, no tracking, no ads. All processing happens locally in your browser. Free forever.",
  openGraph: {
    title: "Simple Toolkit — Fast, Private Browser Tools",
    description: "Professional browser-based tools. 100% private, no uploads, no tracking. Free forever.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <h1 id="hero-heading" className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Simple Toolkit
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto mt-4 bg-gradient-to-r from-primary to-primary/40 rounded-full" aria-hidden="true"></div>
          </div>
          
          <p className="text-xl sm:text-2xl text-muted max-w-2xl mx-auto leading-relaxed">
            Fast, private, browser-based tools.
            <br />
            <span className="text-foreground font-medium">No BS. No bloat.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              href="/tools"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Browse Tools
            </Link>
            <Link 
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border border-border bg-background hover:bg-accent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Support Us
            </Link>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section aria-labelledby="features-heading" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-center mb-12">What Makes Us Different</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Lock icon</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">100% Private</h3>
            <p className="text-muted leading-relaxed">
              Your files never leave your device. All processing happens locally in your browser. Zero uploads, zero storage, zero access.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Lightning bolt icon</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted leading-relaxed">
              No server round-trips, no waiting in queues. Pure client-side processing means instant results and blazing speed.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>No symbol icon</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">No Nonsense</h3>
            <p className="text-muted leading-relaxed">
              No signups, no logins, no paywalls, no ads, no tracking, no watermarks. Just simple tools that work.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Shield with checkmark icon</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">No Limits</h3>
            <p className="text-muted leading-relaxed">
              Unlimited usage, no file size restrictions (beyond your browser's capabilities), no premium features. Everything is free.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Settings icon</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Open & Accessible</h3>
            <p className="text-muted leading-relaxed">
              Built with modern web standards, keyboard navigation, screen reader support, and works on any device with a browser.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Heart icon</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Community Supported</h3>
            <p className="text-muted leading-relaxed">
              This project runs entirely on donations. No venture capital, no data harvesting. Just a tool built for people, by people.
            </p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section aria-labelledby="cta-heading" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/50 to-background p-8 sm:p-12 text-center space-y-6">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold">Ready to get started?</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            No account needed. No installation required. Just pick a tool and start working.
          </p>
          <Link 
            href="/tools"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View All Tools
          </Link>
        </div>
      </section>

      {/* Footer Note */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted">
            Built with privacy and simplicity in mind. Your files are processed locally and never sent to any server.
          </p>
          <div className="text-sm text-muted">
            <Link className="underline hover:text-foreground transition-colors" href="/privacy">Privacy Policy</Link>
            {" · "}
            <Link className="underline hover:text-foreground transition-colors" href="/donate">Support This Project</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
