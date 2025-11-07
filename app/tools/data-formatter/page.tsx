import Link from "next/link";
import DataFormatterValidator from "../../components/DataFormatterValidator";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Formatter & Validator — JSON, YAML, XML | Simple Toolkit",
  description:
    "Format, validate, and convert JSON, YAML, and XML entirely in your browser. No uploads, real-time validation, detailed error reporting. Fast and privacy-first.",
  keywords: [
    "json formatter",
    "yaml formatter",
    "xml formatter",
    "json validator",
    "yaml validator",
    "xml validator",
    "json to yaml",
    "yaml to json",
    "xml to json",
    "format json online",
    "validate json",
    "free json formatter",
    "data formatter",
    "json beautifier",
  ],
  openGraph: {
    title: "Data Formatter & Validator — Private & Free | Simple Toolkit",
    description:
      "Format and validate JSON, YAML, XML locally in your browser. Convert between formats with real-time error reporting. No uploads, completely private.",
    type: "website",
    url: "/tools/data-formatter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Formatter & Validator — Private & Free",
    description:
      "Format, validate, and convert JSON, YAML, XML in your browser. Real-time validation, zero uploads.",
  },
};

export default function DataFormatterPage() {
  return (
    <>
      <TrackView event="Data Formatter Page Viewed" />
      <main className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/tools" className="hover:text-gray-900 transition-colors">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 font-medium">Data Formatter</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Data Formatter & Validator
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Format, validate, and convert between JSON, YAML, and XML. All processing happens in your browser — 
              no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <DataFormatterValidator />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Real-Time Validation",
                  description:
                    "Get instant syntax validation with detailed error messages showing exact line and column numbers.",
                },
                {
                  title: "Format Conversion",
                  description:
                    "Convert seamlessly between JSON, YAML, and XML formats with intelligent data structure preservation.",
                },
                {
                  title: "Beautiful Formatting",
                  description:
                    "Automatically beautify and indent your data for maximum readability with industry-standard conventions.",
                },
                {
                  title: "Auto-Detection",
                  description:
                    "Smart format detection automatically identifies whether your input is JSON, YAML, or XML.",
                },
                {
                  title: "High Performance",
                  description:
                    "Process large files up to 10MB with optimized native browser APIs and debounced validation.",
                },
                {
                  title: "100% Private",
                  description:
                    "All processing happens in your browser. Your data never leaves your device or touches our servers.",
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

          {/* Use Cases */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Perfect For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Developers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Debug API responses and configuration files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Convert between data formats for different systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Validate JSON schemas and YAML manifests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Format minified data for readability</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Data Analysts</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Clean and format exported data for analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Convert data between different tool formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Validate data integrity before import</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Structure nested data for better understanding</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-16 p-8 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-gray-700"
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  100% Private, Instant Processing
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  This tool runs entirely in your browser using native JavaScript and Web APIs. 
                  Your data is never uploaded to any server, stored, or transmitted over the internet. 
                  All formatting, validation, and conversion happens locally on your device.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <details className="group border border-gray-200 rounded-lg">
                <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                  <span>What formats are supported?</span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  The tool supports JSON, YAML, and XML. You can format and validate any of these formats, 
                  or convert between them. The auto-detection feature can automatically identify your input format.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg">
                <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                  <span>What&apos;s the maximum file size?</span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  You can process data files up to 10MB in size. This limit ensures optimal performance 
                  in the browser. For most use cases, this is more than sufficient — most API responses 
                  and configuration files are much smaller.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg">
                <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                  <span>Is this really private?</span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  Yes, absolutely. All processing happens in your browser using JavaScript. Your data 
                  never leaves your device. You can even disconnect from the internet after loading the 
                  page and the tool will continue to work. No data is sent to our servers or any third party.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg">
                <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                  <span>How accurate is the error reporting?</span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  Very accurate. For JSON, we use the browser&apos;s native parser which provides precise line 
                  and column information. For XML, we use the DOMParser API. For YAML, we provide clear 
                  error messages that help you quickly identify and fix syntax issues.
                </div>
              </details>
            </div>
          </div>

          {/* Related Tools */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              More Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: "/tools/merge", label: "Merge PDFs" },
                { href: "/tools/split", label: "Split PDFs" },
                { href: "/tools/compress", label: "Compress PDFs" },
                { href: "/tools/exif-stripper", label: "Strip Image Metadata" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="p-4 border border-gray-200 rounded-lg hover:border-black transition-colors text-center font-medium"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
