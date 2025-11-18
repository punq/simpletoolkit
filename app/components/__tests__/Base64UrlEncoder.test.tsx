import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Base64UrlEncoder from '@/app/components/Base64UrlEncoder';

jest.mock('@/app/utils/analytics', () => ({ track: jest.fn() }));
jest.mock('@/app/utils/pdfUtils', () => ({ downloadBlob: jest.fn() }));

describe('Base64UrlEncoder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Provide a default clipboard for tests
    (global.navigator as any).clipboard = { writeText: jest.fn().mockResolvedValue(undefined) };
  });

  it('encodes raw input as base64 in encode mode', async () => {
    render(<Base64UrlEncoder />);

    const textarea = screen.getByLabelText('Raw text input');
    fireEvent.change(textarea, { target: { value: 'hello' } });

    // Wait for output to update
    await waitFor(() => {
      const output = screen.getByRole('region', { name: /Output display/i });
      expect(output).toHaveTextContent(/aGVsbG8=|aGVsbG8/i);
    });
  });

  it('decodes base64 input when in decode mode', async () => {
    render(<Base64UrlEncoder />);

    const decodeBtn = screen.getByRole('button', { name: /Decode|Switch to decode mode/i });
    fireEvent.click(decodeBtn);

    const textarea = screen.getByLabelText('Base64 input');
    fireEvent.change(textarea, { target: { value: 'aGVsbG8=' } });

    await waitFor(() => {
      const output = screen.getByRole('region', { name: /Output display/i });
      expect(output).toHaveTextContent('hello');
    });
  });
});
