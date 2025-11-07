/**
 * Image utility functions for EXIF/Metadata stripping
 * These utilities provide client-side, privacy-focused image processing
 * All operations are optimized for performance and memory efficiency
 */

/**
 * Maximum file size for client-side image processing (50MB)
 * This limit prevents browser memory exhaustion
 */
export const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

/**
 * Supported image MIME types for EXIF stripping
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const;

/**
 * Supported image file extensions
 */
export const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'] as const;

/**
 * Type definition for supported image MIME types
 */
export type SupportedImageType = typeof SUPPORTED_IMAGE_TYPES[number];

/**
 * JPEG markers
 */
const JPEG_MARKERS = {
  SOI: 0xFFD8,    // Start of Image
  EOI: 0xFFD9,    // End of Image
  APP0: 0xFFE0,   // JFIF marker
  APP1: 0xFFE1,   // EXIF marker
  APP2: 0xFFE2,   // ICC Profile
  SOS: 0xFFDA,    // Start of Scan (image data follows)
} as const;

/**
 * Result of EXIF stripping operation
 */
export interface StripResult {
  /** The cleaned image file as a Blob */
  blob: Blob;
  /** Original file size in bytes */
  originalSize: number;
  /** New file size in bytes */
  newSize: number;
  /** Whether EXIF data was found and removed */
  hadExif: boolean;
  /** Number of metadata segments removed */
  segmentsRemoved: number;
}

/**
 * Validates if a file is a supported image type based on MIME type and extension
 * @param file - File to validate
 * @returns true if file is a supported image type
 */
export const isImageFile = (file: File): boolean => {
  const hasValidMimeType = SUPPORTED_IMAGE_TYPES.includes(file.type as SupportedImageType);
  const hasValidExtension = SUPPORTED_IMAGE_EXTENSIONS.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  return hasValidMimeType || hasValidExtension;
};

/**
 * Validates image file size against maximum limit
 * @param file - File to validate
 * @returns true if file size is within limits
 */
export const isValidImageSize = (file: File): boolean => {
  return file.size > 0 && file.size <= MAX_IMAGE_SIZE;
};

/**
 * Formats byte size to human-readable string
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "12.5 MB", "340 KB")
 */
export const formatImageSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Calculates size reduction percentage
 * @param originalSize - Original file size in bytes
 * @param newSize - New file size in bytes
 * @returns Percentage reduction (e.g., "5.2%")
 */
export const calculateSizeReduction = (originalSize: number, newSize: number): string => {
  if (originalSize === 0) return '0%';
  const reduction = ((originalSize - newSize) / originalSize) * 100;
  return `${reduction.toFixed(1)}%`;
};

/**
 * Reads a 16-bit unsigned integer from buffer (big-endian)
 * @param buffer - DataView of the buffer
 * @param offset - Offset to read from
 * @returns 16-bit unsigned integer
 */
const readUint16BE = (buffer: DataView, offset: number): number => {
  return buffer.getUint16(offset, false);
};

/**
 * Ultra-performant EXIF stripping for JPEG images
 * Uses streaming approach to minimize memory usage
 * Time Complexity: O(n) where n is file size
 * Space Complexity: O(1) for processing, O(n) for output buffer
 * 
 * @param arrayBuffer - JPEG file data as ArrayBuffer
 * @returns StripResult with cleaned image and metadata
 * @throws Error if file is not a valid JPEG or is corrupted
 */
