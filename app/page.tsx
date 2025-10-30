"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function Home() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    if (list.length > 20) {
      setError("You can merge up to 20 files only.");
      setFiles(null);
      return;
    }
    setError(null);
    setFiles(list);
  };

  const merge = async () => {
    if (!files || files.length === 0) {
      setError("Please select 1-20 PDF files to merge.");
      return;
    }
    setMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const f of files) {
        const arrayBuffer = await f.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((p) => mergedPdf.addPage(p));
      }

  const mergedBytes = await mergedPdf.save();
  // mergedBytes is a Uint8Array; use its buffer for Blob to satisfy TypeScript
  const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-6 py-24 px-6 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Simple PDF Merger</h1>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">Merge up to 20 PDF files entirely in your browser — no uploads, no accounts.</p>

        <label className="flex w-full max-w-xl flex-col gap-2">
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={onChange}
            className="mt-4"
          />
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {files ? `${files.length} file(s) selected` : "No files selected"}
          </div>
        </label>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex gap-3">
          <button
            onClick={merge}
            disabled={merging}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {merging ? "Merging..." : "Merge PDFs"}
          </button>

          <a
            className="rounded border px-4 py-2 text-sm"
            href="/donate.html"
            target="_blank"
            rel="noreferrer"
          >
            Donate
          </a>
        </div>

        <div className="w-full max-w-xl pt-8">
          <div className="text-xs text-zinc-500">Ads / Sponsors</div>
          <div className="mt-2 h-24 w-full rounded border border-dashed border-zinc-200" aria-hidden>
            {/* Placeholder for ad code or Google AdSense snippet */}
          </div>
        </div>

        <footer className="pt-8 text-xs text-zinc-500">All merging happens locally in your browser. Files are never uploaded.</footer>
      </main>
    </div>
  );
}
