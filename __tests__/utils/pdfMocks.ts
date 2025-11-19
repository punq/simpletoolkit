/**
 * Mock for pdf-lib library
 */

// Mock PDFDocument class
const mockPages: any[] = [];
// The mock keeps simple page stubs; drawText is used in other tests.

// Allow tests to control page count returned by PDFDocument.load
let mockPageCount = 3;
export const setMockPageCount = (count: number) => {
  mockPageCount = count;
};

export const mockPDFDocument = {
  create: jest.fn(() => {
    const pages: any[] = [];
    return Promise.resolve({
      copyPages: jest.fn((sourcePdf, indices) => {
        // Return pages that look like PDFPage objects in pdf-lib
        return Promise.resolve(
          indices.map((i: number) => {
            const page = {
              pageNumber: i,
              _mock: true,
              rotation: 0,
              setRotation: function (r: number) {
                this.rotation = r;
              },
            };
            return page;
          })
        );
      }),
      addPage: jest.fn(() => {
        // In pdf-lib, addPage returns a PDFPage with utility methods.
        const p = {
          _mock: true,
          drawText: jest.fn(),
        };
        pages.push(p);
        return p;
      }),
      save: jest.fn(() => {
        // Return a mock PDF byte array that's smaller than input (simulating compression)
        const mockBytes = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52]); // "%PDF-1.4"
        return Promise.resolve(mockBytes);
      }),
      getPageCount: jest.fn(() => pages.length),
      getPages: jest.fn(() => pages),
    });
  }),
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
    const pages = Array.from({ length: count }, (_, i) => ({ pageNumber: i, _mock: true }));
    
    return Promise.resolve({
      getPageIndices: jest.fn(() => Array.from({ length: count }, (_, i) => i)),
      getPageCount: jest.fn(() => count),
      getPages: jest.fn(() => pages),
      copyPages: jest.fn((sourcePdf, indices) => {
        return Promise.resolve(
          indices.map((i: number) => {
            const p = pages[i] || { pageNumber: i, _mock: true };
            // attach a no-op setRotation so code that invokes degrees() and setRotation() won't break
            return { ...p, rotation: 0, setRotation: function (r: number) { this.rotation = r; } };
          })
        );
      }),
      addPage: jest.fn(() => {
        const p = {
          _mock: true,
          drawText: jest.fn(),
        };
        return p;
      }),
      save: jest.fn(() => {
        const mockBytes = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52]);
        return Promise.resolve(mockBytes);
      }),
    });
  }),
};

// Helper to emulate pdf-lib's `degrees()` conversion
export const degrees = (n: number) => n;

// Reset function for tests
export const resetPDFMocks = () => {
  mockPages.length = 0;
  mockPageCount = 3;
  mockPDFDocument.create.mockClear();
  mockPDFDocument.load.mockClear();
};

// Export as default for module mock
export const PDFDocument = mockPDFDocument;
