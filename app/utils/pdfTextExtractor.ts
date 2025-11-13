/**
 * PDF text extraction utility
 * - Uses `pdfjs-dist` (lazy-loaded) to extract text page-by-page
 * - 100% client-side, no network calls
 */
/**
 * NOTE: This module intentionally avoids any network requests. It uses
 * the local `pdfjs-dist` build shipped with the app worker at
 * `/pdf-worker/pdf.worker.min.mjs` (see `public/pdf-worker`).
 */

/**
 * Extract options and result types
 */
export interface ExtractOptions {
  /** Optional PDF password (for encrypted PDFs) */
  password?: string;
  /** Progress callback invoked after each page is processed */
  onProgress?: (page: number, total: number) => void;
  /** Optional AbortSignal to cancel long-running processing */
  signal?: AbortSignal;
}

export interface ExtractResult {
  /** Concatenated extracted text */
  text: string;
  /** Number of pages successfully extracted */
  pagesExtracted: number;
  /** True when the PDF appears to contain no selectable text (image-only/scan) */
  isImageOnly?: boolean;
}

import { validatePdfFile } from "@/app/utils/pdfUtils";

/** Minimal pdfjs types used by this module to avoid `any` */
interface PdfTextItem {
  str?: string;
  transform?: number[];
}

interface PdfTextContent {
  items: PdfTextItem[];
}

interface PdfPage {
  getTextContent(): Promise<PdfTextContent>;
  cleanup?: () => void;
}

interface PdfDocument {
  numPages: number;
  getPage(page: number): Promise<PdfPage>;
  cleanup?: () => void;
  destroy?: () => void;
}

interface PdfJsLib {
  GlobalWorkerOptions?: { workerSrc?: string; cMapUrl?: string; cMapPacked?: boolean };
  // Some pdfjs builds expose a flag to disable worker-side network fetches
  disableWorkerFetch?: boolean;
  getDocument(opts: {
    data?: ArrayBuffer | null;
    password?: string;
    // Optional defensive flags (supported by many pdfjs builds)
    disableAutoFetch?: boolean;
    disableRange?: boolean;
  }): { promise: Promise<PdfDocument> };
}

/**
 * Extracts text from a PDF file in a memory-friendly, page-by-page manner.
 * Uses `pdfjs-dist` for accurate, ordered text extraction. Processing is
 * incremental and calls `onProgress` after each page.
 *
 * Security & privacy: This function runs entirely in the browser. It does not
 * perform any network requests and does not transmit data off-device.
 *
 * @param file - PDF file selected by the user
 * @param options - Extraction options
 * @returns ExtractResult with combined text and metadata
 * @throws Error for invalid files or when extraction fails (includes encrypted PDFs)
 */
