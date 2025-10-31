"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function MergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    if (list.length > 20) {
      setError("You can merge up to 20 files only.");
      setFiles([]);
      return;
    }
    setError(null);
    setSkipped([]);
    setFiles(list);
  };

  const onDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === undefined) return;
    if (!files || files.length === 0) return;
    if (from === index) return;
    const updated = [...files];
    const [moved] = updated.splice(from, 1);
    updated.splice(index, 0, moved);
    dragIndexRef.current = null;
    setFiles(updated);
  };

  const removeAt = (index: number) => {
    setFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const merge = async () => {
    if (!files || files.length === 0) {
      setError("Please select 1-20 PDF files to merge.");
      return;
    }
    setError(null);
    setSkipped([]);
    setMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();
      const skippedLocal: string[] = [];

      for (const f of files) {
        try {
          const arrayBuffer = await f.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((p) => mergedPdf.addPage(p));
        } catch (perr: any) {
          // If a single file fails (encrypted/corrupt), skip it and continue
          skippedLocal.push(`${f.name}: ${String(perr?.message || perr)}`);
          // continue with next file
        }
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (skippedLocal.length > 0) {
        setSkipped(skippedLocal);
        setError(`Some files were skipped (${skippedLocal.length}). See details below.`);
      }
    } catch (err: any) {
      setError(String(err?.message || err) || "An unexpected error occurred during merge.");
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        onChange={onChange}
        className="hidden"
        aria-hidden
      />

      <div className="flex gap-3 items-center">
        <button
          onClick={triggerFilePicker}
          className="rounded bg-black px-4 py-3 text-white text-sm hover:opacity-90"
        >
          Choose files…
        </button>

        <div className="text-sm text-zinc-600 dark:text-zinc-400">{files.length ? `${files.length} file(s) selected` : "No files selected"}</div>
      </div>

      {/* Selected files list with drag handles */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2 max-h-72 overflow-auto">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              draggable
              onDragStart={(e) => onDragStart(e, i)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, i)}
              className="flex items-center justify-between rounded border px-3 py-2 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 text-xs text-zinc-500">☰</div>
                <div className="text-sm">
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-zinc-500">{Math.round(f.size / 1024)} KB</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => removeAt(i)} className="text-xs text-red-600">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}
      {skipped.length > 0 && (
        <details className="text-xs text-zinc-600 mt-1">
          <summary>Skipped files details ({skipped.length})</summary>
          <ul className="mt-2 list-disc pl-5">
            {skipped.map((s, idx) => (
              <li key={idx} className="break-words">{s}</li>
            ))}
          </ul>
        </details>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={merge}
          disabled={merging || files.length === 0}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {merging ? "Merging..." : "Merge PDFs"}
        </button>

        <a
          className="rounded border px-4 py-2 text-sm"
          href="/donate.html"
          target="_blank"
          rel="noreferrer"
          aria-label="Donate to keep this tool free"
        >
          Keep this free — Donate
        </a>
      </div>

      <div className="w-full pt-6">
        <div className="text-xs text-zinc-500">Ads / Sponsors</div>
        <div className="mt-2 h-24 w-full rounded border border-dashed border-zinc-200" aria-hidden>
          {/* Placeholder for ad code or Google AdSense snippet */}
        </div>
      </div>

      <footer className="pt-8 text-xs text-zinc-500">All merging happens locally in your browser. Files are never uploaded. <a className="underline" href="/privacy.html">Privacy</a></footer>
    </div>
  );
}
