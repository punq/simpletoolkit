/**
 * Mock for pdf-lib library
 */

// Mock PDFDocument class
const mockPages: any[] = [];

// Allow tests to control page count returned by PDFDocument.load
let mockPageCount = 3;
export const setMockPageCount = (count: number) => {
  mockPageCount = count;
};

export const mockPDFDocument = {
  create: jest.fn(() => Promise.resolve({
    copyPages: jest.fn((pdf, indices) => {
      return Promise.resolve(
        indices.map((i: number) => ({ pageNumber: i, _mock: true }))
      );
    }),
    addPage: jest.fn((page) => {
      mockPages.push(page);
    }),
    save: jest.fn(() => {
      // Return a mock PDF byte array
      const mockBytes = new Uint8Array([37, 80, 68, 70]); // "%PDF" header
      return Promise.resolve(mockBytes);
    }),
    getPageCount: jest.fn(() => mockPages.length),
  })),
  load: jest.fn((arrayBuffer) => {
    // Check if it's a "corrupted" file (size 0)
    if (arrayBuffer.byteLength === 0) {
      return Promise.reject(new Error('Failed to parse PDF: Invalid PDF structure'));
    }
    
    // Check if it's an "encrypted" file (specific size marker)
    if (arrayBuffer.byteLength === 999) {
      return Promise.reject(new Error('Cannot modify encrypted PDF'));
    }
    
    const count = mockPageCount;
    return Promise.resolve({
      getPageIndices: jest.fn(() => Array.from({ length: count }, (_, i) => i)),
      getPageCount: jest.fn(() => count),
    });
  }),
};

// Reset function for tests
export const resetPDFMocks = () => {
  mockPages.length = 0;
  mockPageCount = 3;
  mockPDFDocument.create.mockClear();
  mockPDFDocument.load.mockClear();
};

// Export as default for module mock
export const PDFDocument = mockPDFDocument;
