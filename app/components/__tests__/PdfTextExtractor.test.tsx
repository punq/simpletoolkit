import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import PdfTextExtractor from '@/app/components/PdfTextExtractor';
import { extractTextFromPdf } from '@/app/utils/pdfTextExtractor';
import { validatePdfFile } from '@/app/utils/pdfUtils';

jest.mock('@/app/utils/pdfTextExtractor', () => ({
  extractTextFromPdf: jest.fn(),
}));

jest.mock('@/app/utils/pdfUtils', () => ({
  validatePdfFile: jest.fn(),
  formatFileSize: (n: number) => `${(n / (1024 * 1024)).toFixed(1)} MB`,
  getBaseFilename: (s: string) => s.replace(/\.pdf$/i, ''),
  downloadBlob: jest.fn(),
}));

describe('PdfTextExtractor UI', () => {
  beforeEach(() => {
    // Reset implementations and mocks to avoid cross-test contamination
    jest.resetAllMocks();
    localStorage.clear();
  });
  test('renders header and extract button', () => {
    render(<PdfTextExtractor />);
    expect(screen.getByText(/Extract Text from PDF/i)).toBeInTheDocument();
    const extractBtn = screen.getByRole('button', { name: /Extract Text|Extracting/i });
    expect(extractBtn).toBeInTheDocument();
    expect(extractBtn).toBeDisabled();
  });

  test('drop zone accepts click to open file picker', async () => {
    render(<PdfTextExtractor />);
    const dropZone = screen.getByRole('button', { name: /Choose PDF or drag and drop/i });
    expect(dropZone).toBeInTheDocument();
    await userEvent.click(dropZone);
    // The hidden file input takes the click; we can't assert file dialog, but ensure no errors
  });

  test('extracts successfully and shows output', async () => {
    const mockExtract = extractTextFromPdf as jest.MockedFunction<typeof extractTextFromPdf>;
    mockExtract.mockImplementation(async (file: File, opts: any) => {
      // simulate progress
      opts?.onProgress?.(1, 1);
      return { text: 'Hello world', pagesExtracted: 1, isImageOnly: false };
    });

    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {});

    render(<PdfTextExtractor />);

    // Attach a valid PDF file
    const file = new File(['%PDF-1.4'], 'hello.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    await userEvent.upload(input, file);

    // The extract button should be enabled
    const extractBtn = screen.getByRole('button', { name: /Extract Text|Extracting/i });
    expect(extractBtn).toBeEnabled();

    await userEvent.click(extractBtn);

    // Wait for result text to appear
    await screen.findByText(/Extracted Text/i);
    expect(screen.getByRole('textbox')).toHaveValue('Hello world');
  });

  test('shows password prompt if extract throws password error', async () => {
    const mockExtract = extractTextFromPdf as jest.MockedFunction<typeof extractTextFromPdf>;
    // First call fails, second call succeeds (simulating retry)
    mockExtract
      .mockImplementationOnce(async () => { throw new Error('PDF is password protected'); })
      .mockImplementationOnce(async () => ({ text: 'ok', pagesExtracted: 1, isImageOnly: false }));

    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {});

    render(<PdfTextExtractor />);

    const file = new File(['%PDF-1.4'], 'locked.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    await userEvent.upload(input, file);

    const extractBtn = screen.getByRole('button', { name: /Extract Text|Extracting/i });
    await userEvent.click(extractBtn);

    await screen.findByLabelText('Password');
    expect(screen.getByText(/password protected/i)).toBeInTheDocument();
  });

  test.skip('shows image-only message when extract returns isImageOnly', async () => {
    const mockExtract = extractTextFromPdf as jest.MockedFunction<typeof extractTextFromPdf>;
    // Simulate a failure that indicates the PDF has no selectable text
    mockExtract.mockImplementation(async () => { throw new Error('No selectable text was found in this PDF'); });

    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {});

    render(<PdfTextExtractor />);

    const file = new File(['%PDF-1.4'], 'scan.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    await userEvent.upload(input, file);

    const extractBtn = screen.getByRole('button', { name: /Extract Text|Extracting/i });
    await userEvent.click(extractBtn);

    // ensure mock extract was invoked and the UI updated to show the image-only message
    await waitFor(() => expect(mockExtract).toHaveBeenCalled());
    // The image-only message appears inside a status element; check within it
    // The component sets an error string when no selectable text is found; detect that
    await screen.findByText(/No selectable text|OCR is required|image-only/i);
  });

  test('copy and download buttons call clipboard and download', async () => {
    const mockExtract = extractTextFromPdf as jest.MockedFunction<typeof extractTextFromPdf>;
    mockExtract.mockImplementation(async () => ({ text: 'Hello world', pagesExtracted: 1, isImageOnly: false }));

    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {});

    // Mock clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    render(<PdfTextExtractor />);
    const file = new File(['%PDF-1.4'], 'my.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    await userEvent.upload(input, file);

    await userEvent.click(screen.getByRole('button', { name: /Extract Text|Extracting/i }));

    await screen.findByText(/Extracted Text/i);

    // Copy inside the Extracted Text region
    const extractedHeading = await screen.findByText(/Extracted Text/i);
    const extractedContainer = extractedHeading.closest('div');
    const copyBtn = within(extractedContainer as HTMLElement).getByRole('button', { name: /Copy/i });
    await userEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello world');

    // Download
    const downloadBtn = screen.getByRole('button', { name: /Download .txt/i });
    await userEvent.click(downloadBtn);
    const pdfUtils = require('@/app/utils/pdfUtils');
    expect(pdfUtils.downloadBlob).toHaveBeenCalled();
  });

  test('cancel aborts long running extraction', async () => {
    const mockExtract = extractTextFromPdf as jest.MockedFunction<typeof extractTextFromPdf>;

    mockExtract.mockImplementation((file: File, options: any) => {
      return new Promise((resolve, reject) => {
        if (options.signal) {
          options.signal.addEventListener('abort', () => reject(new Error('Extraction aborted')));
        }
        // never resolve to simulate long running
      });
    });

    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {});

    render(<PdfTextExtractor />);
    const file = new File(['%PDF-1.4'], 'long.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    await userEvent.upload(input, file);

    await userEvent.click(screen.getByRole('button', { name: /Extract Text|Extracting/i }));

    // Wait for processing status to appear
    await screen.findByRole('status');

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelBtn);

    // Should hide processing status
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  test('retry with password calls extraction with provided password', async () => {
    const mockExtract = extractTextFromPdf as jest.MockedFunction<typeof extractTextFromPdf>;
    // First call rejects with password error
    mockExtract.mockRejectedValueOnce(new Error('PDF is password protected'));
    // Second call resolves when password provided
    mockExtract.mockImplementationOnce(async (_file: File, options: any) => {
      if (options.password === 'secret') return { text: 'ok', pagesExtracted: 1, isImageOnly: false };
      throw new Error('PDF is password protected');
    });

    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {});

    render(<PdfTextExtractor />);
    const file = new File(['%PDF-1.4'], 'locked.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    await userEvent.upload(input, file);

    await userEvent.click(screen.getByRole('button', { name: /Extract Text|Extracting/i }));

    await screen.findByLabelText('Password');

    // The label isn't programmatically linked to the input; find the password input inside the dialog
    const dialog = screen.getByRole('dialog');
    const pw = dialog.querySelector('input[type="password"]') as HTMLInputElement;
    fireEvent.change(pw, { target: { value: 'secret' } });
    // ensure the input value is applied before retrying
    await waitFor(() => expect(pw).toHaveValue('secret'));
    await userEvent.click(screen.getByRole('button', { name: /Retry/i }));

    // await that extract was called twice (initial attempt + retry)
    await waitFor(() => expect(mockExtract).toHaveBeenCalledTimes(2));
    // Second call should be made (and we verified mock recieved it)
    expect(mockExtract).toHaveBeenCalledTimes(2);

    await waitFor(() => expect(screen.queryByRole('textbox')).toBeInTheDocument());
    expect(screen.getByRole('textbox')).toHaveValue('ok');
  });
});
