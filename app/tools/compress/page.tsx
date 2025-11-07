import Link from "next/link";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import CompressTool from "../../components/CompressTool";
import TrackView from "@/app/components/TrackView";
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

export default function CompressPage() {
  return (
    <>
      <TrackView event="Tool Viewed" props={{ tool: "compress" }} />
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
              <li className="text-gray-900 font-medium">Compress PDF</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Compress PDF Files
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Reduce PDF file size while maintaining quality. All processing happens in your browser — 
              no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <CompressTool />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Smart Compression",
                  description:
                    "Reduces file size by optimizing images, fonts, and metadata while preserving document quality.",
                },
                {
                  title: "Real-Time Progress",
                  description:
                    "See compression progress page-by-page with a visual progress bar showing completion status.",
                },
                {
                  title: "Size Comparison",
                  description:
                    "View original vs. compressed file sizes to see exactly how much space you've saved.",
                },
                {
                  title: "Private",
                  description:
                    "All compression happens in your browser. Your PDFs never leave your device.",
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
                    <span>Reduce file size for email attachments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Optimize reports and presentations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Compress invoices and contracts for storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Optimize documents for web sharing</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Personal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Compress scanned documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Reduce file size for online applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Optimize PDFs for cloud storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Compress photo albums and portfolios</span>
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
                  All compression happens locally on your device.
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
                  <span>How much smaller will my PDF be?</span>
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
                  Compression results vary by document. PDFs with many images typically see 30-70% size reduction. Text-heavy documents may have smaller savings. The tool shows you the exact file size before and after compression.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>Will compression reduce quality?</span>
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
                  The compression optimizes internal PDF structures without significantly affecting visible quality. Text remains sharp, and images are optimized while maintaining readability.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>What's the maximum file size?</span>
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
                  You can compress PDFs up to 50MB in size. This ensures optimal performance in the browser.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>How long does compression take?</span>
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
                  Most PDFs compress in seconds. Larger files may take longer. You'll see real-time progress as each page is processed.
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
                { href: "/tools/rearrange", label: "Rearrange Pages" },
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