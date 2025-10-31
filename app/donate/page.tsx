import Link from "next/link";

export default function DonatePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">Support Simple Toolkit</h1>
            <p className="text-muted leading-relaxed">
              Thanks for considering a donation. This project (simpletoolkit.app) is intentionally small and free — 
              your donation helps cover domain and hosting costs and keeps the tools ad-light and privacy-first.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight">Donate</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-6">
        
                <a 
                  href="https://buymeacoffee.com/simpletoolkit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Buy me a coffee
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">If you prefer not to donate</h3>
            <p className="text-muted leading-relaxed">
              No problem! You can still help by sharing Simple Toolkit with others who might find it useful.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/" className="text-sm text-muted hover:text-foreground transition-all relative link-underline">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}