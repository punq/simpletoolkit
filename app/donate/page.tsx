import Link from "next/link";
import TrackView from "@/app/components/TrackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Simple Toolkit — Help Keep It Free & Privacy-First",
  description:
    "Support Simple Toolkit with a donation to help cover hosting costs and keep our privacy-focused tools free and accessible to everyone.",
  openGraph: {
    title: "Support Simple Toolkit",
    description: "Help keep our privacy-first tools free and accessible for everyone.",
  },
};

export default function DonatePage() {
  return (
    <>
      <TrackView event="Donate Page Viewed" />
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
                Donate
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="space-y-12">
              {/* Header Section */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Support Simple Toolkit
                </h1>
                <p className="text-lg text-muted-foreground dark:text-gray-300 leading-relaxed">
                  Thanks for considering a donation. This project (simpletoolkit.app) is intentionally small and free — 
                  your donation helps cover domain and hosting costs and keeps the tools ad-free and privacy-first.
                </p>
              </div>

              {/* Support Options */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Support Options</h2>
                <div className="border-2 border-black dark:border-white p-8 flex flex-col items-center text-center space-y-4">
                  <div className="text-xl font-bold mb-2">Buy me a coffee</div>
                  <p className="text-muted-foreground dark:text-gray-300 mb-4">Support with a one-time donation</p>
                  <a 
                    href="https://buymeacoffee.com/simpletoolkit" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Support via Buy Me a Coffee"
                    className="inline-flex items-center justify-center bg-[#FFDD00] px-6 py-3 text-base font-semibold text-[#000000] hover:bg-[#FFED4E] transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z"/>
                    </svg>
                    Buy me a coffee
                  </a>
                </div>
              </div>

              {/* Impact Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">How Your Support Helps</h2>
                <div className="border-2 border-black dark:border-white p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-black dark:bg-white" 
                        style={{ width: '45%' }} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">
                      <span className="font-bold text-foreground">~$20</span> yearly hosting costs covered
                    </p>
                  </div>
                  <ul className="space-y-3 text-muted-foreground dark:text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white font-bold">✓</span>
                      <span>Keep the tools free and accessible</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white font-bold">✓</span>
                      <span>Maintain fast, reliable hosting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white font-bold">✓</span>
                      <span>Enable future feature development</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black dark:text-white font-bold">✓</span>
                      <span>Support privacy-focused tools</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Other Ways to Help */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Other Ways to Help</h2>
                <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">
                  Can&#39;t donate? No problem! You can still help by:
                </p>
                <ul className="space-y-3 text-muted-foreground dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-black dark:text-white">•</span>
                    <span>Sharing Simple Toolkit with others who might find it useful</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black dark:text-white">•</span>
                    <span>Providing feedback or reporting issues - send to me at simpletoolkit@gmail.com</span>
                  </li>
                </ul>
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