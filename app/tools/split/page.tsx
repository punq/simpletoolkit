import Link from "next/link";
import SplitTool from "../../components/SplitTool";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF — Extract Pages, Ranges, or Individual PDFs | Simple Toolkit",
  description:
    "Split a PDF into pages or extract a range entirely in your browser. No uploads, no tracking, no watermarks.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "pdf splitter",
    "split pdf offline",
    "browser pdf tools",
    "free pdf tools",
    "no watermark",
  ],
  openGraph: {
    title: "Split PDF — Private & Free | Simple Toolkit",
    description:
      "Extract pages or ranges from a PDF locally in your browser — no uploads or watermarks.",
    type: "website",
    url: "/tools/split",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF — Private & Free",
    description: "Split PDF pages locally in your browser. No uploads, no watermarks, no signup.",
  },
  alternates: { canonical: "/tools/split" },
};

export default function SplitPage() {
  return (
    <div className="flex flex-col items-center">
      <TrackView event="Tool Viewed" props={{ tool: "split" }} />
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
            <h1 className="text-3xl font-semibold tracking-tight">Split PDF</h1>
            <p className="text-muted">
              Split PDF files locally in your browser — extract pages, ranges, or split into individual pages. No uploads, no accounts.
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
              <SplitTool />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