export const stripJpegExif = async (arrayBuffer: ArrayBuffer): Promise<StripResult> => {
  const view = new DataView(arrayBuffer);
  const originalSize = arrayBuffer.byteLength;
  
  // Validate JPEG signature (0xFFD8)
  if (view.byteLength < 2 || readUint16BE(view, 0) !== JPEG_MARKERS.SOI) {
    throw new Error('Invalid JPEG file: Missing SOI marker');
  }

  // Allocate output buffer (worst case: same size as input)
  const output = new Uint8Array(arrayBuffer.byteLength);
  let outputOffset = 0;
  let inputOffset = 0;
  let segmentsRemoved = 0;
  let hadExif = false;

  // Copy SOI marker
  output[outputOffset++] = 0xFF;
  output[outputOffset++] = 0xD8;
  inputOffset = 2;

  // Process all markers until SOS (Start of Scan) or end
  while (inputOffset < view.byteLength - 1) {
    // Read marker
    if (view.getUint8(inputOffset) !== 0xFF) {
      // Not a marker, we've hit image data or corruption
      break;
    }

    const marker = readUint16BE(view, inputOffset);
    
    // Check for SOS marker (image data follows)
    if (marker === JPEG_MARKERS.SOS) {
      // Copy SOS and all remaining data (image data)
      const remaining = view.byteLength - inputOffset;
      const sourceArray = new Uint8Array(arrayBuffer, inputOffset, remaining);
      output.set(sourceArray, outputOffset);
      outputOffset += remaining;
      break;
    }

    // Check for EOI marker (shouldn't happen before SOS, but handle it)
    if (marker === JPEG_MARKERS.EOI) {
      output[outputOffset++] = 0xFF;
      output[outputOffset++] = 0xD9;
      inputOffset += 2;
      break;
    }

    // Read segment length (includes the 2-byte length field itself)
    if (inputOffset + 3 >= view.byteLength) {
      throw new Error('Corrupted JPEG: Incomplete segment header');
    }

    const segmentLength = readUint16BE(view, inputOffset + 2);
    
    if (segmentLength < 2 || inputOffset + 2 + segmentLength > view.byteLength) {
      throw new Error('Corrupted JPEG: Invalid segment length');
    }

    // Check if this is an EXIF/metadata segment to remove
    const shouldRemove = (
      marker === JPEG_MARKERS.APP1 || // EXIF
      marker === JPEG_MARKERS.APP2    // ICC Profile (optional, can contain metadata)
    );

    if (shouldRemove) {
      // Skip this segment entirely
      segmentsRemoved++;
      if (marker === JPEG_MARKERS.APP1) {
        hadExif = true;
      }
      inputOffset += 2 + segmentLength;
    } else {
      // Keep this segment
      const segmentSize = 2 + segmentLength;
      const segmentData = new Uint8Array(arrayBuffer, inputOffset, segmentSize);
      output.set(segmentData, outputOffset);
      outputOffset += segmentSize;
      inputOffset += segmentSize;
    }
  }

  // Create final blob with exact size (trim unused buffer space)
  const finalData = output.slice(0, outputOffset);
  const blob = new Blob([finalData], { type: 'image/jpeg' });

  return {
    blob,
    originalSize,
    newSize: blob.size,
    hadExif,
    segmentsRemoved,
  };
};

/**
 * Strips EXIF data from PNG images
 * PNG files store metadata in chunks like tEXt, iTXt, zTXt
 * This removes all non-critical chunks while preserving image data
 * Time Complexity: O(n) where n is file size
 * Space Complexity: O(n) for output buffer
 * 
 * @param arrayBuffer - PNG file data as ArrayBuffer
 * @returns StripResult with cleaned image and metadata
 * @throws Error if file is not a valid PNG
 */
