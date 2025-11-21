import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

jest.mock('@/app/utils/analytics', () => ({ track: jest.fn() }));

import JwtUtility from '@/app/components/JwtUtility';

describe('JwtUtility RS256 validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Provide a subtle mock that supports importKey and verify for RS256
    const subtle = {
      async importKey() {
        // return a simple object as key
        return {} as any;
      },
      async verify() {
        // default to true unless overridden in test
        return true;
      },
    };
    (globalThis as any).crypto = (globalThis as any).crypto || {};
    (globalThis as any).crypto.subtle = subtle;
    // mock clipboard
    Object.assign(navigator, { clipboard: { writeText: jest.fn(() => Promise.resolve()) } });
  });

  afterEach(() => {
    cleanup();
  });

  test('validates RS256 token when verify returns true', async () => {
    render(<JwtUtility />);

    // create a minimal RS256 token (header/payload base64url, signature arbitrary)
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = { sub: '1' };
    const toB64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const token = `${toB64(header)}.${toB64(payload)}.c2ln`;

    const ta = screen.getByPlaceholderText(/Paste JWT here/i);
    await userEvent.clear(ta);
    await userEvent.type(ta, token);

    // Provide a tiny valid base64 PEM body (YQ== decodes to 'a')
    const pem = '-----BEGIN PUBLIC KEY-----\nYQ==\n-----END PUBLIC KEY-----';
    const pemTA = screen.getByPlaceholderText(/-----BEGIN PUBLIC KEY-----/i);
    await userEvent.clear(pemTA);
    await userEvent.type(pemTA, pem);

    const btn = screen.getByRole('button', { name: /Validate \(RS256\)/i });
    await userEvent.click(btn);

    await waitFor(async () => {
      const matches = await screen.findAllByText(/Valid \(RS256\)/i);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  test('shows invalid signature when verify returns false', async () => {
    // override verify to return false
    (globalThis as any).crypto.subtle.verify = async () => false;

    render(<JwtUtility />);

    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = { sub: '1' };
    const toB64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const token = `${toB64(header)}.${toB64(payload)}.c2ln`;

    const ta = screen.getByPlaceholderText(/Paste JWT here/i);
    await userEvent.clear(ta);
    await userEvent.type(ta, token);

    const pem = '-----BEGIN PUBLIC KEY-----\nYQ==\n-----END PUBLIC KEY-----';
    const pemTA = screen.getByPlaceholderText(/-----BEGIN PUBLIC KEY-----/i);
    await userEvent.clear(pemTA);
    await userEvent.type(pemTA, pem);

    const btn = screen.getByRole('button', { name: /Validate \(RS256\)/i });
    await userEvent.click(btn);

    await waitFor(async () => {
      const matches = await screen.findAllByText(/Invalid signature \(RS256\)/i);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  test('handles importKey throwing an error', async () => {
    (globalThis as any).crypto.subtle.importKey = async () => { throw new Error('import failed'); };

    render(<JwtUtility />);

    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = { sub: '1' };
    const toB64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const token = `${toB64(header)}.${toB64(payload)}.c2ln`;

    const ta = screen.getByPlaceholderText(/Paste JWT here/i);
    await userEvent.clear(ta);
    await userEvent.type(ta, token);

    const pem = '-----BEGIN PUBLIC KEY-----\nYQ==\n-----END PUBLIC KEY-----';
    const pemTA = screen.getByPlaceholderText(/-----BEGIN PUBLIC KEY-----/i);
    await userEvent.clear(pemTA);
    await userEvent.type(pemTA, pem);

    const btn = screen.getByRole('button', { name: /Validate \(RS256\)/i });
    await userEvent.click(btn);

    await waitFor(async () => {
      const matches = await screen.findAllByText(/Validation error:/i);
      expect(matches.length).toBeGreaterThan(0);
    });
  });
});
