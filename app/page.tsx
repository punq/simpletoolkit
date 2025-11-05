import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">Simple Toolkit</h1>
          <p className="text-muted">Private, fast, and easy to use.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link 
            href="/tools/merge" 
            className="group block rounded-lg border border-border p-6 transition-all hover:border-foreground/20 hover:shadow-lg"
          >
            <h3 className="font-medium">Merge PDFs</h3>
            <p className="mt-2 text-sm text-muted">Merge up to 20 PDFs locally in your browser — no uploads.</p>
          </Link>

          <Link 
            href="/tools/split" 
            className="group block rounded-lg border border-border p-6 transition-all hover:border-foreground/20 hover:shadow-lg"
          >
            <h3 className="font-medium">Split PDF</h3>
            <p className="mt-2 text-sm text-muted">Extract pages, ranges, or split into individual pages — all locally.</p>
          </Link>

          <div className="block rounded-lg border border-border/50 p-6 opacity-70">
            <h3 className="font-medium">Rotate / Rearrange (coming soon)</h3>
            <p className="mt-2 text-sm text-muted">Rotate or rearrange pages in a PDF.</p>
          </div>

          <div className="block rounded-lg border border-border/50 p-6 opacity-70">
            <h3 className="font-medium">Compress PDF (coming soon)</h3>
            <p className="mt-2 text-sm text-muted">Reduce PDF file size (best-effort client-side).</p>
          </div>
        </div>

        <div className="mt-16 text-center space-y-6">
          <p className="text-sm text-muted">Files are processed locally in your browser and are not uploaded to any server.</p>
          <div className="text-sm text-muted">
            Keep this project running — <Link className="underline hover:text-foreground transition-colors" href="/donate">Donate</Link> · <Link className="underline hover:text-foreground transition-colors" href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
