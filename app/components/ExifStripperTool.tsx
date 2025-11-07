"use client";

import { useRef, useState } from "react";
import SuccessMessage from "./SuccessMessage";
import { 
  MAX_IMAGE_SIZE,
  isImageFile,
  isValidImageSize,
  formatImageSize,
  calculateSizeReduction,
  stripImageMetadata,
  downloadImage,
  sanitizeImageFilename,
  type StripResult,
} from "@/app/utils/imageUtils";
import { track } from "@/app/utils/analytics";

export default function ExifStripperTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [results, setResults] = useState<Array<{ file: File; result: StripResult }>>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const addFiles = (incoming: File[] | FileList): number => {
    const list = Array.from(incoming);
    const images = list.filter((f) => isImageFile(f));
    const rejected = list.filter((f) => !isImageFile(f));
    
    // Track rejected files for user feedback
    if (rejected.length > 0) {
      setRejectedFiles(rejected.map(f => f.name));
      setTimeout(() => setRejectedFiles([]), 4000);
    }
    
    if (images.length === 0) {
      if (list.length > 0) {
        setError("No valid image files detected. Please upload JPEG or PNG images.");
      }
      return 0;
    }

    // Filter out oversized files
    const oversized = images.filter((f) => !isValidImageSize(f));
    
    if (oversized.length > 0) {
      setError(
        `File size limit exceeded: ${oversized.map(f => f.name).join(", ")} (max ${formatImageSize(MAX_IMAGE_SIZE)} per file)`
      );
      return 0;
    }

    setFiles((prev) => {
      const existingIds = new Set(prev.map((p) => `${p.name}|${p.size}`));
      const combined = [...prev];
      
      for (const f of images) {
        if (combined.length >= 50) break; // Allow up to 50 images
        const id = `${f.name}|${f.size}`;
        if (!existingIds.has(id)) {
          combined.push(f);
          existingIds.add(id);
        }
      }
      return combined;
    });

    setError(null);
    return images.length;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = addFiles(e.target.files || []);
    if (count > 0) {
      setAddedMessage(`${count} file${count > 1 ? "s" : ""} added`);
      window.setTimeout(() => setAddedMessage(null), 2000);
      track("Files Added", { count, tool: "exif-stripper" });
    }
  };

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
    
    const dtFiles = Array.from(e.dataTransfer.files || []);
    const count = addFiles(dtFiles);
    
    if (count > 0) {
      setAddedMessage(`${count} file${count > 1 ? "s" : ""} added`);
      window.setTimeout(() => setAddedMessage(null), 2000);
      track("Files Dropped", { count, tool: "exif-stripper" });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const clearAll = () => {
    setFiles([]);
    setError(null);
    setResults([]);
    setCurrentFileIndex(0);
    setRejectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const stripMetadata = async () => {
    if (files.length === 0) {
      setError("Please add at least one image file.");
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(false);
    setResults([]);
    setCurrentFileIndex(0);

    const opId = `exif-strip-${Date.now()}`;
    setOperationId(opId);

    try {
      const processedResults: Array<{ file: File; result: StripResult }> = [];
      let totalOriginalSize = 0;
      let totalNewSize = 0;
      let filesWithExif = 0;
      let filesWithoutExif = 0;

      // Process files sequentially to avoid memory issues
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFileIndex(i + 1);
        
        try {
          const result = await stripImageMetadata(file);
          processedResults.push({ file, result });
          
          totalOriginalSize += result.originalSize;
          totalNewSize += result.newSize;
          if (result.hadExif) {
            filesWithExif++;
          } else {
            filesWithoutExif++;
          }

          // Auto-download cleaned file
          downloadImage(result.blob, file.name);
          
          // Small delay between downloads to prevent browser blocking
          if (files.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          throw new Error(`Failed to process ${file.name}: ${msg}`);
        }
      }

      setResults(processedResults);
      setSuccess(true);
      
      // Track analytics with edge case info
      track("Metadata Stripped", {
        count: files.length,
        filesWithExif,
        filesWithoutExif,
        totalOriginalSize,
        totalNewSize,
        reduction: calculateSizeReduction(totalOriginalSize, totalNewSize),
      });

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      track("Strip Error", { error: msg });
    } finally {
      setProcessing(false);
      setCurrentFileIndex(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Step-by-Step Guide */}
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-2">
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${files.length > 0 ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}`}>
            1
          </span>
          <span className={files.length > 0 ? 'text-success font-medium' : ''}>Add Images</span>
        </div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${processing ? 'bg-primary text-primary-foreground animate-pulse' : results.length > 0 ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </span>
          <span className={processing ? 'text-primary font-medium' : results.length > 0 ? 'text-success font-medium' : ''}>Strip Metadata</span>
        </div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${results.length > 0 ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
            3
          </span>
          <span className={results.length > 0 ? 'text-success font-medium' : ''}>Download Clean Files</span>
        </div>
      </div>

      {/* Privacy Badge */}
      <div className="flex items-center gap-2 text-sm border rounded-lg px-4 py-3 bg-success/5 border-success/20">
        <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-success font-medium">
          <strong>100% Private:</strong> All metadata stripping happens locally in your browser. Your images never leave your device.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50"}
          ${files.length > 0 ? "bg-muted/30" : ""}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onClick={triggerFilePicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerFilePicker();
          }
        }}
        aria-label="Click or drag images to upload"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
          onChange={onChange}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <p className="text-lg font-semibold mb-1">
              {isDragging ? "Drop images here" : "Click or drag images here"}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPEG and PNG • Max {formatImageSize(MAX_IMAGE_SIZE)} per file • Up to 50 files
            </p>
          </div>

          {files.length === 0 && (
            <button
              type="button"
              className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={(e) => {
                e.stopPropagation();
                triggerFilePicker();
              }}
            >
              Select Images
            </button>
          )}
        </div>
      </div>

      {/* Added Message */}
      {addedMessage && (
        <div className="flex items-center gap-2 text-sm border rounded-lg px-4 py-3 bg-success/5 border-success/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-success font-medium">{addedMessage}</p>
        </div>
      )}

      {/* Rejected Files Warning */}
      {rejectedFiles.length > 0 && (
        <div 
          className="flex items-start gap-2 text-sm border rounded-lg px-4 py-3 bg-warning/5 border-warning/20 animate-in fade-in slide-in-from-top-2 duration-200"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-warning">Skipped non-image files:</p>
            <p className="text-warning/80 mt-1">{rejectedFiles.join(", ")}</p>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="border rounded-xl p-6 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Selected Images ({files.length})
            </h3>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-2 py-1"
              aria-label="Clear all files"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatImageSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex-shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Strip Button */}
          <button
            type="button"
            onClick={stripMetadata}
            disabled={processing || files.length === 0}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={processing ? `Stripping metadata, processing file ${currentFileIndex} of ${files.length}` : "Strip metadata from selected images"}
            aria-live="polite"
            aria-busy={processing}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>
                  Stripping Metadata
                  {files.length > 1 && ` (${currentFileIndex}/${files.length})`}
                  ...
                </span>
              </span>
            ) : (
              `Strip Metadata from ${files.length} Image${files.length > 1 ? "s" : ""}`
            )}
          </button>
        </div>
      )}

      {/* Processing Progress Bar */}
      {processing && files.length > 1 && (
        <div 
          className="border rounded-xl p-4 bg-card animate-in fade-in duration-200"
          role="status"
          aria-live="polite"
          aria-label={`Processing ${currentFileIndex} of ${files.length} images`}
        >
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-medium">Processing images...</span>
            <span className="text-muted-foreground">{currentFileIndex} of {files.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentFileIndex / files.length) * 100}%` }}
              role="progressbar"
              aria-valuenow={currentFileIndex}
              aria-valuemin={0}
              aria-valuemax={files.length}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200"
          role="alert"
          aria-live="assertive"
        >
          <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="p-1 hover:bg-destructive/20 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive flex-shrink-0"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && results.length > 0 && (
        <SuccessMessage
          message={
            results.filter(r => r.result.hadExif).length === 0
              ? `Processing complete! ${results.length} image${results.length > 1 ? "s" : ""} had no EXIF data to remove.`
              : `Successfully stripped metadata from ${results.filter(r => r.result.hadExif).length} of ${results.length} image${results.length > 1 ? "s" : ""}!`
          }
          onClose={() => setSuccess(false)}
          trackingEvent="Metadata Strip Success"
          operationId={operationId || undefined}
          tool="exif-stripper"
        />
      )}

      {/* Results Summary */}
      {results.length > 0 && (
        <div className="border rounded-xl p-6 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Processing Results</h3>
            {results.filter(r => r.result.hadExif).length === 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No metadata found
              </span>
            )}
          </div>
          
          {results.filter(r => r.result.hadExif).length === 0 && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Good news!</strong> None of your images contained EXIF metadata. They're already privacy-safe.
                The cleaned versions have been downloaded anyway for your peace of mind.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            {results.map(({ file, result }, index) => (
              <div
                key={`result-${index}`}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate" title={sanitizeImageFilename(file.name)}>
                    {sanitizeImageFilename(file.name)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatImageSize(result.originalSize)} → {formatImageSize(result.newSize)}
                    {result.segmentsRemoved > 0 && (
                      <span className="ml-2 text-success">
                        ({result.segmentsRemoved} metadata segment{result.segmentsRemoved > 1 ? "s" : ""} removed)
                      </span>
                    )}
                  </p>
                </div>
                
                {result.hadExif ? (
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium flex-shrink-0 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    EXIF Removed
                  </span>
                ) : (
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium flex-shrink-0">
                    No EXIF
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Total Stats */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Files:</span>
              <span className="font-semibold">{results.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Files with EXIF:</span>
              <span className="font-semibold">
                {results.filter(r => r.result.hadExif).length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Size Reduction:</span>
              <span className="font-semibold text-success">
                {calculateSizeReduction(
                  results.reduce((sum, r) => sum + r.result.originalSize, 0),
                  results.reduce((sum, r) => sum + r.result.newSize, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="border rounded-xl p-6 space-y-4 bg-muted/30">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What Metadata is Removed?
        </h3>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">JPEG Images:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>EXIF data (camera model, settings, GPS location)</li>
              <li>ICC color profiles (optional metadata)</li>
              <li>Timestamps and device information</li>
            </ul>
          </div>
          
          <div>
            <p className="font-medium text-foreground mb-1">PNG Images:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Text metadata (tEXt, iTXt, zTXt chunks)</li>
              <li>EXIF data (eXIf chunk)</li>
              <li>Timestamps and physical dimensions</li>
            </ul>
          </div>

          <p className="pt-2 border-t">
            <strong className="text-foreground">Note:</strong> Image quality and visual appearance remain 100% unchanged. 
            Only hidden metadata is removed.
          </p>
        </div>
      </div>
    </div>
  );
}
