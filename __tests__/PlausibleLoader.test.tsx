import React from 'react';
import { render, cleanup } from '@testing-library/react';

// Mock Next Script to render a simple script element we can assert on
jest.mock('next/script', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('script', { 'data-testid': 'plausible-script', 'data-src': props.src }),
}));

describe('PlausibleLoader', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    localStorage.clear();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('renders nothing when NEXT_PUBLIC_PLAUSIBLE is not enabled', () => {
    // Ensure env not set
    delete process.env.NEXT_PUBLIC_PLAUSIBLE;
    // Consent present but deployment disabled
    localStorage.setItem('analytics_consent', '1');
    const mod = require('@/app/components/PlausibleLoader');
    const { PlausibleLoaderContent } = mod;
    const raw = localStorage.getItem('analytics_consent');
    const consent = raw === null ? null : raw === '1';
    const enabled = process.env.NEXT_PUBLIC_PLAUSIBLE === '1' || process.env.NEXT_PUBLIC_PLAUSIBLE === 'true';
    const { queryByTestId } = render(PlausibleLoaderContent(enabled, consent));
    // Since PlausibleLoader returns null, queryByTestId should be null
    expect(queryByTestId('plausible-script')).toBeNull();
    cleanup();
  });

  it('renders plausible scripts when enabled and consent is granted', () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE = '1';
    localStorage.setItem('analytics_consent', '1');
    const mod = require('@/app/components/PlausibleLoader');
    const { PlausibleLoaderContent } = mod;
    const raw = localStorage.getItem('analytics_consent');
    const consent = raw === null ? null : raw === '1';
    const enabled = process.env.NEXT_PUBLIC_PLAUSIBLE === '1' || process.env.NEXT_PUBLIC_PLAUSIBLE === 'true';
    const { getAllByTestId } = render(PlausibleLoaderContent(enabled, consent));
    const scripts = getAllByTestId('plausible-script');
    expect(scripts.length).toBeGreaterThanOrEqual(1);
    expect(scripts.some((s: HTMLElement) => s.getAttribute('data-src')?.includes('plausible.io'))).toBe(true);
    cleanup();
  });

  it('renders nothing if consent is denied', () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE = '1';
    localStorage.setItem('analytics_consent', '0');
    const mod = require('@/app/components/PlausibleLoader');
    const { PlausibleLoaderContent } = mod;
    const raw = localStorage.getItem('analytics_consent');
    const consent = raw === null ? null : raw === '1';
    const enabled = process.env.NEXT_PUBLIC_PLAUSIBLE === '1' || process.env.NEXT_PUBLIC_PLAUSIBLE === 'true';
    const { queryByTestId } = render(PlausibleLoaderContent(enabled, consent));
    expect(queryByTestId('plausible-script')).toBeNull();
    cleanup();
  });
});
