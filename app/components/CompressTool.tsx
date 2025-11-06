"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { PDFDocument, PDFName, PDFStream, PDFDict } from "pdf-lib";
import SuccessMessage from "./SuccessMessage";

type CompressionLevel = "low" | "medium" | "high";

type ProgressData = {
  processed: number;
  total: number;
  percent: number;
};

export default function CompressTool() {
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

  // Core state
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  // Compression-specific state
  const [compressing, setCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [progress, setProgress] = useState<ProgressData>({ processed: 0, total: 0, percent: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const triggerFilePicker = () => fileInputRef.current?.click();

  const handleFileSelect = async (selected: File) => {
    if (!selected) return;

    setError(null);
    setSuccess(false);
    setCompressedSize(null);

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

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      
      setFile(selected);
      setOriginalSize(selected.size);
      track("PDF Selected", { 
        size: Math.round(selected.size / 1024),
        pages: pageCount
      });
    } catch (err: any) {
      setError(`Could not load PDF: ${err.message || err}`);
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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
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

      // Copy pages with progress tracking
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
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(".pdf", "")}-compressed.pdf`;
      a.click();
      
      URL.revokeObjectURL(url);
      
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

  // Format file size for display
  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + " MB";
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
          isDragging ? "border-black bg-gray-50" : file ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
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
              <div className="font-medium">{file.name}</div>
              <div className="text-gray-500">
                Original size: {formatSize(file.size)}
                {compressedSize && (
                  <> • Compressed: {formatSize(compressedSize)}</>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Compression Level</label>
              <div className="flex gap-3 justify-start" role="radiogroup" aria-label="Compression level selection">
                {["low", "medium", "high"].map((level) => (
                  <button
                    key={level}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCompressionLevel(level as CompressionLevel);
                    }}
                    className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black min-w-[80px] sm:min-w-[100px] ${
                      compressionLevel === level
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-300 hover:border-gray-400"
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
          message="PDF compressed successfully!"
          onClose={() => setSuccess(false)}
          trackingEvent="Compress Success Donation Click"
        />
      )}

      {file && (
        <div className="space-y-4">
          {progress.percent > 0 && progress.percent < 100 && (
            <div className="space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div 
                className="text-xs text-gray-600"
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
              className="flex-none rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              aria-busy={compressing}
            >
              {compressing ? "Compressing..." : "Compress PDF"}
            </button>
            
            {originalSize && compressedSize && (
              <div className="text-sm text-gray-600">
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