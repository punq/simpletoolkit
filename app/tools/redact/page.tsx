import Link from "next/link";
import ClientSidePDFRedactor from "../../components/PDFRedactor";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redact PDF Files — Secure, Private, No Upload | Simple Toolkit",
  description:
    "Redact sensitive information from PDFs entirely in your browser. Visual redaction with text removal. No uploads, no server processing. Fast and privacy-first.",
  keywords: [
    "redact pdf",
    "pdf redaction",
    "secure pdf redaction",
    "redact pdf offline",
    "redact pdf in browser",
    "free pdf redaction",
    "no upload pdf redact",
    "privacy pdf redact",
    "remove text from pdf",
  ],
  openGraph: {
    title: "Redact PDF Files — Secure & Private | Simple Toolkit",
    description:
      "Redact sensitive information from PDFs locally in your browser — no uploads, complete privacy. Visual and text redaction.",
    type: "website",
    url: "/tools/redact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Redact PDF Files — Secure & Private",
    description: "Redact PDFs locally in your browser. No uploads, complete privacy.",
  },
  alternates: { canonical: "/tools/redact" },
};

export default function RedactPage() {
  return (
    <>
      <TrackView event="Tool Viewed" props={{ tool: "redact" }} />
      <main className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/tools" className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 dark:text-white font-medium">Redact PDF</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Redact PDF Files
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Remove sensitive information from PDFs with visual redaction and text removal. 
              All processing happens in your browser — no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <ClientSidePDFRedactor />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Visual Redaction",
                  description:
                    "Draw solid black rectangles over sensitive content. Content is completely obscured from view with precise control over redaction areas.",
                },
                {
                  title: "Text Content Removal",
                  description:
                    "Attempts to remove or mask underlying text from PDF content streams, preventing extraction via copy-paste or search.",
                },
                {
                  title: "Client-Side Only",
                  description:
                    "All redaction happens locally in your browser. Your sensitive documents never leave your device.",
                },
                {
                  title: "Multi-Page Support",
                  description:
                    "Redact content across multiple pages. Navigate through your document and select areas on any page.",
                },
                {
                  title: "Flattening Option",
                  description:
                    "Choose between unflattened (editable) or flattened (secure) output. Flattening merges all layers.",
                },
                {
                  title: "Large File Support",
                  description:
                    "Optimized for large files. Efficient processing ensures smooth performance even with PDFs up to 50MB.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors"
                >
                  <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Common Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Legal Documents</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Redact client names and case numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Remove confidential information from filings</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Financial Records</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Remove account numbers and SSNs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Redact sensitive financial data</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Medical Records</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Protect patient privacy and PHI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Redact names and dates of birth</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Government Documents</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Redact classified information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Remove PII before FOIA releases</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Business Contracts</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Protect proprietary terms and pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Redact partner names from templates</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Research Papers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Anonymize participant information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Redact confidential research data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-16 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Privacy is Protected
                </h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  This tool runs entirely in your browser using the pdf-lib library. 
                  Your PDFs are never uploaded to any server, stored, or transmitted over the internet. 
                  All redaction happens locally on your device.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  In addition to visual redaction, the tool attempts to mask text content from the PDF&apos;s 
                  internal content streams within redacted areas. When you select the flattened option, 
                  all PDF layers are merged into a single, non-editable representation. This ensures that 
                  redaction boxes cannot be removed or manipulated.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-16 sm:mt-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <details className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <summary className="font-semibold text-black dark:text-white cursor-pointer">
                  Is my PDF uploaded to a server?
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400">
                  No. All processing happens entirely in your browser using JavaScript. Your 
                  PDF file never leaves your device, ensuring complete privacy.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <summary className="font-semibold text-black dark:text-white cursor-pointer">
                  What&apos;s the difference between unflattened and flattened?
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400">
                  Unflattened PDFs preserve the document structure, allowing further edits. 
                  Flattened PDFs merge all layers, making the redactions permanent and 
                  non-removable. Always use flattened for final, secure sharing.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <summary className="font-semibold text-black dark:text-white cursor-pointer">
                  Can redactions be removed from the PDF?
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400">
                  If you use the flattened option, redactions cannot be removed as all layers 
                  are merged. Unflattened PDFs may allow redaction removal in some PDF editors, 
                  so always use flattening for secure documents.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <summary className="font-semibold text-black dark:text-white cursor-pointer">
                  Does this work with encrypted/password-protected PDFs?
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400">
                  No. Encrypted PDFs must have password protection removed before redaction. 
                  This is a security measure to prevent unauthorized modifications.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <summary className="font-semibold text-black dark:text-white cursor-pointer">
                  What is the maximum file size?
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400">
                  The maximum file size is 50MB per PDF. This limit ensures smooth performance 
                  in your browser without exhausting system memory.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <summary className="font-semibold text-black dark:text-white cursor-pointer">
                  How precise is the text content removal?
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400">
                  The tool attempts to mask text in the PDF content stream within redacted areas. 
                  While this significantly reduces the risk of text extraction, PDF structure 
                  complexity may vary. Always review the output and use flattening for maximum 
                  security.
                </p>
              </details>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 sm:mt-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4">
              Explore More PDF Tools
            </h2>
            <p className="text-base text-gray-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
              All our tools are free, privacy-focused, and run entirely in your browser.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tools/merge"
                className="px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Merge PDFs
              </Link>
              <Link
                href="/tools/split"
                className="px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Split PDF
              </Link>
              <Link
                href="/tools/compress"
                className="px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Compress PDF
              </Link>
              <Link
                href="/tools/rearrange"
                className="px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Rearrange Pages
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
