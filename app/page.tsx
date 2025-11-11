import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Toolkit — Privacy-First Tools | No Signup, No Uploads, Always Free",
  description:
    "Free browser-based tools for PDFs, images, and more. Files never leave your device—everything runs in your browser. No uploads, no ads, no accounts, no watermarks. Professional tools that respect your privacy.",
  openGraph: {
    title: "Simple Toolkit — Privacy-First Tools",
    description: "Free browser-based tools. Files never leave your device. No uploads, no ads, no accounts. Professional tools that respect your privacy.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Clean and Confident */}
      <section className="w-full border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 pt-20 sm:pt-32 pb-16 sm:pb-24">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold tracking-wide uppercase mb-8">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            <span>100% Client-Side Processing</span>
          </div>

          {/* Main Value Prop */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-[900px]">
            Professional tools that respect your{" "}
            <span className="shimmer-text">privacy</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-[600px] mb-8 leading-relaxed">
            PDFs, images, text, and dev utilities—all running entirely in your browser. 
            No uploads. No accounts. No ads. No compromises.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link 
              href="/tools" 
              className="inline-flex items-center justify-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              aria-label="Explore all available tools"
            >
              Explore Tools
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              href="#verify" 
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white text-sm font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              aria-label="Learn how client-side processing works"
            >
              See How It Works
            </Link>
          </div>

          {/* Proof Points */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-border dark:border-zinc-700">
            {[
              { value: "0", label: "Files uploaded to servers" },
              { value: "0", label: "Ads shown" },
              { value: "0", label: "Accounts required" },
              { value: "0", label: "Cookies used" }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold mb-1 tabular-nums text-black dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="w-full bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-black dark:text-white">What makes us different</h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              Unlike typical online tools, your files <strong className="text-black dark:text-white">never touch our servers</strong>. 
              Everything happens in your browser using JavaScript—no uploads, no storage, no server-side processing. 
              We can&apos;t see your files because they never leave your device. This is the privacy guarantee.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700 text-sm text-gray-700 dark:text-gray-200">
              <strong className="text-black dark:text-white">No ads.</strong> No affiliate links. No cookies. No premium tiers. No paywalls.
              <br />
              We use privacy-focused Plausible for anonymous page view stats. It&apos;s cookieless, GDPR-compliant, and doesn&apos;t track individuals.
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Preview */}
      <section className="w-full bg-white dark:bg-black">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-black dark:text-white">Popular Tools</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-[600px] mx-auto">
              The most-used privacy-focused tools. Everything runs in your browser—files never leave your device.
            </p>
          </div>

          {/* Featured 4 tools in 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                href: "/tools/image-converter",
                title: "Convert Images",
                description: "Convert between JPEG, PNG, and WebP formats. Adjust quality and batch process.",
                category: "IMAGE"
              },
              {
                href: "/tools/merge",
                title: "Merge PDFs",
                description: "Combine multiple PDF files into a single document. Drag to reorder before merging.",
                category: "PDF"
              },
              {
                href: "/tools/split",
                title: "Split PDFs",
                description: "Extract specific pages or split a PDF into multiple documents.",
                category: "PDF"
              },
              {
                href: "/tools/exif-stripper",
                title: "Strip Image Metadata",
                description: "Remove EXIF, GPS, and camera data from JPEG and PNG images for privacy.",
                category: "IMAGE"
              }
            ].map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group block p-8 border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 group-hover:text-gray-300 dark:group-hover:text-gray-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-200 dark:group-hover:text-gray-600 uppercase tracking-wide">
                      {tool.category}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed group-hover:text-gray-100 dark:group-hover:text-gray-700 transition-colors">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>

          {/* More Tools Teaser - Clean B&W design */}
          <div className="border-2 border-black dark:border-white p-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">More Tools Available</h3>
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
                Compress PDFs • Rearrange PDFs • Data Formatter • Base64 Encoder • Text List Utilities
              </p>
              <Link 
                href="/tools" 
                className="inline-flex items-center text-sm font-semibold underline hover:no-underline text-black dark:text-white"
              >
                Browse all tools
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="hidden sm:block">
              <svg className="w-16 h-16 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 17a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 17a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Technical Proof */}
      <section id="verify" className="w-full bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Verify, don&apos;t trust
              </h2>
              <div className="space-y-4 text-gray-300 dark:text-gray-400">
                <p className="text-base leading-relaxed">
                  Open your browser&apos;s Network tab. Upload a file. Process it. Watch what happens.
                </p>
                <p className="text-base leading-relaxed">
                  You&apos;ll see <strong className="text-white dark:text-gray-100">zero file uploads to our servers</strong>. Your files stay on your device. 
                  This isn&apos;t marketing—it&apos;s how the application is architecturally built.
                </p>
                <p className="text-base leading-relaxed">
                  Everything runs using the File API and pdf-lib library entirely in your browser. 
                  Your files are processed in memory and downloaded directly back to you.
                </p>
                <p className="text-sm leading-relaxed border-l-2 border-zinc-700 dark:border-zinc-600 pl-4 mt-6">
                  <strong className="text-white dark:text-gray-100">Note on analytics:</strong> We use Plausible for anonymous page view counts (not file processing). 
                  No cookies, no personal data, no IP addresses stored. Just aggregated stats to understand which tools are useful.
                </p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-zinc-700 dark:border-zinc-600">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4">Technical Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {['Next.js', 'TypeScript', 'pdf-lib', 'File API', 'Client-side only'].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-mono border border-zinc-700 dark:border-zinc-600">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 dark:bg-zinc-950 border border-zinc-700 dark:border-zinc-600 p-6">
              <div className="font-mono text-xs sm:text-sm leading-relaxed space-y-1">
                <div className="text-green-400 dark:text-green-500">{'//'} All processing happens locally</div>
                <div className="text-white">const <span className="text-blue-400">processFile</span> = async (file) =&gt; &#123;</div>
                <div className="ml-4 text-green-400 dark:text-green-500">{'//'} Read in browser memory</div>
                <div className="ml-4 text-gray-300 dark:text-gray-400">const buffer = await file.arrayBuffer();</div>
                <div className="ml-4 text-gray-300 dark:text-gray-400">const data = new Uint8Array(buffer);</div>
                <div className="ml-4 text-gray-300 dark:text-gray-400"></div>
                <div className="ml-4 text-green-400 dark:text-green-500">{'//'} Process with Web APIs</div>
                <div className="ml-4 text-gray-300 dark:text-gray-400">const result = await transform(data);</div>
                <div className="ml-4 text-gray-300 dark:text-gray-400"></div>
                <div className="ml-4 text-green-400 dark:text-green-500">{'//'} Download directly - no server</div>
                <div className="ml-4 text-gray-300 dark:text-gray-400">const blob = new Blob([result]);</div>
                <div className="ml-4 text-gray-300 dark:text-gray-400">downloadFile(blob, &apos;output.pdf&apos;);</div>
                <div className="text-white">&#125;;</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="w-full bg-white dark:bg-black">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-black dark:text-white">Why this matters</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-[600px]">
              Most &quot;free&quot; tools aren&apos;t free—you pay with your data, privacy, and attention
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Your files stay private",
                description: "Processing happens in your browser. No servers means no risk of data breaches, no terms of service changes, no one can access your documents."
              },
              {
                title: "Works offline",
                description: "After the page loads, disconnect from the internet and it still works. All processing happens locally in your browser."
              },
              {
                title: "No paywalls",
                description: "No \"upgrade to pro\" prompts. No feature locks. Actually free forever. Only limited by your device's capabilities."
              },
              {
                title: "Genuinely free",
                description: "Not free-to-try. Not freemium. Not ad-supported. Free. Optional donations keep it running."
              },
              {
                title: "Minimal analytics",
                description: "Privacy-focused Plausible for page view stats only. No cookies. No fingerprinting. No personal data or IP addresses stored."
              },
              {
                title: "Open source for transparency",
                description: "Code is public on GitHub so you can verify our privacy claims. Audit the source, check network traffic, confirm files stay local. Trust through transparency."
              }
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-black dark:border-white pl-4">
                <h3 className="text-lg font-bold mb-2 text-black dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="w-full bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-black dark:text-white">
            Support independent software
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-200 max-w-[500px] mx-auto mb-8">
            SimpleToolkit is free and always will be. If you find it useful, 
            consider supporting the hosting and development costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/donate" 
              className="inline-flex items-center justify-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              aria-label="Support SimpleToolkit development"
            >
              Support This Project
            </Link>
            <Link 
              href="https://github.com/punq/simpletoolkit" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white text-sm font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              aria-label="View source code on GitHub"
            >
              <svg className="w-4 h-4 mr-2 fill-current" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
              View on GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
