/**
 * Test utilities and helpers for PDF testing
 */

/**
 * Creates a mock PDF File object for testing
 * @param options Configuration for the mock file
 * @returns A mock File object
 */
export function createMockPDFFile(options: {
  name?: string;
  size?: number;
  lastModified?: number;
  corrupted?: boolean;
  encrypted?: boolean;
} = {}): File {
  const {
    name = 'test.pdf',
    size = 1024 * 100, // 100KB default
    lastModified = Date.now(),
  } = options;

  // Create a simple mock PDF content
  const content = new ArrayBuffer(size);
  const blob = new Blob([content], { type: 'application/pdf' });
  
  const file = new File([blob], name, {
    type: 'application/pdf',
    lastModified,
  });

  // Add size property explicitly for consistency
  Object.defineProperty(file, 'size', {
    value: size,
    writable: false,
  });

  // Add arrayBuffer method for PDF processing
  if (!file.arrayBuffer) {
    Object.defineProperty(file, 'arrayBuffer', {
      value: () => Promise.resolve(content),
      writable: false,
    });
  }

  return file;
}

/**
 * Creates multiple mock PDF files
 * @param count Number of files to create
 * @param namePrefix Prefix for file names
 * @returns Array of mock File objects
 */
export function createMockPDFFiles(count: number, namePrefix = 'test'): File[] {
  return Array.from({ length: count }, (_, i) => 
    createMockPDFFile({ 
      name: `${namePrefix}-${i + 1}.pdf`,
      size: 1024 * (100 + i * 10) // Varying sizes
    })
  );
}

/**
 * Creates a mock DataTransfer object for drag-and-drop testing
 * @param files Files to include in the DataTransfer
 * @returns Mock DataTransfer object
 */
export function createMockDataTransfer(files: File[]): DataTransfer {
  return {
    dropEffect: 'none',
    effectAllowed: 'all',
    files: {
      ...files,
      length: files.length,
      item: (index: number) => files[index] || null,
      [Symbol.iterator]: function* () {
        yield* files;
      },
    } as FileList,
    items: [] as any,
    types: ['Files'],
    clearData: jest.fn(),
    getData: jest.fn(),
    setData: jest.fn(),
    setDragImage: jest.fn(),
  } as unknown as DataTransfer;
}

/**
 * Creates a mock drag event
 * @param type Event type
 * @param files Files to include
 * @returns Mock DragEvent
 */
export function createMockDragEvent(
  type: 'dragstart' | 'dragover' | 'dragleave' | 'drop',
  files: File[] = []
): React.DragEvent<HTMLDivElement> {
  const dataTransfer = createMockDataTransfer(files);
  
  return {
    type,
    dataTransfer,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    bubbles: true,
    cancelable: true,
    currentTarget: document.createElement('div'),
    target: document.createElement('div'),
  } as unknown as React.DragEvent<HTMLDivElement>;
}

/**
 * Waits for a specific amount of time
 * @param ms Milliseconds to wait
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Waits for async updates to complete
 */
export function waitForUpdates(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}
