import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tools — Simple Toolkit",
  description: "Browse all available privacy-first, browser-based tools. No uploads, no tracking, no limitations.",
};

export default function ToolsPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">All Tools</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Private, fast, and easy to use. All tools run entirely in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Active Tools */}
          <Link 
            href="/tools/merge" 
            className="group block rounded-lg border border-border p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Merge PDFs</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Active</span>
            </div>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Merge up to 20 PDFs locally in your browser. Drag to reorder, no uploads required.
            </p>
          </Link>

          <Link 
            href="/tools/split" 
            className="group block rounded-lg border border-border p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Split PDF</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Active</span>
            </div>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Extract pages, ranges, or split into individual pages. All processing happens locally.
            </p>
          </Link>

          {/* Rotate / Rearrange */}
          <Link 
            href="/tools/rearrange" 
            className="group block rounded-lg border border-border p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Rotate / Rearrange PDFs</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Active</span>
            </div>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Rotate pages or rearrange the order of pages within a PDF document.
            </p>
          </Link>

          <Link 
            href="/tools/compress" 
            className="group block rounded-lg border border-border p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Compress PDF</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Active</span>
            </div>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Reduce PDF file size with client-side compression techniques.
            </p>
          </Link>

          <div className="block rounded-lg border border-border/50 p-6 opacity-70">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold">PDF to Images</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-muted/10 text-muted font-medium">Coming Soon</span>
            </div>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Convert PDF pages to image files (PNG, JPG) directly in your browser.
            </p>
          </div>

          <div className="block rounded-lg border border-border/50 p-6 opacity-70">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold">Images to PDF</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-muted/10 text-muted font-medium">Coming Soon</span>
            </div>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Combine multiple images into a single PDF document locally.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center space-y-6">
          <div className="inline-block rounded-lg border border-border/50 bg-accent/30 px-6 py-4">
            <p className="text-sm text-muted">
              <strong className="text-foreground">All tools process files locally.</strong> Your files never leave your device and are not uploaded to any server.
            </p>
          </div>
          <div className="text-sm text-muted">
            Want to support development? <Link className="underline hover:text-foreground transition-colors" href="/donate">Donate</Link> · <Link className="underline hover:text-foreground transition-colors" href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
