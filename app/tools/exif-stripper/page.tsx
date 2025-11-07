import Link from "next/link";
import ExifStripperTool from "../../components/ExifStripperTool";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EXIF/Metadata Stripper — Remove Photo Metadata | Simple Toolkit",
  description:
    "Strip EXIF data and metadata from JPEG and PNG images entirely in your browser. Remove location, date, camera info before sharing. 100% private, no uploads.",
  keywords: [
    "exif remover",
    "metadata stripper",
    "remove exif data",
    "strip photo metadata",
    "privacy photo editor",
    "remove gps from photo",
    "delete photo metadata",
    "exif cleaner",
    "image privacy tool",
    "offline exif remover",
    "no upload exif stripper",
  ],
  openGraph: {
    title: "EXIF/Metadata Stripper — Privacy-First Image Tool | Simple Toolkit",
    description:
      "Strip sensitive EXIF data and metadata from photos locally in your browser. No uploads, no tracking, completely private.",
    type: "website",
    url: "/tools/exif-stripper",
  },
  twitter: {
    card: "summary_large_image",
    title: "EXIF/Metadata Stripper — Private & Free",
    description: "Remove EXIF data from images locally. No uploads, completely private.",
  },
  alternates: { canonical: "/tools/exif-stripper" },
};

export default function ExifStripperPage() {
  return (
    <div className="flex flex-col items-center">
      <TrackView event="Tool Viewed" props={{ tool: "exif-stripper" }} />
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
            <h1 className="text-3xl font-semibold tracking-tight">EXIF/Metadata Stripper</h1>
            <p className="text-muted">
              Remove sensitive EXIF data and metadata from your images before sharing. 
              Strip location, date, camera info, and more — all processed locally in your browser with zero uploads.
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
              <ExifStripperTool />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
