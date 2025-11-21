import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Ensure a clean localStorage between tests
beforeEach(() => {
  window.localStorage.clear();
});

describe('Analytics consent propagation', () => {

  test('toggle AnalyticsToggle in privacy page updates consent', async () => {
    window.localStorage.clear();
    const PrivacyPage = require('@/app/privacy/page').default;
    render(<PrivacyPage />);

    // Analytics toggle should initially show Off
    const toggleBtn = await screen.findByRole('button', { name: /analytics/i });
    expect(toggleBtn).toBeTruthy();
    expect(toggleBtn).toHaveTextContent(/Analytics: Off/i);

    // Click to enable
    await act(async () => {
      await userEvent.click(toggleBtn);
    });
    expect(toggleBtn).toHaveTextContent(/Analytics: On/i);
    expect(window.localStorage.getItem('analytics_consent')).toBe('1');

    // Click to disable
    await act(async () => {
      await userEvent.click(toggleBtn);
    });
    expect(toggleBtn).toHaveTextContent(/Analytics: Off/i);
    expect(window.localStorage.getItem('analytics_consent')).toBe('0');
  });
});
