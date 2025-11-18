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
});
