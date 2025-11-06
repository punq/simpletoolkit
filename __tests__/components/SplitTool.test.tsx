/**
 * Simplified, reliable test suite for SplitTool
 * Covers file selection, modes, validations, splitting, downloads, analytics, and accessibility
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SplitTool from '@/app/components/SplitTool';
import { createMockPDFFile } from '../utils/testHelpers';
import { resetPDFMocks, setMockPageCount } from '../utils/pdfMocks';

// Mock pdf-lib
jest.mock('pdf-lib', () => require('../utils/pdfMocks'));

// Mock Next.js Link
jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);

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

const getFileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement;

const uploadFile = (file: File) => {
  const input = getFileInput();
  Object.defineProperty(input, 'files', {
    value: [file],
    writable: false,
    configurable: true,
  });
  fireEvent.change(input);
};

describe('SplitTool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetPDFMocks();
    (global.URL.createObjectURL as jest.Mock).mockReturnValue('mock-url');
    (global.URL.revokeObjectURL as jest.Mock).mockClear();
    global.plausible = jest.fn();
    (global.confirm as jest.Mock).mockReturnValue(true);
    setMockPageCount(3);
  });

  describe('Initial UI', () => {
    it('renders initial state and disables Split button', () => {
      render(<SplitTool />);
      expect(screen.getByRole('heading', { name: 'Split PDF' })).toBeInTheDocument();
      expect(screen.getByText(/Drop a PDF here or/i)).toBeInTheDocument();
      expect(screen.getByText(/Maximum file size: 50MB/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Split PDF/i })).toBeDisabled();
      const dropZone = screen.getByRole('button', { name: 'Choose PDF file or drag and drop' });
      expect(dropZone).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('File Selection', () => {
    it('accepts a valid PDF and shows page count', async () => {
      render(<SplitTool />);
      const file = createMockPDFFile({ name: 'sample.pdf', size: 1024 * 100 });
      setMockPageCount(5);
      uploadFile(file);

      await waitFor(() => {
        expect(screen.getByText('sample.pdf')).toBeInTheDocument();
        expect(screen.getByText(/0\.1 MB/i)).toBeInTheDocument();
        expect(screen.getByText(/5 pages/i)).toBeInTheDocument();
      });

      // Analytics on load
      await waitFor(() => {
        expect(global.plausible).toHaveBeenCalledWith('File Loaded', { props: { pages: 5 } });
      });
    });

    it('rejects non-PDF file', async () => {
      render(<SplitTool />);
      const bad = new File(['x'], 'bad.txt', { type: 'text/plain' });
      const input = getFileInput();
      Object.defineProperty(input, 'files', { value: [bad], configurable: true });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText(/Please select a PDF file/i)).toBeInTheDocument();
      });
    });

    it('rejects file larger than 50MB', async () => {
      render(<SplitTool />);
      const big = createMockPDFFile({ name: 'big.pdf', size: 51 * 1024 * 1024 });
      uploadFile(big);
      await waitFor(() => {
        expect(screen.getByText(/File is too large/i)).toBeInTheDocument();
      });
    });

    it('handles PDF load failure gracefully', async () => {
      render(<SplitTool />);
      // size 0 triggers load failure in mock
      const corrupted = createMockPDFFile({ name: 'bad.pdf', size: 0 });
      uploadFile(corrupted);

      await waitFor(() => {
        expect(screen.getByText(/Could not load PDF/i)).toBeInTheDocument();
      });
    });

    it('clears file and resets state', async () => {
      render(<SplitTool />);
      const file = createMockPDFFile({ name: 'a.pdf' });
      uploadFile(file);

      await waitFor(() => expect(screen.getByText('a.pdf')).toBeInTheDocument());

      const clearBtn = screen.getByRole('button', { name: /Clear selected file/i });
      fireEvent.click(clearBtn);

      await waitFor(() => {
        expect(screen.queryByText('a.pdf')).not.toBeInTheDocument();
        expect(screen.getByText(/Drop a PDF here or/i)).toBeInTheDocument();
      });
    });
  });

  describe('Modes and Validation', () => {
    it('default is pages mode with input', async () => {
      render(<SplitTool />);
      uploadFile(createMockPDFFile({ name: 'p.pdf' }));
      await waitFor(() => expect(screen.getByText('p.pdf')).toBeInTheDocument());
      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());
      // Using getAllByText due to label + helper paragraph both containing the phrase
      expect(screen.getAllByText(/Page numbers/i).length).toBeGreaterThan(0);
    });

    it('validates pages mode input', async () => {
      render(<SplitTool />);
      uploadFile(createMockPDFFile({ name: 'p.pdf' }));
      await waitFor(() => expect(screen.getByText(/3 pages/)).toBeInTheDocument());
      const splitBtn = screen.getByRole('button', { name: /Split PDF/i });

      fireEvent.click(splitBtn);
      await waitFor(() => {
        expect(screen.getByText(/Please enter page numbers/i)).toBeInTheDocument();
      });
    });

    it('range mode shows inputs and validates bad range', async () => {
      render(<SplitTool />);
      uploadFile(createMockPDFFile({ name: 'r.pdf' }));
      await waitFor(() => expect(screen.getByText(/3 pages/)).toBeInTheDocument());

      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());
      const rangeRadio = screen.getByLabelText(/Extract page range/i);
      fireEvent.click(rangeRadio);

      const [start, end] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
      fireEvent.change(start, { target: { value: '0' } });
      fireEvent.change(end, { target: { value: '100' } });

      const splitBtn = screen.getByRole('button', { name: /Split PDF/i });
      fireEvent.click(splitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid range/i)).toBeInTheDocument();
      });
    });

    it('every-n mode validates invalid n', async () => {
      render(<SplitTool />);
      uploadFile(createMockPDFFile({ name: 'n.pdf' }));
      await waitFor(() => expect(screen.getByText('n.pdf')).toBeInTheDocument());
      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());
      fireEvent.click(screen.getByLabelText(/Split every N pages/i));

      // Label not associated via htmlFor; fallback to placeholder or role
      const nInput = screen.getByPlaceholderText('1') as HTMLInputElement;
      fireEvent.change(nInput, { target: { value: '0' } });

      const splitBtn = screen.getByRole('button', { name: /Split PDF/i });
      fireEvent.click(splitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid number of pages per split/i)).toBeInTheDocument();
      });
    });
  });

  describe('Splitting Operations', () => {
    it('splits specific pages and downloads one file', async () => {
      render(<SplitTool />);
      uploadFile(createMockPDFFile({ name: 'doc.pdf' }));
      await waitFor(() => expect(screen.getByText(/3 pages/)).toBeInTheDocument());

      const pagesInput = screen.getByPlaceholderText('1,3,5-7') as HTMLInputElement;
      fireEvent.change(pagesInput, { target: { value: '1,3' } });

      const splitBtn = screen.getByRole('button', { name: /Split PDF/i });
      fireEvent.click(splitBtn);

      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });

      // Analytics
      expect(global.plausible).toHaveBeenCalledWith('Split Completed', { props: { mode: 'pages', pages: 2 } });
    });

    it('splits a valid range', async () => {
      render(<SplitTool />);
      setMockPageCount(6);
      uploadFile(createMockPDFFile({ name: 'r.pdf' }));
      await waitFor(() => expect(screen.getByText('r.pdf')).toBeInTheDocument());
      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());

      fireEvent.click(screen.getByLabelText(/Extract page range/i));
      const [start, end] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
      fireEvent.change(start, { target: { value: '2' } });
      fireEvent.change(end, { target: { value: '4' } });

      fireEvent.click(screen.getByRole('button', { name: /Split PDF/i }));

      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });

      expect(global.plausible).toHaveBeenCalledWith('Split Completed', { props: { mode: 'range', start: 2, end: 4 } });
    });

    it('splits every N pages and creates multiple files', async () => {
      render(<SplitTool />);
      setMockPageCount(5);
      uploadFile(createMockPDFFile({ name: 'n.pdf' }));
      await waitFor(() => expect(screen.getByText('n.pdf')).toBeInTheDocument());

      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());
      fireEvent.click(screen.getByLabelText(/Split every N pages/i));
      fireEvent.change(screen.getByPlaceholderText('1'), { target: { value: '2' } });

      fireEvent.click(screen.getByRole('button', { name: /Split PDF/i }));

      await waitFor(() => {
        // 5 pages, n=2 => 3 parts
        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(3);
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });

      expect(global.plausible).toHaveBeenCalledWith('Split Completed', { props: { mode: 'every-n', n: 2, parts: 3 } });
    });

    it('splits into individual pages (multiple files)', async () => {
      render(<SplitTool />);
      setMockPageCount(3);
      uploadFile(createMockPDFFile({ name: 'solo.pdf' }));
      await waitFor(() => expect(screen.getByText('solo.pdf')).toBeInTheDocument());
      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());

      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());
      fireEvent.click(screen.getByLabelText(/Split into individual pages/i));
      fireEvent.click(screen.getByRole('button', { name: /Split PDF/i }));

      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(3);
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });

      expect(global.plausible).toHaveBeenCalledWith('Split Completed', { props: { mode: 'individual', pages: 3 } });
    });

    it('respects confirm() cancel in every-n when too many files', async () => {
      render(<SplitTool />);
      setMockPageCount(120);
      uploadFile(createMockPDFFile({ name: 'many.pdf' }));
      await waitFor(() => expect(screen.getByText('many.pdf')).toBeInTheDocument());

      (global.confirm as jest.Mock).mockReturnValueOnce(false);
      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());
      fireEvent.click(screen.getByLabelText(/Split every N pages/i));
      fireEvent.change(screen.getByPlaceholderText('1'), { target: { value: '1' } });
      fireEvent.click(screen.getByRole('button', { name: /Split PDF/i }));

      // Should abort without downloads
      await waitFor(() => {
        expect(global.URL.createObjectURL).not.toHaveBeenCalled();
      });
    });

    it('respects confirm() cancel in individual when too many files', async () => {
      render(<SplitTool />);
      setMockPageCount(60);
      uploadFile(createMockPDFFile({ name: 'many2.pdf' }));
      await waitFor(() => expect(screen.getByText('many2.pdf')).toBeInTheDocument());

      (global.confirm as jest.Mock).mockReturnValueOnce(false);
      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());
      fireEvent.click(screen.getByLabelText(/Split into individual pages/i));
      fireEvent.click(screen.getByRole('button', { name: /Split PDF/i }));

      await waitFor(() => {
        expect(global.URL.createObjectURL).not.toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility & Keyboard', () => {
    it('triggers file picker with Enter/Space', () => {
      render(<SplitTool />);
      const dropZone = screen.getByRole('button', { name: 'Choose PDF file or drag and drop' });
      const fileInput = getFileInput();
      const clickSpy = jest.spyOn(fileInput, 'click');

      fireEvent.keyDown(dropZone, { key: 'Enter' });
      fireEvent.keyDown(dropZone, { key: ' ' });

      expect(clickSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Memory & Downloads', () => {
    it('revokes object URLs for each download', async () => {
      render(<SplitTool />);
      setMockPageCount(3);
      uploadFile(createMockPDFFile({ name: 'u.pdf' }));
      await waitFor(() => expect(screen.getByText('u.pdf')).toBeInTheDocument());
      await waitFor(() => expect(screen.getByText(/Split mode:/)).toBeInTheDocument());

      fireEvent.click(screen.getByLabelText(/Split into individual pages/i));
      fireEvent.click(screen.getByRole('button', { name: /Split PDF/i }));

      await waitFor(() => {
        expect((global.URL.revokeObjectURL as jest.Mock).mock.calls.length).toBe(3);
      });
    });
  });
});
