import Link from "next/link";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import CompressTool from "../../components/CompressTool";


export default function CompressPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          <div>
            <Link 
              href="/" 
              className="text-sm text-muted hover:text-foreground transition-all relative link-underline inline-flex items-center"
            >
              ← Back to tools
            </Link>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">Compress PDF</h1>
            <p className="text-muted">
              Reduce PDF file size locally in your browser — optimize images, fonts, and metadata. No uploads, no accounts.
            </p>
          </div>

          <div className="w-full">
            <ErrorBoundary>
              <CompressTool />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Files - Free, Private, No Upload Required",
  description: "Reduce PDF file size locally in your browser. Fast, secure, and private PDF compression - no servers, no data collection.",
  keywords: "compress pdf, reduce pdf size, pdf compression, pdf optimizer, compress pdf online, free pdf compression",
  openGraph: {
    title: "Free PDF Compression Tool - Private & Secure",
    description: "Compress PDF files directly in your browser. No uploads, no servers, completely private.",
    type: "website",
    url: "/tools/compress"
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Compression Tool - Private & Secure",
    description: "Compress PDF files directly in your browser. No uploads, no servers, completely private."
  }
};