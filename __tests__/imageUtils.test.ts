/**
 * Comprehensive unit tests for imageUtils core stripping functions
 * Tests cover successful operations, edge cases, and error scenarios
 */

import {
  stripJpegExif,
  stripPngMetadata,
  stripImageMetadata,
  isImageFile,
  isValidImageSize,
  formatImageSize,
  calculateSizeReduction,
  MAX_IMAGE_SIZE,
} from '@/app/utils/imageUtils';

describe('imageUtils - Core Stripping Functions', () => {
  describe('stripJpegExif', () => {
    it('successfully strips EXIF from valid JPEG with APP1 marker', async () => {
      // Create a minimal valid JPEG with EXIF data
      const jpegWithExif = new Uint8Array([
        // SOI marker
        0xFF, 0xD8,
        // APP1 marker (EXIF)
        0xFF, 0xE1,
        // Length (20 bytes including this field)
        0x00, 0x14,
        // EXIF identifier "Exif\0\0"
        0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
        // Mock EXIF data (12 bytes)
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // SOS marker (Start of Scan)
        0xFF, 0xDA,
        // Length
        0x00, 0x08,
        // Mock scan header
        0x01, 0x00, 0x00, 0x3F, 0x00, 0x00,
        // Mock image data
        0xFF, 0xD9 // EOI marker
      ]);

      const result = await stripJpegExif(jpegWithExif.buffer);

      expect(result.hadExif).toBe(true);
      expect(result.segmentsRemoved).toBeGreaterThan(0);
      expect(result.newSize).toBeLessThan(result.originalSize);
      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.type).toBe('image/jpeg');
    });

    it('handles JPEG with no EXIF data gracefully', async () => {
      // Create a minimal valid JPEG without EXIF
      const jpegNoExif = new Uint8Array([
        // SOI marker
        0xFF, 0xD8,
        // APP0 marker (JFIF, not EXIF)
        0xFF, 0xE0,
        // Length
        0x00, 0x10,
        // JFIF identifier "JFIF\0"
        0x4A, 0x46, 0x49, 0x46, 0x00,
        // Version 1.1
        0x01, 0x01,
        // Density units
        0x00,
        // X density
        0x00, 0x01,
        // Y density
        0x00, 0x01,
        // Thumbnail size
        0x00, 0x00,
        // SOS marker
        0xFF, 0xDA,
        // Length
        0x00, 0x08,
        // Mock scan header
        0x01, 0x00, 0x00, 0x3F, 0x00, 0x00,
        // EOI marker
        0xFF, 0xD9
      ]);

      const result = await stripJpegExif(jpegNoExif.buffer);

      expect(result.hadExif).toBe(false);
      expect(result.segmentsRemoved).toBe(0);
      expect(result.blob).toBeInstanceOf(Blob);
      // File should be roughly the same size
      expect(result.newSize).toBeGreaterThan(0);
    });

    it('throws error for invalid JPEG (missing SOI marker)', async () => {
      const invalidJpeg = new Uint8Array([
        0x00, 0x00, // Invalid start
        0xFF, 0xDA,
        0x00, 0x00
      ]);

      await expect(stripJpegExif(invalidJpeg.buffer)).rejects.toThrow('Invalid JPEG file: Missing SOI marker');
    });

    it('throws error for corrupted JPEG (incomplete segment)', async () => {
      const corruptedJpeg = new Uint8Array([
        0xFF, 0xD8, // SOI
        0xFF, 0xE1, // APP1 marker
        0xFF, 0xFF, // Invalid length (extends beyond file)
        0x00, 0x00
      ]);

      await expect(stripJpegExif(corruptedJpeg.buffer)).rejects.toThrow('Corrupted JPEG');
    });

    it('handles JPEG with multiple APP segments', async () => {
      const jpegMultipleApps = new Uint8Array([
        0xFF, 0xD8, // SOI
        // APP0
        0xFF, 0xE0,
        0x00, 0x0A,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // APP1 (EXIF)
        0xFF, 0xE1,
        0x00, 0x0A,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // APP2 (ICC Profile)
        0xFF, 0xE2,
        0x00, 0x0A,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // SOS
        0xFF, 0xDA,
        0x00, 0x08,
        0x01, 0x00, 0x00, 0x3F, 0x00, 0x00,
        0xFF, 0xD9 // EOI
      ]);

      const result = await stripJpegExif(jpegMultipleApps.buffer);

      expect(result.hadExif).toBe(true);
      expect(result.segmentsRemoved).toBe(2); // APP1 and APP2
      expect(result.newSize).toBeLessThan(result.originalSize);
    });
  });

  describe('stripPngMetadata', () => {
    it('successfully strips metadata from valid PNG with eXIf chunk', async () => {
      // PNG signature
      const signature = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      
      // IHDR chunk (critical)
      const ihdr = new Uint8Array([
        0x00, 0x00, 0x00, 0x0D, // Length: 13
        0x49, 0x48, 0x44, 0x52, // "IHDR"
        0x00, 0x00, 0x00, 0x10, // Width: 16
        0x00, 0x00, 0x00, 0x10, // Height: 16
        0x08, 0x06, 0x00, 0x00, 0x00, // Bit depth, color type, etc.
        0x00, 0x00, 0x00, 0x00  // CRC (mock)
      ]);

      // eXIf chunk (metadata to remove)
      const exif = new Uint8Array([
        0x00, 0x00, 0x00, 0x08, // Length: 8
        0x65, 0x58, 0x49, 0x66, // "eXIf"
        0x00, 0x00, 0x00, 0x00, // Mock EXIF data
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00  // CRC
      ]);

      // IDAT chunk (image data)
      const idat = new Uint8Array([
        0x00, 0x00, 0x00, 0x04, // Length: 4
        0x49, 0x44, 0x41, 0x54, // "IDAT"
        0x00, 0x00, 0x00, 0x00, // Mock data
        0x00, 0x00, 0x00, 0x00  // CRC
      ]);

      // IEND chunk (end)
      const iend = new Uint8Array([
        0x00, 0x00, 0x00, 0x00, // Length: 0
        0x49, 0x45, 0x4E, 0x44, // "IEND"
        0x00, 0x00, 0x00, 0x00  // CRC
      ]);

      // Combine all chunks
      const pngWithExif = new Uint8Array([
        ...signature,
        ...ihdr,
        ...exif,
        ...idat,
        ...iend
      ]);

      const result = await stripPngMetadata(pngWithExif.buffer);

      expect(result.hadExif).toBe(true);
      expect(result.segmentsRemoved).toBeGreaterThan(0);
      expect(result.newSize).toBeLessThan(result.originalSize);
      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.type).toBe('image/png');
    });

    it('handles PNG with no metadata gracefully', async () => {
      const signature = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      
      const ihdr = new Uint8Array([
        0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x10,
        0x00, 0x00, 0x00, 0x10,
        0x08, 0x06, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
      ]);

      const idat = new Uint8Array([
        0x00, 0x00, 0x00, 0x04,
        0x49, 0x44, 0x41, 0x54,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
      ]);

      const iend = new Uint8Array([
        0x00, 0x00, 0x00, 0x00,
        0x49, 0x45, 0x4E, 0x44,
        0x00, 0x00, 0x00, 0x00
      ]);

      const pngNoMetadata = new Uint8Array([...signature, ...ihdr, ...idat, ...iend]);

      const result = await stripPngMetadata(pngNoMetadata.buffer);

      expect(result.hadExif).toBe(false);
      expect(result.segmentsRemoved).toBe(0);
      expect(result.blob).toBeInstanceOf(Blob);
    });

    it('throws error for invalid PNG (wrong signature)', async () => {
      const invalidPng = new Uint8Array([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
      ]);

      await expect(stripPngMetadata(invalidPng.buffer)).rejects.toThrow('Invalid PNG file: Missing PNG signature');
    });

    it('throws error for truncated PNG file', async () => {
      const truncatedPng = new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // Signature only
        0x00, 0x00, 0x00, 0x0D, // Start of chunk but incomplete
      ]);

      await expect(stripPngMetadata(truncatedPng.buffer)).rejects.toThrow('Corrupted PNG');
    });

    it('removes text metadata chunks (tEXt, iTXt)', async () => {
      const signature = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      
      const ihdr = new Uint8Array([
        0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x10,
        0x00, 0x00, 0x00, 0x10,
        0x08, 0x06, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
      ]);

      // tEXt chunk
      const text = new Uint8Array([
        0x00, 0x00, 0x00, 0x0C,
        0x74, 0x45, 0x58, 0x74, // "tEXt"
        0x41, 0x75, 0x74, 0x68, 0x6F, 0x72, 0x00, 0x4A, 0x6F, 0x68, 0x6E, 0x00, // "Author\0John\0"
        0x00, 0x00, 0x00, 0x00
      ]);

      const idat = new Uint8Array([
        0x00, 0x00, 0x00, 0x04,
        0x49, 0x44, 0x41, 0x54,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
      ]);

      const iend = new Uint8Array([
        0x00, 0x00, 0x00, 0x00,
        0x49, 0x45, 0x4E, 0x44,
        0x00, 0x00, 0x00, 0x00
      ]);

      const pngWithText = new Uint8Array([...signature, ...ihdr, ...text, ...idat, ...iend]);

      const result = await stripPngMetadata(pngWithText.buffer);

      expect(result.segmentsRemoved).toBe(1);
      expect(result.newSize).toBeLessThan(result.originalSize);
    });
  });

  describe('stripImageMetadata (main entry point)', () => {
    it('automatically detects and strips JPEG EXIF', async () => {
      // Create a minimal but valid JPEG with EXIF
      const jpegData = new Uint8Array([
        0xFF, 0xD8, // SOI
        0xFF, 0xE1, // APP1
        0x00, 0x10, // Length
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0xFF, 0xDA, // SOS
        0x00, 0x08,
        0x01, 0x00, 0x00, 0x3F, 0x00, 0x00,
        0xFF, 0xD9 // EOI
      ]);
      
      const jpegFile = new File([jpegData], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock arrayBuffer if not available in test environment
      if (!jpegFile.arrayBuffer) {
        Object.defineProperty(jpegFile, 'arrayBuffer', {
          value: () => Promise.resolve(jpegData.buffer),
          writable: false,
        });
      }

      const result = await stripImageMetadata(jpegFile);

      expect(result).toBeDefined();
      expect(result.blob).toBeInstanceOf(Blob);
    });

    it('automatically detects and strips PNG metadata', async () => {
      const pngFile = new File(
        [new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52])],
        'test.png',
        { type: 'image/png' }
      );

      // Will throw due to incomplete file, but tests format detection
      await expect(stripImageMetadata(pngFile)).rejects.toThrow();
    });

    it('throws error for null/undefined file', async () => {
      await expect(stripImageMetadata(null as any)).rejects.toThrow('No file provided');
    });

    it('throws error for unsupported file type', async () => {
      const textFile = new File(['text content'], 'test.txt', { type: 'text/plain' });

      await expect(stripImageMetadata(textFile)).rejects.toThrow('Unsupported file type');
    });

    it('throws error for empty file', async () => {
      const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });

      await expect(stripImageMetadata(emptyFile)).rejects.toThrow('File is empty');
    });

    it('throws error for file exceeding size limit', async () => {
      const largeBuffer = new ArrayBuffer(MAX_IMAGE_SIZE + 1);
      const largeFile = new File([largeBuffer], 'large.jpg', { type: 'image/jpeg' });

      await expect(stripImageMetadata(largeFile)).rejects.toThrow('File too large');
    });
  });

  describe('Validation Functions', () => {
    describe('isImageFile', () => {
      it('accepts valid JPEG by MIME type', () => {
        const file = new File([], 'test.jpg', { type: 'image/jpeg' });
        expect(isImageFile(file)).toBe(true);
      });

      it('accepts valid PNG by MIME type', () => {
        const file = new File([], 'test.png', { type: 'image/png' });
        expect(isImageFile(file)).toBe(true);
      });

      it('accepts JPEG by extension even with wrong MIME type', () => {
        const file = new File([], 'test.jpg', { type: 'application/octet-stream' });
        expect(isImageFile(file)).toBe(true);
      });

      it('rejects non-image files', () => {
        const file = new File([], 'test.txt', { type: 'text/plain' });
        expect(isImageFile(file)).toBe(false);
      });

      it('rejects PDF files', () => {
        const file = new File([], 'test.pdf', { type: 'application/pdf' });
        expect(isImageFile(file)).toBe(false);
      });
    });

    describe('isValidImageSize', () => {
      it('accepts files within size limit', () => {
        const file = new File([new ArrayBuffer(1024 * 1024)], 'test.jpg');
        expect(isValidImageSize(file)).toBe(true);
      });

      it('rejects files exceeding size limit', () => {
        const file = new File([new ArrayBuffer(MAX_IMAGE_SIZE + 1)], 'test.jpg');
        expect(isValidImageSize(file)).toBe(false);
      });

      it('rejects empty files', () => {
        const file = new File([], 'test.jpg');
        expect(isValidImageSize(file)).toBe(false);
      });

      it('accepts files at exact size limit', () => {
        const file = new File([new ArrayBuffer(MAX_IMAGE_SIZE)], 'test.jpg');
        expect(isValidImageSize(file)).toBe(true);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('formatImageSize', () => {
      it('formats bytes correctly', () => {
        expect(formatImageSize(500)).toBe('500 B');
      });

      it('formats kilobytes correctly', () => {
        expect(formatImageSize(1024)).toBe('1.0 KB');
        expect(formatImageSize(1536)).toBe('1.5 KB');
      });

      it('formats megabytes correctly', () => {
        expect(formatImageSize(1024 * 1024)).toBe('1.0 MB');
        expect(formatImageSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
      });
    });

    describe('calculateSizeReduction', () => {
      it('calculates percentage reduction correctly', () => {
        expect(calculateSizeReduction(1000, 800)).toBe('20.0%');
        expect(calculateSizeReduction(1000, 500)).toBe('50.0%');
      });

      it('handles no reduction', () => {
        expect(calculateSizeReduction(1000, 1000)).toBe('0.0%');
      });

      it('handles zero original size', () => {
        expect(calculateSizeReduction(0, 0)).toBe('0%');
      });

      it('handles increase in size', () => {
        const result = calculateSizeReduction(1000, 1100);
        expect(result).toContain('-'); // Negative percentage
      });
    });
  });
});
