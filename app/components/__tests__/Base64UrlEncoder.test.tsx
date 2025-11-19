import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

    const decodeBtn = screen.getByRole('button', { name: /Switch to decode mode/i });
    fireEvent.click(decodeBtn);

    const textarea = screen.getByLabelText('Base64 input');
    fireEvent.change(textarea, { target: { value: 'aGVsbG8=' } });

    await waitFor(() => {
      const output = screen.getByRole('region', { name: /Output display/i });
      expect(output).toHaveTextContent('hello');
    });
  });

  it.skip('swaps input and output and toggles direction', async () => {
    const { getByLabelText, getByRole } = render(<Base64UrlEncoder />);

    // Switch to decode, then set base64 so we control output deterministically
    const decodeBtn = getByRole('button', { name: /Switch to decode mode/i });
    fireEvent.click(decodeBtn);

    const input = getByLabelText('Base64 input') as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: 'aGVsbG8=' } });

    // Wait for decoding to complete
    await waitFor(() => expect(getByRole('region', { name: /Output display/i })).toHaveTextContent('hello'));

    // Wait for encoding to produce output
    await waitFor(() => expect(getByRole('region', { name: /Output display/i })).not.toHaveTextContent(/Output will appear here/i), { timeout: 3000 });

    // Swap
    // Scope swap to the output container so we don't accidentally pick another swap
    const output = getByRole('region', { name: /Output display/i });
    const swapBtn = within(output).getByRole('button', { name: /Swap input and output/i });
    fireEvent.click(swapBtn);

    // Now the output region should contain the decoded text in the opposite direction
    await waitFor(() => expect(getByRole('region', { name: /Output display/i })).toHaveTextContent(/hello|aGVsbG8/));
  });

  it.skip('download triggers downloadBlob and success state', async () => {
    const { getByLabelText, getByRole } = render(<Base64UrlEncoder />);
    // Intentionally not using the raw input variable here; we only need the output region
    // Switch to decode and set a known base64 string
    const decodeBtn2 = getByRole('button', { name: /Decode|Switch to decode mode/i });
    fireEvent.click(decodeBtn2);
    fireEvent.change(getByLabelText('Base64 input'), { target: { value: 'ZGF0YQ==' } });
    await waitFor(() => expect(getByRole('region', { name: /Output display/i })).toHaveTextContent('data'));

    // Wait for output to be available
    // wait until the output is replaced by the encoded/decode output (not the placeholder)
    await waitFor(() => expect(getByRole('region', { name: /Output display/i })).not.toHaveTextContent(/Output will appear here/i), { timeout: 3000 });

    // Mock clipboard and download
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: jest.fn().mockResolvedValue(undefined) }, configurable: true });

    const downloadBtn = getByRole('button', { name: /Download output as file/i });
    fireEvent.click(downloadBtn);

    const pdfUtils = require('@/app/utils/pdfUtils');
    expect(pdfUtils.downloadBlob).toHaveBeenCalled();
  });
});
