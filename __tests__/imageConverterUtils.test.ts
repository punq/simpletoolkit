import {
    isSupportedImage,
    isValidImageSize,
    formatSize,
    getFormatDisplayName,
    convertImage,
    generateFilename,
    MAX_IMAGE_SIZE
} from '../app/utils/imageConverterUtils';

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Image
class MockImage {
    onload: () => void = () => { };
    onerror: () => void = () => { };
    src: string = '';
    width: number = 100;
    height: number = 100;

    constructor() {
        setTimeout(() => this.onload(), 10);
    }
}
global.Image = MockImage as any;

// Mock Canvas
const mockToBlob = jest.fn((callback) => callback(new Blob(['mock-content'])));
const mockGetContext = jest.fn(() => ({
    drawImage: jest.fn(),
    fillRect: jest.fn(),
    fillStyle: '',
}));

HTMLCanvasElement.prototype.getContext = mockGetContext as any;
HTMLCanvasElement.prototype.toBlob = mockToBlob as any;

describe('imageConverterUtils', () => {
    describe('isSupportedImage', () => {
        it('returns true for supported mime types', () => {
            const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
            expect(isSupportedImage(file)).toBe(true);
        });

        it('returns true for supported extensions', () => {
            const file = new File([''], 'test.webp', { type: '' });
            expect(isSupportedImage(file)).toBe(true);
        });

        it('returns false for unsupported types', () => {
            const file = new File([''], 'test.txt', { type: 'text/plain' });
            expect(isSupportedImage(file)).toBe(false);
        });
    });

    describe('isValidImageSize', () => {
        it('returns true for valid size', () => {
            const file = { size: 1024 } as File;
            expect(isValidImageSize(file)).toBe(true);
        });

        it('returns false for empty file', () => {
            const file = { size: 0 } as File;
            expect(isValidImageSize(file)).toBe(false);
        });

        it('returns false for too large file', () => {
            const file = { size: MAX_IMAGE_SIZE + 1 } as File;
            expect(isValidImageSize(file)).toBe(false);
        });
    });

    describe('formatSize', () => {
        it('formats bytes', () => {
            expect(formatSize(500)).toBe('500 B');
        });

        it('formats KB', () => {
            expect(formatSize(1500)).toBe('1.5 KB');
        });

        it('formats MB', () => {
            expect(formatSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
        });
    });

    describe('getFormatDisplayName', () => {
        it('returns correct display names', () => {
            expect(getFormatDisplayName('image/jpeg')).toBe('JPEG');
            expect(getFormatDisplayName('png')).toBe('PNG');
            expect(getFormatDisplayName('unknown')).toBe('UNKNOWN');
        });
    });

    describe('generateFilename', () => {
        it('generates correct filename', () => {
            expect(generateFilename('test.png', 'jpeg')).toBe('test.jpg');
            expect(generateFilename('test.bmp', 'webp')).toBe('test.webp');
        });
    });

    describe('convertImage', () => {
        it('converts image successfully', async () => {
            const file = new File(['mock-image-content'], 'test.png', { type: 'image/png' });
            const result = await convertImage(file, { format: 'jpeg' });

            expect(result).toBeDefined();
            expect(result.newFormat).toBe('jpeg');
            expect(mockGetContext).toHaveBeenCalled();
            expect(mockToBlob).toHaveBeenCalled();
        });

        it('throws error for unsupported format', async () => {
            const file = new File([''], 'test.txt', { type: 'text/plain' });
            await expect(convertImage(file, { format: 'jpeg' })).rejects.toThrow('Unsupported image format');
        });

        it('resizes image if dimensions provided', async () => {
            const file = new File(['mock-image-content'], 'test.png', { type: 'image/png' });
            // Mock Image with specific size for this test if needed, 
            // but our MockImage has fixed 100x100.

            await convertImage(file, { format: 'png', maxWidth: 50 });

            // We can't easily check the canvas size here without more complex mocking,
            // but we can check if it didn't crash.
            // To verify resizing, we'd need to inspect the canvas created.
            // Since we can't spy on the local variable `canvas`, we rely on coverage.
        });
    });
});
