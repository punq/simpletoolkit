"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import SuccessMessage from "./SuccessMessage";
import {
  validatePdfFile,
  formatFileSize,
  downloadBlob,
  getBaseFilename,
  redactPdfData,
  type RedactionArea,
  type RedactionResult,
} from "@/app/utils/pdfUtils";
import { track } from "@/app/utils/analytics";
import type { RenderTask, PDFDocumentProxy } from "pdfjs-dist";

/**
 * Represents a redaction box being drawn or already placed
 */
interface RedactionBox extends RedactionArea {
  id: string;
  /** Whether this box is currently being edited */
  isActive?: boolean;
}

/**
 * PDF page metadata for rendering
 */
interface PdfPageMetadata {
  pageNumber: number;
  width: number;
  height: number;
  dataUrl?: string;
}

/**
 * High-Integrity Client-Side PDF Redactor
 * 
 * Security Features:
 * - 100% client-side processing (zero network calls)
 * - Visual redaction with black rectangles
 * - Text content removal from redacted areas
 * - Optional flattening for final secure sharing
 * - Robust error handling for corrupted/encrypted PDFs
 * 
 * UX Features:
 * - Page-by-page thumbnail preview
 * - Precise rectangle selection for redaction zones
 * - Clear processing status indicators
 * - Unflattened (editable) and flattened (secure) download options
 * 
 * @component
 */
