/**
 * Simplified working test suite for MergeTool component
 * Focuses on tests that work reliably in the Jest environment
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MergeTool from '@/app/components/MergeTool';
import { createMockPDFFile, createMockPDFFiles } from '../utils/testHelpers';
import { resetPDFMocks } from '../utils/pdfMocks';

// Mock pdf-lib
jest.mock('pdf-lib', () => require('../utils/pdfMocks'));

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

// Helper to simulate file upload
const uploadFiles = (fileInput: HTMLInputElement, files: File[]) => {
  Object.defineProperty(fileInput, 'files', {
    value: files,
    writable: false,
    configurable: true,
  });
  fireEvent.change(fileInput);
};

describe('MergeTool - Core Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetPDFMocks();
    (global.URL.createObjectURL as jest.Mock).mockReturnValue('mock-url');
    (global.URL.revokeObjectURL as jest.Mock).mockClear();
    global.plausible = jest.fn();
  });

  describe('Initial Rendering', () => {
    it('renders with correct initial state', () => {
      render(<MergeTool />);
      
      expect(screen.getByRole('heading', { name: 'Merge PDFs' })).toBeInTheDocument();
      expect(screen.getByText(/Drop PDFs here or/i)).toBeInTheDocument();
      expect(screen.getByText(/Maximum 20 files • 50MB per file/i)).toBeInTheDocument();
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      expect(mergeButton).toBeDisabled();
    });

    it('has proper accessibility attributes', () => {
      render(<MergeTool />);
      
      const dropZone = screen.getByRole('button', { name: 'Choose PDFs or drag and drop' });
      expect(dropZone).toHaveAttribute('tabIndex', '0');
      
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('accept', '.pdf');
      expect(fileInput).toHaveAttribute('multiple');
    });

    it('does not show Clear all button initially', () => {
      render(<MergeTool />);
      expect(screen.queryByRole('button', { name: /Clear all/i })).not.toBeInTheDocument();
    });
  });

  describe('File Addition', () => {
    it('adds PDF files successfully', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const files = createMockPDFFiles(2);
      
      uploadFiles(fileInput, files);
      
      await waitFor(() => {
        expect(screen.getByText('test-1.pdf')).toBeInTheDocument();
        expect(screen.getByText('test-2.pdf')).toBeInTheDocument();
      });
    });

    it('shows "files added" message', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(3));
      
      await waitFor(() => {
        expect(screen.getByText('3 files added')).toBeInTheDocument();
      });
    });

    it('enables merge button after adding files', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(1));
      
      await waitFor(() => {
        const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
        expect(mergeButton).not.toBeDisabled();
      });
    });

    it('shows Clear all button after adding files', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(1));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Clear all/i })).toBeInTheDocument();
      });
    });

    it('filters out non-PDF files', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const txtFile = new File(['content'], 'doc.txt', { type: 'text/plain' });
      const pdfFile = createMockPDFFile({ name: 'test.pdf' });
      
      uploadFiles(fileInput, [txtFile, pdfFile]);
      
      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
        expect(screen.queryByText('doc.txt')).not.toBeInTheDocument();
      });
    });

    it('accepts .pdf files regardless of MIME type', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.pdf', { type: 'application/octet-stream' });
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });
    });

    it('tracks file additions in analytics', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(2));
      
      await waitFor(() => {
        expect(global.plausible).toHaveBeenCalledWith('Files Added', { props: { count: 2 } });
      });
    });
  });

  describe('File Size Validation', () => {
    it('rejects files larger than 50MB', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const largeFile = createMockPDFFile({ name: 'huge.pdf', size: 51 * 1024 * 1024 });
      uploadFiles(fileInput, [largeFile]);
      
      await waitFor(() => {
        expect(screen.getByText(/File size limit exceeded.*huge\.pdf/i)).toBeInTheDocument();
      });
    });

    it('accepts files exactly at 50MB', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const exactFile = createMockPDFFile({ name: 'exact.pdf', size: 50 * 1024 * 1024 });
      uploadFiles(fileInput, [exactFile]);
      
      await waitFor(() => {
        expect(screen.getByText('exact.pdf')).toBeInTheDocument();
      });
    });

    it('displays file sizes in MB', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = createMockPDFFile({ size: 5 * 1024 * 1024 });
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText(/5\.\d MB/)).toBeInTheDocument();
      });
    });
  });

  describe('File Count Limits', () => {
    it('enforces 20 file maximum', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const files = createMockPDFFiles(25);
      uploadFiles(fileInput, files);
      
      await waitFor(() => {
        const fileElements = screen.getAllByText(/test-\d+\.pdf/);
        expect(fileElements.length).toBe(20);
      });
    });
  });

  describe('Duplicate Handling', () => {
    it('prevents duplicate files with same name and size', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file1 = createMockPDFFile({ name: 'dup.pdf', size: 1000 });
      uploadFiles(fileInput, [file1]);
      
      await waitFor(() => expect(screen.getAllByText('dup.pdf').length).toBe(1));
      
      const file2 = createMockPDFFile({ name: 'dup.pdf', size: 1000 });
      uploadFiles(fileInput, [file2]);
      
      await waitFor(() => {
        expect(screen.getAllByText('dup.pdf').length).toBe(1);
      });
    });

    it('allows files with same name but different size', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file1 = createMockPDFFile({ name: 'same.pdf', size: 1000 });
      const file2 = createMockPDFFile({ name: 'same.pdf', size: 2000 });
      
      uploadFiles(fileInput, [file1, file2]);
      
      await waitFor(() => {
        expect(screen.getAllByText('same.pdf').length).toBe(2);
      });
    });
  });

  describe('File Management', () => {
    it('removes files when remove button clicked', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(3));
      
      await waitFor(() => expect(screen.getByText('test-2.pdf')).toBeInTheDocument());
      
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[1]);
      
      await waitFor(() => {
        expect(screen.queryByText('test-2.pdf')).not.toBeInTheDocument();
        expect(screen.getByText('test-1.pdf')).toBeInTheDocument();
        expect(screen.getByText('test-3.pdf')).toBeInTheDocument();
      });
    });

    it('clears all files when Clear all clicked', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(3));
      
      await waitFor(() => expect(screen.getByText('test-1.pdf')).toBeInTheDocument());
      
      const clearButton = screen.getByRole('button', { name: /Clear all/i });
      fireEvent.click(clearButton);
      
      await waitFor(() => {
        expect(screen.queryByText('test-1.pdf')).not.toBeInTheDocument();
        expect(screen.queryByText('test-2.pdf')).not.toBeInTheDocument();
        expect(screen.queryByText('test-3.pdf')).not.toBeInTheDocument();
      });
    });

    it('shows drag handles for each file', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(2));
      
      await waitFor(() => {
        const handles = screen.getAllByText('☰');
        expect(handles.length).toBe(2);
      });
    });
  });

  describe('Keyboard Accessibility', () => {
    it('triggers file picker on Enter key', () => {
      render(<MergeTool />);
      const dropZone = screen.getByRole('button', { name: 'Choose PDFs or drag and drop' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const clickSpy = jest.spyOn(fileInput, 'click');
      fireEvent.keyDown(dropZone, { key: 'Enter' });
      
      expect(clickSpy).toHaveBeenCalled();
    });

    it('triggers file picker on Space key', () => {
      render(<MergeTool />);
      const dropZone = screen.getByRole('button', { name: 'Choose PDFs or drag and drop' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const clickSpy = jest.spyOn(fileInput, 'click');
      fireEvent.keyDown(dropZone, { key: ' ' });
      
      expect(clickSpy).toHaveBeenCalled();
    });

    it('does not trigger on other keys', () => {
      render(<MergeTool />);
      const dropZone = screen.getByRole('button', { name: 'Choose PDFs or drag and drop' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const clickSpy = jest.spyOn(fileInput, 'click');
      fireEvent.keyDown(dropZone, { key: 'a' });
      
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('PDF Merge Operation', () => {
    it('merges PDFs successfully', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(2));
      
      await waitFor(() => expect(screen.getByText('test-1.pdf')).toBeInTheDocument());
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      fireEvent.click(mergeButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    it('shows "Merging..." state during operation', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(1));
      await waitFor(() => expect(screen.getByText('test-1.pdf')).toBeInTheDocument());
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      fireEvent.click(mergeButton);
      
      expect(screen.getByText(/Merging PDFs.../i)).toBeInTheDocument();
    });

    it('creates and revokes object URL', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(1));
      await waitFor(() => expect(screen.getByText('test-1.pdf')).toBeInTheDocument());
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      fireEvent.click(mergeButton);
      
      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
      });
    });

    it('tracks merge analytics', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(2));
      await waitFor(() => expect(screen.getByText('test-1.pdf')).toBeInTheDocument());
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      fireEvent.click(mergeButton);
      
      await waitFor(() => {
        expect(global.plausible).toHaveBeenCalledWith('Merge Started', { props: { files: 2 } });
        expect(global.plausible).toHaveBeenCalledWith('Merge Completed', { props: { files: 2, skipped: 0 } });
      });
    });
  });

  describe('Error Handling', () => {
    it('handles corrupted PDF files', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const corrupted = createMockPDFFile({ name: 'bad.pdf', size: 0 }); // Size 0 triggers error in mock
      const good = createMockPDFFile({ name: 'good.pdf' });
      
      uploadFiles(fileInput, [corrupted, good]);
      await waitFor(() => expect(screen.getByText('bad.pdf')).toBeInTheDocument());
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      fireEvent.click(mergeButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Some files were skipped/i)).toBeInTheDocument();
      });
    });

    it('handles encrypted PDF files', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const encrypted = createMockPDFFile({ name: 'enc.pdf', size: 999 }); // Size 999 triggers encrypted error
      
      uploadFiles(fileInput, [encrypted]);
      await waitFor(() => expect(screen.getByText('enc.pdf')).toBeInTheDocument());
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      fireEvent.click(mergeButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Some files were skipped/i)).toBeInTheDocument();
      });
    });
  });

  describe('UI State', () => {
    it('changes drop zone appearance with files', async () => {
      render(<MergeTool />);
      const dropZone = screen.getByRole('button', { name: 'Choose PDFs or drag and drop' });
      
      expect(dropZone).not.toHaveClass('border-gray-400');
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      uploadFiles(fileInput, createMockPDFFiles(1));
      
      await waitFor(() => {
        expect(dropZone).toHaveClass('border-gray-400');
        expect(dropZone).toHaveClass('bg-gray-50');
      });
    });

    it('shows reorder instructions with files', async () => {
      render(<MergeTool />);
      
      expect(screen.queryByText(/Drag files to reorder/i)).not.toBeInTheDocument();
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      uploadFiles(fileInput, createMockPDFFiles(1));
      
      await waitFor(() => {
        expect(screen.getByText(/Drag files to reorder • Click to add more/i)).toBeInTheDocument();
      });
    });
  });

  describe('Success Message', () => {
    it('displays success message after merge', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(1));
      await waitFor(() => expect(screen.getByText('test-1.pdf')).toBeInTheDocument());
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      fireEvent.click(mergeButton);
      
      await waitFor(() => {
        expect(screen.getByText('PDFs merged successfully!')).toBeInTheDocument();
      });
    });

    it('closes success message when close clicked', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(1));
      await waitFor(() => expect(screen.getByText('test-1.pdf')).toBeInTheDocument());
      
      const mergeButton = screen.getByRole('button', { name: /Merge selected PDF files/i });
      fireEvent.click(mergeButton);
      
      await waitFor(() => expect(screen.getByTestId('success-message')).toBeInTheDocument());
      
      const closeButton = screen.getByTestId('close-success');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Analytics', () => {
    it('handles undefined plausible gracefully', async () => {
      delete (global as any).plausible;
      
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Should not throw
      uploadFiles(fileInput, createMockPDFFiles(1));
      
      await waitFor(() => {
        expect(screen.getByText('test-1.pdf')).toBeInTheDocument();
      });
    });

    it('handles tracking errors gracefully', async () => {
      global.plausible = jest.fn(() => { throw new Error('Tracking error'); });
      
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Should not break UI
      uploadFiles(fileInput, createMockPDFFiles(1));
      
      await waitFor(() => {
        expect(screen.getByText('test-1.pdf')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty file list', () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      fireEvent.change(fileInput);
      
      // Should not crash
      expect(screen.getByText(/Drop PDFs here or/i)).toBeInTheDocument();
    });

    it('handles very long filenames', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const longName = 'a'.repeat(200) + '.pdf';
      const file = createMockPDFFile({ name: longName });
      
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText(longName)).toBeInTheDocument();
      });
    });

    it('handles special characters in filenames', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const specialName = 'test (copy) [1] #2 @file.pdf';
      const file = createMockPDFFile({ name: specialName });
      
      uploadFiles(fileInput, [file]);
      
      await waitFor(() => {
        expect(screen.getByText(specialName)).toBeInTheDocument();
      });
    });

    it('handles 1 byte files', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      const tinyFile = createMockPDFFile({ name: 'tiny.pdf', size: 1 });
      uploadFiles(fileInput, [tinyFile]);
      
      await waitFor(() => {
        expect(screen.getByText('tiny.pdf')).toBeInTheDocument();
      });
    });

    it('prevents event propagation on remove button', async () => {
      render(<MergeTool />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      uploadFiles(fileInput, createMockPDFFiles(1));
      await waitFor(() => expect(screen.getByText('test-1.pdf')).toBeInTheDocument());
      
      const clickSpy = jest.spyOn(fileInput, 'click');
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);
      
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });
});
