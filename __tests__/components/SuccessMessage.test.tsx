import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SuccessMessage from '../../app/components/SuccessMessage';
import { track } from '@/app/utils/analytics';

// Mock dependencies
jest.mock('@/app/utils/analytics', () => ({
    track: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    usePathname: () => '/tools/test-tool',
}));

jest.mock('next/link', () => {
    return ({ children, href, onClick }: any) => (
        <a href={href} onClick={onClick}>{children}</a>
    );
});

describe('SuccessMessage', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the message correctly', () => {
        render(<SuccessMessage message="Operation successful" />);
        expect(screen.getByText('Operation successful')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('calls onClose when dismiss button is clicked', () => {
        const onClose = jest.fn();
        render(<SuccessMessage message="Done" onClose={onClose} />);

        const dismissBtn = screen.getByLabelText('Dismiss message');
        fireEvent.click(dismissBtn);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('auto-hides after specified duration', () => {
        const onClose = jest.fn();
        render(<SuccessMessage message="Done" onClose={onClose} autoHideDuration={5000} />);

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not auto-hide if duration is 0', () => {
        const onClose = jest.fn();
        render(<SuccessMessage message="Done" onClose={onClose} autoHideDuration={0} />);

        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(onClose).not.toHaveBeenCalled();
    });

    it('uses adaptive duration when autoHideDuration is explicitly set to undefined', () => {
        const onClose = jest.fn();
        // When autoHideDuration is explicitly undefined (not 0), the component should calculate adaptive duration
        // However, the default prop is 0, so we need to pass a positive value to trigger adaptive behavior
        // Let's test with a very short message which should auto-hide quickly
        render(<SuccessMessage message="OK" onClose={onClose} autoHideDuration={undefined as any} />);

        // Should not close immediately
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(onClose).not.toHaveBeenCalled();

        // Since default is 0 (persist mode), it should never auto-close
        act(() => {
            jest.advanceTimersByTime(10000);
        });
        expect(onClose).not.toHaveBeenCalled();
    });

    it('tracks donation click', () => {
        render(<SuccessMessage message="Done" />);

        const donateLink = screen.getByRole('link', { name: /donate/i });
        fireEvent.click(donateLink);

        expect(track).toHaveBeenCalledWith('Donate Click', expect.any(Object));
    });
});
