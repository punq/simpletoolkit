import Link from "next/link";
import MergeTool from "../../components/MergeTool";

export default function MergePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          <div>
            <Link 
              href="/" 
              className="text-sm text-muted hover:text-foreground transition-all relative link-underline inline-flex items-center"
            >
              ← Back to tools
            </Link>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">Merge PDFs</h1>
            <p className="text-muted">
              Merge up to 20 PDF files locally in your browser — no uploads, no accounts.
            </p>
          </div>

          <div className="w-full">
            <MergeTool />
          </div>
        </div>
      </div>
    </div>
  );
}
