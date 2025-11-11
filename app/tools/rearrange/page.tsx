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
    <>
      <TrackView event="Tool Viewed" props={{ tool: "rearrange" }} />
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
              <li className="text-gray-900 font-medium">Rearrange PDF</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Rearrange & Rotate PDF Pages
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Reorder pages and rotate them in 90° increments. All processing happens in your browser — 
              no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <RearrangeTool />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Drag to Reorder",
                  description:
                    "Easily rearrange pages by dragging and dropping them into your desired sequence.",
                },
                {
                  title: "Rotate Pages",
                  description:
                    "Rotate individual pages or all pages at once in 90° increments (90°, 180°, 270°).",
                },
                {
                  title: "Visual Preview",
                  description:
                    "See page thumbnails with rotation indicators to verify your changes before saving.",
                },
                {
                  title: "Private",
                  description:
                    "All processing happens in your browser. Your PDFs never leave your device.",
                },
                {
                  title: "No Watermarks",
                  description:
                    "Get clean PDFs with no watermarks, no ads, and no signup required.",
                },
                {
                  title: "Large File Support",
                  description:
                    "Process PDFs up to 50MB with up to 1000 pages for optimal browser performance.",
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
              Common Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Business</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Fix scanned documents with upside-down pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Reorganize reports for better flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Correct page orientation before printing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Reorder presentation slides</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Personal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Fix rotated pages from mobile scans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Reorganize book chapters or articles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Arrange photo album pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Reorder assignment pages</span>
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
                <p className="text-gray-600 leading-relaxed">
                  This tool runs entirely in your browser using the pdf-lib library. 
                  Your PDFs are never uploaded to any server, stored, or transmitted over the internet. 
                  All rearranging and rotating happens locally on your device.
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
              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>How do I rotate pages?</span>
                  <svg
                    className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform"
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
                  <div className="p-4 pt-0 text-gray-600 leading-relaxed">
                    Click the rotate button on individual page thumbnails to rotate them 90° clockwise. You can also rotate all pages at once using the &quot;Rotate All&quot; button.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>How do I reorder pages?</span>
                  <svg
                    className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform"
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
                <div className="p-4 pt-0 text-gray-600 leading-relaxed">
                  Simply drag and drop page thumbnails to rearrange them in your desired order. The new page numbers will update automatically.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>What&apos;s the maximum file size?</span>
                  <svg
                    className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform"
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
                <div className="p-4 pt-0 text-gray-600 leading-relaxed">
                  You can process PDFs up to 50MB with a maximum of 1000 pages. This ensures optimal performance in the browser.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>Can I rotate only some pages?</span>
                  <svg
                    className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform"
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
                <div className="p-4 pt-0 text-gray-600 leading-relaxed">
                  Yes. Each page has its own rotate button, so you can rotate individual pages independently without affecting others.
                </div>
              </details>
            </div>
          </div>

          {/* Related Tools */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              More PDF Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: "/tools/merge", label: "Merge PDFs" },
                { href: "/tools/split", label: "Split PDFs" },
                { href: "/tools/compress", label: "Compress PDFs" },
                { href: "/tools/data-formatter", label: "Format Data" },
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
