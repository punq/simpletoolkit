"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

type SplitMode = "pages" | "range" | "every-n" | "individual";

export default function SplitTool() {
  const track = (name: string, props?: Record<string, any>) => {
    try {
      if (typeof window === "undefined") return;
      const w = window as any;
      if (typeof w.plausible === "function") {
        if (props) w.plausible(name, { props });
        else w.plausible(name);
      }
    } catch (_err) {
      // swallow tracking errors
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [splitting, setSplitting] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<SplitMode>("pages");
  
  // Mode-specific inputs
  const [pageInput, setPageInput] = useState(""); // e.g., "1,3,5-7"
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [everyN, setEveryN] = useState("1");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }

    // File size validation - max 50MB for client-side processing
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selected.size > maxSize) {
      setError("File is too large. Please select a PDF under 50MB.");
      return;
    }

    setFile(selected);
    setError(null);
    setPageCount(null);

    // Load PDF to get page count
    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setPageCount(count);
      track("File Loaded", { pages: count });
    } catch (err: any) {
      setError(`Could not load PDF: ${err.message || err}`);
      setFile(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPageCount(null);
    setError(null);
    setPageInput("");
    setRangeStart("");
    setRangeEnd("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Parse page input like "1,3,5-7" into an array of page numbers (1-indexed)
  const parsePageInput = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes("-")) {
        const rangeParts = part.split("-");
        if (rangeParts.length !== 2) {
          throw new Error(`Invalid range format: ${part}`);
        }
        const [start, end] = rangeParts.map((s) => parseInt(s.trim(), 10));
        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
          throw new Error(`Invalid range: ${part}`);
        }
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      } else {
        const page = parseInt(part, 10);
        if (isNaN(page) || page < 1 || page > maxPages) {
          throw new Error(`Invalid page number: ${part}`);
        }
        pages.add(page);
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  // Sanitize filename to remove problematic characters
  const sanitizeFilename = (name: string): string => {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").substring(0, 200);
  };

  const split = async () => {
    if (!file || !pageCount) {
      setError("Please select a PDF file first.");
      return;
    }

    setError(null);
    setSplitting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const baseFilename = file.name.replace(/\.pdf$/i, "");

      let outputFiles: { name: string; pdf: PDFDocument }[] = [];

      if (mode === "pages") {
        // Extract specific pages
        if (!pageInput.trim()) {
          setError("Please enter page numbers (e.g., 1,3,5-7)");
          setSplitting(false);
          return;
        }

        const pages = parsePageInput(pageInput, pageCount);
        if (pages.length === 0) {
          setError("No valid pages specified.");
          setSplitting(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        for (const pageNum of pages) {
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageNum - 1]);
          newPdf.addPage(copiedPage);
        }

        // Limit filename length for page lists
        const pageStr = pages.length <= 10 ? pages.join("-") : `${pages[0]}-${pages[pages.length - 1]}`;
        const filename = sanitizeFilename(`${baseFilename}_pages_${pageStr}.pdf`);

        outputFiles.push({
          name: filename,
          pdf: newPdf,
        });

        track("Split Completed", { mode: "pages", pages: pages.length });
      } else if (mode === "range") {
        // Extract a range
        const start = parseInt(rangeStart, 10);
        const end = parseInt(rangeEnd, 10);

        if (isNaN(start) || isNaN(end) || start < 1 || end > pageCount || start > end) {
          setError(`Please enter a valid range (1-${pageCount})`);
          setSplitting(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        for (let i = start - 1; i < end; i++) {
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(copiedPage);
        }

        const filename = sanitizeFilename(`${baseFilename}_pages_${start}-${end}.pdf`);

        outputFiles.push({
          name: filename,
          pdf: newPdf,
        });

        track("Split Completed", { mode: "range", start, end });
      } else if (mode === "every-n") {
        // Split every N pages
        const n = parseInt(everyN, 10);
        if (isNaN(n) || n < 1 || n > pageCount) {
          setError("Please enter a valid number of pages per split.");
          setSplitting(false);
          return;
        }

        const numParts = Math.ceil(pageCount / n);
        
        // Warn if creating too many files
        if (numParts > 50) {
          const confirmed = confirm(
            `This will create ${numParts} separate PDF files. Continue?`
          );
          if (!confirmed) {
            setSplitting(false);
            return;
          }
        }

        let partNumber = 1;
        for (let i = 0; i < pageCount; i += n) {
          const newPdf = await PDFDocument.create();
          const end = Math.min(i + n, pageCount);
          
          for (let j = i; j < end; j++) {
            const [copiedPage] = await newPdf.copyPages(sourcePdf, [j]);
            newPdf.addPage(copiedPage);
          }

          const filename = sanitizeFilename(`${baseFilename}_part_${partNumber}.pdf`);

          outputFiles.push({
            name: filename,
            pdf: newPdf,
          });
          partNumber++;
        }

        track("Split Completed", { mode: "every-n", n, parts: outputFiles.length });
      } else if (mode === "individual") {
        // Warn if too many files
        if (pageCount > 50) {
          const confirmed = confirm(
            `This will create ${pageCount} separate PDF files. This may take a while and trigger multiple download prompts. Continue?`
          );
          if (!confirmed) {
            setSplitting(false);
            return;
          }
        }

        // Split into individual pages
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(copiedPage);

          const filename = sanitizeFilename(`${baseFilename}_page_${i + 1}.pdf`);

          outputFiles.push({
            name: filename,
            pdf: newPdf,
          });
        }

        track("Split Completed", { mode: "individual", pages: pageCount });
      }

      // Download all output files
      for (const output of outputFiles) {
        const pdfBytes = await output.pdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        
        try {
          const a = document.createElement("a");
          a.href = url;
          a.download = output.name;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } finally {
          // Always revoke the object URL to prevent memory leaks
          URL.revokeObjectURL(url);
        }

        // Small delay between downloads to prevent browser blocking
        if (outputFiles.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      }
    } catch (err: any) {
      setError(String(err?.message || err) || "An unexpected error occurred during split.");
      track("Split Failed", { error: String(err?.message || err) });
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        className="hidden"
        aria-hidden
      />

      <div className="flex gap-3 items-center">
        <button
          onClick={triggerFilePicker}
          className="rounded bg-black px-4 py-3 text-white text-sm hover:opacity-90"
        >
          Choose PDF…
        </button>

        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {file ? (
            <>
              {file.name} {pageCount && `(${pageCount} pages)`}
            </>
          ) : (
            "No file selected"
          )}
        </div>

        {file && (
          <button onClick={clearFile} className="text-sm text-zinc-600 hover:text-zinc-800 ml-2">
            Clear
          </button>
        )}
      </div>

      {file && pageCount && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Split mode:</label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="pages"
                  checked={mode === "pages"}
                  onChange={() => setMode("pages")}
                  className="cursor-pointer"
                />
                <span className="text-sm">Extract specific pages</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="range"
                  checked={mode === "range"}
                  onChange={() => setMode("range")}
                  className="cursor-pointer"
                />
                <span className="text-sm">Extract page range</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="every-n"
                  checked={mode === "every-n"}
                  onChange={() => setMode("every-n")}
                  className="cursor-pointer"
                />
                <span className="text-sm">Split every N pages</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="individual"
                  checked={mode === "individual"}
                  onChange={() => setMode("individual")}
                  className="cursor-pointer"
                />
                <span className="text-sm">Split into individual pages</span>
              </label>
            </div>
          </div>

          {mode === "pages" && (
            <div>
              <label className="text-sm font-medium block mb-1">
                Page numbers (e.g., 1,3,5-7):
              </label>
              <input
                type="text"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                placeholder="1,3,5-7"
                className="w-full px-3 py-2 border rounded text-sm"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Enter comma-separated page numbers or ranges
              </p>
            </div>
          )}

          {mode === "range" && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1">Start page:</label>
                <input
                  type="number"
                  min="1"
                  max={pageCount}
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  placeholder="1"
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1">End page:</label>
                <input
                  type="number"
                  min="1"
                  max={pageCount}
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  placeholder={String(pageCount)}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>
            </div>
          )}

          {mode === "every-n" && (
            <div>
              <label className="text-sm font-medium block mb-1">
                Pages per split:
              </label>
              <input
                type="number"
                min="1"
                value={everyN}
                onChange={(e) => setEveryN(e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2 border rounded text-sm"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Will create {Math.ceil(pageCount / parseInt(everyN || "1", 10))} file(s)
              </p>
            </div>
          )}

          {mode === "individual" && (
            <p className="text-sm text-zinc-600">
              Will create {pageCount} separate PDF files (one per page)
            </p>
          )}
        </div>
      )}

      {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

      <div className="flex gap-3 mt-6">
        <button
          onClick={split}
          disabled={splitting || !file || !pageCount}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {splitting ? "Splitting..." : "Split PDF"}
        </button>

        <Link
          className="rounded border px-4 py-2 text-sm"
          href="/donate"
          aria-label="Donate to keep this tool free"
        >
          Keep this free — Donate
        </Link>
      </div>

      <footer className="pt-8 text-xs text-zinc-500">
        All splitting happens locally in your browser. Files are never uploaded.{" "}
        <Link className="underline" href="/privacy">
          Privacy
        </Link>
      </footer>
    </div>
  );
}