export const stripPngMetadata = async (arrayBuffer: ArrayBuffer): Promise<StripResult> => {
  const view = new DataView(arrayBuffer);
  const originalSize = arrayBuffer.byteLength;

  // Validate PNG signature
  const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  if (view.byteLength < 8) {
    throw new Error('Invalid PNG file: File too small');
  }

  for (let i = 0; i < PNG_SIGNATURE.length; i++) {
    if (view.getUint8(i) !== PNG_SIGNATURE[i]) {
      throw new Error('Invalid PNG file: Missing PNG signature');
    }
  }

  // Critical chunks that must be preserved
  const CRITICAL_CHUNKS = new Set(['IHDR', 'PLTE', 'IDAT', 'IEND']);
  
  // Ancillary chunks we want to keep for basic functionality
  const KEEP_CHUNKS = new Set([
    'tRNS', // Transparency
    'gAMA', // Gamma (optional but affects rendering)
    'cHRM', // Chromaticity (optional but affects color)
    'sRGB', // sRGB color space
  ]);

  // Metadata chunks to remove
  const METADATA_CHUNKS = new Set([
    'tEXt', 'iTXt', 'zTXt', // Text metadata
    'tIME', // Timestamp
    'pHYs', // Physical dimensions (can reveal DPI settings)
    'eXIf', // EXIF data (PNG extension)
  ]);

  const output = new Uint8Array(arrayBuffer.byteLength);
  let outputOffset = 0;
  let inputOffset = 0;
  let segmentsRemoved = 0;
  let hadExif = false;

  // Copy PNG signature
  output.set(new Uint8Array(arrayBuffer, 0, 8), 0);
  outputOffset = 8;
  inputOffset = 8;

  // Process chunks
  while (inputOffset < view.byteLength) {
    if (inputOffset + 8 > view.byteLength) {
      throw new Error('Corrupted PNG: Incomplete chunk header');
    }

    // Read chunk length (4 bytes, big-endian)
    const chunkLength = view.getUint32(inputOffset, false);
    
    // Read chunk type (4 bytes ASCII)
    const chunkType = String.fromCharCode(
      view.getUint8(inputOffset + 4),
      view.getUint8(inputOffset + 5),
      view.getUint8(inputOffset + 6),
      view.getUint8(inputOffset + 7)
    );

    // Total chunk size: length (4) + type (4) + data (chunkLength) + CRC (4)
    const totalChunkSize = 12 + chunkLength;

    if (inputOffset + totalChunkSize > view.byteLength) {
      throw new Error(`Corrupted PNG: Chunk ${chunkType} extends beyond file`);
    }

    // Determine if we should keep this chunk
    const shouldKeep = CRITICAL_CHUNKS.has(chunkType) || KEEP_CHUNKS.has(chunkType);
    const isMetadata = METADATA_CHUNKS.has(chunkType);

    if (shouldKeep) {
      // Copy chunk to output
      const chunkData = new Uint8Array(arrayBuffer, inputOffset, totalChunkSize);
      output.set(chunkData, outputOffset);
      outputOffset += totalChunkSize;
    } else if (isMetadata) {
      // Skip metadata chunk
      segmentsRemoved++;
      if (chunkType === 'eXIf') {
        hadExif = true;
      }
    }
    // Unknown/other chunks are also skipped for maximum privacy

    inputOffset += totalChunkSize;

    // Stop after IEND chunk
    if (chunkType === 'IEND') {
      break;
    }
  }

  // Create final blob
  const finalData = output.slice(0, outputOffset);
  const blob = new Blob([finalData], { type: 'image/png' });

  return {
    blob,
    originalSize,
    newSize: blob.size,
    hadExif,
    segmentsRemoved,
  };
};

/**
 * Main entry point for stripping EXIF/metadata from images
 * Automatically detects file type and applies appropriate stripping method
 * Ultra-performant with minimal memory overhead
 * 
 * @param file - Image file to process
 * @returns StripResult with cleaned image and metadata
 * @throws Error if file is invalid, corrupted, or unsupported
 */
export const stripImageMetadata = async (file: File): Promise<StripResult> => {
  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }

  if (!isImageFile(file)) {
    throw new Error('Unsupported file type. Please select a JPEG or PNG image.');
  }

  if (!isValidImageSize(file)) {
    if (file.size === 0) {
      throw new Error('File is empty');
    }
    throw new Error(`File too large. Maximum size is ${formatImageSize(MAX_IMAGE_SIZE)}`);
  }

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Detect file type and strip accordingly
  if (file.type === 'image/jpeg' || file.type === 'image/jpg' || 
      file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
    return stripJpegExif(arrayBuffer);
  } else if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
    return stripPngMetadata(arrayBuffer);
  }

  throw new Error('Unable to determine image format');
};

/**
 * Sanitizes filename to remove problematic characters
 * Adds "_clean" suffix to indicate processed file
 * @param filename - Original filename
 * @returns Sanitized filename with "_clean" suffix
 */
export const sanitizeImageFilename = (filename: string): string => {
  if (!filename || typeof filename !== "string") {
    return "image_clean.jpg";
  }

  // Remove or replace dangerous characters
  const sanitized = filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .trim();

  if (sanitized.length === 0) {
    return "image_clean.jpg";
  }

  // Extract name and extension
  const lastDotIndex = sanitized.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return sanitized.substring(0, 200) + '_clean';
  }

  const name = sanitized.substring(0, lastDotIndex);
  const ext = sanitized.substring(lastDotIndex);
  
  // Add "_clean" suffix before extension
  return (name + '_clean' + ext).substring(0, 200);
};

/**
 * Safely creates and triggers a download for an image Blob
 * Ensures proper cleanup of object URLs to prevent memory leaks
 * @param blob - Blob to download
 * @param filename - Suggested filename for download
 */
export const downloadImage = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = sanitizeImageFilename(filename);
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
