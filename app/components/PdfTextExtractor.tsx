"use client";

import React, { useRef, useState } from "react";
import SuccessMessage from "./SuccessMessage";
import { extractTextFromPdf, ExtractResult } from "@/app/utils/pdfTextExtractor";
import { validatePdfFile, downloadBlob, getBaseFilename, formatFileSize } from "@/app/utils/pdfUtils";

export default function PDFTextExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progressPage, setProgressPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isImageOnly, setIsImageOnly] = useState<boolean>(false);
  const [passwordPrompt, setPasswordPrompt] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLTextAreaElement | null>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    try {
      validatePdfFile(f);
      setFile(f);
      setError(null);
      setExtractedText("");
      setIsImageOnly(false);
      setPasswordPrompt(false);
      setPassword("");
      setAddedMessage(`${f.name} added`);
      window.setTimeout(() => setAddedMessage(null), 2000);
      // Analytics intentionally omitted here to guarantee zero-network behavior
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setFile(null);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (!f) return;
    try {
      validatePdfFile(f);
      setFile(f);
      setError(null);
      setExtractedText("");
      setIsImageOnly(false);
      setPasswordPrompt(false);
      setPassword("");
      setAddedMessage(`${f.name} added`);
      window.setTimeout(() => setAddedMessage(null), 2000);
      // Analytics intentionally omitted here to guarantee zero-network behavior
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setFile(null);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const startExtraction = async (opts?: { retryPassword?: string }) => {
    if (!file) return;
    setProcessing(true);
    setSuccess(false);
    setProgressPage(0);
    setTotalPages(0);
    setExtractedText("");
    setIsImageOnly(false);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const opId = `extract-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      setOperationId(opId);
      // Analytics intentionally omitted here to guarantee zero-network behavior
      const onProgress = (page: number, total: number) => {
        setProgressPage(page);
        setTotalPages(total);
      };

      const result: ExtractResult = await extractTextFromPdf(file, {
        password: opts?.retryPassword ?? password ?? undefined,
        onProgress,
        signal: controller.signal,
      });

      setExtractedText(result.text || "");
      setIsImageOnly(Boolean(result.isImageOnly));
      setProgressPage(result.pagesExtracted);
      setTotalPages(result.pagesExtracted || totalPages);
      setPasswordPrompt(false);
      setSuccess(true);
      // Analytics intentionally omitted here to guarantee zero-network behavior
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("password")) {
        // Request password from user
        setPasswordPrompt(true);
        setError("This PDF is password protected. Enter the password to continue.");
      } else if (msg.toLowerCase().includes("image") || msg.toLowerCase().includes("selectable text")) {
        setIsImageOnly(true);
        setError("No selectable text detected. This appears to be an image-only (scanned) PDF.");
      } else {
        setError(msg || "Failed to extract text from PDF.");
        // Analytics intentionally omitted here to guarantee zero-network behavior
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
    } catch (_) {
      // fallback: select textarea
      const e = _ as unknown;
      void e;
      outputRef.current?.select();
    }
  };

  const handleDownload = () => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const base = getBaseFilename(file.name) || "extracted-text";
    downloadBlob(blob, `${base}.txt`);
  };

  const cancelExtraction = () => {
    try {
      abortRef.current?.abort();
      abortRef.current = null;
      setProcessing(false);
      setProgressPage(0);
      setTotalPages(0);
    } catch (_) {
      const e = _ as unknown;
      void e;
    }
  };

  const handleRetryWithPassword = async () => {
    setError(null);
    await startExtraction({ retryPassword: password });
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-medium">Extract Text from PDF</h2>
          <p className="text-sm text-gray-600 mt-1">Extract selectable text from PDFs — page-by-page, locally in your browser. No uploads, no servers.</p>
        </div>
        {file && (
          <button
            onClick={(e) => { e.stopPropagation(); setFile(null); setExtractedText(""); setError(null); setPasswordPrompt(false); setSuccess(false); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            className="text-sm px-4 py-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors"
            aria-label="Clear file"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error / Added message */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step badges */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${file ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
            1
          </span>
          <span className={file ? 'font-medium' : ''}>Add PDF</span>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${processing ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
            2
          </span>
          <span className={processing ? 'font-medium' : ''}>Extract</span>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${extractedText ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
            3
          </span>
          <span className={extractedText ? 'font-medium' : ''}>Copy / Download</span>
        </div>
      </div>

      {/* File Drop Zone */}
      <div
        className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer relative ${isDragging ? 'border-black bg-gray-50' : file ? 'border-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
        onDragEnter={onDragOver}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          // Only open picker when no file is selected
          if (!file && e.target === e.currentTarget) triggerFilePicker();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!file && e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            triggerFilePicker();
          }
        }}
        aria-label="Choose PDF or drag and drop"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="hidden" />
        {file ? (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-gray-400 cursor-grab active:cursor-grabbing" aria-hidden="true">☰</div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{file.name}</div>
                  <div className="text-gray-500 text-xs">{formatFileSize(file.size)}</div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setExtractedText(""); }}
                className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                Remove
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">Drag to replace • Click to choose another file</p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-gray-500">
              <span className="text-sm">Drop PDFs here or <span className="text-black font-medium">choose files</span></span>
            </div>
            <p className="text-xs text-gray-400">Maximum 50MB • 100% client-side</p>
          </div>
        )}
        {addedMessage && (
          <div className="absolute -bottom-6 left-0 text-xs text-gray-600">{addedMessage}</div>
        )}
        </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); startExtraction(); }}
          onMouseDown={(e) => e.stopPropagation()}
          disabled={!file || processing}
          className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={processing}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <span>Extracting...</span>
            </span>
          ) : (
            "Extract Text"
          )}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setFile(null); setExtractedText(""); setError(null); setPasswordPrompt(false); setSuccess(false); if (fileInputRef.current) fileInputRef.current.value = ""; }}
          onMouseDown={(e) => e.stopPropagation()}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          Clear
        </button>

        {processing && (
          <button onClick={(e) => { e.stopPropagation(); cancelExtraction(); }} onMouseDown={(e) => e.stopPropagation()} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
        )}
      </div>

      {/* Processing status */}
      {processing && (
        <div className="flex items-center gap-3 text-sm" role="status" aria-live="polite">
          <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/></svg>
          <div>Processing Page {progressPage} of {totalPages || "?"}</div>
        </div>
      )}

      {/* Password prompt */}
      {passwordPrompt && (
        <div className="space-y-2" role="dialog" aria-modal="false" aria-labelledby="password-prompt-label">
          <label id="password-prompt-label" className="text-sm text-black">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-black rounded px-3 py-2 text-black" />
          <div className="flex gap-2">
            <button onClick={handleRetryWithPassword} className="px-4 py-2 bg-black text-white rounded">Retry</button>
            <button onClick={() => { setPasswordPrompt(false); setPassword(""); }} className="px-4 py-2 border border-black rounded text-black">Cancel</button>
          </div>
        </div>
      )}

      {/* Image-only message */}
      {isImageOnly && (
        <div className="p-3 border border-black rounded text-sm text-black" role="status" aria-live="polite">
          No selectable text was found in this PDF. This appears to be an image-only (scanned) PDF. OCR is required to extract text.
          <div className="mt-2">
            <a href="/tools" className="underline text-black">Back to tools</a>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <SuccessMessage
          message="Text extracted successfully"
          onClose={() => setSuccess(false)}
          trackingEvent="Extract Success"
          operationId={operationId || undefined}
          tool="pdf-text-extractor"
        />
      )}

      {/* Output */}
      {extractedText && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Extracted Text</h3>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); handleCopy(); }} onMouseDown={(e) => e.stopPropagation()} className="px-3 py-1 border border-gray-300 rounded text-sm">Copy</button>
              <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} onMouseDown={(e) => e.stopPropagation()} className="px-3 py-1 bg-black text-white rounded text-sm">Download .txt</button>
            </div>
          </div>

          <textarea
            ref={outputRef}
            readOnly
            value={extractedText}
            className="w-full h-72 p-3 border border-gray-200 rounded font-mono text-sm"
          />
        </div>
      )}

      {/* Page-level features, privacy and FAQ moved to the page wrapper to allow full-width layout */}
    </div>
  );
}
