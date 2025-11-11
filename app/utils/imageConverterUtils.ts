/**
 * Image Format Converter Utilities
 * Provides 100% client-side image format conversion using Canvas API
 * Supports: JPEG, PNG, WEBP, BMP, GIF, ICO
 */

/**
 * Maximum file size for client-side image processing (50MB)
 */
export const MAX_IMAGE_SIZE = 50 * 1024 * 1024;

/**
 * Supported input image formats
 */
export const SUPPORTED_INPUT_FORMATS = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/bmp',
  'image/gif',
  'image/x-icon',
  'image/vnd.microsoft.icon',
] as const;

/**
 * Supported output formats
 */
export type OutputFormat = 'jpeg' | 'png' | 'webp';

/**
 * Quality settings for lossy formats
 */
export interface ConversionOptions {
  format: OutputFormat;
  quality?: number; // 0.0 - 1.0, only for jpeg/webp
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Result of image conversion
 */
export interface ConversionResult {
  blob: Blob;
  originalSize: number;
  newSize: number;
  originalFormat: string;
  newFormat: OutputFormat;
  width: number;
  height: number;
}

/**
 * Validates if a file is a supported image format
 */
export const isSupportedImage = (file: File): boolean => {
  const hasValidMimeType = SUPPORTED_INPUT_FORMATS.includes(file.type as typeof SUPPORTED_INPUT_FORMATS[number]);
  
  // Also check file extension as fallback
  const ext = file.name.toLowerCase().split('.').pop() || '';
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'ico'];
  const hasValidExtension = validExtensions.includes(ext);
  
  return hasValidMimeType || hasValidExtension;
};

/**
 * Validates image file size
 */
export const isValidImageSize = (file: File): boolean => {
  return file.size > 0 && file.size <= MAX_IMAGE_SIZE;
};

/**
 * Formats byte size to human-readable string
 */
export const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Gets the display name for an image format
 */
export const getFormatDisplayName = (format: string): string => {
  const map: Record<string, string> = {
    'jpeg': 'JPEG',
    'jpg': 'JPEG',
    'png': 'PNG',
    'webp': 'WebP',
    'bmp': 'BMP',
    'gif': 'GIF',
    'ico': 'ICO',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/bmp': 'BMP',
    'image/gif': 'GIF',
    'image/x-icon': 'ICO',
    'image/vnd.microsoft.icon': 'ICO',
  };
  return map[format.toLowerCase()] || format.toUpperCase();
};

/**
 * Gets the MIME type for an output format
 */
const getMimeType = (format: OutputFormat): string => {
  const map: Record<OutputFormat, string> = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  };
  return map[format];
};

/**
 * Converts an image file to a different format
 * Uses Canvas API for conversion - 100% client-side
 * 
 * @param file - Image file to convert
 * @param options - Conversion options (format, quality, dimensions)
 * @returns ConversionResult with converted blob and metadata
 * @throws Error if conversion fails
 */
export const convertImage = async (
  file: File,
  options: ConversionOptions
): Promise<ConversionResult> => {
  if (!isSupportedImage(file)) {
    throw new Error('Unsupported image format. Please use JPEG, PNG, WebP, BMP, GIF, or ICO.');
  }

  if (!isValidImageSize(file)) {
    throw new Error(`Image is too large. Maximum size is ${formatSize(MAX_IMAGE_SIZE)}.`);
  }

  const { format, quality = 0.92, maxWidth, maxHeight } = options;

  // Validate quality
  const safeQuality = Math.min(1.0, Math.max(0.0, quality));

  // Load image
  const img = await loadImage(file);
  
  // Calculate dimensions (with optional resizing)
  let { width, height } = img;
  
  if (maxWidth || maxHeight) {
    const scale = Math.min(
      maxWidth ? maxWidth / width : 1,
      maxHeight ? maxHeight / height : 1,
      1 // Don't upscale
    );
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  // Create canvas and draw image
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d', { alpha: format === 'png' });
  if (!ctx) {
    throw new Error('Failed to create canvas context');
  }

  // For JPEG, fill with white background (no transparency)
  if (format === 'jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  // Draw image
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to blob
  const blob = await canvasToBlob(canvas, getMimeType(format), safeQuality);

  return {
    blob,
    originalSize: file.size,
    newSize: blob.size,
    originalFormat: getFormatDisplayName(file.type || file.name.split('.').pop() || ''),
    newFormat: format,
    width,
    height,
  };
};

/**
 * Loads an image file into an HTMLImageElement
 */
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image. The file may be corrupted.'));
    };
    
    img.src = url;
  });
};

/**
 * Converts canvas to blob with proper error handling
 */
const canvasToBlob = (
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert image. Please try again.'));
        }
      },
      mimeType,
      quality
    );
  });
};

/**
 * Downloads a blob as a file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = sanitizeFilename(filename);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
};

/**
 * Sanitizes filename for download
 */
const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return 'converted-image.jpg';
  }
  
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .trim()
    .substring(0, 200);
};

/**
 * Generates output filename based on input and format
 */
export const generateFilename = (originalName: string, format: OutputFormat): string => {
  const baseName = originalName.replace(/\.[^.]+$/, '');
  const extension = format === 'jpeg' ? 'jpg' : format;
  return `${baseName}.${extension}`;
};
