import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TextListUtility from '@/app/components/TextListUtility';

jest.mock('@/app/utils/analytics', () => ({ track: jest.fn() }));
jest.mock('@/app/utils/pdfUtils', () => ({ downloadBlob: jest.fn() }));

describe('TextListUtility', () => {
  beforeEach(() => jest.clearAllMocks());

  it('processes list and removes duplicates when option is toggled', async () => {
    render(<TextListUtility />);

    const input = screen.getByLabelText('Input text list');
    fireEvent.change(input, { target: { value: 'apple\nbanana\napple' } });

    // Toggle remove duplicates
    const removeButton = screen.getByRole('button', { name: /Remove Duplicates/i });
    fireEvent.click(removeButton);

    // Click process
    const processBtn = screen.getByRole('button', { name: /Process text list/i });
    fireEvent.click(processBtn);

    // Wait for output
    await waitFor(() => {
      const output = screen.getByRole('region', { name: /Output display/i });
      expect(output).toHaveTextContent(/apple/);
      expect(output).toHaveTextContent(/banana/);
      // Should not have duplicate 'apple' twice
      const text = output.textContent || '';
      expect((text.match(/apple/g) || []).length).toBe(1);
    });
  });

  it('copy fallback sets error when clipboard is unavailable', async () => {
    render(<TextListUtility />);

    const input = screen.getByLabelText('Input text list');
    fireEvent.change(input, { target: { value: 'one\ntwo' } });

    // Click process
    const processBtn = screen.getByRole('button', { name: /Process text list/i });
    fireEvent.click(processBtn);

    // Simulate clipboard throwing
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    });

    const copyBtn = await screen.findByRole('button', { name: /Copy output to clipboard/i });
    fireEvent.click(copyBtn);

    await waitFor(() => expect(screen.getByText(/Failed to copy to clipboard/i)).toBeInTheDocument());
  });

  it('download calls downloadBlob', async () => {
    render(<TextListUtility />);

    const input = screen.getByLabelText('Input text list');
    fireEvent.change(input, { target: { value: 'a\nb' } });

    const processBtn = screen.getByRole('button', { name: /Process text list/i });
    fireEvent.click(processBtn);

    const downloadBtn = await screen.findByRole('button', { name: /Download output as file/i });
    fireEvent.click(downloadBtn);

    const pdfUtils = require('@/app/utils/pdfUtils');
    expect(pdfUtils.downloadBlob).toHaveBeenCalled();
  });
});
