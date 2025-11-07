"use client";

import { useRef, useState } from "react";
import SuccessMessage from "./SuccessMessage";
import { 
  isPdfFile,
  isValidFileSize,
  formatFileSize,
  sanitizeFilename,
  downloadBlob
} from "@/app/utils/pdfUtils";
import { track } from "@/app/utils/analytics";

type SplitMode = "pages" | "range" | "every-n" | "individual";

export default function SplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [splitting, setSplitting] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<SplitMode>("pages");
  const [success, setSuccess] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);
  
  // Mode-specific inputs
  const [pageInput, setPageInput] = useState(""); // e.g., "1,3,5-7"
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [everyN, setEveryN] = useState("1");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!isPdfFile(selected)) {
      setError("Please select a PDF file.");
      return;
    }

    // File size validation - max 50MB for client-side processing
    if (!isValidFileSize(selected)) {
      setError("File is too large. Please select a PDF under 50MB.");
      return;
    }

    setFile(selected);
    setError(null);
    setPageCount(null);

    // Load PDF to get page count
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setPageCount(count);
      track("File Loaded", { pages: count });
    } catch (err: unknown) {
      const msg = (err && typeof err === 'object' && 'message' in err) ? String((err as { message?: unknown }).message) : String(err);
      setError(`Could not load PDF: ${msg}`);
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

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (!isPdfFile(droppedFile)) {
      setError("Please select a PDF file.");
      return;
    }

    if (!isValidFileSize(droppedFile)) {
      setError("File is too large. Please select a PDF under 50MB.");
      return;
    }

    setFile(droppedFile);
    setError(null);
    setPageCount(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await droppedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setPageCount(count);
      track("File Loaded", { pages: count });
    } catch (err: unknown) {
      const msg = (err && typeof err === 'object' && 'message' in err) ? String((err as { message?: unknown }).message) : String(err);
      setError(`Could not load PDF: ${msg}`);
      setFile(null);
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

  const split = async () => {
    if (!file || !pageCount) {
      setError("Please select a PDF file first.");
      return;
    }

    setError(null);
    setSuccess(false);
    setSplitting(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const baseFilename = file.name.replace(/\.pdf$/i, "");

  const outputFiles: { name: string; pdf: unknown }[] = [];

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
  const pdfDoc = output.pdf as { save: () => Promise<Uint8Array | ArrayBuffer> };
  const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        
        // Use shared download utility
        downloadBlob(blob, output.name);

        // Small delay between downloads to prevent browser blocking
        if (outputFiles.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      }
      
      const opId = `split-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setOperationId(opId);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err && typeof err === 'object' && 'message' in err) ? String((err as { message?: unknown }).message) : String(err);
      setError(msg || "An unexpected error occurred during split.");
      track("Split Failed", { error: msg });
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-medium">Split PDF</h2>
        {file && (
          <button
            onClick={clearFile}
            className="text-sm sm:text-base px-2 py-1 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
            aria-label="Clear selected file"
          >
            Clear file
          </button>
        )}
      </div>

      <div
        className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer relative ${
          isDragging ? "border-black bg-gray-50" : file ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Choose PDF file or drag and drop"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="hidden"
          ref={fileInputRef}
          aria-label="Choose PDF file"
        />

        {file ? (
          <div className="w-full space-y-4">
            <div className="text-sm">
              <div className="font-medium">{file.name}</div>
              <div className="text-gray-500">
                {formatFileSize(file.size)}
                {pageCount && <> • {pageCount} pages</>}
              </div>
            </div>

            {pageCount && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Split mode:</label>
                  <div className="space-y-2">
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
                      onClick={(e) => e.stopPropagation()}
                      placeholder="1,3,5-7"
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
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
                        max={pageCount || undefined}
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="1"
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium block mb-1">End page:</label>
                      <input
                        type="number"
                        min="1"
                        max={pageCount || undefined}
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
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
                      onClick={(e) => e.stopPropagation()}
                      placeholder="1"
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Will create {Math.ceil((pageCount || 1) / parseInt(everyN || "1", 10))} file(s)
                    </p>
                  </div>
                )}

                {mode === "individual" && (
                  <p className="text-sm text-gray-600">
                    Will create {pageCount} separate PDF files (one per page)
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-gray-500">
              <span className="text-sm">
                Drop a PDF here or <span className="text-black font-medium">choose a file</span>
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Maximum file size: 50MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <SuccessMessage
          message="PDF split successfully!"
          onClose={() => setSuccess(false)}
          trackingEvent="Split Success Donation Click"
          operationId={operationId || undefined}
          tool="split"
        />
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          split();
        }}
        disabled={splitting || !file || !pageCount}
        className="flex-none rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        {splitting ? "Splitting..." : "Split PDF"}
      </button>
    </div>
  );
}
