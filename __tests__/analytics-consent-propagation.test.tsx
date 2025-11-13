import React from 'react';
import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '@/app/components/Footer';
import AnalyticsConsent from '@/app/components/AnalyticsConsent';

// Ensure a clean localStorage between tests
beforeEach(() => {
  window.localStorage.clear();
});

describe('Analytics consent propagation', () => {
  test('clicking Yes in AnalyticsConsent updates Footer immediately', async () => {
    // Render both components together as they would be on the page
    render(
      <>
        <Footer />
        <AnalyticsConsent />
      </>
    );

    // Initially the consent banner should be visible (localStorage empty)
    const allowButton = await screen.findByRole('button', { name: /Allow analytics|Yes/i });
    expect(allowButton).toBeTruthy();

    // Footer should initially show Off (null treated as off)
    const footer = screen.getByRole('contentinfo');
    const footerToggle = within(footer).getByRole('button');
    expect(footerToggle).toBeTruthy();
    expect(footerToggle).toHaveTextContent(/Off/i);

    // Click the allow button and wait for updates
    await act(async () => {
      await userEvent.click(allowButton);
    });

    // Footer should now reflect On
    expect(footerToggle).toHaveTextContent(/On/i);

    // localStorage should be set
    expect(window.localStorage.getItem('analytics_consent')).toBe('1');
  });

  test('clicking No in AnalyticsConsent updates Footer immediately', async () => {
    render(
      <>
        <Footer />
        <AnalyticsConsent />
      </>
    );

    const denyButton = await screen.findByRole('button', { name: /Decline analytics|No/i });
    const footer = screen.getByRole('contentinfo');
    const footerToggle = within(footer).getByRole('button');

    // Click deny
    await act(async () => {
      await userEvent.click(denyButton);
    });

    expect(footerToggle).toHaveTextContent(/Off/i);
    expect(window.localStorage.getItem('analytics_consent')).toBe('0');
  });
});
