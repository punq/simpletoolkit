"use client";

import { useRef, useState, useEffect } from "react";
import { PDFDocument, PDFName, PDFStream, PDFDict } from "pdf-lib";
import SuccessMessage from "./SuccessMessage";

type CompressionLevel = "low" | "medium" | "high";

// Helper type for progress tracking
type ProgressData = {
  processed: number;
  total: number;
  percent: number;
};

export default function CompressTool() {
  // Analytics tracking helper
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

  // State management
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [progress, setProgress] = useState<ProgressData>({ processed: 0, total: 0, percent: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any object URLs
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
    };
  }, [file]);

  // File handling
  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Reset states
    setError(null);
    setSuccess(false);
    setCompressedSize(null);

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      setError("File size must be under 20MB.");
      return;
    }

    setFile(file);
    setOriginalSize(file.size);
    track("PDF Selected", { size: Math.round(file.size / 1024) });
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
    <div className="w-full max-w-xl">
      {/* File Drop Zone */}
      <div
        role="region"
        aria-label="PDF upload area"
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-black bg-gray-50" : "border-gray-300"
        } ${file ? "border-green-500 bg-green-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Space') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <div className="font-medium">{file.name}</div>
                  <div className="text-gray-500">
                    Original size: {formatSize(file.size)}
                    {compressedSize && (
                      <> • Compressed: {formatSize(compressedSize)}</>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)} 
                className="text-xs text-red-600"
              >
                Remove
              </button>
            </div>

            {/* Compression Level Selector */}
            <div className="flex gap-3 justify-center">
              <div role="radiogroup" aria-label="Compression level selection">
                {["low", "medium", "high"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setCompressionLevel(level as CompressionLevel)}
                    className={`px-4 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                      compressionLevel === level
                        ? "bg-black text-white"
                        : "bg-gray-100 hover:bg-gray-200"
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
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-sm">
                Drop a PDF here or{" "}
                <span className="text-black font-medium">choose a file</span>
              </span>
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Maximum file size: 20MB
            </p>
          </div>
        )}
      </div>

      {error && <div className="text-sm text-red-600 mt-4">{error}</div>}

      {success && (
        <SuccessMessage
          message="PDF compressed successfully!"
          onClose={() => setSuccess(false)}
          trackingEvent="Compress Success Donation Click"
        />
      )}

      <div className="space-y-4 mt-4">
        {progress.percent > 0 && progress.percent < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-black h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress.percent}%` }}
            ></div>
            <div 
              className="text-xs text-gray-500 mt-1"
              role="status"
              aria-live="polite"
            >
              Processing page {progress.processed} of {progress.total}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={compress}
            disabled={!file || compressing}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            aria-busy={compressing}
            aria-label={compressing ? "Compressing PDF, please wait" : "Compress PDF"}
          >
            {compressing ? "Compressing..." : "Compress PDF"}
          </button>
          
          {originalSize && compressedSize && (
            <div className="text-sm text-gray-600 flex items-center">
              <span className="font-medium">
                {Math.round(((originalSize - compressedSize) / originalSize) * 100)}% smaller
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}