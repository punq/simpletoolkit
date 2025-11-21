import Link from "next/link";
import TrackView from "@/app/components/TrackView";
import AnalyticsToggle from "@/app/components/AnalyticsToggle";
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
        <div className="max-w-[700px] mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 dark:text-gray-100" aria-current="page">Privacy</li>
            </ol>
          </nav>

          <section className="mb-12">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Your Privacy, Simply Protected</h1>
            <p className="text-lg text-muted-foreground dark:text-gray-300 mb-2">Simple Toolkit is designed so your files never leave your device. All processing happens locally in your browser.</p>
            <ul className="list-disc pl-6 space-y-2 text-base text-muted-foreground dark:text-gray-300">
              <li>No uploads. No storage. No tracking of your files.</li>
              <li>No cookies. No advertising. No cross-site tracking.</li>
              <li>All tools work fully offline.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">Privacy Principles</h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <ul className="space-y-3 text-base">
                <li>Your files never leave your device.</li>
                <li>No personal data is collected.</li>
                <li>No cookies or identifiers.</li>
                <li>Analytics are optional and privacy-friendly.</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">Analytics</h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col gap-4">
              <p className="text-base text-muted-foreground dark:text-gray-300">We use Plausible Analytics, a privacy-first, cookie-less service. Analytics are <span className="font-semibold">enabled by default</span>, and you can opt out at any time below. No personal data or file contents are ever sent.</p>
              <div className="flex justify-center py-2">
                <AnalyticsToggle />
              </div>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Tracks only anonymous usage: tool used, success/failure, duration.</li>
                <li>No filenames, file contents, or personal info.</li>
                <li>GDPR, CCPA, PECR compliant.</li>
                <li>Can be blocked by content blockers.</li>
                <li>You can opt out at any time using the toggle above.</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">Contact</h2>
            <p className="text-base text-muted-foreground dark:text-gray-300">Questions about privacy? Email <a href="mailto:simpletoolkitapp@gmail.com" className="text-black dark:text-white font-semibold hover:underline">simpletoolkitapp@gmail.com</a></p>
          </section>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Return to homepage">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}