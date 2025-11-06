import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Toolkit — Privacy-First Tools | No Signup, No Tracking, Always Free",
  description:
    "Free browser-based tools for PDFs, images, and more. 100% private—files never leave your device. No uploads, no tracking, no ads, no watermarks. Professional tools that respect your privacy.",
  openGraph: {
    title: "Simple Toolkit — Privacy-First Tools",
    description: "Free browser-based tools. 100% private, no uploads, no tracking. Professional tools that respect your privacy.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section - Bold & Distinctive */}
      <section aria-labelledby="hero-heading" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-28 pb-16 sm:pb-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-success/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        
        <div className="text-center space-y-8 relative z-10">
          {/* Distinctive badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold shadow-sm" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--primary)/10', color: 'var(--primary)' }}>
            <span className="relative flex h-2 w-2" aria-label="Active">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--success)' }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--success)' }}></span>
            </span>
            <span className="text-foreground">100% Private • No Servers • No Tracking</span>
          </div>

          <div className="space-y-6">
            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Simple Tools That
              <br />
              <span className="relative inline-block mt-2">
                <span className="gradient-text font-black">
                  Respect Your Privacy
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 10C50 3 100 2 150 5C200 8 250 3 298 7" stroke="var(--success)" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed px-4" style={{ color: 'var(--muted-foreground)' }}>
              No signups. No uploads. No tracking. No ads. No watermarks. No premium tiers.
              <br />
              <strong className="text-foreground font-bold">PDFs, images, text—all free, forever.</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              href="/tools"
              className="group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-bold rounded-xl text-primary-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-lg hover:shadow-xl hover:scale-105 bg-primary hover:bg-primary-hover"
              style={{ minWidth: '200px' }}
            >
              Get Started Free
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/donate"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-bold rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-background hover:bg-accent border-border hover:border-primary/30"
              style={{ minWidth: '200px' }}
            >
              Support This Project
            </Link>
          </div>

          {/* Social proof / stats - The Hook */}
          <div className="pt-12 sm:pt-16">
            <p className="text-sm font-semibold uppercase tracking-wide mb-6" style={{ color: 'var(--muted)' }}>
              What We Don't Do
            </p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="text-4xl sm:text-5xl font-black text-foreground tabular-nums">0</div>
                <div className="text-sm sm:text-base font-medium" style={{ color: 'var(--muted-foreground)' }}>Files Uploaded</div>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="text-4xl sm:text-5xl font-black text-foreground tabular-nums">0</div>
                <div className="text-sm sm:text-base font-medium" style={{ color: 'var(--muted-foreground)' }}>Ads Shown</div>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="text-4xl sm:text-5xl font-black text-foreground tabular-nums">0</div>
                <div className="text-sm sm:text-base font-medium" style={{ color: 'var(--muted-foreground)' }}>Logins Required</div>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="text-4xl sm:text-5xl font-black text-foreground tabular-nums">0</div>
                <div className="text-sm sm:text-base font-medium" style={{ color: 'var(--muted-foreground)' }}>Data Collected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different - More Visual */}
      <section aria-labelledby="features-heading" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-4xl sm:text-5xl font-bold mb-4">
            Why We're <span className="text-primary">Different</span>
          </h2>
          <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
            We're not just another PDF tool. We're what you wish existed all along.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Large featured card */}
          <article className="md:col-span-2 relative overflow-hidden rounded-2xl border-2 p-8 sm:p-10 bg-gradient-to-br from-primary/5 via-background to-success/5 hover:shadow-xl transition-all group" style={{ borderColor: 'var(--primary)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-700" aria-hidden="true"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Lock icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">Your Files Stay on Your Device</h3>
              </div>
              <p className="text-lg leading-relaxed max-w-3xl" style={{ color: 'var(--muted-foreground)' }}>
                Unlike every other PDF tool, we <strong className="text-foreground">literally cannot access your files</strong>. There's no server, no upload, no temporary storage. Your browser does all the work. It's not a feature—it's our architecture.
              </p>
            </div>
          </article>

          {/* Comparison cards */}
          <article className="relative overflow-hidden rounded-2xl border p-6 bg-card-bg hover:shadow-lg transition-all group" style={{ borderColor: 'var(--card-border)' }}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--icon-simple)' }}>
                  <svg className="w-6 h-6 text-[#db2777]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Cross icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">Others</span>
              </div>
              <h3 className="text-xl font-semibold">The Usual Suspects</h3>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Upload files to their servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Add watermarks unless you pay</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Track everything you do</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Show ads everywhere</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Require account creation</span>
                </li>
              </ul>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl border-2 p-6 bg-gradient-to-br from-success/5 to-background hover:shadow-xl transition-all group" style={{ borderColor: 'var(--success)' }}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--icon-trust)' }}>
                  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Check icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-success/10 text-success">Simple Toolkit</span>
              </div>
              <h3 className="text-xl font-semibold">How It Should Be</h3>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span><strong className="text-foreground">Everything</strong> stays local</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span><strong className="text-foreground">No watermarks</strong>, ever</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span><strong className="text-foreground">Zero tracking</strong> or analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span><strong className="text-foreground">Ad-free</strong> forever</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span><strong className="text-foreground">No account</strong> needed</span>
                </li>
              </ul>
            </div>
          </article>

          {/* Bottom cards */}
          <article className="rounded-2xl border p-6 bg-card-bg hover:shadow-lg transition-all" style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--icon-speed)' }}>
                <svg className="w-6 h-6 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>Lightning icon</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Actually Fast</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  No upload time, no queue, no waiting. Your browser is surprisingly powerful—we just let it do its job.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border p-6 bg-card-bg hover:shadow-lg transition-all" style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--icon-community)' }}>
                <svg className="w-6 h-6 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>Heart icon</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Donation-Powered</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  No investors to please, no users to monetize. Just a tool that works, supported by people who appreciate that.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CTA Section - Bold & Different */}
      <section aria-labelledby="cta-heading" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border-2 p-12 sm:p-16 text-center shadow-2xl" style={{ borderColor: 'var(--primary)', background: 'linear-gradient(135deg, var(--primary)/10 0%, var(--success)/5 100%)' }}>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl" aria-hidden="true"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 id="cta-heading" className="text-4xl sm:text-5xl font-bold">
              Stop uploading.
              <br />
              <span className="text-primary">Start creating.</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
              They ask you to trust them with your files.
              <br />
              <strong className="text-foreground">We can't touch them even if we wanted to.</strong>
            </p>
            <Link 
              href="/tools"
              className="group inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Try It Now—No Signup
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted">
            Built with privacy and simplicity in mind. Your files are processed locally and never sent to any server.
          </p>
          <div className="text-sm text-muted">
            <Link className="underline hover:text-foreground transition-colors" href="/privacy">Privacy Policy</Link>
            {" · "}
            <Link className="underline hover:text-foreground transition-colors" href="/donate">Support This Project</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
