/**
 * Test suite for ImageConverterTool component
 * Validates image format conversion functionality, UI interactions, quality settings, and error handling
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageConverterTool from '@/app/components/ImageConverterTool';
import type { ConversionResult } from '@/app/utils/imageConverterUtils';

// Mock imageConverterUtils module
const mockConvertImage = jest.fn();
const mockDownloadBlob = jest.fn();

jest.mock('@/app/utils/imageConverterUtils', () => ({
  ...jest.requireActual('@/app/utils/imageConverterUtils'),
  convertImage: (...args: any[]) => mockConvertImage(...args),
  downloadBlob: (...args: any[]) => mockDownloadBlob(...args),
}));

// Mock SuccessMessage
jest.mock('@/app/components/SuccessMessage', () => {
  return function MockSuccessMessage({ message, onClose }: any) {
    return (
      <div data-testid="success-message">
        {message}
        <button onClick={onClose} data-testid="close-success">Close</button>
      </div>
    );
  };
});

// Helper to create mock image files
function createMockImageFile(options: {
  name?: string;
  type?: string;
  size?: number;
} = {}): File {
  const {
    name = 'test.jpg',
    type = 'image/jpeg',
    size = 1024 * 500, // 500KB default
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

function createMockImageFiles(count: number, type = 'image/jpeg'): File[] {
  return Array.from({ length: count }, (_, i) => 
    createMockImageFile({ 
      name: `test-${i + 1}.jpg`,
      type,
      size: 1024 * (500 + i * 100)
    })
  );
}

// Helper to simulate file upload
const uploadFiles = (fileInput: HTMLInputElement, files: File[]) => {
  Object.defineProperty(fileInput, 'files', {
    value: files,
    writable: false,
    configurable: true,
  });
  fireEvent.change(fileInput);
};

// Mock conversion result
const createMockConversionResult = (
  file: File, 
  format: 'jpeg' | 'png' | 'webp'
): ConversionResult => ({
  blob: new Blob(['converted content'], { type: `image/${format}` }),
  originalSize: file.size,
  newSize: format === 'png' ? file.size + 1024 : file.size - 1024,
  originalFormat: 'JPEG',
  newFormat: format,
  width: 1920,
  height: 1080,
});

describe('ImageConverterTool - Core Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders with initial state', () => {
    render(<ImageConverterTool />);
    
    expect(screen.getByText(/Click to select images/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /PNG/ })).toBeInTheDocument(); // Default format button
    expect(screen.getByText(/100% Private/i)).toBeInTheDocument();
  });

  test('displays step indicators', () => {
    render(<ImageConverterTool />);
    
    expect(screen.getByText(/Add Images/i)).toBeInTheDocument();
    expect(screen.getByText(/Convert/i)).toBeInTheDocument();
    expect(screen.getByText(/Download/i)).toBeInTheDocument();
  });

  test('allows file upload via input', () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(2);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    expect(screen.getByText(/2 images ready/i)).toBeInTheDocument();
    expect(screen.getByText(/test-1.jpg/i)).toBeInTheDocument();
    expect(screen.getByText(/test-2.jpg/i)).toBeInTheDocument();
  });

  test('handles drag and drop', () => {
    render(<ImageConverterTool />);
    
    const dropZone = screen.getByText(/Click to select images/i).closest('div');
    const files = createMockImageFiles(1);
    
    const dragEvent = new Event('dragover', { bubbles: true });
    Object.assign(dragEvent, {
      dataTransfer: {
        files,
        dropEffect: null,
      },
      preventDefault: jest.fn(),
    });
    
    fireEvent(dropZone!, dragEvent);
    
    const dropEvent = new Event('drop', { bubbles: true });
    Object.assign(dropEvent, {
      dataTransfer: { files },
      preventDefault: jest.fn(),
    });
    
    fireEvent(dropZone!, dropEvent);
    
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument();
  });
});

describe('ImageConverterTool - Format Selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('switches between JPEG, PNG, and WebP formats', () => {
    render(<ImageConverterTool />);
    
    const jpegButton = screen.getByRole('button', { name: /JPEG/i });
    const pngButton = screen.getByRole('button', { name: /PNG/i });
    const webpButton = screen.getByRole('button', { name: /WEBP/i });
    
    // PNG is default
    expect(pngButton).toHaveClass('bg-black');
    
    // Switch to JPEG
    fireEvent.click(jpegButton);
    expect(jpegButton).toHaveClass('bg-black');
    expect(screen.getByText(/Quality:/i)).toBeInTheDocument();
    
    // Switch to WebP
    fireEvent.click(webpButton);
    expect(webpButton).toHaveClass('bg-black');
    expect(screen.getByText(/Quality:/i)).toBeInTheDocument();
    
    // Switch back to PNG
    fireEvent.click(pngButton);
    expect(pngButton).toHaveClass('bg-black');
    expect(screen.getByText(/PNG is a lossless format/i)).toBeInTheDocument();
  });

  test('shows quality slider for JPEG and WebP', () => {
    render(<ImageConverterTool />);
    
    const jpegButton = screen.getByRole('button', { name: /JPEG/i });
    fireEvent.click(jpegButton);
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue('92'); // Default quality
    
    fireEvent.change(slider, { target: { value: '75' } });
    expect(screen.getByText(/Quality: 75%/i)).toBeInTheDocument();
  });

  test('hides quality slider for PNG', () => {
    render(<ImageConverterTool />);
    
    // PNG is default
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(screen.getByText(/PNG is a lossless format/i)).toBeInTheDocument();
  });
});

describe('ImageConverterTool - File Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('removes individual files', () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(3);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    expect(screen.getByText(/3 images ready/i)).toBeInTheDocument();
    
    const removeButtons = screen.getAllByLabelText(/Remove/i);
    fireEvent.click(removeButtons[1]); // Remove second file
    
    expect(screen.getByText(/2 images ready/i)).toBeInTheDocument();
    expect(screen.queryByText(/test-2.jpg/i)).not.toBeInTheDocument();
  });

  test('clears all files', () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(5);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    expect(screen.getByText(/5 images ready/i)).toBeInTheDocument();
    
    const clearButton = screen.getByText(/Clear All/i);
    fireEvent.click(clearButton);
    
    expect(screen.queryByText(/images ready/i)).not.toBeInTheDocument();
  });

  test('prevents duplicate files', () => {
    render(<ImageConverterTool />);
    
    const file = createMockImageFile({ name: 'duplicate.jpg' });
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, [file]);
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument();
    
    // Try to upload same file again
    uploadFiles(fileInput, [file]);
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument(); // Still only 1
  });

  test('enforces maximum file limit (20 files)', () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(25); // More than max
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    expect(screen.getByText(/20 images ready/i)).toBeInTheDocument(); // Only 20 added
  });
});

describe('ImageConverterTool - Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rejects files that are too large', () => {
    render(<ImageConverterTool />);
    
    const largeFile = createMockImageFile({
      name: 'huge.jpg',
      size: 51 * 1024 * 1024, // 51MB, over limit
    });
    
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    uploadFiles(fileInput, [largeFile]);
    
    expect(screen.getByText(/File size limit exceeded/i)).toBeInTheDocument();
  });

  test('rejects non-image files', () => {
    render(<ImageConverterTool />);
    
    const nonImage = createMockImageFile({
      name: 'document.pdf',
      type: 'application/pdf',
    });
    
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    uploadFiles(fileInput, [nonImage]);
    
    expect(screen.getByText(/No valid image files detected/i)).toBeInTheDocument();
  });

  test('shows error when converting without files', () => {
    render(<ImageConverterTool />);
    
    // No files added
    const convertButton = screen.queryByRole('button', { name: /Convert to/i });
    expect(convertButton).not.toBeInTheDocument(); // Button only shows when files added
  });
});

describe('ImageConverterTool - Conversion Process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockConvertImage.mockImplementation((file) => 
      Promise.resolve(createMockConversionResult(file, 'png'))
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('converts single file successfully', async () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(1);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    const convertButton = screen.getByRole('button', { name: /Convert to PNG/i });
    fireEvent.click(convertButton);
    
    expect(screen.getByText(/Converting 1 of 1/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockConvertImage).toHaveBeenCalledWith(files[0], expect.objectContaining({
        format: 'png',
      }));
      expect(mockDownloadBlob).toHaveBeenCalled();
    });
    
    expect(screen.getByText(/Successfully converted 1 image/i)).toBeInTheDocument();
  });

  test('converts multiple files with progress', async () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(3);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    const convertButton = screen.getByRole('button', { name: /Convert to PNG/i });
    fireEvent.click(convertButton);
    
    await waitFor(() => {
      expect(mockConvertImage).toHaveBeenCalledTimes(3);
      expect(mockDownloadBlob).toHaveBeenCalledTimes(3);
    });
    
    expect(screen.getByText(/Successfully converted 3 images/i)).toBeInTheDocument();
  });

  test('applies quality setting for JPEG', async () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(1);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    // Switch to JPEG
    const jpegButton = screen.getByRole('button', { name: /JPEG/i });
    fireEvent.click(jpegButton);
    
    // Set quality to 80%
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '80' } });
    
    const convertButton = screen.getByRole('button', { name: /Convert to JPEG/i });
    fireEvent.click(convertButton);
    
    await waitFor(() => {
      expect(mockConvertImage).toHaveBeenCalledWith(files[0], expect.objectContaining({
        format: 'jpeg',
        quality: 0.80,
      }));
    });
  });

  test('handles conversion errors gracefully', async () => {
    mockConvertImage.mockRejectedValue(new Error('Conversion failed'));
    
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(1);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    const convertButton = screen.getByRole('button', { name: /Convert to PNG/i });
    fireEvent.click(convertButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Some files failed to convert/i)).toBeInTheDocument();
    });
  });

  test('delays between multiple downloads', async () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(2);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    const convertButton = screen.getByRole('button', { name: /Convert to PNG/i });
    fireEvent.click(convertButton);
    
    await waitFor(() => {
      expect(mockConvertImage).toHaveBeenCalledTimes(2);
    });
    
    // Advance timers to trigger delays
    jest.runAllTimers();
    
    expect(mockDownloadBlob).toHaveBeenCalledTimes(2);
  });
});

describe('ImageConverterTool - Results Display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockConvertImage.mockImplementation((file, options) => 
      Promise.resolve(createMockConversionResult(file, options.format))
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('shows size reduction for JPEG conversion', async () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(1);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    // Switch to JPEG
    const jpegButton = screen.getByRole('button', { name: /JPEG/i });
    fireEvent.click(jpegButton);
    
    const convertButton = screen.getByRole('button', { name: /Convert to JPEG/i });
    fireEvent.click(convertButton);
    
    await waitFor(() => {
  expect(screen.getByText(/Successfully converted 1 image to JPEG!/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Smaller/i).length).toBeGreaterThan(0);
    });
  });

  test('shows size increase for PNG conversion', async () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(1);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    const convertButton = screen.getByRole('button', { name: /Convert to PNG/i });
    fireEvent.click(convertButton);
    
    await waitFor(() => {
  expect(screen.getByText(/Successfully converted 1 image to PNG!/i)).toBeInTheDocument();
  expect(screen.getByText(/larger/i)).toBeInTheDocument();
    });
  });
});

describe('ImageConverterTool - Supported Formats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('accepts JPEG files', () => {
    render(<ImageConverterTool />);
    
    const file = createMockImageFile({ name: 'photo.jpg', type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, [file]);
    
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument();
    expect(screen.getByText(/photo.jpg/i)).toBeInTheDocument();
  });

  test('accepts PNG files', () => {
    render(<ImageConverterTool />);
    
    const file = createMockImageFile({ name: 'logo.png', type: 'image/png' });
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, [file]);
    
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument();
    expect(screen.getByText(/logo.png/i)).toBeInTheDocument();
  });

  test('accepts WebP files', () => {
    render(<ImageConverterTool />);
    
    const file = createMockImageFile({ name: 'modern.webp', type: 'image/webp' });
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, [file]);
    
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument();
  });

  test('accepts BMP files', () => {
    render(<ImageConverterTool />);
    
    const file = createMockImageFile({ name: 'bitmap.bmp', type: 'image/bmp' });
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, [file]);
    
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument();
  });

  test('accepts GIF files', () => {
    render(<ImageConverterTool />);
    
    const file = createMockImageFile({ name: 'animation.gif', type: 'image/gif' });
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, [file]);
    
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument();
  });
});

describe('ImageConverterTool - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('handles zero-byte files', () => {
    render(<ImageConverterTool />);
    
    const emptyFile = createMockImageFile({ name: 'empty.jpg', size: 0 });
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, [emptyFile]);
    
    // Should be rejected (size validation)
    expect(screen.queryByText(/1 image ready/i)).not.toBeInTheDocument();
  });

  test('handles files with special characters in name', () => {
    render(<ImageConverterTool />);
    
    const file = createMockImageFile({ name: 'test-file (1) [copy].jpg' });
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, [file]);
    
    expect(screen.getByText(/1 image ready/i)).toBeInTheDocument();
    expect(screen.getByText(/test-file \(1\) \[copy\].jpg/i)).toBeInTheDocument();
  });

  test('disables controls during conversion', async () => {
    mockConvertImage.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(createMockConversionResult(createMockImageFile(), 'png')), 1000))
    );
    
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(1);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    const convertButton = screen.getByRole('button', { name: /Convert to PNG/i });
    fireEvent.click(convertButton);
    
    // Check that controls are disabled
    const formatButtons = screen.getAllByRole('button').filter(btn => 
      ['JPEG', 'PNG', 'WEBP'].includes(btn.textContent || '')
    );
    formatButtons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
    
    await waitFor(() => {
      expect(mockConvertImage).toHaveBeenCalled();
    });
  });
});

describe('ImageConverterTool - Accessibility', () => {
  test('has proper ARIA labels', () => {
    render(<ImageConverterTool />);
    
    expect(screen.getByLabelText(/Select images to convert/i)).toBeInTheDocument();
  });

  test('has proper button labels for file removal', () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(2);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    expect(screen.getByLabelText(/Remove test-1.jpg/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Remove test-2.jpg/i)).toBeInTheDocument();
  });

  test('step indicators update correctly', () => {
    render(<ImageConverterTool />);
    
    const files = createMockImageFiles(1);
    const fileInput = screen.getByLabelText(/Select images to convert/i) as HTMLInputElement;
    
    uploadFiles(fileInput, files);
    
    // Verify step indicator text is present
    expect(screen.getByText('Add Images')).toBeInTheDocument();
    expect(screen.getByText('Convert')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });
});
