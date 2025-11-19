import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('PdfTextExtractor extra UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('handles drag/drop with valid file', async () => {
    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {});
    const mockExtract = extractTextFromPdf as jest.MockedFunction<typeof extractTextFromPdf>;
    mockExtract.mockImplementationOnce(async (file: File, opts: any) => {
      opts?.onProgress?.(1, 1);
      return { text: 'Dragged text', pagesExtracted: 1, isImageOnly: false };
    });

    render(<PdfTextExtractor />);

    const dropZone = screen.getByRole('button', { name: /Choose PDF or drag and drop/i });

    // Create mock file and DataTransfer
    const file = new File(['%PDF-1.4'], 'dragged.pdf', { type: 'application/pdf' });
    // Fire drop event (jsdom doesn't fully implement DataTransfer across versions)
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

    // Expect the file name to appear in the UI
    await screen.findByText('dragged.pdf');

    // Click extract
    const extractBtn = screen.getByRole('button', { name: /Extract Text|Extracting/i });
    await userEvent.click(extractBtn);

    await screen.findByText(/Extracted Text/i);
    expect(screen.getByRole('textbox')).toHaveValue('Dragged text');
  });

  it('shows error when validatePdfFile throws', async () => {
    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {
      throw new Error('Please select a PDF file.');
    });

    render(<PdfTextExtractor />);

    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    const file = new File(['hello'], 'notpdf.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);

    // The error should appear as an alert
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/Please select a PDF file/i);
  });

  it('clipboard fallback: when clipboard.writeText fails, selects textarea', async () => {
    (validatePdfFile as jest.MockedFunction<typeof validatePdfFile>).mockImplementation(() => {});

    const mockExtract = extractTextFromPdf as jest.MockedFunction<typeof extractTextFromPdf>;
    mockExtract.mockImplementation(async () => ({ text: 'b', pagesExtracted: 1, isImageOnly: false }));

    // Make clipboard write reject
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockRejectedValue(new Error('nope')) },
      configurable: true,
    });

    // Spy on HTMLTextAreaElement.select
    const selectSpy = jest.spyOn(HTMLTextAreaElement.prototype, 'select');

    render(<PdfTextExtractor />);

    const file = new File(['%PDF-1.4'], 'my.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    await userEvent.upload(input, file);

    await userEvent.click(screen.getByRole('button', { name: /Extract Text|Extracting/i }));
    await screen.findByText(/Extracted Text/i);

    const extractedHeading = await screen.findByText(/Extracted Text/i);
    const extractedContainer = extractedHeading.closest('div');
    const copyBtn = within(extractedContainer as HTMLElement).getByRole('button', { name: /Copy/i });
    await userEvent.click(copyBtn);

    await waitFor(() => expect(selectSpy).toHaveBeenCalled());

    selectSpy.mockRestore();
  });
});
