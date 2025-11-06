import type { Metadata } from "next";
import Link from "next/link";
import RearrangeTool from "@/app/components/RearrangeTool";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";

export const metadata: Metadata = {
  title: "Rearrange & Rotate PDF — Free, Private, No Upload | Simple Toolkit",
  description: "Reorder pages and rotate PDFs entirely in your browser. No uploads, no watermarks, no signup. Fast and private.",
  keywords: [
    "rearrange pdf",
    "rotate pdf",
    "reorder pdf pages",
    "pdf page rotation",
    "pdf tools private",
    "no upload pdf",
    "free pdf tools"
  ],
  openGraph: {
    title: "Rearrange & Rotate PDF — Private & Free | Simple Toolkit",
    description: "Drag to reorder and rotate PDF pages locally — no uploads or watermarks.",
    type: "website",
    url: "/tools/rearrange"
  },
  twitter: {
    card: "summary_large_image",
    title: "Rearrange & Rotate PDF — Private & Free",
    description: "Reorder and rotate PDF pages locally. No uploads, no watermarks, no tracking."
  },
  alternates: { canonical: "/tools/rearrange" }
};

export default function RearrangePage() {
  return (
    <div className="flex flex-col items-center">
      <TrackView event="Tool Viewed" props={{ tool: "rearrange" }} />
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          <div>
            <Link 
              href="/tools" 
              className="text-sm text-muted hover:text-foreground transition-all relative link-underline inline-flex items-center"
            >
              ← Back to tools
            </Link>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">Rotate / Rearrange PDF</h1>
            <p className="text-muted">
              Rotate pages 90° at a time and drag to reorder — all processing is local. No uploads, no accounts.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="/donate"
                className="text-sm text-muted hover:text-foreground transition-all relative link-underline inline-flex items-center"
              >
                ♥️ Support this project
              </Link>
            </div>
          </div>

          <div className="w-full">
            <ErrorBoundary>
              <RearrangeTool />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
