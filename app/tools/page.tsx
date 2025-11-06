import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tools — Privacy-First, No-Upload Utilities | Simple Toolkit",
  description:
    "Explore our fast, browser-based tools for PDFs and more. 100% private—no logins, no ads, no tracking, no watermarks. Files never leave your device.",
  keywords: [
    "privacy-first tools",
    "no upload tools",
    "pdf tools",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "rearrange pdf",
    "rotate pdf",
    "offline pdf editor",
    "browser tools",
    "no tracking",
    "no login",
  ],
  openGraph: {
    title: "Simple Toolkit — All Tools",
    description:
      "Private, modern tools that run entirely in your browser. Merge, split, compress PDFs and more—no uploads, no tracking.",
    type: "website",
  },
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero / Intro */}
      <section
        aria-labelledby="tools-hero"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 relative overflow-hidden"
      >
        <div className="absolute top-16 left-8 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div className="absolute bottom-8 right-8 w-96 h-96 bg-success/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold shadow-sm" style={{ borderColor: 'var(--primary)' }}>
            <span className="text-foreground">100% Private • No Logins • No Tracking</span>
          </div>
          <h1 id="tools-hero" className="text-4xl sm:text-5xl font-bold tracking-tight">All Tools</h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            Professional, browser-based utilities for PDFs and beyond. Files never leave your device. No ads. No watermarks. Free forever.
          </p>
        </div>
      </section>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        {/* Category: PDF Tools */}
        <section aria-labelledby="pdf-tools" className="mt-6">
          <div className="flex items-baseline justify-between mb-6">
            <h2 id="pdf-tools" className="text-2xl sm:text-3xl font-bold tracking-tight">PDF Tools</h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">Client-Side Only</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Merge */}
            <Link
              href="/tools/merge"
              className="group block rounded-2xl border p-6 transition-all hover:border-foreground/20 hover:shadow-xl hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Merge PDF files locally in your browser"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Merge PDF</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Active</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Combine multiple PDFs and drag to reorder pages—<strong className="text-foreground">no uploads</strong>, no tracking.
              </p>
            </Link>

            {/* Split */}
            <Link
              href="/tools/split"
              className="group block rounded-2xl border p-6 transition-all hover:border-foreground/20 hover:shadow-xl hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Split a PDF into pages or ranges locally"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Split PDF</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Active</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Extract pages, ranges, or split into single-page files—all <strong className="text-foreground">in your browser</strong>.
              </p>
            </Link>

            {/* Rearrange / Rotate */}
            <Link
              href="/tools/rearrange"
              className="group block rounded-2xl border p-6 transition-all hover:border-foreground/20 hover:shadow-xl hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Rearrange or rotate PDF pages locally"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Rearrange & Rotate PDF</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Active</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Reorder pages and rotate as needed—fast, private, and accurate.
              </p>
            </Link>

            {/* Compress */}
            <Link
              href="/tools/compress"
              className="group block rounded-2xl border p-6 transition-all hover:border-foreground/20 hover:shadow-xl hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Compress PDF size locally"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Compress PDF</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Active</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Reduce file size with smart, client-side compression—<strong className="text-foreground">no watermarks</strong>.
              </p>
            </Link>
          </div>
        </section>

        {/* Category: Coming Soon */}
        <section aria-labelledby="coming-soon" className="mt-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 id="coming-soon" className="text-2xl sm:text-3xl font-bold tracking-tight">Coming Soon</h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-border/40 text-muted">Roadmap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="block rounded-2xl border border-border/50 p-6 opacity-80">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">PDF → Images</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-muted/10 text-muted font-medium">Planned</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Convert PDF pages to PNG or JPG entirely on-device.
              </p>
            </div>

            <div className="block rounded-2xl border border-border/50 p-6 opacity-80">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">Images → PDF</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-muted/10 text-muted font-medium">Planned</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Combine images into a single, high‑quality PDF locally.
              </p>
            </div>

            <div className="block rounded-2xl border border-border/50 p-6 opacity-80">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">Metadata Cleaner</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-muted/10 text-muted font-medium">Researching</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Remove hidden metadata from files before sharing—privacy first.
              </p>
            </div>
          </div>
        </section>

        {/* Trust / Promise */}
        <section aria-labelledby="privacy-promise" className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border-2 p-8 sm:p-10 text-center" style={{ borderColor: 'var(--primary)' }}>
            <div className="absolute -top-16 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div className="absolute -bottom-16 right-1/3 w-72 h-72 bg-success/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div className="relative z-10 space-y-4">
              <h2 id="privacy-promise" className="text-2xl sm:text-3xl font-bold">Our Privacy Promise</h2>
              <p className="text-sm sm:text-base max-w-3xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                All tools run <strong className="text-foreground">100% in your browser</strong>. We never upload, log, or track your files or actions. No accounts, no ads, no analytics—just useful tools.
              </p>
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <Link className="underline hover:text-foreground transition-colors" href="/privacy">Read our simple privacy policy</Link>
                {" · "}
                <Link className="underline hover:text-foreground transition-colors" href="/donate">Support this project</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Simple FAQ without JS */}
        <section aria-labelledby="faq" className="mt-12">
          <h2 id="faq" className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">FAQs</h2>
          <div className="space-y-3">
            <details className="rounded-xl border p-4" style={{ borderColor: 'var(--card-border)' }}>
              <summary className="cursor-pointer font-medium">Do my files ever get uploaded?</summary>
              <p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                No. Processing happens locally using WebAssembly and browser APIs via pdf-lib. We do not have servers to receive your files.
              </p>
            </details>
            <details className="rounded-xl border p-4" style={{ borderColor: 'var(--card-border)' }}>
              <summary className="cursor-pointer font-medium">Is it really free and ad‑free?</summary>
              <p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Yes. The project is donation‑powered. There are no premium tiers, watermarks, ads, or trackers.
              </p>
            </details>
            <details className="rounded-xl border p-4" style={{ borderColor: 'var(--card-border)' }}>
              <summary className="cursor-pointer font-medium">Can I use this offline?</summary>
              <p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Once the page loads, most tools continue to work even if your connection drops. Everything runs in your browser.
              </p>
            </details>
          </div>
        </section>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Simple Toolkit – All Tools",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  item: {
                    "@type": "SoftwareApplication",
                    name: "Merge PDF",
                    applicationCategory: "UtilitiesApplication",
                    operatingSystem: "Web",
                    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
                    url: "/tools/merge",
                    description: "Combine multiple PDF files locally in your browser—no uploads or tracking.",
                  },
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  item: {
                    "@type": "SoftwareApplication",
                    name: "Split PDF",
                    applicationCategory: "UtilitiesApplication",
                    operatingSystem: "Web",
                    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
                    url: "/tools/split",
                    description: "Extract pages or ranges and split PDFs entirely on‑device.",
                  },
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  item: {
                    "@type": "SoftwareApplication",
                    name: "Rearrange & Rotate PDF",
                    applicationCategory: "UtilitiesApplication",
                    operatingSystem: "Web",
                    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
                    url: "/tools/rearrange",
                    description: "Reorder and rotate PDF pages privately in your browser.",
                  },
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  item: {
                    "@type": "SoftwareApplication",
                    name: "Compress PDF",
                    applicationCategory: "UtilitiesApplication",
                    operatingSystem: "Web",
                    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
                    url: "/tools/compress",
                    description: "Reduce PDF file size with client‑side compression—no watermarks.",
                  },
                },
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: "Tools", item: "/tools" },
              ],
            }),
          }}
        />
      </main>
    </div>
  );
}
