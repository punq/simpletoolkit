import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '@/app/components/Header';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick} data-testid={`link-${href}`}>
      {children}
    </a>
  );
});

// Mock pathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock analytics track
jest.mock('@/app/utils/analytics', () => ({
  track: jest.fn(),
}));

describe('Header', () => {
  it('renders brand and desktop links', () => {
    render(<Header />);

    expect(screen.getByText(/Simple Toolkit/i)).toBeInTheDocument();
    expect(screen.getByTestId('link-/tools')).toBeInTheDocument();
    expect(screen.getByTestId('link-/donate')).toBeInTheDocument();
  });

  it('toggles mobile menu and adds no-scroll', async () => {
    render(<Header />);

    // Initially, toggle button exists
    const toggle = screen.getByRole('button', { name: /Open menu|Close menu/i });
    expect(toggle).toBeInTheDocument();

    // Click to open
    fireEvent.click(toggle);

    // Wait for menu to be mounted
    await waitFor(() => {
      expect(document.documentElement.classList.contains('no-scroll')).toBe(true);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(document.documentElement.classList.contains('no-scroll')).toBe(false);
      // aria-expanded should be updated on toggle
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
