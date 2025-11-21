
import Link from "next/link";
import TrackView from "@/app/components/TrackView";

export default function DisclaimerPage() {
  return (
    <>
      <TrackView event="Disclaimer Page Viewed" />
      <main className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-[700px] mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 dark:text-gray-100" aria-current="page">Disclaimer</li>
            </ol>
          </nav>

          <section className="mb-12">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Disclaimer</h1>
            <p className="text-lg text-muted-foreground dark:text-gray-300 mb-2">SimplePDFToolkit is a free, browser-based utility tool. All processing happens locally on your device; no data is uploaded to our servers.</p>
            <ul className="list-disc pl-6 space-y-2 text-base text-muted-foreground dark:text-gray-300">
              <li>Use at your own discretion and risk.</li>
              <li>No warranties, express or implied, regarding accuracy, reliability, or suitability.</li>
              <li>We are not responsible for any loss, damage, or legal issues from use or misuse.</li>
              <li>You are responsible for compliance with laws in your jurisdiction (including Canada).</li>
              <li>This tool is provided "as is" without guarantees.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">Limitation of Liability</h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <ul className="space-y-3 text-base">
                <li>SimplePDFToolkit, its creators, and contributors are not liable for any direct, indirect, incidental, or consequential damages.</li>
                <li>No legal advice is provided; consult a professional for legal matters.</li>
                <li>If you do not agree with these terms, please do not use the application.</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">Contact</h2>
            <p className="text-base text-muted-foreground dark:text-gray-300">Questions about this disclaimer? Email <a href="mailto:simpletoolkitapp@gmail.com" className="text-black dark:text-white font-semibold hover:underline">simpletoolkitapp@gmail.com</a></p>
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
