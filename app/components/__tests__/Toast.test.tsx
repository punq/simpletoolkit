import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the message', () => {
        render(<Toast message="Test Message" onClose={jest.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent('Test Message');
    });

    it('calls onClose after timeout', () => {
        const onClose = jest.fn();
        render(<Toast message="Test Message" onClose={onClose} />);

        // Default timeout is 3000ms
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('clears timeout on unmount', () => {
        const onClose = jest.fn();
        const { unmount } = render(<Toast message="Test Message" onClose={onClose} />);

        unmount();

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(onClose).not.toHaveBeenCalled();
    });
});
