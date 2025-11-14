import Link from 'next/link';
import JwtUtility from '@/app/components/JwtUtility';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import TrackView from '@/app/components/TrackView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JWT Validator & Generator — Client-Side | Simple Toolkit',
  description:
    'Decode, validate, and generate JSON Web Tokens (JWT) entirely in your browser. HS256 generation and verification, RS256 verification via PEM public key. Keys never leave your device.',
  keywords: [
    'jwt',
    'jwt generator',
    'jwt validator',
    'hs256',
    'rs256',
    'json web token',
    'jwt online',
    'client-side crypto',
  ],
  openGraph: {
    title: 'JWT Validator & Generator — Simple Toolkit',
    description:
      'Client-side JWT generator and validator. HS256 generation, RS256 verification with public key PEM. No uploads, keys remain in your browser.',
    type: 'website',
    url: 'https://simpletoolkit.app/tools/jwt',
    images: [
      {
        url: 'https://simpletoolkit.app/stkapp.PNG',
        alt: 'Simple Toolkit — JWT Utility',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JWT Validator & Generator — Simple Toolkit',
    description:
      'Decode, validate, and generate JWTs locally in your browser. HS256 generation and verification; RS256 verification via PEM public key.',
    images: ['https://simpletoolkit.app/stkapp.PNG'],
  },
  alternates: {
    canonical: 'https://simpletoolkit.app/tools/jwt',
  },
};

export default function JwtPage() {
  return (
    <>
      <TrackView event="Page View" props={{ page: '/tools/jwt' }} />
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
              <li className="text-gray-900 dark:text-white font-medium">JWT Utility</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Client-Side JWT Validator & Generator</h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-[700px]">
              Decode, validate, and generate JSON Web Tokens locally in your browser. Zero uploads — your secret keys and private keys never leave your device.
            </p>
          </div>

          <ErrorBoundary>
            <JwtUtility />



              {/* Privacy Badge */}
              <div className="mt-12 p-6 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Zero Uploads — Keys Stay Local</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      All cryptographic operations use the browser Web Crypto API (SubtleCrypto). Secrets and private keys are imported and used only in-memory; nothing is sent to external servers.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>Does my Secret Key leave my browser?</span>
                      <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      No. Keys are imported into the browser&apos;s SubtleCrypto and used in-memory. Nothing is transmitted or stored externally by this app.
                    </div>
                  </details>

                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>Which algorithms are supported?</span>
                      <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      This UI supports HS256 generation and validation, and RS256 verification when you provide a public key PEM. RS256 signing (private key generation) is intentionally not provided to avoid exposing private keys in the browser.
                    </div>
                  </details>

                  <details className="group border border-gray-200 dark:border-zinc-800 rounded-lg">
                    <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between p-6 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <span>Can I verify tokens created elsewhere?</span>
                      <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      Yes. Paste the token and provide the correct shared secret (for HS256) or public key PEM (for RS256) to verify signatures locally.
                    </div>
                  </details>
                </div>
              </div>

              {/* Related Tools */}
              <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">More Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { href: '/tools/base64', label: 'Base64 Encoder' },
                    { href: '/tools/data-formatter', label: 'Data Formatter' },
                    { href: '/tools/exif-stripper', label: 'Strip Image Metadata' },
                    { href: '/tools/merge', label: 'Merge PDFs' },
                  ].map((tool) => (
                    <Link key={tool.href} href={tool.href} className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-black dark:hover:border-white transition-colors text-center font-medium">
                      {tool.label}
                    </Link>
                  ))}
                </div>
              </div>
            
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
}
