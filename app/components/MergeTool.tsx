"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import SuccessMessage from "./SuccessMessage";

export default function MergeTool() {
  // safe Plausible tracker helper — no-op when Plausible isn't loaded
  const track = (name: string, props?: Record<string, any>) => {
    try {
      if (typeof window === "undefined") return;
      const w = window as any;
      if (typeof w.plausible === "function") {
        if (props) w.plausible(name, { props });
        else w.plausible(name);
      }
    } catch (_err) {
      // swallow tracking errors — analytics must never break UX
    }
  };
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  // Prevent adding the same dragged files repeatedly during a single drag session
  const dragSessionAddedRef = useRef(false);
  // Counter to track nested dragenter/dragleave events
  const dragCounterRef = useRef(0);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const addFiles = (incoming: File[] | FileList) => {
    const list = Array.from(incoming as any as File[]);
    const pdfs = list.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) return 0;

    // File size limit: 50MB per file
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    const oversized = pdfs.filter((f) => f.size > MAX_FILE_SIZE);
    
    if (oversized.length > 0) {
      setError(`File size limit exceeded: ${oversized.map(f => f.name).join(", ")} (max 50MB per file)`);
      return 0;
    }

    setFiles((prev) => {
      const existingIds = new Set(prev.map((p) => `${p.name}|${p.size}`));
      const combined = [...prev];
      for (const f of pdfs) {
        if (combined.length >= 20) break;
        const id = `${f.name}|${f.size}`;
        if (!existingIds.has(id)) {
          combined.push(f);
          existingIds.add(id);
        }
      }
      return combined;
    });

    setError(null);
    setSkipped([]);
    return pdfs.length;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = addFiles(e.target.files || []);
    if (count > 0) {
      setAddedMessage(`${count} file${count > 1 ? "s" : ""} added`);
      window.setTimeout(() => setAddedMessage(null), 2000);
      track("Files Added", { count });
    }
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

  // Window-level listeners: when user drags files from the OS over the page,
  // automatically detect PDF files and add them once per drag session.
  useEffect(() => {
    const onWindowDragEnter = (e: DragEvent) => {
      try {
        if (!e.dataTransfer) return;
        const dtFiles = Array.from(e.dataTransfer.files || []);
        if (dtFiles.length === 0) return;
        const pdfFiles = dtFiles.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
        if (pdfFiles.length === 0) return;
        if (dragSessionAddedRef.current) return;

        setError(null);
        setSkipped([]);
        const added = addFiles(pdfFiles);
        if (added > 0) {
          setAddedMessage(`${added} file${added > 1 ? "s" : ""} added`);
          window.setTimeout(() => setAddedMessage(null), 2000);
          track("Files Added", { count: added, method: "drag-global" });
        }

        dragSessionAddedRef.current = true;
      } catch (err) {
        // ignore errors in drag handler
      }
    };

    const onWindowDragOver = (e: DragEvent) => {
      // allow drop
      if (e.dataTransfer) e.preventDefault();
    };

    const onWindowDrop = (e: DragEvent) => {
      if (e.dataTransfer) e.preventDefault();
      // clear session flags when drag ends
      dragSessionAddedRef.current = false;
      dragCounterRef.current = 0;
      setIsDragging(false);
    };

    const onWindowDragLeave = (_e: DragEvent) => {
      // decrement counter and clear session when leaving page entirely
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
      if (dragCounterRef.current === 0) {
        dragSessionAddedRef.current = false;
        setIsDragging(false);
      }
    };

    const onWindowDragEnterCounter = (e: DragEvent) => {
      dragCounterRef.current += 1;
      setIsDragging(true);
      onWindowDragEnter(e);
    };

    window.addEventListener("dragenter", onWindowDragEnterCounter);
    window.addEventListener("dragover", onWindowDragOver);
    window.addEventListener("dragleave", onWindowDragLeave);
    window.addEventListener("drop", onWindowDrop);

    return () => {
      window.removeEventListener("dragenter", onWindowDragEnterCounter);
      window.removeEventListener("dragover", onWindowDragOver);
      window.removeEventListener("dragleave", onWindowDragLeave);
      window.removeEventListener("drop", onWindowDrop);
    };
  }, []);

  const removeAt = (index: number) => {
    setFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const clearAll = () => {
    setFiles([]);
    setError(null);
    setSkipped([]);
  };

  // Drop zone handlers for better UX and compatibility
  const onZoneDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const onZoneDragLeave = (_e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  const onZoneDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dtFiles = Array.from(e.dataTransfer.files || []);
    const added = addFiles(dtFiles);
    if (added > 0) {
      setAddedMessage(`${added} file${added > 1 ? "s" : ""} added`);
      window.setTimeout(() => setAddedMessage(null), 2000);
      track("Files Added", { count: added, method: "drop-zone" });
    }
    dragSessionAddedRef.current = false;
    dragCounterRef.current = 0;
  };

  const merge = async () => {
    if (!files || files.length === 0) {
      setError("Please select 1-20 PDF files to merge.");
      return;
    }
    setError(null);
    setSkipped([]);
    setSuccess(false);
    setMerging(true);

    try {
      track("Merge Started", { files: files.length });
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
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setSuccess(true);
      } finally {
        // Always revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(url);
      }

      if (skippedLocal.length > 0) {
        setSkipped(skippedLocal);
        setError(`Some files were skipped (${skippedLocal.length}). See details below.`);
        track("Merge Completed", { files: files.length, skipped: skippedLocal.length });
      }
    } catch (err: any) {
      setError(String(err?.message || err) || "An unexpected error occurred during merge.");
      track("Merge Failed", { error: String(err?.message || err) });
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

      <div
        onDragOver={onZoneDragOver}
        onDragLeave={onZoneDragLeave}
        onDrop={onZoneDrop}
        className="relative flex gap-3 items-center"
        aria-label="PDF drop zone"
      >
        <button
          onClick={triggerFilePicker}
          className="rounded bg-black px-4 py-3 text-white text-sm hover:opacity-90"
        >
          Choose files…
        </button>

        <div className="text-sm text-zinc-600 dark:text-zinc-400">{files.length ? `${files.length} file(s) selected` : "No files selected"}</div>

        {files.length > 0 && (
          <button onClick={clearAll} className="text-sm text-zinc-600 hover:text-zinc-800 ml-2">Clear all</button>
        )}

        {addedMessage && (
          <div className="absolute -bottom-6 left-0 text-xs text-green-600">{addedMessage}</div>
        )}

        {isDragging && (
          <div className="pointer-events-none absolute inset-0 rounded border-2 border-dashed border-zinc-300 bg-white/60 flex items-center justify-center">
            <div className="text-sm text-zinc-700">Drop PDFs here to add</div>
          </div>
        )}
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
      
      {success && (
        <SuccessMessage 
          message="PDFs merged successfully!"
          onClose={() => setSuccess(false)}
          trackingEvent="Merge Success Donation Click"
        />
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={merge}
          disabled={merging || files.length === 0}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {merging ? "Merging..." : "Merge PDFs"}
        </button>

        <Link
          className="rounded border px-4 py-2 text-sm"
          href="/donate"
          aria-label="Donate to keep this tool free"
        >
          Keep this free — Donate
        </Link>
      </div>

      <footer className="pt-8 text-xs text-zinc-500">All merging happens locally in your browser. Files are never uploaded. <Link className="underline" href="/privacy">Privacy</Link></footer>
    </div>
  );
}
