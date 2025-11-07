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
    url: "https://simpletoolkit.com/tools/base64",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 URL Encoder/Decoder — Private & Free",
    description:
      "Encode and decode Base64 strings with standard and URL-safe support. 100% client-side processing.",
  },
  alternates: {
    canonical: "https://simpletoolkit.com/tools/base64",
  },
};

export default function Base64Page() {
  return (
    <>
      <TrackView event="Page View" props={{ page: "/tools/base64" }} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <ErrorBoundary>
          <Base64UrlEncoder />

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                <Link
                  href="/tools"
                  className="hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded px-2 py-1"
                >
                  ← Back to Tools
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/tools/data-formatter"
                  className="hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded px-2 py-1"
                >
                  Data Formatter
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/tools/exif-stripper"
                  className="hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded px-2 py-1"
                >
                  EXIF Stripper
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/privacy"
                  className="hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded px-2 py-1"
                >
                  Privacy Policy
                </Link>
              </div>

              {/* SEO Content */}
              <div className="mt-12 prose prose-sm max-w-none text-gray-600">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About Base64 Encoding
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What is Base64?
                    </h3>
                    <p className="mb-4">
                      Base64 is a binary-to-text encoding scheme that converts binary data into
                      ASCII string format. It's widely used for encoding data in emails, data URIs,
                      web tokens (JWT), and anywhere binary data needs to be transmitted as text.
                    </p>
                    <p>
                      Our tool supports both standard Base64 (RFC 4648 Section 4) and URL-safe
                      Base64 (RFC 4648 Section 5) encoding and decoding.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Standard vs URL-Safe Base64
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        <strong>Standard Base64:</strong> Uses +, /, and = for padding. Best for
                        general use cases like email attachments and data URIs.
                      </li>
                      <li>
                        <strong>URL-Safe Base64:</strong> Uses -, _, and no padding. Safe for URLs,
                        filenames, and web applications where + and / might cause issues.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Full Unicode Support
                    </h3>
                    <p>
                      Unlike many online tools, our encoder properly handles full Unicode text
                      including emojis, Chinese characters, and special symbols using modern
                      TextEncoder/TextDecoder APIs.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      100% Client-Side
                    </h3>
                    <p>
                      All encoding and decoding happens in your browser using native Web APIs.
                      No data is ever uploaded to a server, ensuring complete privacy and security.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Common Use Cases
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Embedding images in HTML/CSS</li>
                      <li>JWT tokens for authentication</li>
                      <li>Email attachments (MIME)</li>
                      <li>URL parameters and cookies</li>
                      <li>API request/response data</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Why Use Our Base64 Encoder?
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Real-time encoding/decoding as you type</li>
                    <li>Auto-detection of Base64 format</li>
                    <li>Support for large files (up to 10MB)</li>
                    <li>Copy to clipboard with one click</li>
                    <li>Download encoded/decoded output</li>
                    <li>Keyboard shortcuts for power users</li>
                    <li>No ads, no tracking, no sign-up required</li>
                    <li>Works offline after initial page load</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
}
