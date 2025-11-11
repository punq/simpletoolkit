import Link from "next/link";
import ImageConverterTool from "../../components/ImageConverterTool";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Format Converter — Convert JPEG, PNG, WebP | Simple Toolkit",
  description:
    "Convert images between JPEG, PNG, and WebP formats entirely in your browser. Adjust quality, batch convert, resize. 100% private, no uploads.",
  keywords: [
    "image converter",
    "convert jpg to png",
    "convert png to jpg",
    "convert webp to jpg",
    "convert jpeg to png",
    "webp converter",
    "image format converter",
    "free image converter",
    "online image converter",
    "convert images online",
    "no upload image converter",
    "privacy image converter",
    "batch image converter",
  ],
  openGraph: {
    title: "Image Format Converter — Private & Free | Simple Toolkit",
    description:
      "Convert images between JPEG, PNG, and WebP formats locally in your browser. No uploads, no tracking, completely private.",
    type: "website",
    url: "/tools/image-converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Format Converter — Private & Free",
    description: "Convert images locally in your browser. No uploads, completely private.",
  },
  alternates: { canonical: "/tools/image-converter" },
};

export default function ImageConverterPage() {
  return (
    <>
      <TrackView event="Tool Viewed" props={{ tool: "image-converter" }} />
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
              <li className="text-gray-900 dark:text-white font-medium">Image Converter</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Convert Image Formats
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-[700px]">
              Convert between JPEG, PNG, and WebP formats with quality control. All processing happens in your browser — 
              no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <ImageConverterTool />
          </ErrorBoundary>

          {/* Features Grid */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Multiple Formats",
                  description:
                    "Convert between JPEG, PNG, and WebP formats. Support for BMP, GIF, and ICO as input formats.",
                },
                {
                  title: "Quality Control",
                  description:
                    "Adjust compression quality for JPEG and WebP formats to balance file size and image quality.",
                },
                {
                  title: "Batch Processing",
                  description:
                    "Convert up to 20 images at once with automatic sequential downloading.",
                },
                {
                  title: "Instant Conversion",
                  description:
                    "Lightning-fast conversion using Canvas API. Most images convert in milliseconds.",
                },
                {
                  title: "Size Comparison",
                  description:
                    "See original vs. converted file sizes to understand compression impact.",
                },
                {
                  title: "100% Private",
                  description:
                    "All conversion happens in your browser. Your images never leave your device or touch our servers.",
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
                <h3 className="text-lg font-semibold mb-3">Web Optimization</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Convert PNG to JPEG to reduce file size for faster page loads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Convert images to WebP for modern browser optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Batch convert product images for e-commerce sites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Optimize social media images before posting</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Quality Preservation</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Convert JPEG to PNG for lossless editing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Preserve transparency when converting to PNG</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Convert old formats (BMP, GIF) to modern formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-zinc-500 mt-1">•</span>
                    <span>Prepare images for printing or archival</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Client-Side Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  This tool uses the HTML5 Canvas API built into your browser. When you select images:
                </p>
                <ol className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">1.</span>
                    <span>Images load into browser memory (never uploaded)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">2.</span>
                    <span>Canvas API draws and re-encodes in chosen format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">3.</span>
                    <span>Converted image downloads directly to your device</span>
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Your Privacy is Protected
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  This tool runs entirely in your browser using the Canvas API. 
                  Your images are never uploaded to any server, stored, or transmitted over the internet. 
                  All conversion happens locally on your device in milliseconds.
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
                  <span>What image formats are supported?</span>
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
                  You can convert TO: JPEG, PNG, or WebP. Input formats supported: JPEG, PNG, WebP, BMP, GIF, and ICO. The tool automatically handles transparency for PNG conversions.
                </div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>Will converting affect image quality?</span>
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
                  PNG is lossless, so quality is preserved. JPEG and WebP are lossy formats where you can adjust the quality slider (1-100%). Higher quality means larger files but better image appearance. The default 92% setting provides excellent quality while reducing file size.
                </div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>What&apos;s the maximum file size?</span>
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
                  You can convert images up to 50MB in size. You can process up to 20 images at once. This ensures optimal performance in the browser.
                </div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>Does this work offline?</span>
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
                  Once the page loads, all conversion happens locally using browser APIs. However, you need an initial internet connection to load the page. After that, no network activity occurs during conversion.
                </div>
              </details>

              <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <summary className="cursor-pointer text-base font-medium flex items-center justify-between p-4 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span>Which format should I choose?</span>
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
                  JPEG: Best for photos, offers smallest file sizes. PNG: Best for graphics, logos, or when you need transparency. WebP: Modern format with excellent compression, ideal for web use (not supported by older browsers).
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
                { href: "/tools/exif-stripper", label: "Strip Image Metadata" },
                { href: "/tools/merge", label: "Merge PDFs" },
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
