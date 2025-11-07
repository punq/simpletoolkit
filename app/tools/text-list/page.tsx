import Link from "next/link";
import TextListUtility from "../../components/TextListUtility";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text List Utility — Deduplicate, Sort, Convert Case | Simple Toolkit",
  description:
    "Process text lists entirely in your browser. Remove duplicates, sort alphabetically, convert case, remove empty lines. No uploads, no watermarks, no signup, no ads. Fast and privacy-first.",
  keywords: [
    "text list processor",
    "remove duplicates",
    "sort lines",
    "deduplicate text",
    "case converter",
    "text list tool",
    "free text tools",
    "no upload text processor",
    "alphabetize list",
    "sort text lines",
  ],
  openGraph: {
    title: "Text List Utility — Private & Free | Simple Toolkit",
    description:
      "Process text lists locally in your browser — remove duplicates, sort, convert case. No uploads, instant results.",
    type: "website",
    url: "/tools/text-list",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text List Utility — Private & Free",
    description: "Process text lists locally in your browser. Remove duplicates, sort, convert case instantly.",
  },
  alternates: { canonical: "/tools/text-list" },
};

export default function TextListPage() {
  return (
    <>
      <TrackView event="Tool Viewed" props={{ tool: "text-list" }} />
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
              <li className="text-gray-900 font-medium" aria-current="page">
                Text List Utility
              </li>
            </ol>
          </nav>

          {/* Main Tool */}
          <ErrorBoundary>
            <TextListUtility />

            {/* Privacy Badge */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              {/* Privacy Badge */}
              <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                      All processing happens locally in your browser using native JavaScript. 
                      Your data never leaves your device, is never uploaded to any server, or transmitted over the internet. 
                      Complete privacy guaranteed.
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
                      <span>Is my data uploaded to a server?</span>
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
                      No. All processing happens entirely in your browser using JavaScript. Your text never leaves
                      your device, making this tool perfect for sensitive or confidential lists like email addresses,
                      customer names, or proprietary data.
                    </div>
                  </details>

                  <details className="group border border-gray-200 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                      <span>How large of a list can I process?</span>
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
                      The tool supports inputs up to 10MB and can handle 100,000+ lines instantly. 
                      It uses optimized algorithms like Set data structures for O(n) deduplication, 
                      making it significantly faster than traditional approaches. For most users, 
                      this is more than sufficient for typical use cases.
                    </div>
                  </details>

                  <details className="group border border-gray-200 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                      <span>Does removing duplicates preserve order?</span>
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
                      Yes. When removing duplicates, the tool keeps the first occurrence of each line and preserves
                      the original order unless you also enable sorting. This ensures predictable results when
                      processing your data.
                    </div>
                  </details>

                  <details className="group border border-gray-200 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                      <span>Is duplicate detection case-sensitive?</span>
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
                      Yes, by default duplicate detection is case-sensitive. This means &quot;Apple&quot; and &quot;apple&quot; 
                      are treated as different lines. However, if you apply case conversion (like lowercase) before 
                      removing duplicates, the tool will compare lines after conversion, effectively making it case-insensitive.
                    </div>
                  </details>

                  <details className="group border border-gray-200 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                      <span>Can I use multiple operations at once?</span>
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
                      Absolutely! You can enable any combination of operations. They are applied in an optimal 
                      order: case conversion → remove empty lines → remove duplicates → sort. This ensures 
                      the best results regardless of which options you select.
                    </div>
                  </details>

                  <details className="group border border-gray-200 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                      <span>What case conversion options are available?</span>
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
                      <p className="mb-3">The tool supports five case conversion types:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li><strong>UPPERCASE:</strong> Converts all text to capital letters</li>
                        <li><strong>lowercase:</strong> Converts all text to lowercase</li>
                        <li><strong>Title Case:</strong> Capitalizes the first letter of each word</li>
                        <li><strong>camelCase:</strong> Perfect for programming variable names</li>
                        <li><strong>snake_case:</strong> Common in Python and database naming</li>
                      </ul>
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
                    { href: "/tools/base64", label: "Base64 Encoder" },
                    { href: "/tools/data-formatter", label: "Data Formatter" },
                    { href: "/tools/exif-stripper", label: "Strip Image Metadata" },
                    { href: "/tools/merge", label: "Merge PDFs" },
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
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
}
