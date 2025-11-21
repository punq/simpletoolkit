import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/app/utils/analytics', () => ({
  track: jest.fn(),
}));

import { track } from '@/app/utils/analytics';

describe('Footer analytics toggle', () => {
  beforeEach(() => {
    localStorage.clear();
    (global as any).plausible = undefined;
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_PLAUSIBLE = '1';
    process.env.NEXT_PUBLIC_PLAUSIBLE_DEFAULT_CONSENT = '1';
  });

  it('toggles analytics consent in privacy page', async () => {
    const PrivacyPage = require('@/app/privacy/page').default;
    render(<PrivacyPage />);

    const btn = await screen.findByRole('button', { name: /analytics/i });
    expect(btn).toBeInTheDocument();
    // Check initial state
    const initialIsOn = /Analytics: On/i.test(btn.textContent || '');

    // Toggle
    fireEvent.click(btn);
    await waitFor(() => {
      const expectedValue = initialIsOn ? '0' : '1';
      const expectedText = initialIsOn ? /Analytics: Off/i : /Analytics: On/i;
      expect(localStorage.getItem('analytics_consent')).toBe(expectedValue);
      expect(btn).toHaveTextContent(expectedText);
    });
    expect(track).toHaveBeenCalledWith(initialIsOn ? 'Consent Revoked' : 'Consent Granted');

    // Toggle back
    fireEvent.click(btn);
    await waitFor(() => {
      const expectedValue = initialIsOn ? '1' : '0';
      const expectedText = initialIsOn ? /Analytics: On/i : /Analytics: Off/i;
      expect(localStorage.getItem('analytics_consent')).toBe(expectedValue);
      expect(btn).toHaveTextContent(expectedText);
    });
    expect(track).toHaveBeenCalledWith(initialIsOn ? 'Consent Granted' : 'Consent Revoked');
  });
});
