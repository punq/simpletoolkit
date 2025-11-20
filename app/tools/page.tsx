import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools — Simple Toolkit",
  description:
    "Powerful, privacy-first tools that run entirely in your browser. No uploads, no tracking, just utility.",
};

// Reusable Card Component for the Bento Grid
function ToolCard({
  href,
  title,
  description,
  icon,
  size = "normal",
  badge,
  className = "",
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  size?: "normal" | "large" | "wide";
  badge?: string;
  className?: string;
}) {
  // Size classes
  const sizeClasses = {
    normal: "col-span-1 row-span-1",
    large: "col-span-1 sm:col-span-2 row-span-2",
    wide: "col-span-1 sm:col-span-2 row-span-1",
  };

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[2rem] bg-neutral-50 dark:bg-[#1c1c1e] border border-neutral-200 dark:border-[#2c2c2e] p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-black/50 ${sizeClasses[size]} ${className}`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-black/50 border border-neutral-100 dark:border-[#3a3a3c] text-black dark:text-white">
              {icon}
            </div>
            {badge && (
              <span className="px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-black/5 dark:bg-white/10 text-black dark:text-white backdrop-blur-md">
                {badge}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
            {title}
          </h3>
          <p className="text-neutral-500 dark:text-[#86868b] font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-6 flex items-center text-sm font-semibold text-black dark:text-white opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          Open Tool <span className="ml-1">→</span>
        </div>
      </div>

      {/* Subtle gradient blob for hover effect */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-neutral-200/50 to-transparent dark:from-white/5 dark:to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
}

// Icons
const Icons = {
  Merge: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 19l4 4 4-4" /><path d="M12 3v20" /><path d="M20 14v-4a2 2 0 0 0-2-2h-4" /><path d="M4 14v-4a2 2 0 0 1 2-2h4" /></svg>
  ),
  Split: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18" /><path d="M8 7l4-4 4 4" /><path d="M8 17l4 4 4-4" /></svg>
  ),
  Compress: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6" /><path d="M4 10h6" /><path d="M14 10h6" /><path d="M14 14h6" /><path d="M8 19l4-4 4 4" /><path d="M12 15v9" /><path d="M8 5l4 4 4-4" /><path d="M12 9V0" /></svg>
  ),
  Redact: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
  ),
  Text: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  ),
  Code: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  ),
  Image: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
  ),
  Lock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  List: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
  ),
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neutral-100/50 dark:bg-neutral-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-100/50 dark:bg-neutral-900/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 py-20 sm:py-28">

        {/* Header */}
        <header className="mb-20 max-w-3xl animate-fade-in">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter mb-6 text-black dark:text-white">
            Tools.
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-neutral-500 dark:text-[#86868b] leading-relaxed">
            A collection of privacy-first utilities designed for speed and simplicity.
            <span className="text-black dark:text-white"> No uploads. No tracking.</span>
          </p>
        </header>

        {/* PDF Tools Section */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">PDF</h2>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-[#333]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard
              href="/tools/merge"
              title="Merge"
              description="Combine multiple PDFs into a single file. Drag & drop reordering."
              icon={<Icons.Merge />}
              size="large"
              badge="Popular"
            />
            <ToolCard
              href="/tools/split"
              title="Split"
              description="Extract pages or split documents into separate files."
              icon={<Icons.Split />}
            />
            <ToolCard
              href="/tools/compress"
              title="Compress"
              description="Reduce file size while maintaining quality."
              icon={<Icons.Compress />}
            />
            <ToolCard
              href="/tools/rearrange"
              title="Organize"
              description="Rotate, delete, and reorder pages instantly."
              icon={<Icons.List />}
            />
            <ToolCard
              href="/tools/redact"
              title="Redact"
              description="Permanently remove sensitive information."
              icon={<Icons.Redact />}
            />
            <ToolCard
              href="/tools/pdf-text-extractor"
              title="Extract Text"
              description="Pull selectable text from any PDF document."
              icon={<Icons.Text />}
              className="sm:col-span-2"
            />
          </div>
        </section>

        {/* Developer Tools Section */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Developer</h2>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-[#333]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              href="/tools/data-formatter"
              title="JSON / YAML"
              description="Format, validate, and convert data structures."
              icon={<Icons.Code />}
              size="wide"
            />
            <ToolCard
              href="/tools/base64"
              title="Base64"
              description="Encode and decode strings and files."
              icon={<Icons.Code />}
            />
            <ToolCard
              href="/tools/jwt"
              title="JWT Debugger"
              description="Decode and verify JSON Web Tokens."
              icon={<Icons.Lock />}
              badge="New"
            />
          </div>
        </section>

        {/* Image & Privacy Section */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Media & Privacy</h2>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-[#333]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              href="/tools/image-converter"
              title="Converter"
              description="Transform images between PNG, JPG, and WebP."
              icon={<Icons.Image />}
            />
            <ToolCard
              href="/tools/exif-stripper"
              title="EXIF Stripper"
              description="Remove location and metadata from photos."
              icon={<Icons.Lock />}
            />
            <ToolCard
              href="/tools/text-list"
              title="List Tools"
              description="Deduplicate, sort, and clean text lists."
              icon={<Icons.List />}
            />
          </div>
        </section>

        {/* Footer Promise */}
        <footer className="mt-32 pt-12 border-t border-neutral-200 dark:border-[#333] text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-2xl font-bold mb-4">Privacy by Design</h3>
          <p className="text-neutral-500 dark:text-[#86868b] max-w-2xl mx-auto mb-8">
            Simple Toolkit is open source and runs 100% in your browser.
            Your files never leave your device.
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium">
            <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="https://github.com/punq/simpletoolkit" className="hover:text-neutral-900 dark:hover:text-white transition-colors">GitHub</Link>
            <Link href="/donate" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Donate</Link>
          </div>
        </footer>

      </main>
    </div>
  );
}
