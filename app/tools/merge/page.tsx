import Link from "next/link";
import MergeTool from "../../components/MergeTool";

export default function MergePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-6 py-24 px-6 bg-white dark:bg-black">
  <Link href="/" className="self-start rounded px-3 py-1 text-sm text-zinc-700 hover:underline">← Back</Link>

  <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Merge PDFs</h1>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">Merge up to 20 PDF files locally in your browser — no uploads, no accounts.</p>

        <div className="mt-6">
          <MergeTool />
        </div>
      </main>
    </div>
  );
}
