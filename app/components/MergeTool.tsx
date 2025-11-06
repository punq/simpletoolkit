"use client";

import { useRef, useState } from "react";
import Link from "next/link";
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const addFiles = (incoming: File[] | FileList) => {
    const list = Array.from(incoming as any as File[]);
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
        } catch (perr: any) {
          // If a single file fails (encrypted/corrupt), skip it and continue
          skippedLocal.push(`${f.name}: ${String(perr?.message || perr)}`);
          // continue with next file
        }
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
      
      // Use shared download utility
      downloadBlob(blob, "merged.pdf");
      setSuccess(true);

      if (skippedLocal.length > 0) {
        setSkipped(skippedLocal);
        setError(`Some files were skipped (${skippedLocal.length}). See details below.`);
      }
      
      track("Merge Completed", { files: files.length, skipped: skippedLocal.length });
    } catch (err: any) {
      setError(String(err?.message || err) || "An unexpected error occurred during merge.");
      track("Merge Failed", { error: String(err?.message || err) });
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
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
            className="text-sm sm:text-base px-2 py-1 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
            aria-label="Clear all files"
          >
            Clear all
          </button>
        )}
      </div>

      <div
        className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer relative ${
          isDragging ? "border-black bg-gray-50" : files.length > 0 ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
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
                  className="flex items-center justify-between bg-white rounded-lg border p-3"
                  draggable
                  onDragStart={(e) => onDragStart(e, i)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, i)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">☰</div>
                    <div>
                      <div className="font-medium text-sm">{f.name}</div>
                      <div className="text-gray-500 text-xs">{formatFileSize(f.size)}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAt(i);
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
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
          <div className="absolute -bottom-6 left-0 text-xs text-green-600">
            {addedMessage}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-sm text-red-600">
          {error}
        </div>
      )}

      {skipped.length > 0 && (
        <details className="text-xs text-gray-600 mt-1">
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

      <button
        onClick={merge}
        disabled={merging || files.length === 0}
        className="flex-none rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        {merging ? "Merging..." : "Merge PDFs"}
      </button>
    </div>
  );
}
