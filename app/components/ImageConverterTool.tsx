"use client";

import { useRef, useState, useCallback } from "react";
import SuccessMessage from "./SuccessMessage";
import {
  isSupportedImage,
  isValidImageSize,
  convertImage,
  downloadBlob,
  generateFilename,
  formatSize,
  getFormatDisplayName,
  MAX_IMAGE_SIZE,
  type OutputFormat,
  type ConversionResult,
} from "@/app/utils/imageConverterUtils";
import { track } from "@/app/utils/analytics";

export default function ImageConverterTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [results, setResults] = useState<ConversionResult[]>([]);
  
  // Conversion settings
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [quality, setQuality] = useState(92);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const addFiles = useCallback((incoming: File[] | FileList): number => {
    const list = Array.from(incoming);
    const images = list.filter((f) => isSupportedImage(f));
    
    if (images.length === 0) {
      if (list.length > 0) {
        setError("No valid image files detected. Supported: JPEG, PNG, WebP, BMP, GIF, ICO");
      }
      return 0;
    }

    // Filter out oversized files
    const oversized = images.filter((f) => !isValidImageSize(f));
    
    if (oversized.length > 0) {
      setError(
        `File size limit exceeded: ${oversized.map(f => f.name).join(", ")} (max ${formatSize(MAX_IMAGE_SIZE)} per file)`
      );
      return 0;
    }

    setFiles((prev) => {
      const existingIds = new Set(prev.map((p) => `${p.name}|${p.size}`));
      const combined = [...prev];
      
      for (const f of images) {
        if (combined.length >= 20) break; // Max 20 images
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
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = addFiles(e.target.files || []);
    if (count > 0) {
      track("Files Added", { count, tool: "image-converter" });
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
    const added = addFiles(dtFiles);
    if (added > 0) {
      track("Files Added", { count: added, method: "drop-zone", tool: "image-converter" });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setResults([]);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertImages = async () => {
    if (files.length === 0) {
      setError("Please add at least one image to convert.");
      return;
    }

    setConverting(true);
    setError(null);
    setSuccess(false);
    setResults([]);
    setCurrentFileIndex(0);

    const trackingProps: { files: number; format: OutputFormat; quality?: number } = {
      files: files.length, 
      format: outputFormat,
    };
    if (outputFormat !== 'png') {
      trackingProps.quality = quality;
    }
    track("Conversion Started", trackingProps);

    const conversionResults: ConversionResult[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setCurrentFileIndex(i + 1);
      const file = files[i];

      try {
        const result = await convertImage(file, {
          format: outputFormat,
          quality: outputFormat !== 'png' ? quality / 100 : undefined,
        });

        conversionResults.push(result);

        // Auto-download each converted image
        const filename = generateFilename(file.name, outputFormat);
        downloadBlob(result.blob, filename);

        // Small delay between downloads to prevent browser blocking
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${file.name}: ${msg}`);
      }
    }

    setResults(conversionResults);
    setConverting(false);

    if (errors.length > 0) {
      setError(`Some files failed to convert: ${errors.join("; ")}`);
      track("Conversion Failed", { 
        errors: errors.length, 
        total: files.length 
      });
    } else {
      const opId = `convert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setOperationId(opId);
      setSuccess(true);
      track("Conversion Completed", { 
        files: files.length, 
        format: outputFormat 
      });
    }
  };

  const showQualitySlider = outputFormat === 'jpeg' || outputFormat === 'webp';


  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Step-by-Step Guide */}
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-2">
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${files.length > 0 ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}`}>1</span>
          <span className={files.length > 0 ? 'text-success font-medium' : ''}>Add Images</span>
        </div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${converting ? 'bg-primary text-primary-foreground animate-pulse' : results.length > 0 ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>2</span>
          <span className={converting ? 'text-primary font-medium' : results.length > 0 ? 'text-success font-medium' : ''}>Convert</span>
        </div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${results.length > 0 ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>3</span>
          <span className={results.length > 0 ? 'text-success font-medium' : ''}>Download</span>
        </div>
      </div>

      {/* Privacy Badge */}
      <div className="flex items-center gap-2 text-sm border rounded-lg px-4 py-3 bg-success/5 border-success/20">
        <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-success font-medium">
          <strong>100% Private:</strong> All image conversion happens locally in your browser. Your images never leave your device.
        </p>
      </div>

      {/* Conversion Settings */}
      <div className="space-y-4 p-6 border border-gray-200 rounded-lg bg-white">
        <h3 className="font-semibold text-base">Conversion Settings</h3>
        
        {/* Output Format */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Output Format
          </label>
          <div className="flex gap-2">
            {(['jpeg', 'png', 'webp'] as OutputFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setOutputFormat(fmt)}
                disabled={converting}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  outputFormat === fmt
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider (for JPEG/WebP) */}
        {showQualitySlider && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Quality: {quality}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={converting}
              className="w-full accent-black disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}

        {outputFormat === 'png' && (
          <p className="text-xs text-gray-600">
            PNG is a lossless format. Quality setting does not apply.
          </p>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging ? "border-black bg-gray-50 scale-[1.01]" : "border-gray-300 hover:border-gray-400"}
        `}
        onClick={triggerFilePicker}
      >
        <svg
          className="w-12 h-12 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-base mb-1">
          <span className="font-semibold text-black">
            Click to select images
          </span>{" "}
          or drag and drop
        </p>
        <p className="text-sm text-gray-600">
          JPEG, PNG, WebP, BMP, GIF, ICO • Max {formatSize(MAX_IMAGE_SIZE)} per file • Up to 20 images
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onChange}
          className="hidden"
          aria-label="Select images to convert"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {files.length} image{files.length > 1 ? 's' : ''} ready
            </h3>
            <button
              onClick={clearAll}
              disabled={converting}
              className="text-sm text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-600">
                    {getFormatDisplayName(file.type)} • {formatSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={converting}
                  className="ml-4 text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Convert Button */}
      {files.length > 0 && (
        <button
          onClick={convertImages}
          disabled={converting}
          className="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {converting
            ? `Converting ${currentFileIndex} of ${files.length}...`
            : `Convert to ${outputFormat.toUpperCase()}`}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200" role="alert" aria-live="assertive">
          <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
          <button type="button" onClick={() => setError(null)} className="p-1 hover:bg-destructive/20 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive flex-shrink-0" aria-label="Dismiss error">
            <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && !converting && (
        <SuccessMessage
          message={`Successfully converted ${results.length} image${results.length > 1 ? 's' : ''} to ${outputFormat.toUpperCase()}!`}
          onClose={() => setSuccess(false)}
          operationId={operationId || undefined}
          tool="image-converter"
        />
      )}

      {/* Results Summary */}
      {results.length > 0 && !converting && (
        <div className="border rounded-xl p-6 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Conversion Results</h3>
          </div>
          <div className="space-y-2">
            {results.map((result, index) => {
              const savings = result.originalSize - result.newSize;
              const percent = ((savings / result.originalSize) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" title={files[index].name}>{files[index].name}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.originalFormat} → {result.newFormat.toUpperCase()} • {formatSize(result.originalSize)} → {formatSize(result.newSize)}
                      {savings > 0 && ` (${percent}% smaller)`}
                      {savings < 0 && ` (${Math.abs(Number(percent))}% larger)`}
                    </p>
                  </div>
                  {savings > 0 ? (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium flex-shrink-0 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Smaller
                    </span>
                  ) : (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium flex-shrink-0">No Savings</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Info Section */}
      <div className="border rounded-xl p-6 space-y-4 bg-muted/30">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How Does Image Conversion Work?
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Supported Formats:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>JPEG (.jpg, .jpeg)</li>
              <li>PNG (.png)</li>
              <li>WebP (.webp)</li>
              <li>BMP (.bmp)</li>
              <li>GIF (.gif)</li>
              <li>ICO (.ico)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Conversion Process:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All processing is 100% local in your browser</li>
              <li>No files are uploaded or sent to any server</li>
              <li>Uses browser-native Canvas API for conversion</li>
              <li>Quality slider applies to JPEG/WebP only</li>
              <li>PNG is always lossless</li>
            </ul>
          </div>
          <p className="pt-2 border-t">
            <strong className="text-foreground">Note:</strong> Image quality and appearance are preserved. Only the format changes.
          </p>
        </div>
      </div>
    </div>
  );
}
