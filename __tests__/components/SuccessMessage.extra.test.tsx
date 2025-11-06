import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SuccessMessage from '@/app/components/SuccessMessage';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick} data-testid={`link-${href}`}>{children}</a>
  );
});

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/tools/merge',
}));

// Mock analytics track to avoid depending on plausible
jest.mock('@/app/utils/analytics', () => ({
  track: jest.fn(),
}));

// Setup clipboard
beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
    configurable: true,
  });
  // Ensure localStorage is clean for each test
  window.localStorage.clear();
});

describe('SuccessMessage enhancements', () => {
  it('shows operations counter and increments on mount', async () => {
    render(<SuccessMessage message="Done!" autoHideDuration={0} />);

    await waitFor(() => {
      expect(screen.getByText(/You've completed 1 operation/)).toBeInTheDocument();
    });

    // Mount again to verify increment
    render(<SuccessMessage message="Done again!" autoHideDuration={0} />);

    await waitFor(() => {
      expect(screen.getByText(/You've completed 2 operations/)).toBeInTheDocument();
    });
  });

  it('copies share text to clipboard when Share is clicked', async () => {
    render(<SuccessMessage message="All set" autoHideDuration={0} />);

    const shareBtn = await screen.findByRole('button', { name: /Copy share message to clipboard/i });
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect((navigator.clipboard as any).writeText).toHaveBeenCalled();
    });
  });

  it('shows cross-links to other tools', async () => {
    render(<SuccessMessage message="Nice" autoHideDuration={0} />);

    // On merge page, should suggest split or compress or rearrange (two of them)
    await waitFor(() => {
      expect(screen.getByText(/Need to split next\?/i)).toBeInTheDocument();
    });
  });
});