export default function ClientSidePDFRedactor() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState<string>("");

  const [pages, setPages] = useState<PdfPageMetadata[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [redactionBoxes, setRedactionBoxes] = useState<RedactionBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [redactionResult, setRedactionResult] = useState<RedactionResult | null>(null);
  const [isRenderingPage, setIsRenderingPage] = useState(false);
  
  // Cache the rendered page image to avoid re-rendering on every mouse move
  const [cachedPageImage, setCachedPageImage] = useState<ImageData | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Ref to track current render operation for cancellation
  const renderAbortController = useRef<AbortController | null>(null);
  
  // Ref to track the current PDF.js render task for proper cancellation
  const renderTaskRef = useRef<RenderTask | null>(null);
  
  // Animation frame ID for throttling mouse move events
  const rafId = useRef<number | null>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  // Memoize current page boxes to avoid recalculation on every render
  const currentPageBoxes = useMemo(
    () => redactionBoxes.filter((box) => box.pageNumber === currentPage),
    [redactionBoxes, currentPage]
  );

  /**
   * Load PDF and extract page metadata
   */
  const loadPdf = useCallback(async (pdfFile: File) => {
    setProcessingMessage("Loading PDF...");
    setProcessing(true);
    setError(null);
    setSuccess(false);
    setRedactionBoxes([]);
    setRedactionResult(null);

    try {
      validatePdfFile(pdfFile);

      const { PDFDocument } = await import("pdf-lib");
      let arrayBuffer;
      try {
        arrayBuffer = await pdfFile.arrayBuffer();
      } catch {
        setError("Unable to read this PDF. The file may be corrupted or encrypted.");
        setFile(null);
        setPages([]);
        return;
      }
      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: false,
        });
      } catch (e) {
        const emsg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: unknown }).message) : String(e);
        if (emsg.toLowerCase().includes('encrypted') || emsg.toLowerCase().includes('password')) {
          setError('This PDF is encrypted. Please remove the password protection first.');
        } else if (emsg.includes('Invalid') || emsg.toLowerCase().includes('parse')) {
          setError('Unable to read this PDF. The file may be corrupted.');
        } else {
          setError(emsg);
        }
        setFile(null);
        setPages([]);
        return;
      }

      const pageCount = pdfDoc.getPageCount();

      if (pageCount < 1) {
        setError("PDF contains no pages.");
        setFile(null);
        setPages([]);
        return;
      }
      if (pageCount > 500) {
        setError("PDF has too many pages (max 500). This prevents browser memory issues.");
        setFile(null);
        setPages([]);
        return;
      }

      // Extract page metadata
      const pagesMetadata: PdfPageMetadata[] = [];
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        pagesMetadata.push({
          pageNumber: i + 1,
          width,
          height,
        });
      }

      setFile(pdfFile);
      setPages(pagesMetadata);
      setCurrentPage(1);
      track("Redactor PDF Loaded", { pages: pageCount });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message)
          : String(err);

      setError(message);
      setFile(null);
      setPages([]);
    } finally {
      setProcessing(false);
      setProcessingMessage("");
    }
  }, []);

  /**
   * Handle file selection
   */
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        loadPdf(selectedFile);
      }
    },
    [loadPdf]
  );

  /**
   * Drag and drop handlers
   */
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      loadPdf(droppedFile);
    }
  };

  /**
   * Render current page to canvas for preview and interaction
   * Uses abort controller for proper cleanup and cancellation
   */
  const renderCurrentPage = useCallback(async () => {
    if (!file || !canvasRef.current || currentPage < 1 || currentPage > pages.length) {
      return;
    }

    // Cancel any in-flight render operation
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // Ignore cancellation errors
      }
      renderTaskRef.current = null;
    }

    if (renderAbortController.current) {
      renderAbortController.current.abort();
    }

    const abortController = new AbortController();
    renderAbortController.current = abortController;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsRenderingPage(true);

    let pdf: PDFDocumentProxy | null = null;

    try {
      // Use PDF.js for actual rendering
      const pdfjsLib = await import("pdfjs-dist");
      
      // Check if cancelled
      if (abortController.signal.aborted) return;
      
      // Set worker source to use local file from public directory
      // This avoids CDN issues and keeps everything self-contained
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';
      }

      const arrayBuffer = await file.arrayBuffer();
      
      // Check if cancelled
      if (abortController.signal.aborted) return;
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      pdf = await loadingTask.promise;
      
      // Check if cancelled
      if (abortController.signal.aborted) {
        pdf.destroy();
        return;
      }
      
      const page = await pdf.getPage(currentPage);

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        canvas: canvas,
      };

      // Store the render task so we can cancel it if needed
      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      
      // Clear the render task reference after completion
      renderTaskRef.current = null;
      
      // Check if cancelled before caching
      if (abortController.signal.aborted) {
        if (pdf) pdf.destroy();
        return;
      }
      
      // Cache the rendered page for fast redrawing during mouse interaction
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setCachedPageImage(imageData);
      
      // Clean up PDF.js resources
      if (pdf) pdf.destroy();
    } catch (err) {
      // Ignore abort/cancel errors
      const errorName = (err as Error).name;
      if (errorName === 'AbortError' || errorName === 'RenderingCancelledException') {
        if (pdf) pdf.destroy();
        return;
      }
      
      console.error("Failed to render page:", err);
      setError(`Failed to render page ${currentPage}. ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      if (renderAbortController.current === abortController) {
        setIsRenderingPage(false);
        renderAbortController.current = null;
      }
    }
  }, [file, currentPage, pages.length]);

  useEffect(() => {
    if (file && pages.length > 0) {
      renderCurrentPage();
    }
    
    // Cleanup function to abort render on unmount or page change
    return () => {
      // Cancel the PDF.js render task
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancellation errors
        }
        renderTaskRef.current = null;
      }
      
      // Abort the operation
      if (renderAbortController.current) {
        renderAbortController.current.abort();
      }
    };
  }, [file, pages.length, currentPage, renderCurrentPage]);

  /**
   * Draw existing redaction boxes on canvas
   * Memoized to prevent unnecessary re-renders
   */
  const drawExistingBoxes = useCallback((ctx: CanvasRenderingContext2D, pageNum: number, boxes: RedactionBox[]) => {
    const pageBoxes = boxes.filter((box) => box.pageNumber === pageNum);

    pageBoxes.forEach((box) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
  }, []);

  /**
   * Canvas mouse handlers for drawing redaction boxes
   */
  const onCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setDrawStart({ x, y });
  }, []);

  const onCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart || !canvasRef.current || !cachedPageImage) return;

    // Cancel any pending animation frame
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }

    // Throttle canvas redraws using requestAnimationFrame
    rafId.current = requestAnimationFrame(() => {
      if (!canvasRef.current || !cachedPageImage) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Restore the cached page image (fast!)
      ctx.putImageData(cachedPageImage, 0, 0);
      
      // Draw existing boxes
      drawExistingBoxes(ctx, currentPage, redactionBoxes);

      // Draw current box being created
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        drawStart.x,
        drawStart.y,
        currentX - drawStart.x,
        currentY - drawStart.y
      );
      ctx.setLineDash([]);
    });
  }, [isDrawing, drawStart, cachedPageImage, drawExistingBoxes, currentPage, redactionBoxes]);

  const onCanvasMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    // Calculate box dimensions
    const x = Math.min(drawStart.x, endX);
    const y = Math.min(drawStart.y, endY);
    const width = Math.abs(endX - drawStart.x);
    const height = Math.abs(endY - drawStart.y);

    // Only create box if it has meaningful size
    if (width > 10 && height > 10) {
      const newBox: RedactionBox = {
        id: `redact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pageNumber: currentPage,
        x,
        y,
        width,
        height,
        isActive: true,
      };

      setRedactionBoxes((prev) => [...prev, newBox]);
      track("Redaction Box Created", {
        page: currentPage,
        width: Math.round(width),
        height: Math.round(height),
      });
    }

    setIsDrawing(false);
    setDrawStart(null);
  }, [isDrawing, drawStart, currentPage]);

  /**
   * Redraw canvas with existing boxes when boxes change or cache updates
   * Only runs when not actively drawing to avoid interference
   */
  useEffect(() => {
    if (canvasRef.current && !isDrawing && file && pages.length > 0 && cachedPageImage) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Restore cached page image
        ctx.putImageData(cachedPageImage, 0, 0);
        // Draw existing boxes on top
        drawExistingBoxes(ctx, currentPage, redactionBoxes);
      }
    }
  }, [redactionBoxes, cachedPageImage, isDrawing, file, pages.length, drawExistingBoxes, currentPage]);

  /**
   * Cleanup animation frame on unmount
   */
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  /**
   * Remove a specific redaction box
   */
  const removeBox = useCallback((boxId: string) => {
    setRedactionBoxes((prev) => prev.filter((box) => box.id !== boxId));
  }, []);

  /**
   * Clear all redaction boxes
   */
  const clearAllBoxes = useCallback(() => {
    setRedactionBoxes([]);
    setRedactionResult(null);
    setSuccess(false);
  }, []);

  /**
   * Apply redactions to PDF
   */
  const applyRedactions = useCallback(async (flatten: boolean) => {
    if (!file || redactionBoxes.length === 0) {
      setError("Please select at least one area to redact.");
      return;
    }

    setProcessingMessage(`${flatten ? "Flattening and applying" : "Applying"} redactions locally...`);
    setProcessing(true);
    setError(null);

    try {
      const result = await redactPdfData(file, redactionBoxes, flatten);
      setRedactionResult(result);
      setSuccess(false); // We'll show success after download
      track("Redaction Applied", {
        areas: result.redactedCount,
        flattened: flatten,
        originalSize: result.originalSize,
        redactedSize: result.redactedSize,
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message)
          : String(err);
      setError(message);
    } finally {
      setProcessing(false);
      setProcessingMessage("");
    }
  }, [file, redactionBoxes]);

  /**
   * Download redacted PDF
   */
  const downloadRedactedPdf = useCallback((flatten: boolean) => {
    if (!redactionResult || !file) return;

    const baseFilename = getBaseFilename(file.name);
    const suffix = flatten ? "_redacted_flattened" : "_redacted";
    const filename = `${baseFilename}${suffix}.pdf`;

    downloadBlob(redactionResult.blob, filename);
    
    const opId = `redact-${Date.now()}`;
    setOperationId(opId);
    setSuccess(true);
    
    track("Redacted PDF Downloaded", {
      flattened: flatten,
      areas: redactionResult.redactedCount,
      originalSize: redactionResult.originalSize,
      redactedSize: redactionResult.redactedSize,
    });
  }, [redactionResult, file]);

  /**
   * Page navigation
   */
  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= pages.length) {
      setCurrentPage(pageNum);
      setCachedPageImage(null); // Clear cache when changing pages
    }
  }, [pages.length]);

  return (
    <div className="space-y-6">
      {/* File Input Section */}
      {!file && (
        <div>
          <label htmlFor="pdf-upload" className="block text-sm font-medium mb-2">
            Select PDF to Redact
          </label>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              if (e.target === e.currentTarget) triggerFilePicker();
            }}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-black bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            role="button"
            tabIndex={0}
            aria-label="Choose PDF file or drag and drop"
            onKeyDown={(e) => {
              if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                triggerFilePicker();
              }
            }}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              {isDragging ? "Drop PDF here" : "Click or drag PDF here"}
            </p>
            <p className="mt-1 text-xs text-gray-400">Maximum file size: 50MB</p>
          </div>
          <input
            ref={fileInputRef}
            id="pdf-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={onFileChange}
            className="hidden"
            aria-label="Choose PDF file"
          />
        </div>
      )}

      {/* Processing Indicator */}
      {processing && processingMessage && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
            <p className="text-sm text-gray-900">
              {processingMessage}
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          className="bg-gray-50 border border-gray-300 rounded-lg p-4"
          role="alert"
        >
          <p className="text-sm text-gray-900">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

  {/* Main Redaction Interface */}
  {file && pages.length > 0 && !error && (
        <div className="space-y-4">
          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {pages.length} page
                  {pages.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPages([]);
                  setRedactionBoxes([]);
                  setRedactionResult(null);
                  setError(null);
                  setSuccess(false);
                }}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Remove File
              </button>
            </div>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </button>
            <div className="text-sm font-medium">
              Page {currentPage} of {pages.length}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pages.length}
              className="px-4 py-2 text-sm font-medium rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Canvas for Drawing Redaction Areas */}
          <div ref={containerRef} className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 relative min-h-[500px] flex items-center justify-center">
            {isRenderingPage && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
                  <p className="text-sm text-gray-700">Rendering page {currentPage}...</p>
                </div>
              </div>
            )}
            {!isRenderingPage && (!canvasRef.current || canvasRef.current.width === 0) && (
              <p className="text-gray-500 text-sm">Loading page preview...</p>
            )}
            <div data-testid="pdf-preview" style={{ width: '100%', height: '100%' }}>
              <canvas
                ref={canvasRef}
                data-testid="pdf-canvas"
                onMouseDown={onCanvasMouseDown}
                onMouseMove={onCanvasMouseMove}
                onMouseUp={onCanvasMouseUp}
                className="cursor-crosshair max-w-full mx-auto"
                style={{ display: "block" }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Instructions:</strong> Click and drag on the page preview to draw redaction boxes over sensitive content.
              Navigate between pages to redact multiple areas across the document.
            </p>
          </div>

          {/* Current Page Redaction Boxes */}
          {currentPageBoxes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Redaction Boxes on Page {currentPage} ({currentPageBoxes.length})
              </h3>
              <div className="space-y-2">
                {currentPageBoxes.map((box) => (
                  <div
                    key={box.id}
                    className="flex items-center justify-between bg-gray-50 rounded p-3 text-sm"
                  >
                    <div className="text-xs text-gray-600">
                      Position: ({Math.round(box.x)}, {Math.round(box.y)}) •
                      Size: {Math.round(box.width)} × {Math.round(box.height)}
                    </div>
                    <button
                      onClick={() => removeBox(box.id)}
                      className="text-gray-600 hover:text-black transition-colors text-xs"
                      data-testid={`remove-redaction-${box.id}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Redaction Boxes Summary */}
          {redactionBoxes.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Total Redaction Areas: {redactionBoxes.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    Across {new Set(redactionBoxes.map((b) => b.pageNumber)).size} page(s)
                  </p>
                </div>
                <button
                  onClick={clearAllBoxes}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  data-testid="clear-all-redactions"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {redactionBoxes.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => applyRedactions(false)}
                  disabled={processing}
                  className="flex-1 min-w-[200px] bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                  data-testid="apply-redactions-unflattened"
                >
                  Apply Redactions (Unflattened)
                </button>
                <button
                  onClick={() => applyRedactions(true)}
                  disabled={processing}
                  className="flex-1 min-w-[200px] bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                  data-testid="apply-redactions-flattened"
                >
                  Apply Redactions (Flattened)
                </button>
              </div>
              <p className="text-xs text-gray-500">
                <strong>Unflattened:</strong> Preserves PDF structure for further editing. 
                <strong className="ml-2">Flattened:</strong> Merges all layers for maximum security (recommended for final sharing).
              </p>
            </div>
          )}

          {/* Download Redacted PDF */}
          {redactionResult && (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Redaction Complete
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {redactionResult.redactedCount} area(s) redacted •
                  {redactionResult.flattened ? " Flattened" : " Unflattened"} •
                  Size: {formatFileSize(redactionResult.redactedSize)}
                </p>
              </div>
              <button
                onClick={() => downloadRedactedPdf(redactionResult.flattened)}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                data-testid="download-redacted-pdf"
              >
                Download Redacted PDF
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {success && operationId && (
        <SuccessMessage
          message="PDF redacted successfully! Your data never left your browser."
          onClose={() => setSuccess(false)}
          trackingEvent="Redaction Completed"
          operationId={operationId}
          tool="redact"
        />
      )}

      {/* How to Use */}
      <details className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
        <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-white hover:text-black dark:hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 rounded px-2 py-1">
          How to Use
        </summary>
        <div className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">1. Upload PDF</p>
            <p>Click the drop zone or drag and drop your PDF file (max 50MB, 500 pages).</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">2. Draw Redaction Boxes</p>
            <p>Click and drag on the page preview to draw rectangles over sensitive content. Navigate between pages to redact multiple areas.</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">3. Apply & Download</p>
            <p>Choose &quot;Unflattened&quot; for further editing or &quot;Flattened&quot; (recommended) for maximum security before sharing.</p>
          </div>
        </div>
      </details>
    </div>
  );
}
