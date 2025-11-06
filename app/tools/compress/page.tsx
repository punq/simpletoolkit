import Link from "next/link";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import CompressTool from "../../components/CompressTool";
import Head from "next/head";

export default function CompressPage() {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
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
  title: "Free PDF Compression Tool - Reduce PDF Size Locally, No Upload",
  description: "Compress PDF files securely in your browser. Fast, private PDF compression with no file upload required. Reduce file size while maintaining quality - completely free.",
  keywords: "compress pdf, reduce pdf size, pdf compression, pdf optimizer, compress pdf online, free pdf compression, local pdf compression, secure pdf compression, private pdf tools, browser pdf compression",
  openGraph: {
    title: "Free PDF Compression Tool - Private & Secure | SimplePDFToolkit",
    description: "Compress PDFs directly in your browser - no uploads, no servers, completely private. Reduce file size while maintaining quality, all done locally.",
    type: "website",
    url: "/tools/compress"
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Compression Tool - Private & Secure",
    description: "Compress PDF files directly in your browser. No uploads, no servers, completely private."
  }
};