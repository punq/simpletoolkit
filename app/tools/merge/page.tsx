import Link from "next/link";
import MergeTool from "../../components/MergeTool";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files — Free, Private, No Upload | Simple Toolkit",
  description:
    "Combine multiple PDFs entirely in your browser. No uploads, no watermarks, no signup, no ads. Fast and privacy-first.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "pdf merger",
    "merge pdf offline",
    "merge pdf in browser",
    "free pdf tools",
    "no watermark",
    "no upload pdf merge",
  ],
  openGraph: {
    title: "Merge PDF Files — Private & Free | Simple Toolkit",
    description:
      "Merge up to 20 PDFs locally in your browser — no uploads or watermarks. Fast, secure, and free.",
    type: "website",
    url: "/tools/merge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Files — Private & Free",
    description: "Merge PDFs locally in your browser. No uploads, no watermarks, no signup.",
  },
  alternates: { canonical: "/tools/merge" },
};

export default function MergePage() {
  return (
    <>
      <TrackView event="Tool Viewed" props={{ tool: "merge" }} />
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
              <li className="text-gray-900 font-medium">Merge PDFs</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Merge PDF Files
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Combine multiple PDFs into a single document. All processing happens in your browser — 
              no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <MergeTool />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Multiple Files",
                  description:
                    "Merge up to 20 PDF files at once, with a maximum of 50MB per file for optimal performance.",
                },
                {
                  title: "Drag to Reorder",
                  description:
                    "Easily reorder your PDFs by dragging and dropping them into the desired sequence.",
                },
                {
                  title: "Fast Processing",
                  description:
                    "Lightning-fast merging powered by pdf-lib. Most operations complete in seconds.",
                },
                {
                  title: "Private",
                  description:
                    "All merging happens in your browser. Your PDFs never leave your device.",
                },
                {
                  title: "No Watermarks",
                  description:
                    "Get clean PDFs with no watermarks, no ads, and no signup required.",
                },
                {
                  title: "Error Handling",
                  description:
                    "Encrypted PDFs are automatically skipped with detailed error messages.",
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
                    <span>Combine contracts and legal documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Merge invoices and financial statements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Consolidate reports and presentations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Create complete proposal packages</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Personal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Combine scanned documents and forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Merge research papers and materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Create application packages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Organize portfolios and albums</span>
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
                  All merging happens locally on your device.
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
                  <span>How many PDFs can I merge at once?</span>
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
                  You can merge up to 20 PDF files in a single operation. Each file can be up to 50MB in size.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>What happens to encrypted PDFs?</span>
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
                  Password-protected PDFs will be automatically skipped with a detailed error message. The merge will continue with the remaining valid files.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>Is this really free with no watermarks?</span>
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
                  Yes, completely free with no watermarks, no ads, and no signup required.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <span>Can I change the order of PDFs?</span>
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
                  Yes. Simply drag and drop the files in your desired order before merging.
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
                { href: "/tools/split", label: "Split PDFs" },
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
