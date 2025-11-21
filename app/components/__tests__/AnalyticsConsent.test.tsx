import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyticsConsent from '../AnalyticsConsent';
import { track } from '@/app/utils/analytics';

// Mock the track function
jest.mock('@/app/utils/analytics', () => ({
    track: jest.fn(),
}));

describe('AnalyticsConsent', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        window.localStorage.clear();
        jest.clearAllMocks();
    });

    it('renders when no consent is stored', async () => {
        render(<AnalyticsConsent />);

        // Wait for the component to check localStorage and render
        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: /analytics consent/i })).toBeInTheDocument();
        });

        expect(screen.getByText(/Allow anonymous metrics\?/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /allow analytics/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /decline analytics/i })).toBeInTheDocument();
    });

    it('does not render when consent is already stored (allowed)', async () => {
        window.localStorage.setItem('analytics_consent', '1');
        render(<AnalyticsConsent />);

        // Should not be in the document even after waiting
        await waitFor(() => { }, { timeout: 100 });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not render when consent is already stored (denied)', async () => {
        window.localStorage.setItem('analytics_consent', '0');
        render(<AnalyticsConsent />);

        await waitFor(() => { }, { timeout: 100 });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('sets consent to "1" and tracks event when "Yes" is clicked', async () => {
        render(<AnalyticsConsent />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /allow analytics/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /allow analytics/i }));

        expect(window.localStorage.getItem('analytics_consent')).toBe('1');
        expect(track).toHaveBeenCalledWith('Consent Granted');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('sets consent to "0" and tracks event when "No" is clicked', async () => {
        render(<AnalyticsConsent />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /decline analytics/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /decline analytics/i }));

        expect(window.localStorage.getItem('analytics_consent')).toBe('0');
        expect(track).toHaveBeenCalledWith('Consent Revoked');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('dispatches "analytics-consent-changed" event on update', async () => {
        const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
        render(<AnalyticsConsent />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /allow analytics/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /allow analytics/i }));

        expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event));
        const event = dispatchEventSpy.mock.calls.find(call => call[0].type === 'analytics-consent-changed');
        expect(event).toBeTruthy();
    });
});
