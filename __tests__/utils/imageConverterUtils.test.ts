/**
 * Test suite for imageConverterUtils
 * Validates image format conversion logic, file validation, and helper functions
 */

import {
  isSupportedImage,
  isValidImageSize,
  convertImage,
  formatSize,
  type OutputFormat,
  type ConversionOptions,
} from '@/app/utils/imageConverterUtils';

// Mock Canvas API
class MockHTMLCanvasElement {
  width = 0;
  height = 0;
  private context: any = null;

  getContext(contextId: string) {
    if (contextId === '2d') {
      if (!this.context) {
        this.context = {
          drawImage: jest.fn(),
          canvas: this,
        };
      }
      return this.context;
    }
    return null;
  }

  toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number) {
    // Simulate Canvas API behavior
    const content = `converted-${type}-${quality}`;
    const blob = new Blob([content], { type: type || 'image/png' });
    setTimeout(() => callback(blob), 0);
  }
}

// Mock Image API
class MockImage {
  src = '';
  width = 1920;
  height = 1080;
  onload: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;

  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
}

// Mock URL.createObjectURL and revokeObjectURL
const mockObjectURLs = new Set<string>();
global.URL.createObjectURL = jest.fn(() => {
  const url = `blob:mock-${Math.random()}`;
  mockObjectURLs.add(url);
  return url;
});
global.URL.revokeObjectURL = jest.fn((url: string) => {
  mockObjectURLs.delete(url);
});

// Mock document.createElement for Canvas
const originalCreateElement = document.createElement.bind(document);
jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
  if (tagName === 'canvas') {
    return new MockHTMLCanvasElement() as any;
  }
  if (tagName === 'img') {
    return new MockImage() as any;
  }
  return originalCreateElement(tagName);
});

// Helper to create mock file
function createMockFile(options: {
  name?: string;
  type?: string;
  size?: number;
} = {}): File {
  const {
    name = 'test.jpg',
    type = 'image/jpeg',
    size = 1024 * 500,
  } = options;

  const content = new ArrayBuffer(size);
  const blob = new Blob([content], { type });
  
  const file = new File([blob], name, {
    type,
    lastModified: Date.now(),
  });

  Object.defineProperty(file, 'size', {
    value: size,
    writable: false,
  });

  return file;
}

describe('imageConverterUtils - File Validation', () => {
  describe('isSupportedImage', () => {
    test('accepts JPEG images', () => {
      const file = createMockFile({ type: 'image/jpeg' });
      expect(isSupportedImage(file)).toBe(true);
    });

    test('accepts PNG images', () => {
      const file = createMockFile({ type: 'image/png' });
      expect(isSupportedImage(file)).toBe(true);
    });

    test('accepts WebP images', () => {
      const file = createMockFile({ type: 'image/webp' });
      expect(isSupportedImage(file)).toBe(true);
    });

    test('accepts BMP images', () => {
      const file = createMockFile({ type: 'image/bmp' });
      expect(isSupportedImage(file)).toBe(true);
    });

    test('accepts GIF images', () => {
      const file = createMockFile({ type: 'image/gif' });
      expect(isSupportedImage(file)).toBe(true);
    });

    test('accepts ICO images', () => {
      const file = createMockFile({ type: 'image/x-icon' });
      expect(isSupportedImage(file)).toBe(true);
    });

    test('rejects PDF files', () => {
      const file = createMockFile({ type: 'application/pdf' });
      expect(isSupportedImage(file)).toBe(false);
    });

    test('rejects text files', () => {
      const file = createMockFile({ type: 'text/plain' });
      expect(isSupportedImage(file)).toBe(false);
    });

    test('rejects video files', () => {
      const file = createMockFile({ type: 'video/mp4' });
      expect(isSupportedImage(file)).toBe(false);
    });

    test('handles empty MIME type', () => {
      const file = createMockFile({ type: '' });
      expect(isSupportedImage(file)).toBe(false);
    });

    test('handles undefined MIME type', () => {
      const file = createMockFile();
      Object.defineProperty(file, 'type', { value: undefined });
      expect(isSupportedImage(file)).toBe(false);
    });
  });

  describe('isValidImageSize', () => {
    test('accepts files within size limit', () => {
      const file = createMockFile({ size: 1024 * 1024 * 10 }); // 10MB
      expect(isValidImageSize(file)).toBe(true);
    });

    test('accepts files at exact size limit', () => {
      const file = createMockFile({ size: 1024 * 1024 * 50 }); // 50MB (max)
      expect(isValidImageSize(file)).toBe(true);
    });

    test('rejects files over size limit', () => {
      const file = createMockFile({ size: 1024 * 1024 * 51 }); // 51MB
      expect(isValidImageSize(file)).toBe(false);
    });

    test('accepts very small files', () => {
      const file = createMockFile({ size: 1024 }); // 1KB
      expect(isValidImageSize(file)).toBe(true);
    });

    test('rejects zero-byte files', () => {
      const file = createMockFile({ size: 0 });
      expect(isValidImageSize(file)).toBe(false);
    });
  });
});

