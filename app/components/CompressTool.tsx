"use client";

import { useRef, useState } from "react";
import SuccessMessage from "./SuccessMessage";
import { 
  isPdfFile,
  isValidFileSize,
  formatFileSize,
  downloadBlob,
  getBaseFilename
} from "@/app/utils/pdfUtils";
import { track } from "@/app/utils/analytics";

type CompressionLevel = "low" | "medium" | "high";

type ProgressData = {
  processed: number;
  total: number;
  percent: number;
};

export default function CompressTool() {
  // Core state
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Compression-specific state
  const [compressing, setCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [progress, setProgress] = useState<ProgressData>({ processed: 0, total: 0, percent: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (selected: File) => {
    if (!selected) return;

    setError(null);
    setSuccess(false);
    setCompressedSize(null);

    if (!isPdfFile(selected)) {
      setError("Please select a PDF file.");
      return;
    }

    // File size validation - max 50MB for client-side processing
    if (!isValidFileSize(selected)) {
      setError("File is too large. Please select a PDF under 50MB.");
      return;
    }

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      
      setFile(selected);
      setOriginalSize(selected.size);
      track("PDF Selected", { 
        size: Math.round(selected.size / 1024),
        pages: pageCount
      });
    } catch (err: unknown) {
      const msg = (err && typeof err === 'object' && 'message' in err) ? String((err as { message?: unknown }).message) : String(err);
      setError(`Could not load PDF: ${msg}`);
      setFile(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setOriginalSize(null);
    setCompressedSize(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
    
    const file = e.dataTransfer.files[0];
    await handleFileSelect(file);
  };

  const compress = async () => {
    if (!file) return;

    try {
      setCompressing(true);
      setError(null);
      setProgress({ processed: 0, total: 100, percent: 0 });
      
      // Load the PDF
      const { PDFDocument } = await import("pdf-lib");
      const fileData = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileData);
      
      // Get compression settings based on level
      const compressionSettings = {
        high: {
          useObjectStreams: true,
          objectsPerTick: 100,
          updateInterval: 100
        },
        medium: {
          useObjectStreams: true,
          objectsPerTick: 50,
          updateInterval: 50
        },
        low: {
          useObjectStreams: true,
          objectsPerTick: 20,
          updateInterval: 20
        }
      };

      const settings = compressionSettings[compressionLevel];

      // Create a copy with optimized settings
      const optimizedPdf = await PDFDocument.create();
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;
      setError("Failed to compress PDF. Please make sure the file isn't corrupted or password protected.");
      for (let i = 0; i < totalPages; i++) {
        const [copiedPage] = await optimizedPdf.copyPages(pdfDoc, [i]);
        optimizedPdf.addPage(copiedPage);
        
        setProgress({
          processed: i + 1,
          total: totalPages,
          percent: Math.round(((i + 1) / totalPages) * 100)
        });
      }

      // Save with optimized settings
      const compressedBytes = await optimizedPdf.save({
        useObjectStreams: settings.useObjectStreams,
        objectsPerTick: settings.objectsPerTick
      });

      // Convert Uint8Array to Blob safely
      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      setCompressedSize(blob.size);
      
      // Use shared download utility
      const baseFilename = getBaseFilename(file.name);
  downloadBlob(blob, `${baseFilename}-compressed.pdf`);
      
  const opId = `compress-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  setOperationId(opId);
  setSuccess(true);
      track("PDF Compressed", {
        originalSize: Math.round(file.size / 1024),
        compressedSize: Math.round(blob.size / 1024),
        compressionLevel,
        reductionPercent: Math.round(((file.size - blob.size) / file.size) * 100)
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to compress PDF. Please make sure the file isn't corrupted or password protected.");
      track("Compression Error", { error: errorMessage });
    } finally {
      setCompressing(false);
      setProgress({ processed: 0, total: 0, percent: 0 });
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-medium">PDF Compression</h2>
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
          isDragging ? "border-black dark:border-white bg-gray-50 dark:bg-zinc-900" : file ? "border-gray-400 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900" : "border-gray-300 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-700"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Space") {
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
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
          ref={fileInputRef}
          aria-label="Choose PDF file"
        />

        {file ? (
          <div className="w-full space-y-4">
            <div className="text-sm">
              <div className="font-medium text-black dark:text-white">{file.name}</div>
              <div className="text-gray-500 dark:text-gray-400">
                Original size: {formatFileSize(file.size)}
                {compressedSize && (
                  <> • Compressed: {formatFileSize(compressedSize)}</>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-black dark:text-white">Compression Level</label>
              <div className="flex gap-3 justify-start" role="radiogroup" aria-label="Compression level selection">
                {["low", "medium", "high"].map((level) => (
                  <button
                    key={level}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCompressionLevel(level as CompressionLevel);
                    }}
                    className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white min-w-[80px] sm:min-w-[100px] ${
                      compressionLevel === level
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                        : "bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600 text-black dark:text-white"
                    }`}
                    role="radio"
                    aria-checked={compressionLevel === level}
                    aria-label={`${level} compression level`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-gray-500 dark:text-gray-400">
              <span className="text-sm">
                Drop a PDF here or <span className="text-black dark:text-white font-medium">choose a file</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Maximum file size: 50MB
            </p>
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
          message="PDF compressed successfully!"
          onClose={() => setSuccess(false)}
          trackingEvent="Compress Success Donation Click"
          operationId={operationId || undefined}
          tool="compress"
        />
      )}

      {file && (
        <div className="space-y-4">
          {progress.percent > 0 && progress.percent < 100 && (
            <div className="space-y-2">
              <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div 
                className="text-xs text-gray-600 dark:text-gray-300"
                role="status"
                aria-live="polite"
              >
                Processing page {progress.processed} of {progress.total}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                compress();
              }}
              disabled={!file || compressing}
              className="flex-none rounded-lg bg-black dark:bg-white px-4 py-2 text-white dark:text-black disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
              aria-busy={compressing}
            >
              {compressing ? "Compressing..." : "Compress PDF"}
            </button>
            
            {originalSize && compressedSize && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">
                  {Math.round(((originalSize - compressedSize) / originalSize) * 100)}% reduction
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}