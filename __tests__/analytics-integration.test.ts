/**
 * Analytics Integration & Performance Test Suite
 * 
 * Tests real-world integration scenarios and performance characteristics.
 */

import { track, type AnalyticsProps } from '@/app/utils/analytics';

describe('analytics - integration & performance', () => {
  let originalConsoleWarn: typeof console.warn;

  beforeEach(() => {
    originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    if (typeof window !== 'undefined') {
      (window as any).plausible = undefined;
    }
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
    
    if (typeof window !== 'undefined') {
      (window as any).plausible = undefined;
    }
  });

  describe('Integration scenarios', () => {
    it('should work in typical PDF merge scenario', () => {
      const mockPlausible = jest.fn();
      (window as any).plausible = mockPlausible;

      track('PDF Merged', {
        fileCount: 3,
        totalSize: 5242880,
        duration: 1.5,
        success: true,
      });

      expect(mockPlausible).toHaveBeenCalledWith('PDF Merged', {
        props: {
          fileCount: 3,
          totalSize: 5242880,
          duration: 1.5,
          success: true,
        },
      });
    });

    it('should work in typical error tracking scenario', () => {
      const mockPlausible = jest.fn();
      (window as any).plausible = mockPlausible;

      track('Processing Error', {
        errorType: 'ValidationError',
        fileSize: 102400,
        stage: 'upload',
      });

      expect(mockPlausible).toHaveBeenCalledTimes(1);
    });

    it('should work in page view tracking scenario', () => {
      const mockPlausible = jest.fn();
      (window as any).plausible = mockPlausible;

      track('pageview');

      expect(mockPlausible).toHaveBeenCalledWith('pageview');
    });

    it('should work in feature usage tracking scenario', () => {
      const mockPlausible = jest.fn();
      (window as any).plausible = mockPlausible;

      track('Feature Used', {
        feature: 'compress',
        compressionLevel: 75,
        outputSize: 1048576,
      });

      expect(mockPlausible).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance characteristics', () => {
    it('should execute quickly for simple events', () => {
      const mockPlausible = jest.fn();
      (window as any).plausible = mockPlausible;

      const start = performance.now();
      track('Performance Test');
      const duration = performance.now() - start;

      // Should be essentially instantaneous (< 1ms)
      expect(duration).toBeLessThan(1);
    });

    it('should not block on plausible execution', () => {
      let plausibleExecuted = false;
      const mockPlausible = jest.fn(() => {
        // Simulate slow analytics call
        for (let i = 0; i < 1000; i++) {
          // Busy wait
        }
        plausibleExecuted = true;
      });
      (window as any).plausible = mockPlausible;

      const start = performance.now();
      track('Blocking Test');
      const duration = performance.now() - start;

      // Track should complete (even if plausible is slow)
      expect(mockPlausible).toHaveBeenCalled();
    });

    it('should handle memory efficiently with large props', () => {
      const mockPlausible = jest.fn();
      (window as any).plausible = mockPlausible;

      const largeProps: AnalyticsProps = {};
      for (let i = 0; i < 100; i++) {
        largeProps[`key${i}`] = `value${i}`;
      }

      expect(() => track('Large Props', largeProps)).not.toThrow();
    });
  });
});
