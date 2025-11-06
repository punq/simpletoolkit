import Link from "next/link";
import MergeTool from "../../components/MergeTool";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files — Free, Private, No Upload | Simple Toolkit",
  description:
    "Combine multiple PDFs entirely in your browser. No uploads, no watermarks, no signup, no ads. Fast and privacy-first.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "pdf merger",
    "merge pdf offline",
    "merge pdf in browser",
    "free pdf tools",
    "no watermark",
    "no upload pdf merge",
  ],
  openGraph: {
    title: "Merge PDF Files — Private & Free | Simple Toolkit",
    description:
      "Merge up to 20 PDFs locally in your browser — no uploads or watermarks. Fast, secure, and free.",
    type: "website",
    url: "/tools/merge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Files — Private & Free",
    description: "Merge PDFs locally in your browser. No uploads, no watermarks, no signup.",
  },
  alternates: { canonical: "/tools/merge" },
};

export default function MergePage() {
  return (
    <div className="flex flex-col items-center">
      <TrackView event="Tool Viewed" props={{ tool: "merge" }} />
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
            <h1 className="text-3xl font-semibold tracking-tight">Merge PDFs</h1>
            <p className="text-muted">
              Merge up to 20 PDF files locally in your browser — no uploads, no accounts.
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
              <MergeTool />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
