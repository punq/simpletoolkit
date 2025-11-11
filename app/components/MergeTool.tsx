"use client";

import { useRef, useState } from "react";
import SuccessMessage from "./SuccessMessage";
import { 
  MAX_FILE_SIZE,
  isPdfFile,
  formatFileSize,
  downloadBlob
} from "@/app/utils/pdfUtils";
import { track } from "@/app/utils/analytics";

export default function MergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const addFiles = (incoming: File[] | FileList) => {
    const list = Array.from(incoming as unknown as File[]);
    const pdfs = list.filter((f) => isPdfFile(f));
    if (pdfs.length === 0) return 0;

    // Filter out oversized files
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

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, index?: number) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (typeof index === 'number' && dragIndexRef.current !== null) {
      // Handle reordering
      const from = dragIndexRef.current;
      if (from === index) return;
      const updatedFiles = [...files];
      const [moved] = updatedFiles.splice(from, 1);
      updatedFiles.splice(index, 0, moved);
      dragIndexRef.current = null;
      setFiles(updatedFiles);
    } else {
      // Handle new files
      const dtFiles = Array.from(e.dataTransfer.files || []);
      const added = addFiles(dtFiles);
      if (added > 0) {
        setAddedMessage(`${added} file${added > 1 ? "s" : ""} added`);
        window.setTimeout(() => setAddedMessage(null), 2000);
        track("Files Added", { count: added, method: "drop-zone" });
      }
    }
  };

  // We don't need window-level handlers anymore as the drag and drop is handled by the component

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
    setSuccess(false);
    setMerging(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      track("Merge Started", { files: files.length });
      const mergedPdf = await PDFDocument.create();
      const skippedLocal: string[] = [];

      for (const f of files) {
        try {
          const arrayBuffer = await f.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((p) => mergedPdf.addPage(p));
        } catch (perr: unknown) {
          // If a single file fails (encrypted/corrupt), skip it and continue
          const msg = (perr && typeof perr === 'object' && 'message' in perr) ? String((perr as { message?: unknown }).message) : String(perr);
          skippedLocal.push(`${f.name}: ${msg}`);
          // continue with next file
        }
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
      
  // Use shared download utility
      downloadBlob(blob, "merged.pdf");
  // Generate unique operation id for deduping counters
  const opId = `merge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  setOperationId(opId);
  setSuccess(true);

      if (skippedLocal.length > 0) {
        setSkipped(skippedLocal);
        setError(`Some files were skipped (${skippedLocal.length}). See details below.`);
      }
      
      track("Merge Completed", { files: files.length, skipped: skippedLocal.length });
    } catch (err: unknown) {
      const msg = (err && typeof err === 'object' && 'message' in err) ? String((err as { message?: unknown }).message) : String(err);
      setError(msg || "An unexpected error occurred during merge.");
      track("Merge Failed", { error: msg });
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-medium">Merge PDFs</h2>
        {files.length > 0 && (
          <button
            onClick={() => {
              setFiles([]);
              setError(null);
              setSkipped([]);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="text-sm px-4 py-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors"
            aria-label="Clear all files"
          >
            Clear All
          </button>
        )}
      </div>

      {/* File Drop Zone */}
      <div
        className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer relative ${
          isDragging ? "border-black bg-gray-50" : files.length > 0 ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={onDragOver}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerFilePicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerFilePicker();
          }
        }}
        aria-label="Choose PDFs or drag and drop"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={onChange}
          className="hidden"
          ref={fileInputRef}
          multiple
        />

        {files.length > 0 ? (
          <div className="w-full space-y-4">
            {/* File List */}
            <div className="space-y-2">
              {files.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                  draggable
                  onDragStart={(e) => onDragStart(e, i)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, i)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 cursor-grab active:cursor-grabbing" aria-hidden="true">☰</div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{f.name}</div>
                      <div className="text-gray-500 text-xs">{formatFileSize(f.size)}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAt(i);
                    }}
                    className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                    aria-label={`Remove ${f.name}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center">
              Drag files to reorder • Click to add more
            </p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-gray-500">
              <span className="text-sm">
                Drop PDFs here or <span className="text-black font-medium">choose files</span>
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Maximum 20 files • 50MB per file
            </p>
          </div>
        )}

        {addedMessage && (
          <div className="absolute -bottom-6 left-0 text-xs text-gray-600">
            {addedMessage}
          </div>
        )}
      </div>

      {/* Error Display with Enhanced Messaging */}
      {error && (
        <div
          className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm space-y-2"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Skipped Files Details */}
      {skipped.length > 0 && (
        <details className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
          <summary className="cursor-pointer font-medium text-gray-800 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded px-2 py-1">
            Skipped files details ({skipped.length})
          </summary>
          <ul className="mt-3 space-y-1 text-gray-700">
            {skipped.map((s, idx) => (
              <li key={idx} className="break-words pl-2 border-l-2 border-gray-300">{s}</li>
            ))}
          </ul>
        </details>
      )}

      {/* Success Message */}
      {success && (
        <SuccessMessage
          message="PDFs merged successfully!"
          onClose={() => setSuccess(false)}
          trackingEvent="Merge Success Donation Click"
          operationId={operationId || undefined}
          tool="merge"
        />
      )}

      {/* Action Button */}
      <button
        onClick={merge}
        disabled={merging || files.length === 0}
        className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-busy={merging}
        aria-label="Merge selected PDF files"
      >
        {merging ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Merging PDFs...</span>
          </span>
        ) : (
          "Merge PDFs"
        )}
      </button>

      {/* Privacy Notice */}
      <div className="p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-900 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">Private & Secure</p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              All processing happens locally in your browser. No files are uploaded to any server.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <details className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
        <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-white hover:text-black dark:hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 rounded px-2 py-1">
          How to Use
        </summary>
        <div className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">1. Add PDFs</p>
            <p>Click the drop zone or drag and drop PDF files (up to 20 files, 50MB each).</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">2. Reorder (Optional)</p>
            <p>Drag files to change their order in the final merged PDF.</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">3. Merge</p>
            <p>Click &quot;Merge PDFs&quot; and your merged file will download automatically as &quot;merged.pdf&quot;.</p>
          </div>
        </div>
      </details>
    </div>
  );
}
