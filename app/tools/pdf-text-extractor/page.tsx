import Link from "next/link";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import PDFTextExtractor from "@/app/components/PdfTextExtractor";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract Text from PDF - SimpleToolkit",
  description:
    "Extract selectable text from PDFs locally in your browser. Page-by-page extraction, password support, and .txt download — no uploads.",
  alternates: { canonical: "https://simpletoolkit.app/tools/pdf-text-extractor" },
};

export default function Page() {
  return (
    <>
      <TrackView event="Tool Viewed" props={{ tool: "pdf-text-extractor" }} />
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
              <li className="text-gray-900 dark:text-white font-medium">Extract Text</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Extract Text from PDF</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Extract selectable text from PDFs locally in your browser — page-by-page, with password support and a .txt download option. No uploads, no servers.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <PDFTextExtractor />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Local-only",
                  description: "Extract text entirely in your browser with no uploads or servers.",
                },
                {
                  title: "Page-by-page",
                  description: "Sequential extraction reduces memory use for large PDFs.",
                },
                {
                  title: "Password support",
                  description: "Prompt for encrypted PDFs — password stays local.",
                },
                {
                  title: "Download .txt",
                  description: "Copy or download the extracted text as a plain text file.",
                },
                {
                  title: "Performance",
                  description: "Designed for responsiveness and low memory usage on large documents.",
                },
                {
                  title: "Privacy-first",
                  description: "No telemetry — all processing happens locally in the browser.",
                },
              ].map((feature, index) => (
                <div key={index} className="p-6 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-black dark:hover:border-white transition-colors">
                  <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Business</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Extract report text for search and archiving</li>
                  <li>Retrieve text for translations or copy-editing</li>
                  <li>Pull meeting notes and manuals into editable text</li>
                </ul>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Personal</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Extract article text for offline reading</li>
                  <li>Pull text from saved receipts or invoices</li>
                  <li>Recover text from PDFs before translating or editing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-16 p-6 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Private & Secure</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">All text extraction happens locally in your browser. No files are uploaded, stored, or transmitted over the internet.</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>Why is no text extracted?</span>
                  <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">If the PDF is a scanned document (image-only), this tool cannot extract text. Use an OCR tool to convert images to selectable text.</div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>How do password-protected PDFs work?</span>
                  <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">Enter the password when prompted and processing will continue locally. Passwords are not sent anywhere.</div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>Are my files uploaded?</span>
                  <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">No. Everything happens in your browser. This is a privacy-first, client-side tool.</div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>What about large PDFs?</span>
                  <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">Files up to 50MB are supported. The tool extracts pages sequentially to conserve memory. Use Cancel to stop processing anytime.</div>
              </details>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
