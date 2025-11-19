import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

// stub window.location.reload
const originalReload = window.location.reload;

beforeEach(() => {
  jest.clearAllMocks();
  // Some environments (JSDOM) prevent redefining `window.location` — set reload directly when possible.
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location.reload = jest.fn();
  } catch {
    // Fall back to defineProperty when writable (older environments)
    try {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...window.location, reload: jest.fn() },
      });
    } catch {
      // no-op
    }
  }
});

afterEach(() => {
  jest.clearAllMocks();
  // Restore original reload
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location.reload = originalReload;
  } catch {
    try {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...window.location, reload: originalReload },
      });
    } catch {
      // no-op
    }
  }
});

function Bomb(): React.ReactElement {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders fallback when a child throws', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">fallback</div>}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders default fallback and contains a refresh button', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    // Default UI contains heading and button
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /Refresh Page/i });
    expect(btn).toBeInTheDocument();

    // clicking should not throw; details should be present
    btn.click();
    expect(screen.getByText(/Technical details/i)).toBeInTheDocument();
  });
});
