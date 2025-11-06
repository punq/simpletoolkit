/**
 * Shared PDF utility functions
 * These utilities are used across all PDF manipulation tools
 */

/**
 * Maximum file size for client-side PDF processing (50MB)
 * This limit prevents browser memory exhaustion
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

/**
 * Validates if a file is a PDF based on MIME type and extension
 * @param file - File to validate
 * @returns true if file is a valid PDF
 */
export const isPdfFile = (file: File): boolean => {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
};

/**
 * Validates PDF file size against maximum limit
 * @param file - File to validate
 * @returns true if file size is within limits
 */
export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Formats byte size to human-readable MB string
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "12.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + " MB";
};

/**
 * Sanitizes filename to remove problematic characters that could cause security issues
 * Removes: < > : " / \ | ? * and control characters (0x00-0x1F)
 * Limits length to 200 characters to prevent filesystem issues
 * @param filename - Original filename
 * @returns Sanitized filename safe for download
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== "string") {
    return "document.pdf";
  }
  
  // Remove or replace dangerous characters
  const sanitized = filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .trim();
  
  // Ensure we don't have an empty string
  if (sanitized.length === 0) {
    return "document.pdf";
  }
  
  // Limit length to prevent filesystem issues
  return sanitized.substring(0, 200);
};

/**
 * Validates and prepares a PDF file for processing
 * @param file - File to validate
 * @throws Error with user-friendly message if validation fails
 */
export const validatePdfFile = (file: File): void => {
  if (!file) {
    throw new Error("No file provided.");
  }

  if (!isPdfFile(file)) {
    throw new Error("Please select a PDF file.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large. Please select a PDF under 50MB.");
  }
};

/**
 * Safely creates and triggers a download for a Blob
 * Ensures proper cleanup of object URLs to prevent memory leaks
 * @param blob - Blob to download
 * @param filename - Suggested filename for download
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = sanitizeFilename(filename);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    
    // Small delay before cleanup to ensure download initiated
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    // Always clean up URL even if download fails
    URL.revokeObjectURL(url);
    throw error;
  }
};

/**
 * Extracts base filename without extension
 * @param filename - Full filename with extension
 * @returns Filename without .pdf extension
 */
export const getBaseFilename = (filename: string): string => {
  return filename.replace(/\.pdf$/i, "");
};
