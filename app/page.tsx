import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-6 py-24 px-6 bg-white dark:bg-black">
  <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Simple Toolkit</h1>

  <p className="text-sm text-zinc-600 dark:text-zinc-400">Private, fast, and easy to use.</p>

        <div className="w-full max-w-2xl mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/tools/merge" className="block rounded border p-4 hover:shadow">
            <h3 className="font-medium">Merge PDFs</h3>
            <p className="text-xs text-zinc-500 mt-1">Merge up to 20 PDFs locally in your browser — no uploads.</p>
          </Link>

          <div className="block rounded border p-4 opacity-70">
            <h3 className="font-medium">Split PDFs (coming soon)</h3>
            <p className="text-xs text-zinc-500 mt-1">Extract pages from PDFs — planned.</p>
          </div>

          <div className="block rounded border p-4 opacity-70">
            <h3 className="font-medium">Rotate / Rearrange (coming soon)</h3>
            <p className="text-xs text-zinc-500 mt-1">Rotate or rearrange pages in a PDF.</p>
          </div>

          <div className="block rounded border p-4 opacity-70">
            <h3 className="font-medium">Compress PDF (coming soon)</h3>
            <p className="text-xs text-zinc-500 mt-1">Reduce PDF file size (best-effort client-side).</p>
          </div>
        </div>

        <div className="w-full max-w-xl mt-12 text-xs text-zinc-500">Privacy: Files are processed locally in your browser and are not uploaded to any server.</div>

        <footer className="pt-8 text-xs text-zinc-500">Keep this project running — <a className="underline" href="/donate.html">Donate</a> · <a className="underline" href="/privacy.html">Privacy</a></footer>
      </main>
    </div>
  );
}
