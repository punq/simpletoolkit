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
    <>
      <TrackView event="Tool Viewed" props={{ tool: "split" }} />
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
              <li className="text-gray-900 font-medium">Split PDF</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Split PDF Files
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Extract pages or ranges from a PDF document. All processing happens in your browser — 
              no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <SplitTool />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Multiple Split Modes",
                  description:
                    "Extract specific pages, page ranges, split every N pages, or create individual page files.",
                },
                {
                  title: "Page Range Support",
                  description:
                    "Use flexible syntax like '1,3,5-7' to extract exactly the pages you need.",
                },
                {
                  title: "Fast Processing",
                  description:
                    "Lightning-fast splitting powered by pdf-lib. Most operations complete in seconds.",
                },
                {
                  title: "Private",
                  description:
                    "All splitting happens in your browser. Your PDFs never leave your device.",
                },
                {
                  title: "No Watermarks",
                  description:
                    "Get clean PDFs with no watermarks, no ads, and no signup required.",
                },
                {
                  title: "Large File Support",
                  description:
                    "Process PDFs up to 50MB in size with smooth performance.",
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
                    <span>Extract specific contract pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Separate chapters from large reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Split invoices by month or quarter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Break down presentation decks</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Personal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Extract pages from scanned documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Separate book chapters or articles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Create individual assignment files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Split photo albums by event</span>
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
                  All splitting happens locally on your device.
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
                  <span>What split modes are available?</span>
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
                  You can extract specific pages (e.g., 1,3,5-7), extract a continuous range, split every N pages, or split into individual page files.
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
                  You can split PDFs up to 50MB in size. This ensures optimal performance in the browser.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>Can I split password-protected PDFs?</span>
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
                  No, encrypted or password-protected PDFs cannot be processed. You&apos;ll need to remove the password first.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>How do I specify page ranges?</span>
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
                  Use commas to separate individual pages and hyphens for ranges. For example: &quot;1,3,5-7&quot; extracts pages 1, 3, 5, 6, and 7.
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
                { href: "/tools/rearrange", label: "Rearrange Pages" },
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
