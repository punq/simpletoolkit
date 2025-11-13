import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PdfTextExtractor from '@/app/components/PdfTextExtractor';

describe('PdfTextExtractor UI', () => {
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
});
