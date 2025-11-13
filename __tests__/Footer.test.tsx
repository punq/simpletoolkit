import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/app/utils/analytics', () => ({
  track: jest.fn(),
}));

import Footer from '@/app/components/Footer';
import { track } from '@/app/utils/analytics';

describe('Footer analytics toggle', () => {
  beforeEach(() => {
    localStorage.clear();
    (global as any).plausible = undefined;
    jest.clearAllMocks();
  });

  it('shows Off by default and toggles to On with toast and track call', async () => {
    render(<Footer />);

    const btn = screen.getByRole('button', { name: /analytics/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent(/Off/);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(localStorage.getItem('analytics_consent')).toBe('1');
      expect(screen.getByRole('status')).toHaveTextContent(/enabled/i);
    });

    expect(track).toHaveBeenCalledWith('Consent Granted');

    // toggle back off
    fireEvent.click(btn);
    await waitFor(() => {
      expect(localStorage.getItem('analytics_consent')).toBe('0');
      expect(screen.getByRole('status')).toHaveTextContent(/disabled/i);
    });

    expect(track).toHaveBeenCalledWith('Consent Revoked');
  });
});
