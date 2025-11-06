/**
 * Mock for pdf-lib library
 */

// Mock PDFDocument class
const mockPages: any[] = [];

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
    
    return Promise.resolve({
      getPageIndices: jest.fn(() => [0, 1, 2]), // Mock 3 pages
      getPageCount: jest.fn(() => 3),
    });
  }),
};

// Reset function for tests
export const resetPDFMocks = () => {
  mockPages.length = 0;
  mockPDFDocument.create.mockClear();
  mockPDFDocument.load.mockClear();
};

// Export as default for module mock
export const PDFDocument = mockPDFDocument;
