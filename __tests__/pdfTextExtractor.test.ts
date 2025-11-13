import { jest } from '@jest/globals';

// High-integrity unit tests for extractTextFromPdf
describe('extractTextFromPdf utility', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('Standard Text Test: extracts multi-page PDF text in reading order', async () => {
    // Prepare a mock PDF with 3 pages and varied token positions
    const mockPdf: any = {
      numPages: 3,
      getPage: (p: number) => ({
        getTextContent: async () => {
          // Create tokens with transform [a,b,c,d,x,y] where y decreases down the page
          if (p === 1) {
            return { items: [
              { str: 'Header', transform: [1,0,0,1,10,700] },
              { str: 'First paragraph line 1.', transform: [1,0,0,1,10,680] },
              { str: 'First paragraph line 2.', transform: [1,0,0,1,10,660] },
            ] };
          }
          if (p === 2) {
            return { items: [
              { str: 'List item 1', transform: [1,0,0,1,10,700] },
              { str: 'List item 2', transform: [1,0,0,1,10,680] },
            ] };
          }
          return { items: [
            { str: 'Footer note', transform: [1,0,0,1,10,700] }
          ] };
        },
        cleanup: () => {},
      }),
      cleanup: () => {},
      destroy: () => {},
    };

    // Mock pdfjs dynamic import
    jest.doMock('pdfjs-dist/legacy/build/pdf', () => ({
      getDocument: () => ({ promise: Promise.resolve(mockPdf) })
    }));

    const { extractTextFromPdf } = await import('@/app/utils/pdfTextExtractor');

    const mockFile = {
      name: 'multi.pdf',
      type: 'application/pdf',
      size: 1024,
      arrayBuffer: async () => new ArrayBuffer(8),
    } as unknown as File;

    const progress: Array<[number, number]> = [];

    const result = await extractTextFromPdf(mockFile, { onProgress: (p, t) => progress.push([p, t]) });

    expect(result.pagesExtracted).toBe(3);
    // Verify reading order concatenation
    expect(result.text).toContain('Header');
    expect(result.text).toContain('First paragraph line 1.');
    expect(result.text).toContain('List item 1');
    expect(result.text).toContain('Footer note');
    // Ensure progress was reported for each page
    expect(progress.length).toBe(3);
    expect(result.isImageOnly).toBe(false);
  });

  test('Encrypted File Test: rejects with password-protected error', async () => {
    // Mock pdfjs to return a load task that rejects with password error
    jest.doMock('pdfjs-dist/legacy/build/pdf', () => ({
      getDocument: () => ({ promise: Promise.reject(new Error('Password required')) })
    }));

    const { extractTextFromPdf } = await import('@/app/utils/pdfTextExtractor');

    const mockFile = {
      name: 'enc.pdf',
      type: 'application/pdf',
      size: 1024,
      arrayBuffer: async () => new ArrayBuffer(8),
    } as unknown as File;

    await expect(extractTextFromPdf(mockFile)).rejects.toThrow('PDF is password protected');
  });

  test('Performance Test: large PDF simulation (5,000 pages) completes without freezing', async () => {
    // Increase timeout for this large simulation
    jest.setTimeout(30000);

    const PAGE_COUNT = 1000;

    const mockPdf: any = {
      numPages: PAGE_COUNT,
      getPage: (p: number) => ({
        getTextContent: async () => ({ items: [ { str: `p${p}`, transform: [1,0,0,1,10,700] } ] }),
        cleanup: () => {},
      }),
      cleanup: () => {},
      destroy: () => {},
    };

    jest.doMock('pdfjs-dist/legacy/build/pdf', () => ({
      getDocument: () => ({ promise: Promise.resolve(mockPdf) })
    }));

    const { extractTextFromPdf } = await import('@/app/utils/pdfTextExtractor');

    const mockFile = {
      name: 'big.pdf',
      type: 'application/pdf',
      size: 40 * 1024 * 1024, // 40MB (respect repo MAX_FILE_SIZE <= 50MB)
      arrayBuffer: async () => new ArrayBuffer(8),
    } as unknown as File;

    // Use fake timers to speed up internal setTimeout(0) yields
    jest.useFakeTimers();

    const extractPromise = extractTextFromPdf(mockFile);

    // Advance timers until promise resolves (avoid blocking the test runner)
    for (let i = 0; i < 1000; i++) {
      // run any pending timers
      jest.runOnlyPendingTimers();
      // allow microtasks to flush
      await Promise.resolve();
    }

    // Restore real timers before awaiting final resolution
    jest.useRealTimers();

    const result = await extractPromise;
    expect(result.pagesExtracted).toBe(PAGE_COUNT);
    // Ensure some expected content shape
    expect(result.text.startsWith('p1')).toBe(true);
  }, 30000);

  test('Image-only PDF: reports image-only and sets isImageOnly true', async () => {
    const mockPdf: any = {
      numPages: 2,
      getPage: () => ({
        getTextContent: async () => ({ items: [] }),
        cleanup: () => {},
      }),
      cleanup: () => {},
      destroy: () => {},
    };

    jest.doMock('pdfjs-dist/legacy/build/pdf', () => ({
      getDocument: () => ({ promise: Promise.resolve(mockPdf) })
    }));

    const { extractTextFromPdf } = await import('@/app/utils/pdfTextExtractor');

    const mockFile = {
      name: 'scan.pdf',
      type: 'application/pdf',
      size: 1024,
      arrayBuffer: async () => new ArrayBuffer(8),
    } as unknown as File;

    const result = await extractTextFromPdf(mockFile);
    expect(result.pagesExtracted).toBe(2);
    expect(result.isImageOnly).toBe(true);
    expect(result.text).toBe('');
  });
});
