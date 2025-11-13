import Link from "next/link";
import Base64UrlEncoder from "../../components/Base64UrlEncoder";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 URL Encoder/Decoder — Standard & URL-Safe | Simple Toolkit",
  description:
    "Encode and decode Base64 strings entirely in your browser. Supports standard and URL-safe Base64 (RFC 4648). Full Unicode support, no uploads, 100% private.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "url safe base64",
    "base64 url encoder",
    "encode base64 online",
    "decode base64",
    "base64 converter",
    "free base64 tool",
    "base64 unicode",
    "rfc 4648",
  ],
  openGraph: {
    title: "Base64 URL Encoder/Decoder — Private & Free | Simple Toolkit",
    description:
      "Encode and decode Base64 strings locally in your browser. Standard and URL-safe modes, full Unicode support. No uploads, completely private.",
    type: "website",
    url: "https://simpletoolkit.app/tools/base64",
    images: [
      {
        url: "https://simpletoolkit.app/stkapp.PNG",
        alt: "Simple Toolkit — Base64 Encoder",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 URL Encoder/Decoder — Private & Free",
    description:
      "Encode and decode Base64 strings with standard and URL-safe support. 100% client-side processing.",
    images: ["https://simpletoolkit.app/stkapp.PNG"],
  },
  alternates: {
    canonical: "https://simpletoolkit.app/tools/base64",
  },
};

export default function Base64Page() {
  return (
    <>
      <TrackView event="Page View" props={{ page: "/tools/base64" }} />
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
              <li className="text-gray-900 dark:text-white font-medium">Base64 Encoder</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Base64 Encoder/Decoder
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-[700px]">
              Encode and decode Base64 strings with standard and URL-safe support. 
              All processing happens in your browser — no uploads, no tracking, completely private.
            </p>
          </div>

          {/* Tool Component */}
          <ErrorBoundary>
            <Base64UrlEncoder />

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <Link
                href="/tools"
                className="hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 rounded px-2 py-1"
              >
                ← Back to Tools
              </Link>
              <span className="text-gray-300 dark:text-zinc-600">|</span>
              <Link
                href="/tools/data-formatter"
                className="hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 rounded px-2 py-1"
              >
                Data Formatter
              </Link>
              <span className="text-gray-300 dark:text-zinc-600">|</span>
              <Link
                href="/tools/exif-stripper"
                className="hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 rounded px-2 py-1"
              >
                EXIF Stripper
              </Link>
              <span className="text-gray-300 dark:text-zinc-600">|</span>
              <Link
                href="/privacy"
                className="hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 rounded px-2 py-1"
              >
                Privacy Policy
              </Link>
              </div>

              {/* Privacy Badge */}
                <div className="mt-12 p-6 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white dark:text-black"
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
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      100% Private, Instant Processing
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      All encoding and decoding happens locally in your browser using native Web APIs. 
                      Your data never leaves your device, is never uploaded to any server, or transmitted over the internet. 
                      Complete privacy guaranteed.
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
                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>What is Base64 encoding?</span>
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
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      Base64 is a binary-to-text encoding scheme that converts binary data into ASCII string format. 
                      It&apos;s widely used for encoding data in emails, data URIs, web tokens (JWT), and anywhere 
                      binary data needs to be transmitted as text. Our tool supports both standard Base64 
                      (RFC 4648 Section 4) and URL-safe Base64 (RFC 4648 Section 5).
                    </div>
                  </details>

                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>What&apos;s the difference between Standard and URL-Safe Base64?</span>
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
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      <p className="mb-3"><strong>Standard Base64 (RFC 4648 Section 4):</strong></p>
                      <ul className="list-disc list-inside space-y-1 mb-4">
                        <li>Uses characters: A-Z, a-z, 0-9, +, /</li>
                        <li>Includes = padding</li>
                        <li>Best for general use cases like email attachments and data URIs</li>
                      </ul>
                      <p className="mb-3"><strong>URL-Safe Base64 (RFC 4648 Section 5):</strong></p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Uses characters: A-Z, a-z, 0-9, -, _</li>
                        <li>No padding characters</li>
                        <li>Safe for URLs, filenames, and web applications where + and / might cause issues</li>
                      </ul>
                    </div>
                  </details>

                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>Does this tool support Unicode characters?</span>
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
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      Yes, absolutely! Unlike many online tools, our encoder properly handles full Unicode text 
                      including emojis, Chinese characters, Arabic text, and special symbols using modern 
                      TextEncoder/TextDecoder APIs. This ensures accurate encoding and decoding of any text.
                    </div>
                  </details>

                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>What&apos;s the maximum input size?</span>
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
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      The tool supports inputs up to 10MB in size. For larger inputs, we automatically 
                      debounce the encoding/decoding operations to maintain smooth performance. The tool 
                      also displays the current input size to help you stay within limits.
                    </div>
                  </details>

                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>Is my data safe? Does it get uploaded anywhere?</span>
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
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      Yes, your data is completely safe. All encoding and decoding happens locally in your browser 
                      using native JavaScript APIs (TextEncoder, TextDecoder, btoa, atob). No data is ever sent to 
                      our servers or any third party. You can even disconnect from the internet after loading the 
                      page and the tool will continue to work perfectly.
                    </div>
                  </details>

                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>What are common use cases for Base64?</span>
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
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      Base64 is commonly used for:
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Embedding images in HTML/CSS (data URIs)</li>
                        <li>JWT tokens for authentication</li>
                        <li>Email attachments (MIME encoding)</li>
                        <li>URL parameters and cookies</li>
                        <li>API request/response data</li>
                        <li>Storing binary data in text-based formats like JSON or XML</li>
                      </ul>
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
                    { href: "/tools/data-formatter", label: "Data Formatter" },
                    { href: "/tools/exif-stripper", label: "Strip Image Metadata" },
                    { href: "/tools/merge", label: "Merge PDFs" },
                    { href: "/tools/split", label: "Split PDFs" },
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
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
}
