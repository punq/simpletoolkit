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
    <>
      <TrackView event="Tool Viewed" props={{ tool: "exif-stripper" }} />
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
              <li className="text-gray-900 dark:text-white font-medium">EXIF Stripper</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Strip Image Metadata
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Remove sensitive EXIF data and metadata from your photos before sharing. All processing happens in your browser — 
              no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <ExifStripperTool />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Remove GPS Location",
                  description:
                    "Strip GPS coordinates and location data from photos to protect your privacy and prevent location tracking.",
                },
                {
                  title: "Delete Camera Info",
                  description:
                    "Remove camera make, model, lens information, and other technical metadata embedded in your images.",
                },
                {
                  title: "Strip Timestamps",
                  description:
                    "Delete date and time information to prevent others from knowing when your photos were taken.",
                },
                {
                  title: "JPEG & PNG Support",
                  description:
                    "Works with both JPEG (removes APP1/APP2 markers) and PNG (removes metadata chunks) image formats.",
                },
                {
                  title: "Ultra-Fast Processing",
                  description:
                    "Instant metadata removal using optimized native Web APIs with no external dependencies.",
                },
                {
                  title: "100% Private",
                  description:
                    "All processing happens in your browser. Your images never leave your device or touch our servers.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-black dark:hover:border-white transition-colors"
                >
                  <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Common Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Privacy Protection</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Remove location data before posting to social media</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Strip metadata from real estate listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Protect home address in property photos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Remove personal info before sharing online</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Professional Use</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Clean images for client deliverables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Remove equipment details from portfolio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Strip timestamps from timestamped photos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Prepare images for public distribution</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-16 p-6 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-900 dark:text-white"
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Your Privacy is Protected
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  This tool runs entirely in your browser using native Web APIs (File API, ArrayBuffer, DataView). 
                  Your images are never uploaded to any server, stored, or transmitted over the internet. 
                  All metadata removal happens locally on your device in milliseconds.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>What metadata gets removed?</span>
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-zinc-500 transform group-open:rotate-180 transition-transform"
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
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                  All EXIF data including GPS coordinates, camera make/model, lens info, date/time, copyright, author, software, and other technical metadata. For JPEGs, we strip APP1 and APP2 markers. For PNGs, we remove metadata chunks while preserving the essential image data.
                </div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>Will this affect image quality?</span>
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-zinc-500 transform group-open:rotate-180 transition-transform"
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
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                  No. The tool only removes metadata and preserves the actual image pixels completely unchanged. Your photo will look identical but without the embedded information.
                </div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>What file formats are supported?</span>
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-zinc-500 transform group-open:rotate-180 transition-transform"
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
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Currently JPEG and PNG formats are supported. These are the most common image formats that contain EXIF metadata.
                </div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>How fast is the processing?</span>
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-zinc-500 transform group-open:rotate-180 transition-transform"
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
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Extremely fast. The tool uses optimized binary parsing with native Web APIs, so most images are processed in milliseconds. No uploading or downloading means instant results.
                </div>
              </details>
            </div>
          </div>

          {/* Related Tools */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              More Tools
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
                  className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-black dark:hover:border-white transition-colors text-center font-medium"
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
