"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import SuccessMessage from "./SuccessMessage";
import { 
  validatePdfFile, 
  formatFileSize, 
  downloadBlob,
  getBaseFilename 
} from "@/app/utils/pdfUtils";
import { track } from "@/app/utils/analytics";

/**
 * Page rotation in degrees. Must be a multiple of 90.
 */
export type Rotation = 0 | 90 | 180 | 270;

/**
 * UI representation of a single page within a selected PDF.
 */
export interface PageItem {
  /** 0-based page index within the source PDF */
  index: number;
  /** rotation in degrees applied to this page */
  rotation: Rotation;
}

/**
 * Rotate/Rearrange Tool
 * - Load a single PDF
 * - Display list of pages with drag-and-drop reordering
 * - Per-page rotation (90° increments)
 * - Export a new PDF with applied order and rotations
 * 
 * Security: All validation uses shared utilities, input sanitized
 * Accessibility: Full ARIA labels, keyboard navigation, semantic HTML
 * Performance: O(n) operations, minimal re-renders via memoization
 */
export default function RearrangeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [pages, setPages] = useState<PageItem[]>([]);
  const [processing, setProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const pageCount = pages.length;

  const triggerFilePicker = () => fileInputRef.current?.click();

  /**
   * Validates PDF and loads page count
   * Uses shared validation utilities for consistent security
   */
  const validateAndPrepare = useCallback(async (f: File): Promise<number> => {
    validatePdfFile(f); // Throws if invalid
    const buf = await f.arrayBuffer();
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(buf);
    return pdf.getPageCount();
  }, []);

  /**
   * Load the PDF and initialize page state.
   * Includes proper error handling for encrypted/corrupted PDFs
   */
  const onFileSelected = useCallback(async (f: File | undefined | null) => {
    if (!f) return;
    setError(null);
    setSuccess(false);

    try {
      const count = await validateAndPrepare(f);
      
      // Validate page count is reasonable (prevent DoS from malformed PDFs)
      if (count < 1) {
        throw new Error("PDF contains no pages.");
      }
      if (count > 1000) {
        throw new Error("PDF has too many pages (max 1000). This prevents browser memory issues.");
      }
      
      setFile(f);
      setPages(Array.from({ length: count }, (_, i) => ({ index: i, rotation: 0 })));
      track("Rearrange File Loaded", { pages: count });
    } catch (err: unknown) {
      setFile(null);
      setPages([]);
      
      // Provide user-friendly error messages
      const message = (err && typeof err === 'object' && 'message' in err) ? String((err as { message?: unknown }).message) : String(err);
      if (message.includes("encrypted") || message.includes("password")) {
        setError("This PDF is encrypted. Please remove the password protection first.");
      } else if (message.includes("Invalid") || message.includes("parse")) {
        setError("Unable to read this PDF. The file may be corrupted.");
      } else {
        setError(message);
      }
    }
  }, [validateAndPrepare]);

  const clear = () => {
    setFile(null);
    setPages([]);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /**
   * Rotate a page item by 90 degrees clockwise.
   * Uses immutable state update for performance and predictability.
   */
  const rotateCW = useCallback((i: number) => {
    setPages((prev) => {
      // Validate index
      if (i < 0 || i >= prev.length) return prev;
      
      return prev.map((p, idx) => 
        idx === i 
          ? { ...p, rotation: ((p.rotation + 90) % 360) as Rotation } 
          : p
      );
    });
  }, []);

  /**
   * Rotate a page item by 90 degrees counter-clockwise.
   * Uses immutable state update for performance and predictability.
   */
  const rotateCCW = useCallback((i: number) => {
    setPages((prev) => {
      // Validate index
      if (i < 0 || i >= prev.length) return prev;
      
      return prev.map((p, idx) => 
        idx === i 
          ? { ...p, rotation: ((p.rotation + 270) % 360) as Rotation } 
          : p
      );
    });
  }, []);

  /**
   * Remove a page from output.
   * Validates index before mutation.
   */
  const removeAt = useCallback((i: number) => {
    setPages((prev) => {
      if (i < 0 || i >= prev.length) return prev;
      return prev.filter((_, idx) => idx !== i);
    });
  }, []);

  /**
   * Drag-and-drop reordering handlers.
   * Implements accessible drag-and-drop with proper ARIA support.
   */
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index)); // Required for Firefox
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only set false if leaving the container itself, not child elements
    if (e.currentTarget === e.target) {
      setIsDraggingOver(false);
    }
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>, index?: number) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (typeof index === "number" && dragIndexRef.current !== null) {
      // Handle reordering existing pages
      const from = dragIndexRef.current;
      
      // Validate indices
      if (from === index || from < 0 || from >= pages.length || index < 0 || index >= pages.length) {
        dragIndexRef.current = null;
        return;
      }
      
      setPages((prev) => {
        const next = prev.slice();
        const [moved] = next.splice(from, 1);
        next.splice(index, 0, moved);
        return next;
      });
      dragIndexRef.current = null;
    } else {
      // Handle dropping new file
      const dtFile = e.dataTransfer.files?.[0];
      if (dtFile) onFileSelected(dtFile);
    }
  };

  /**
   * Export a new PDF applying the specified order and rotations.
   * Complexity: O(n) page copies with constant extra memory per page.
   * Security: Validates all inputs, uses shared download utility with sanitization.
   */
  const exportPdf = useCallback(async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }
    if (pages.length === 0) {
      setError("No pages to export. Please select a PDF with pages.");
      return;
    }

    setError(null);
    setSuccess(false);
    setProcessing(true);

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const srcBytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(srcBytes);
      const srcPageCount = srcPdf.getPageCount();
      const out = await PDFDocument.create();

      // Copy in current order, applying per-page rotation
      for (let i = 0; i < pages.length; i++) {
        const item = pages[i];
        
        // Validate page index is within bounds
        if (item.index < 0 || item.index >= srcPageCount) {
          throw new Error(`Invalid page index: ${item.index + 1}`);
        }
        
        const [p] = await out.copyPages(srcPdf, [item.index]);
        
        if (item.rotation !== 0) {
          // Validate rotation value
          if (![90, 180, 270].includes(item.rotation)) {
            throw new Error(`Invalid rotation value: ${item.rotation}`);
          }
          p.setRotation(degrees(item.rotation));
        }
        out.addPage(p);
      }

      const bytes = await out.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      
      // Use shared download utility with sanitization
      const baseFilename = getBaseFilename(file.name);
  downloadBlob(blob, `${baseFilename}-rearranged.pdf`);
      
  const opId = `rearrange-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  setOperationId(opId);
  setSuccess(true);
      track("Rearrange Export Completed", { pages: pages.length });
    } catch (err: unknown) {
      const message = (err && typeof err === 'object' && 'message' in err) ? String((err as { message?: unknown }).message) : String(err);
      setError(message || "Failed to export PDF.");
      track("Rearrange Export Failed", { error: message });
    } finally {
      setProcessing(false);
    }
  }, [file, pages]);

  /**
   * Memoized summary of page state for performance
   */
  const pageSummary = useMemo(() => {
    const rotated = pages.filter((p) => p.rotation !== 0).length;
    return { rotated, total: pages.length };
  }, [pages]);

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-medium text-black dark:text-white">Rotate / Rearrange PDF</h2>
        {file && (
          <button
            onClick={clear}
            className="text-sm sm:text-base px-2 py-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 rounded-md"
            aria-label="Clear selected file"
          >
            Clear file
          </button>
        )}
      </div>

      <div
        className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer relative ${
          isDraggingOver ? "border-black dark:border-white bg-gray-50 dark:bg-zinc-900" : file ? "border-gray-400 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900" : "border-gray-300 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-700"
        }`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) triggerFilePicker();
        }}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            triggerFilePicker();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Choose PDF file or drag and drop"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => onFileSelected(e.target.files?.[0])}
          className="hidden"
          ref={fileInputRef}
          aria-label="Choose PDF file"
        />

        {file ? (
          <div className="w-full space-y-4">
            <div className="text-sm">
              <div className="font-medium text-black dark:text-white">{file.name}</div>
              <div className="text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}{pageCount > 0 && <> • {pageCount} pages</>}
                {pageSummary.rotated > 0 && (
                  <>
                    {" "}• {pageSummary.rotated} rotated
                  </>
                )}
              </div>
            </div>

            {/* Pages List */}
            <div className="space-y-2" role="list" aria-label="PDF pages">
              {pages.map((p, i) => (
                <div
                  key={`page-${p.index}-${i}`}
                  className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-3 hover:border-gray-400 dark:hover:border-zinc-700 transition-colors"
                  draggable
                  onDragStart={(e) => onDragStart(e, i)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, i)}
                  role="listitem"
                  aria-label={`Page ${p.index + 1}, rotation ${p.rotation} degrees`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="text-gray-400 dark:text-zinc-500 cursor-grab active:cursor-grabbing" 
                      aria-hidden="true"
                    >
                      ☰
                    </div>
                    <div>
                      <div className="font-medium text-sm text-black dark:text-white">Page {p.index + 1}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Rotation: {p.rotation}°</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); rotateCCW(i); }}
                      className="text-xs px-2 py-1 border border-gray-300 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                      aria-label={`Rotate page ${p.index + 1} counter-clockwise 90 degrees`}
                      type="button"
                    >
                      <span aria-hidden="true">⟲</span> 90°
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); rotateCW(i); }}
                      className="text-xs px-2 py-1 border border-gray-300 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                      aria-label={`Rotate page ${p.index + 1} clockwise 90 degrees`}
                      type="button"
                    >
                      <span aria-hidden="true">⟳</span> 90°
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                      className="text-xs px-2 py-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 rounded"
                      aria-label={`Remove page ${p.index + 1} from export`}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Drag pages to reorder • Click to add a different file
            </p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-gray-500 dark:text-gray-400">
              <span className="text-sm">
                Drop a PDF here or <span className="text-black dark:text-white font-medium">choose a file</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500">Maximum file size: 50MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <SuccessMessage
          message="PDF rearranged successfully!"
          onClose={() => setSuccess(false)}
          trackingEvent="Rearrange Success Donation Click"
          operationId={operationId || undefined}
          tool="rearrange"
        />
      )}

      <button
        onClick={(e) => { e.stopPropagation(); exportPdf(); }}
        disabled={processing || !file || pages.length === 0}
        className="flex-none rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-opacity"
        aria-busy={processing}
        aria-disabled={processing || !file || pages.length === 0}
        type="button"
      >
        {processing ? "Exporting..." : "Export Rearranged PDF"}
      </button>
    </div>
  );
}