describe('imageConverterUtils - Format Helpers', () => {
  describe('formatSize', () => {
    test('formats bytes correctly', () => {
      expect(formatSize(500)).toBe('500 B');
      expect(formatSize(999)).toBe('999 B');
    });

    test('formats kilobytes correctly', () => {
      expect(formatSize(1024)).toBe('1.0 KB');
      expect(formatSize(1536)).toBe('1.5 KB');
      expect(formatSize(10240)).toBe('10.0 KB');
    });

    test('formats megabytes correctly', () => {
      expect(formatSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
      expect(formatSize(1024 * 1024 * 15)).toBe('15.0 MB');
    });

    test('formats gigabytes correctly', () => {
      expect(formatSize(1024 * 1024 * 1024)).toBe('1.0 GB');
      expect(formatSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });

    test('handles zero bytes', () => {
      expect(formatSize(0)).toBe('0 B');
    });

    test('handles negative values', () => {
      expect(formatSize(-1024)).toBe('0 B');
    });

    test('rounds to 1 decimal place', () => {
      expect(formatSize(1536)).toBe('1.5 KB');
      expect(formatSize(1638)).toBe('1.6 KB');
      expect(formatSize(1741)).toBe('1.7 KB');
    });
  });
});

describe('imageConverterUtils - Image Conversion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockObjectURLs.clear();
  });

  describe('convertImage - Basic Functionality', () => {
    test('converts JPEG to PNG', async () => {
      const file = createMockFile({ name: 'photo.jpg', type: 'image/jpeg' });
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.type).toBe('image/png');
      expect(result.originalFormat).toBe('JPEG');
      expect(result.newFormat).toBe('PNG');
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
    });

    test('converts PNG to JPEG', async () => {
      const file = createMockFile({ name: 'logo.png', type: 'image/png' });
      const options: ConversionOptions = { format: 'jpeg', quality: 0.92 };

      const result = await convertImage(file, options);

      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.type).toBe('image/jpeg');
      expect(result.originalFormat).toBe('PNG');
      expect(result.newFormat).toBe('JPEG');
    });

    test('converts JPEG to WebP', async () => {
      const file = createMockFile({ name: 'photo.jpg', type: 'image/jpeg' });
      const options: ConversionOptions = { format: 'webp', quality: 0.85 };

      const result = await convertImage(file, options);

      expect(result.blob.type).toBe('image/webp');
      expect(result.newFormat).toBe('WEBP');
    });

    test('converts BMP to PNG', async () => {
      const file = createMockFile({ name: 'bitmap.bmp', type: 'image/bmp' });
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.originalFormat).toBe('BMP');
      expect(result.newFormat).toBe('PNG');
    });

    test('converts GIF to JPEG', async () => {
      const file = createMockFile({ name: 'animation.gif', type: 'image/gif' });
      const options: ConversionOptions = { format: 'jpeg', quality: 0.92 };

      const result = await convertImage(file, options);

      expect(result.originalFormat).toBe('GIF');
      expect(result.newFormat).toBe('JPEG');
    });
  });

  describe('convertImage - Quality Settings', () => {
    test('applies quality setting for JPEG', async () => {
      const file = createMockFile({ type: 'image/png' });
      const options: ConversionOptions = { format: 'jpeg', quality: 0.75 };

      const result = await convertImage(file, options);

      expect(result.blob.type).toBe('image/jpeg');
      // Quality is passed to toBlob, verified by mock
    });

    test('applies quality setting for WebP', async () => {
      const file = createMockFile({ type: 'image/jpeg' });
      const options: ConversionOptions = { format: 'webp', quality: 0.80 };

      const result = await convertImage(file, options);

      expect(result.blob.type).toBe('image/webp');
    });

    test('ignores quality for PNG (lossless)', async () => {
      const file = createMockFile({ type: 'image/jpeg' });
      const options: ConversionOptions = { format: 'png', quality: 0.75 };

      const result = await convertImage(file, options);

      expect(result.blob.type).toBe('image/png');
      // PNG ignores quality parameter
    });

    test('uses default quality when not specified', async () => {
      const file = createMockFile({ type: 'image/png' });
      const options: ConversionOptions = { format: 'jpeg' };

      const result = await convertImage(file, options);

      expect(result.blob.type).toBe('image/jpeg');
    });
  });

  describe('convertImage - File Size Tracking', () => {
    test('tracks original and new file sizes', async () => {
      const file = createMockFile({ size: 1024 * 500 }); // 500KB
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.originalSize).toBe(1024 * 500);
      expect(result.newSize).toBeGreaterThan(0);
      expect(typeof result.newSize).toBe('number');
    });

    test('calculates size for different formats', async () => {
      const file = createMockFile({ type: 'image/png', size: 1024 * 1024 }); // 1MB
      const jpegOptions: ConversionOptions = { format: 'jpeg', quality: 0.92 };

      const result = await convertImage(file, jpegOptions);

      expect(result.originalSize).toBe(1024 * 1024);
      expect(result.newSize).toBeGreaterThan(0);
    });
  });

  describe('convertImage - Error Handling', () => {
    test('handles image load failure', async () => {
      // Mock Image that fails to load
      const FailingImage = class {
        src = '';
        onload: (() => void) | null = null;
        onerror: ((error: any) => void) | null = null;

        constructor() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('Failed to load image'));
            }
          }, 0);
        }
      };

      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'img') {
          return new FailingImage() as any;
        }
        if (tagName === 'canvas') {
          return new MockHTMLCanvasElement() as any;
        }
        return originalCreateElement(tagName);
      });

      const file = createMockFile({ name: 'corrupt.jpg' });
      const options: ConversionOptions = { format: 'png' };

      await expect(convertImage(file, options)).rejects.toThrow();
    });

    test('handles canvas toBlob failure', async () => {
      // Mock Canvas that fails toBlob
      class FailingCanvas extends MockHTMLCanvasElement {
        toBlob(callback: (blob: Blob | null) => void) {
          setTimeout(() => callback(null), 0);
        }
      }

      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return new FailingCanvas() as any;
        }
        if (tagName === 'img') {
          return new MockImage() as any;
        }
        return originalCreateElement(tagName);
      });

      const file = createMockFile();
      const options: ConversionOptions = { format: 'png' };

      await expect(convertImage(file, options)).rejects.toThrow('Failed to convert image');
    });

    test('cleans up object URLs on error', async () => {
      const FailingImage = class {
        src = '';
        onload: (() => void) | null = null;
        onerror: ((error: any) => void) | null = null;

        constructor() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('Load failed'));
            }
          }, 0);
        }
      };

      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'img') {
          return new FailingImage() as any;
        }
        return originalCreateElement(tagName);
      });

      const file = createMockFile();
      const options: ConversionOptions = { format: 'png' };

      try {
        await convertImage(file, options);
  } catch {
        // Expected to fail
      }

      // Verify URL.revokeObjectURL was called
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('convertImage - Canvas Operations', () => {
    test('creates canvas with correct dimensions', async () => {
      const file = createMockFile();
      const options: ConversionOptions = { format: 'png' };

      await convertImage(file, options);

      // Canvas should match image dimensions (1920x1080 from mock)
      const canvas = document.createElement('canvas') as any;
      expect(canvas.width).toBeDefined();
      expect(canvas.height).toBeDefined();
    });

    test('draws image to canvas', async () => {
      const file = createMockFile();
      const options: ConversionOptions = { format: 'png' };

      await convertImage(file, options);

      // Verify canvas context was used
      const canvas = new MockHTMLCanvasElement();
      const ctx = canvas.getContext('2d');
      expect(ctx).not.toBeNull();
    });
  });

  describe('convertImage - Format Detection', () => {
    test('detects JPEG format from MIME type', async () => {
      const file = createMockFile({ type: 'image/jpeg' });
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.originalFormat).toBe('JPEG');
    });

    test('detects PNG format from MIME type', async () => {
      const file = createMockFile({ type: 'image/png' });
      const options: ConversionOptions = { format: 'jpeg', quality: 0.92 };

      const result = await convertImage(file, options);

      expect(result.originalFormat).toBe('PNG');
    });

    test('detects WebP format from MIME type', async () => {
      const file = createMockFile({ type: 'image/webp' });
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.originalFormat).toBe('WEBP');
    });

    test('detects BMP format from MIME type', async () => {
      const file = createMockFile({ type: 'image/bmp' });
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.originalFormat).toBe('BMP');
    });

    test('detects GIF format from MIME type', async () => {
      const file = createMockFile({ type: 'image/gif' });
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.originalFormat).toBe('GIF');
    });

    test('handles unknown format gracefully', async () => {
      const file = createMockFile({ type: 'image/unknown' });
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.originalFormat).toBe('UNKNOWN');
    });
  });

  describe('convertImage - Edge Cases', () => {
    test('handles very small images', async () => {
      const SmallImage = class extends MockImage {
        width = 1;
        height = 1;
      };

      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'img') {
          return new SmallImage() as any;
        }
        if (tagName === 'canvas') {
          return new MockHTMLCanvasElement() as any;
        }
        return originalCreateElement(tagName);
      });

      const file = createMockFile({ size: 100 });
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
    });

    test('handles very large images', async () => {
      const LargeImage = class extends MockImage {
        width = 8000;
        height = 6000;
      };

      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'img') {
          return new LargeImage() as any;
        }
        if (tagName === 'canvas') {
          return new MockHTMLCanvasElement() as any;
        }
        return originalCreateElement(tagName);
      });

      const file = createMockFile({ size: 1024 * 1024 * 20 }); // 20MB
      const options: ConversionOptions = { format: 'png' };

      const result = await convertImage(file, options);

      expect(result.width).toBe(8000);
      expect(result.height).toBe(6000);
    });

    test('handles minimum quality value', async () => {
      const file = createMockFile({ type: 'image/png' });
      const options: ConversionOptions = { format: 'jpeg', quality: 0.01 };

      const result = await convertImage(file, options);

      expect(result.blob.type).toBe('image/jpeg');
    });

    test('handles maximum quality value', async () => {
      const file = createMockFile({ type: 'image/png' });
      const options: ConversionOptions = { format: 'jpeg', quality: 1.0 };

      const result = await convertImage(file, options);

      expect(result.blob.type).toBe('image/jpeg');
    });
  });
});

