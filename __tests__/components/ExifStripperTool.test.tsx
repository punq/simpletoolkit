/**
 * Test suite for ExifStripperTool component
 * Validates EXIF/metadata stripping functionality, UI interactions, and error handling
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExifStripperTool from '@/app/components/ExifStripperTool';
import type { StripResult } from '@/app/utils/imageUtils';

// Mock imageUtils module
const mockStripImageMetadata = jest.fn();
const mockDownloadImage = jest.fn();

jest.mock('@/app/utils/imageUtils', () => ({
  ...jest.requireActual('@/app/utils/imageUtils'),
  stripImageMetadata: (...args: any[]) => mockStripImageMetadata(...args),
  downloadImage: (...args: any[]) => mockDownloadImage(...args),
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

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

  Object.defineProperty(file, 'arrayBuffer', {
    value: () => Promise.resolve(content),
    writable: false,
  });

  return file;
}

function createMockImageFiles(count: number): File[] {
  return Array.from({ length: count }, (_, i) => 
    createMockImageFile({ 
      name: `test-${i + 1}.jpg`,
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

// Mock strip result
const createMockStripResult = (file: File, hadExif = true): StripResult => ({
  blob: new Blob(['stripped content'], { type: file.type }),
  originalSize: file.size,
  newSize: file.size - 1024,
  hadExif,
  segmentsRemoved: hadExif ? 2 : 0,
});

describe('ExifStripperTool - Core Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStripImageMetadata.mockClear();
    mockDownloadImage.mockClear();
    (global.URL.createObjectURL as jest.Mock) = jest.fn(() => 'mock-url');
    (global.URL.revokeObjectURL as jest.Mock) = jest.fn();
    global.plausible = jest.fn();
  });

  describe('Initial Rendering', () => {
    it('renders with correct initial state', () => {
      render(<ExifStripperTool />);
      
      expect(screen.getByText(/100% Private/i)).toBeInTheDocument();
      expect(screen.getByText(/Click or drag images here/i)).toBeInTheDocument();
      expect(screen.getByText(/Supports JPEG and PNG/i)).toBeInTheDocument();
      
      const stripButton = screen.queryByRole('button', { name: /Strip Metadata/i });
      expect(stripButton).not.toBeInTheDocument(); // Hidden until files added
    });

    it('has proper accessibility attributes', () => {
      render(<ExifStripperTool />);
      
      const dropZone = screen.getByRole('button', { name: 'Click or drag images to upload' });
      expect(dropZone).toHaveAttribute('tabIndex', '0');
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toHaveAttribute('accept', 'image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png');
      expect(fileInput).toHaveAttribute('multiple');
    });

    it('displays privacy badge', () => {
      render(<ExifStripperTool />);
      expect(screen.getByText(/100% Private:/)).toBeInTheDocument();
      expect(screen.getByText(/Your images never leave your device/i)).toBeInTheDocument();
    });

    it('displays information section', () => {
      render(<ExifStripperTool />);
      expect(screen.getByText(/What Metadata is Removed\?/i)).toBeInTheDocument();
      expect(screen.getByText(/JPEG Images:/i)).toBeInTheDocument();
      expect(screen.getByText(/PNG Images:/i)).toBeInTheDocument();
    });
  });

  describe('File Addition', () => {
    it('adds image files successfully', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const files = createMockImageFiles(2);
      
      uploadFiles(fileInput, files);
      
      await waitFor(() => {
        expect(screen.getByText('test-1.jpg')).toBeInTheDocument();
        expect(screen.getByText('test-2.jpg')).toBeInTheDocument();
      });
    });

    it('shows "files added" message', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockImageFiles(3));
      
      await waitFor(() => {
        expect(screen.getByText('3 files added')).toBeInTheDocument();
      });
    });

    it('shows strip button after adding files', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockImageFiles(1));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Strip Metadata.*Image/i })).toBeInTheDocument();
      });
    });

    it('shows Clear all button after adding files', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockImageFiles(1));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Clear All/i })).toBeInTheDocument();
      });
    });

    it('accepts PNG files', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const pngFile = createMockImageFile({ name: 'test.png', type: 'image/png' });
      uploadFiles(fileInput, [pngFile]);
      
      await waitFor(() => {
        expect(screen.getByText('test.png')).toBeInTheDocument();
      });
    });

    it('filters out non-image files and shows warning', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const txtFile = new File(['content'], 'doc.txt', { type: 'text/plain' });
      const jpgFile = createMockImageFile({ name: 'test.jpg' });
      
      uploadFiles(fileInput, [txtFile, jpgFile]);
      
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument();
        // Rejected files are shown in the warning message
        expect(screen.getByText(/doc\.txt/)).toBeInTheDocument();
        expect(screen.getByText(/Skipped non-image files:/i)).toBeInTheDocument();
      });
    });

    it('prevents duplicate files', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = createMockImageFile({ name: 'test.jpg', size: 1024 * 500 });
      
      uploadFiles(fileInput, [file]);
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument();
      });
      
      // Try to add the same file again
      uploadFiles(fileInput, [file]);
      
      // Should still only show one instance
      const fileElements = screen.getAllByText('test.jpg');
      expect(fileElements).toHaveLength(1);
    });

    it('shows error for oversized files', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const largeFile = createMockImageFile({ 
        name: 'large.jpg', 
        size: 51 * 1024 * 1024 // 51MB
      });
      
      uploadFiles(fileInput, [largeFile]);
      
      await waitFor(() => {
        expect(screen.getByText(/File size limit exceeded/i)).toBeInTheDocument();
      });
    });

    it('limits to 50 files maximum', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const files = createMockImageFiles(55); // Try to add 55 files
      
      uploadFiles(fileInput, files);
      
      await waitFor(() => {
        const selectedText = screen.getByText(/Selected Images \((\d+)\)/);
        expect(selectedText.textContent).toContain('50'); // Should cap at 50
      });
    });
  });

  describe('File Removal', () => {
    it('removes individual files', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockImageFiles(2));
      
      await waitFor(() => {
        expect(screen.getByText('test-1.jpg')).toBeInTheDocument();
      });
      
      const removeButtons = screen.getAllByLabelText(/Remove test-/);
      fireEvent.click(removeButtons[0]);
      
      await waitFor(() => {
        expect(screen.queryByText('test-1.jpg')).not.toBeInTheDocument();
        expect(screen.getByText('test-2.jpg')).toBeInTheDocument();
      });
    });

    it('clears all files', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockImageFiles(3));
      
      await waitFor(() => {
        expect(screen.getByText(/Selected Images \(3\)/)).toBeInTheDocument();
      });
      
      const clearButton = screen.getByRole('button', { name: /Clear All/i });
      fireEvent.click(clearButton);
      
      await waitFor(() => {
        expect(screen.queryByText('test-1.jpg')).not.toBeInTheDocument();
        expect(screen.queryByText(/Selected Images/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Metadata Stripping', () => {
    it('strips metadata successfully', async () => {
      const file = createMockImageFile({ name: 'photo.jpg' });
      mockStripImageMetadata.mockResolvedValue(createMockStripResult(file));
      mockDownloadImage.mockImplementation(() => {});
      
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText('photo.jpg')).toBeInTheDocument();
      });
      
      const stripButton = screen.getByRole('button', { name: /Strip metadata from selected images/i });
      fireEvent.click(stripButton);
      
      await waitFor(() => {
        expect(mockStripImageMetadata).toHaveBeenCalledWith(file);
        expect(mockDownloadImage).toHaveBeenCalled();
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    it('processes multiple files', async () => {
      const files = createMockImageFiles(3);
      mockStripImageMetadata.mockImplementation((file: File) => 
        Promise.resolve(createMockStripResult(file))
      );
      mockDownloadImage.mockImplementation(() => {});
      
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, files);
      
      await waitFor(() => {
        expect(screen.getByText(/Selected Images \(3\)/)).toBeInTheDocument();
      });
      
      const stripButton = screen.getByRole('button', { name: /Strip metadata from selected images/i });
      fireEvent.click(stripButton);
      
      await waitFor(() => {
        expect(mockStripImageMetadata).toHaveBeenCalledTimes(3);
        expect(mockDownloadImage).toHaveBeenCalledTimes(3);
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    it('shows processing state during stripping', async () => {
      const file = createMockImageFile({ name: 'photo.jpg' });
      
      // Make it resolve slowly
      mockStripImageMetadata.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(createMockStripResult(file)), 100))
      );
      mockDownloadImage.mockImplementation(() => {});
      
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText('photo.jpg')).toBeInTheDocument();
      });
      
      const stripButton = screen.getByRole('button', { name: /Strip metadata from selected images/i });
      fireEvent.click(stripButton);
      
      // Should show processing state - text is split across elements
      expect(screen.getByText(/Stripping Metadata/i)).toBeInTheDocument();
      expect(stripButton).toBeDisabled();
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('displays results summary', async () => {
      const files = createMockImageFiles(2);
      mockStripImageMetadata.mockImplementation((file: File) => 
        Promise.resolve(createMockStripResult(file, true))
      );
      mockDownloadImage.mockImplementation(() => {});
      
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, files);
      
      await waitFor(() => {
        expect(screen.getByText(/Selected Images \(2\)/)).toBeInTheDocument();
      });
      
      const stripButton = screen.getByRole('button', { name: /Strip metadata from selected images/i });
      fireEvent.click(stripButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Processing Results/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Files:/i)).toBeInTheDocument();
        expect(screen.getByText(/Files with EXIF:/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Size Reduction:/i)).toBeInTheDocument();
      });
    });

    it('shows EXIF status badges in results', async () => {
      const file1 = createMockImageFile({ name: 'with-exif.jpg' });
      const file2 = createMockImageFile({ name: 'no-exif.jpg' });
      
      mockStripImageMetadata
        .mockResolvedValueOnce(createMockStripResult(file1, true))
        .mockResolvedValueOnce(createMockStripResult(file2, false));
      mockDownloadImage.mockImplementation(() => {});
      
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, [file1, file2]);
      
      await waitFor(() => {
        expect(screen.getByText('with-exif.jpg')).toBeInTheDocument();
      });
      
      const stripButton = screen.getByRole('button', { name: /Strip metadata from selected images/i });
      fireEvent.click(stripButton);
      
      await waitFor(() => {
        expect(screen.getByText('EXIF Removed')).toBeInTheDocument();
        expect(screen.getByText('No EXIF')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error when stripping fails', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = createMockImageFile({ name: 'corrupt.jpg' });
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText('corrupt.jpg')).toBeInTheDocument();
      });
      
      // Set mock to reject AFTER file is added but BEFORE stripping
      mockStripImageMetadata.mockRejectedValueOnce(new Error('Invalid JPEG format'));
      
      const stripButton = screen.getByRole('button', { name: /Strip metadata from selected images/i });
      fireEvent.click(stripButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to process corrupt\.jpg: Invalid JPEG format/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('allows dismissing error message', async () => {
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockImageFiles(1));
      
      await waitFor(() => {
        expect(screen.getByText('test-1.jpg')).toBeInTheDocument();
      });
      
      // Set mock to reject BEFORE clicking
      mockStripImageMetadata.mockRejectedValueOnce(new Error('Test error'));
      
      const stripButton = screen.getByRole('button', { name: /Strip metadata from selected images/i });
      fireEvent.click(stripButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Test error/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const dismissButton = screen.getByLabelText(/Dismiss error/i);
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/Test error/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Success Message', () => {
    it('shows success message after stripping', async () => {
      const file = createMockImageFile();
      mockStripImageMetadata.mockResolvedValue(createMockStripResult(file));
      mockDownloadImage.mockImplementation(() => {});
      
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText(file.name)).toBeInTheDocument();
      });
      
      const stripButton = screen.getByRole('button', { name: /Strip metadata from selected images/i });
      fireEvent.click(stripButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    it('allows dismissing success message', async () => {
      const file = createMockImageFile();
      mockStripImageMetadata.mockResolvedValue(createMockStripResult(file));
      mockDownloadImage.mockImplementation(() => {});
      
      render(<ExifStripperTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument();
      });
      
      const stripButton = screen.getByRole('button', { name: /Strip Metadata.*Image/i });
      fireEvent.click(stripButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
      
      const closeButton = screen.getByTestId('close-success');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('handles drag over event', () => {
      render(<ExifStripperTool />);
      const dropZone = screen.getByRole('button', { name: 'Click or drag images to upload' });
      
      const dragEvent = new Event('dragover', { bubbles: true }) as any;
      dragEvent.dataTransfer = { dropEffect: '', files: [] };
      dragEvent.preventDefault = jest.fn();
      fireEvent(dropZone, dragEvent);
      
      // Component is rendering, drag state handled
      expect(dropZone).toBeInTheDocument();
    });

    it('handles drag leave event', () => {
      render(<ExifStripperTool />);
      const dropZone = screen.getByRole('button', { name: 'Click or drag images to upload' });
      
      const dragOverEvent = new Event('dragover', { bubbles: true }) as any;
      dragOverEvent.dataTransfer = { dropEffect: '', files: [] };
      dragOverEvent.preventDefault = jest.fn();
      fireEvent(dropZone, dragOverEvent);
      
      const dragLeaveEvent = new Event('dragleave', { bubbles: true }) as any;
      fireEvent(dropZone, dragLeaveEvent);
      
      expect(screen.getByText('Click or drag images here')).toBeInTheDocument();
    });

    it('handles file drop', async () => {
      render(<ExifStripperTool />);
      const dropZone = screen.getByRole('button', { name: 'Click or drag images to upload' });
      
      const files = createMockImageFiles(2);
      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = { files };
      dropEvent.preventDefault = jest.fn();
      fireEvent(dropZone, dropEvent);
      
      await waitFor(() => {
        expect(screen.getByText('test-1.jpg')).toBeInTheDocument();
        expect(screen.getByText('test-2.jpg')).toBeInTheDocument();
      });
    });
  });
});