export async function extractTextFromPdf(
  file: File,
  options: ExtractOptions = {}
): Promise<ExtractResult> {
  validatePdfFile(file);

  // Read file into memory as ArrayBuffer (required by pdfjs)
  let arrayBuffer: ArrayBuffer | null = await file.arrayBuffer();

  // Early abort check
  if (options.signal?.aborted) {
    arrayBuffer = null;
    throw new Error("Extraction aborted");
  }

  // Lazy-load pdfjs to keep initial bundle small
  const pdfjs = (await import("pdfjs-dist/legacy/build/pdf")) as unknown as PdfJsLib;

  // Point pdfjs worker to the local static worker we ship with the app (if available)
  try {
    if (pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs";
      // Prefer local, pre-bundled resources only. Attempt to disable automatic
      // fetching of supplemental assets (CMaps, wasm, etc.) to guarantee
      // zero-network behavior in production environments.
      try {
        // Best-effort: set cMap url to local path if shipped, and mark packed.
        // These are non-fatal and only applied when pdfjs supports them.
        if (pdfjs.GlobalWorkerOptions) {
          pdfjs.GlobalWorkerOptions.cMapUrl = "/pdf-worker/cmaps/";
          pdfjs.GlobalWorkerOptions.cMapPacked = true;
        }
        // In newer pdfjs builds there may be an option to disable worker fetches.
        // Set it if available on the loaded module.
        try {
          (pdfjs as PdfJsLib).disableWorkerFetch = true;
        } catch (e) {
          void e;
        }
      } catch (e) {
        void e;
      }
    }
  } catch (e) {
    void e;
    // Non-fatal: continue without explicitly setting workerSrc
  }

  // Request the document with defensive options to avoid automatic remote
  // fetching of resources (ranges, CMaps) where supported by the pdfjs build.
  const loadTask = pdfjs.getDocument({
    data: arrayBuffer,
    password: options.password,
    // Disable range requests and auto-fetch where supported to ensure
    // extraction is strictly local to the provided ArrayBuffer.
    disableAutoFetch: true,
    disableRange: true,
  });

  // Attempt to load the document. Handle password/encryption errors explicitly.
  let pdf: PdfDocument;
  try {
    pdf = await loadTask.promise;
  } catch (err: unknown) {
    const message = err && typeof err === "object" && "message" in err ? String((err as { message?: unknown }).message) : String(err);
    // pdfjs throws different error shapes; look for 'Password' or 'encrypted'
    if (message.toLowerCase().includes("password") || message.toLowerCase().includes("encrypted")) {
      throw new Error("PDF is password protected");
    }
    throw new Error(`Failed to load PDF: ${message}`);
  }

  const totalPages: number = pdf.numPages || 0;

  const textParts: string[] = [];
  let pagesWithText = 0;
  let pagesExtracted = 0;

  // Process sequentially to keep memory usage predictable. This allows
  // the event loop to breathe and progress updates to render.
  for (let p = 1; p <= totalPages; p++) {
    if (options.signal?.aborted) {
      // Stop processing and cleanup
      try {
        pdf?.cleanup?.();
        pdf?.destroy?.();
      } catch (e) {
        void e;
      }
      arrayBuffer = null;
      throw new Error("Extraction aborted");
    }

    try {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();

      const items: PdfTextItem[] = Array.isArray(textContent.items) ? textContent.items : [];

      // Best-effort reading order: sort by vertical position (y descending), then x ascending
      const sorted = items.slice();
      const tolerance = 2; // points tolerance for grouping on same line
      sorted.sort((a, b) => {
        const ay = (a.transform && a.transform[5]) || 0;
        const by = (b.transform && b.transform[5]) || 0;
        if (Math.abs(by - ay) > tolerance) return by - ay; // top to bottom
        const ax = (a.transform && a.transform[4]) || 0;
        const bx = (b.transform && b.transform[4]) || 0;
        return ax - bx;
      });

      // Concatenate tokens with a space, preserve small line breaks between pages
      const pageText = sorted.map((it) => (typeof it.str === "string" ? it.str : "")).filter(Boolean).join(" ").trim();

      if (pageText.length > 0) {
        pagesWithText++;
      }

      if (pageText) textParts.push(pageText);

      pagesExtracted++;

      // Allow consumers to update progress UI
      options.onProgress?.(p, totalPages);

      // Try to free page resources if possible
      try {
        page.cleanup?.();
      } catch (e) {
        void e;
      }

      // Yield to event loop for responsiveness on large PDFs
      await new Promise((res) => setTimeout(res, 0));
    } catch (err: unknown) {
      // If a single page fails, continue with others but record the issue
      // If the error indicates encryption requiring password, rethrow
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message?: unknown }).message) : String(err);
      if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("encrypted")) {
        // Cleanup
        try {
          pdf?.cleanup?.();
          pdf?.destroy?.();
        } catch (e) {
          void e;
        }
        arrayBuffer = null;
        throw new Error("PDF is password protected");
      }
      // otherwise continue
    }
  }

  // Final cleanup
  try {
    pdf?.cleanup?.();
    pdf?.destroy?.();
  } catch (e) {
    void e;
  }

  // Release the array buffer reference so GC can reclaim memory
  arrayBuffer = null;

  const combined = textParts.join("\n\n");

  // Heuristic for image-only PDFs: no pages had selectable text, or very small output
  const isImageOnly = pagesWithText === 0 || combined.trim().length < 20;

  return {
    text: combined,
    pagesExtracted,
    isImageOnly,
  };
}