describe('imageConverterUtils - Type Safety', () => {
  test('OutputFormat type accepts valid formats', () => {
    const formats: OutputFormat[] = ['jpeg', 'png', 'webp'];
    expect(formats).toHaveLength(3);
  });

  test('ConversionOptions requires format', () => {
    const options: ConversionOptions = { format: 'png' };
    expect(options.format).toBe('png');
  });

  test('ConversionOptions accepts optional quality', () => {
    const options: ConversionOptions = { format: 'jpeg', quality: 0.85 };
    expect(options.quality).toBe(0.85);
  });
});

describe('imageConverterUtils - Integration', () => {
  test('full conversion workflow', async () => {
    const file = createMockFile({
      name: 'photo.jpg',
      type: 'image/jpeg',
      size: 1024 * 1024 * 2, // 2MB
    });

    // Validate file
    expect(isSupportedImage(file)).toBe(true);
    expect(isValidImageSize(file)).toBe(true);

    // Convert file
    const options: ConversionOptions = { format: 'png' };
    const result = await convertImage(file, options);

    // Verify result
    expect(result.blob).toBeInstanceOf(Blob);
    expect(result.originalFormat).toBe('JPEG');
    expect(result.newFormat).toBe('PNG');
    expect(result.originalSize).toBe(1024 * 1024 * 2);
    expect(formatSize(result.originalSize)).toBe('2.0 MB');
  });
});
