import Link from "next/link";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Simple Toolkit | Your Files Never Leave Your Device",
  description:
    "Simple Toolkit processes all files locally in your browser. No uploads, no storage, no tracking. Learn about our privacy-first approach.",
  openGraph: {
    title: "Privacy Policy — Simple Toolkit",
    description: "Your files never leave your device. Learn about our privacy-first approach.",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <TrackView event="Privacy Page Viewed" />
      <main className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 dark:text-gray-100" aria-current="page">
                Privacy
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="space-y-12">
              {/* Header Section */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Privacy
                </h1>
                <p className="text-lg text-muted-foreground dark:text-gray-300 leading-relaxed">
                  Simple Toolkit (simpletoolkit.app) is intentionally privacy-first. All tools process files locally in your browser. 
                  Files you select are not uploaded to our servers, stored, or logged.
                </p>
              </div>

              {/* Core Privacy Principles */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">How We Protect Your Privacy</h2>
                <div className="border-2 border-black dark:border-white p-8 space-y-6">
                  <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">
                    We don&#39;t collect or store the files you process. We use Plausible Analytics, a privacy‑friendly, cookie‑less analytics service, to count visits and basic events. It does not collect personal data, use cookies, or store file content.
                  </p>
                  <ul className="space-y-3 text-muted-foreground dark:text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white font-bold">✓</span>
                      <span>Your files never leave your device</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white font-bold">✓</span>
                      <span>No cookies. No cross‑site tracking. No advertising identifiers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white font-bold">✓</span>
                      <span>Analytics can be blocked by content blockers without affecting functionality</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white font-bold">✓</span>
                      <span>All processing happens client-side using JavaScript in your browser</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Analytics Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">About Analytics</h2>
                <div className="space-y-4 text-muted-foreground dark:text-gray-300">
                  <p className="leading-relaxed">
                    We use <strong className="text-foreground">Plausible Analytics</strong>, a privacy-focused alternative to Google Analytics. Plausible is:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white">•</span>
                      <span><strong className="text-foreground">GDPR, CCPA, and PECR compliant</strong> — no cookie banners needed</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white">•</span>
                      <span><strong className="text-foreground">Open source</strong> — you can review the code</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white">•</span>
                      <span><strong className="text-foreground">Lightweight</strong> — under 1KB script size</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white">•</span>
                      <span><strong className="text-foreground">Privacy-first</strong> — no personal data collection</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Questions?</h2>
                <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">
                  If you have questions about privacy or how your data is handled, email me at{" "}
                  <a 
                    href="mailto:simpletoolkitapp@gmail.com" 
                    className="text-black dark:text-white font-semibold hover:underline"
                  >
                    simpletoolkitapp@gmail.com
                  </a>
                  .
                </p>
              </div>

              {/* Back Link */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                <Link 
                  href="/" 
                  className="inline-flex items-center text-sm text-muted-foreground dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  aria-label="Return to homepage"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}