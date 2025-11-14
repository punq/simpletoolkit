import React from 'react';
import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// High-value tests for JwtUtility core crypto and UI integration.
// These tests mock the browser SubtleCrypto API deterministically using Node's crypto.

import crypto from 'crypto';

// Mock analytics to silence tracking calls
jest.mock('@/app/utils/analytics', () => ({ track: jest.fn() }));

import JwtUtility from '@/app/components/JwtUtility';

/**
 * Install a deterministic SubtleCrypto mock on globalThis.crypto.subtle.
 * - importKey: stores the raw key material
 * - sign: computes HMAC-SHA256 using Node crypto
 * - verify: computes expected HMAC and compares
 */
function installSubtleHMACMock() {
  const keyStore = new WeakMap<object, Buffer>();

  const subtle = {
    async importKey(format: string, keyData: ArrayBuffer | Uint8Array, algorithm: unknown, extractable: boolean, usages: string[]) {
      // Accept ArrayBuffer or Uint8Array
      const buf = Buffer.from(keyData instanceof ArrayBuffer ? new Uint8Array(keyData) : keyData as Uint8Array);
      const keyObj = { kty: format, alg: algorithm, usages } as any;
      keyStore.set(keyObj, buf);
      return keyObj;
    },

    async sign(alg: string | object, key: any, data: ArrayBuffer) {
      // HMAC-SHA256
      const keyBuf = keyStore.get(key);
      if (!keyBuf) throw new Error('Key not found');
      const h = crypto.createHmac('sha256', keyBuf);
      h.update(Buffer.from(new Uint8Array(data)));
      const sig = h.digest();
      return sig.buffer;
    },

    async verify(alg: string | object, key: any, signature: ArrayBuffer, data: ArrayBuffer) {
      const keyBuf = keyStore.get(key);
      if (!keyBuf) return false;
      const h = crypto.createHmac('sha256', keyBuf);
      h.update(Buffer.from(new Uint8Array(data)));
      const expected = h.digest();
      const sigBuf = Buffer.from(new Uint8Array(signature));
      // constant-time compare
      if (expected.length !== sigBuf.length) return false;
      let res = 0;
      for (let i = 0; i < expected.length; i++) res |= expected[i] ^ sigBuf[i];
      return res === 0;
    },
  };

  // attach mock subtle to globalThis in a type-safe way for tests
  (globalThis as any).crypto = (globalThis as any).crypto || ({} as Crypto);
  (globalThis as any).crypto.subtle = subtle;
}

describe('JwtUtility — Core crypto & UI integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    installSubtleHMACMock();
    // mock clipboard
    Object.assign(navigator, { clipboard: { writeText: jest.fn(() => Promise.resolve()) } });
  });

  afterEach(() => {
    cleanup();
  });

  it('Validates a known HS256 token with the correct secret (positive case)', async () => {
    // Known test vector from jwt.io
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
      'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const secret = 'your-256-bit-secret';

    render(<JwtUtility />);

    // Paste token
    const ta = screen.getByPlaceholderText(/Paste JWT here/i);
    await userEvent.clear(ta);
    await userEvent.type(ta, token);

    // Enter secret
    const secretInput = screen.getByPlaceholderText(/Enter shared secret/i);
    await userEvent.clear(secretInput);
    await userEvent.type(secretInput, secret);

    // Click Validate (HS256)
    const btn = screen.getByRole('button', { name: /Validate \(HS256\)/i });
    await userEvent.click(btn);

    // Expect SuccessMessage to display validation text
    await waitFor(() => {
      expect(screen.getByText(/Valid \(HS256\)/i)).toBeInTheDocument();
    });
  });

  it('Fails validation with an incorrect secret (negative case)', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
      'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const wrongSecret = 'incorrect-secret';

    render(<JwtUtility />);

    const ta = screen.getByPlaceholderText(/Paste JWT here/i);
    await userEvent.clear(ta);
    await userEvent.type(ta, token);

    const secretInput = screen.getByPlaceholderText(/Enter shared secret/i);
    await userEvent.clear(secretInput);
    await userEvent.type(secretInput, wrongSecret);

    const btn = screen.getByRole('button', { name: /Validate \(HS256\)/i });
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid signature \(HS256\)/i)).toBeInTheDocument();
    });
  });

  it('Generates an HS256 token and verifies it (generation + verification)', async () => {
    render(<JwtUtility />);

    // Provide a simple secret
    const secret = 'test-secret-123';
    const secretInput = screen.getByPlaceholderText(/Enter shared secret/i);
    await userEvent.clear(secretInput);
    await userEvent.type(secretInput, secret);

    // Ensure header and payload fields have content (defaults exist)
    const genBtn = screen.getByRole('button', { name: /Generate HS256/i });
    await userEvent.click(genBtn);

    // Generated token area should appear — wait for token textarea
    await waitFor(() => {
      const generatedLabel = screen.getByText(/Generated Token/i);
      expect(generatedLabel).toBeInTheDocument();
    });

    const generatedLabel = screen.getByText(/Generated Token/i);
    // Find the textarea inside the generated token container
    const container = generatedLabel.closest('div') || generatedLabel.parentElement;
    if (!container) throw new Error('Generated token container not found');
    const generatedTextarea = within(container).getByRole('textbox') as HTMLTextAreaElement;
    const t = generatedTextarea.value;
    expect(typeof t).toBe('string');
    expect(t.split('.').length).toBe(3);

    // Now validate the generated token using the Validate button
    const validateBtn = screen.getByRole('button', { name: /Validate \(HS256\)/i });
    // Paste token into main token textarea
    const mainTa = screen.getByPlaceholderText(/Paste JWT here/i);
    await userEvent.clear(mainTa);
    await userEvent.type(mainTa, t);

    await userEvent.click(validateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Valid \(HS256\)/i)).toBeInTheDocument();
    });
  });

  it('Displays an error message when token format is malformed', async () => {
    render(<JwtUtility />);

    const ta = screen.getByPlaceholderText(/Paste JWT here/i);
    await userEvent.clear(ta);
    // Use a malformed token with incorrect part count to trigger format error
    await userEvent.type(ta, 'notajwt');

    const btn = screen.getByRole('button', { name: /Validate \(HS256\)/i });
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid token format/i)).toBeInTheDocument();
    });
  });
});
