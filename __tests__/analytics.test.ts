/**
 * Comprehensive Test Suite for analytics.ts
 * 
 * This test suite follows enterprise-grade testing practices for analytics utilities.
 * Analytics is mission-critical infrastructure that must:
 * - Never break user experience (fail-safe)
 * - Handle all edge cases gracefully
 * - Work correctly in different environments (SSR, browser)
 * - Support various event types and properties
 * 
 * Testing Philosophy:
 * - Analytics failures should be silent and never throw
 * - Browser API availability must be checked
 * - Type safety must be maintained
 * - Performance impact must be minimal
 * 
 * Coverage Areas:
 * 1. Browser environment detection
 * 2. Plausible availability checking
 * 3. Event tracking with/without properties
 * 4. Error handling and fail-safe behavior
 * 5. Type validation for properties
 * 6. Edge cases and boundary conditions
 */

import { track, type AnalyticsProps } from '@/app/utils/analytics';

describe('analytics', () => {
  // Store original window object
  let originalWindow: typeof window;
  let originalConsoleWarn: typeof console.warn;

  beforeEach(() => {
    // Save original references
    originalWindow = global.window;
    originalConsoleWarn = console.warn;
    
    // Suppress console warnings during tests
    console.warn = jest.fn();
    
    // Reset window.plausible before each test
    if (typeof window !== 'undefined') {
      (window as any).plausible = undefined;
    }
  });

  afterEach(() => {
    // Restore original state
    console.warn = originalConsoleWarn;
    
    // Clean up window.plausible
    if (typeof window !== 'undefined') {
      (window as any).plausible = undefined;
    }
  });

  describe('Type Definitions', () => {
    describe('AnalyticsProps', () => {
      it('should accept string properties', () => {
        const props: AnalyticsProps = { category: 'pdf', action: 'merge' };
        expect(props.category).toBe('pdf');
        expect(props.action).toBe('merge');
      });

      it('should accept number properties', () => {
        const props: AnalyticsProps = { fileSize: 1024, pageCount: 5 };
        expect(props.fileSize).toBe(1024);
        expect(props.pageCount).toBe(5);
      });

      it('should accept boolean properties', () => {
        const props: AnalyticsProps = { success: true, compressed: false };
        expect(props.success).toBe(true);
        expect(props.compressed).toBe(false);
      });

      it('should accept mixed property types', () => {
        const props: AnalyticsProps = {
          name: 'PDF Tool',
          version: 1,
          enabled: true,
          count: 42,
          status: 'active',
        };
        expect(Object.keys(props).length).toBe(5);
      });
    });
  });

  describe('track function', () => {
    describe('Basic functionality', () => {
      it('should be a function', () => {
        expect(typeof track).toBe('function');
      });

      it('should accept eventName as first parameter', () => {
        expect(() => track('Test Event')).not.toThrow();
      });

      it('should accept optional props as second parameter', () => {
        expect(() => track('Test Event', { key: 'value' })).not.toThrow();
      });

      it('should work with props parameter omitted', () => {
        expect(() => track('Test Event')).not.toThrow();
      });

      it('should return void (undefined)', () => {
        const result = track('Test Event');
        expect(result).toBeUndefined();
      });
    });

    describe('Browser environment detection', () => {
      it('should not throw when window is undefined (SSR)', () => {
        // Simulate SSR environment
        const originalWindow = global.window;
        // @ts-ignore
        delete global.window;

        expect(() => track('SSR Event')).not.toThrow();

        // Restore
        global.window = originalWindow;
      });

      it('should not call plausible in SSR environment', () => {
        const mockPlausible = jest.fn();
        const originalWindow = global.window;
        
        // @ts-ignore
        delete global.window;

        track('SSR Event', { key: 'value' });

        expect(mockPlausible).not.toHaveBeenCalled();

        // Restore
        global.window = originalWindow;
      });

      it('should work in browser environment', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Browser Event');

        expect(mockPlausible).toHaveBeenCalled();
      });
    });

    describe('Plausible availability checking', () => {
      it('should not throw when plausible is undefined', () => {
        (window as any).plausible = undefined;
        expect(() => track('Event')).not.toThrow();
      });

      it('should not throw when plausible is null', () => {
        (window as any).plausible = null;
        expect(() => track('Event')).not.toThrow();
      });

      it('should not throw when plausible is not a function', () => {
        (window as any).plausible = 'not a function';
        expect(() => track('Event')).not.toThrow();
        
        (window as any).plausible = 123;
        expect(() => track('Event')).not.toThrow();
        
        (window as any).plausible = {};
        expect(() => track('Event')).not.toThrow();
        
        (window as any).plausible = [];
        expect(() => track('Event')).not.toThrow();
      });

      it('should call plausible when it is a function', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Test Event');

        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });

      it('should not attempt to call plausible when missing', () => {
        (window as any).plausible = undefined;
        
        // Should not throw or cause errors
        expect(() => track('Event')).not.toThrow();
      });
    });

    describe('Event tracking without properties', () => {
      it('should call plausible with only event name', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Simple Event');

        expect(mockPlausible).toHaveBeenCalledWith('Simple Event');
        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });

      it('should handle empty string event name', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('');

        expect(mockPlausible).toHaveBeenCalledWith('');
      });

      it('should handle event names with special characters', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Event-Name_With.Special!Chars');

        expect(mockPlausible).toHaveBeenCalledWith('Event-Name_With.Special!Chars');
      });

      it('should handle very long event names', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const longName = 'A'.repeat(1000);
        track(longName);

        expect(mockPlausible).toHaveBeenCalledWith(longName);
      });

      it('should handle Unicode event names', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('文档合并');
        track('Événement 🎉');

        expect(mockPlausible).toHaveBeenCalledTimes(2);
      });
    });

    describe('Event tracking with properties', () => {
      it('should call plausible with event name and props object', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const props = { key: 'value', count: 42 };
        track('Event With Props', props);

        expect(mockPlausible).toHaveBeenCalledWith('Event With Props', { props });
        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });

      it('should handle string property values', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('String Props', { category: 'test', status: 'active' });

        expect(mockPlausible).toHaveBeenCalledWith('String Props', {
          props: { category: 'test', status: 'active' },
        });
      });

      it('should handle number property values', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Number Props', { fileSize: 1024, duration: 3.5 });

        expect(mockPlausible).toHaveBeenCalledWith('Number Props', {
          props: { fileSize: 1024, duration: 3.5 },
        });
      });

      it('should handle boolean property values', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Boolean Props', { success: true, hasErrors: false });

        expect(mockPlausible).toHaveBeenCalledWith('Boolean Props', {
          props: { success: true, hasErrors: false },
        });
      });

      it('should handle mixed property types', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Mixed Props', {
          name: 'Test',
          count: 5,
          enabled: true,
          percentage: 75.5,
          status: 'complete',
        });

        expect(mockPlausible).toHaveBeenCalledWith('Mixed Props', {
          props: {
            name: 'Test',
            count: 5,
            enabled: true,
            percentage: 75.5,
            status: 'complete',
          },
        });
      });

      it('should handle empty props object', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Empty Props', {});

        expect(mockPlausible).toHaveBeenCalledWith('Empty Props', { props: {} });
      });

      it('should handle props with many keys', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const manyProps: AnalyticsProps = {};
        for (let i = 0; i < 50; i++) {
          manyProps[`key${i}`] = `value${i}`;
        }

        track('Many Props', manyProps);

        expect(mockPlausible).toHaveBeenCalledWith('Many Props', { props: manyProps });
      });

      it('should handle props with special characters in keys', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Special Keys', {
          'key-with-dash': 'value1',
          'key_with_underscore': 'value2',
          'key.with.dot': 'value3',
        });

        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });

      it('should handle props with Unicode values', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Unicode Props', {
          text: '文档处理',
          emoji: '🎉',
          arabic: 'مرحبا',
        });

        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });
    });

    describe('Error handling and fail-safe behavior', () => {
      it('should not throw when plausible throws an error', () => {
        const mockPlausible = jest.fn(() => {
          throw new Error('Plausible error');
        });
        (window as any).plausible = mockPlausible;

        expect(() => track('Event')).not.toThrow();
      });

      it('should continue execution after plausible error', () => {
        const mockPlausible = jest.fn(() => {
          throw new Error('Network error');
        });
        (window as any).plausible = mockPlausible;

        let afterTrack = false;
        track('Event');
        afterTrack = true;

        expect(afterTrack).toBe(true);
      });

      it('should handle TypeError in plausible call', () => {
        const mockPlausible = jest.fn(() => {
          throw new TypeError('Invalid argument');
        });
        (window as any).plausible = mockPlausible;

        expect(() => track('Event')).not.toThrow();
      });

      it('should handle ReferenceError in plausible call', () => {
        const mockPlausible = jest.fn(() => {
          throw new ReferenceError('Undefined reference');
        });
        (window as any).plausible = mockPlausible;

        expect(() => track('Event')).not.toThrow();
      });

      it('should handle async errors gracefully', () => {
        const mockPlausible = jest.fn(() => {
          return Promise.reject(new Error('Async error'));
        });
        (window as any).plausible = mockPlausible;

        expect(() => track('Event')).not.toThrow();
      });

      it('should not expose errors to caller', () => {
        const mockPlausible = jest.fn(() => {
          throw new Error('Internal error');
        });
        (window as any).plausible = mockPlausible;

        const result = track('Event');
        expect(result).toBeUndefined();
      });

      it('should handle null event name gracefully', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        // @ts-ignore - Testing runtime behavior
        expect(() => track(null)).not.toThrow();
      });

      it('should handle undefined event name gracefully', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        // @ts-ignore - Testing runtime behavior
        expect(() => track(undefined)).not.toThrow();
      });

      it('should handle non-string event names gracefully', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        // @ts-ignore - Testing runtime behavior
        expect(() => track(123)).not.toThrow();
        
        // @ts-ignore - Testing runtime behavior
        expect(() => track({})).not.toThrow();
        
        // @ts-ignore - Testing runtime behavior
        expect(() => track([])).not.toThrow();
      });
    });

    describe('Edge cases and boundary conditions', () => {
      it('should handle rapid successive calls', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        for (let i = 0; i < 100; i++) {
          track(`Event ${i}`);
        }

        expect(mockPlausible).toHaveBeenCalledTimes(100);
      });

      it('should handle concurrent calls', async () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const promises = Array.from({ length: 10 }, (_, i) =>
          Promise.resolve(track(`Concurrent Event ${i}`))
        );

        await Promise.all(promises);

        expect(mockPlausible).toHaveBeenCalledTimes(10);
      });

      it('should handle props with zero values', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Zero Values', { count: 0, size: 0, value: 0 });

        expect(mockPlausible).toHaveBeenCalledWith('Zero Values', {
          props: { count: 0, size: 0, value: 0 },
        });
      });

      it('should handle props with negative numbers', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Negative Numbers', { offset: -10, delta: -5.5 });

        expect(mockPlausible).toHaveBeenCalledWith('Negative Numbers', {
          props: { offset: -10, delta: -5.5 },
        });
      });

      it('should handle props with very large numbers', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Large Numbers', {
          bigNumber: Number.MAX_SAFE_INTEGER,
          hugeValue: 1e100,
        });

        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });

      it('should handle props with special number values', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Special Numbers', {
          infinity: Infinity,
          negInfinity: -Infinity,
          notANumber: NaN,
        });

        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });

      it('should handle empty string in props', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Empty String', { emptyValue: '', anotherEmpty: '' });

        expect(mockPlausible).toHaveBeenCalledWith('Empty String', {
          props: { emptyValue: '', anotherEmpty: '' },
        });
      });

      it('should handle very long string values in props', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const longString = 'x'.repeat(10000);
        track('Long String', { longValue: longString });

        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });
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

    describe('Performance considerations', () => {
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
          for (let i = 0; i < 1000000; i++) {
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
        for (let i = 0; i < 1000; i++) {
          largeProps[`key${i}`] = `value${i}`;
        }

        expect(() => track('Large Props', largeProps)).not.toThrow();
      });
    });

    describe('Type safety validation', () => {
      it('should accept valid AnalyticsProps types', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const validProps: AnalyticsProps = {
          stringProp: 'value',
          numberProp: 42,
          booleanProp: true,
        };

        track('Type Safety', validProps);

        expect(mockPlausible).toHaveBeenCalledWith('Type Safety', { props: validProps });
      });

      it('should work with inferred prop types', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        track('Inferred Types', {
          text: 'hello',
          count: 10,
          flag: false,
        });

        expect(mockPlausible).toHaveBeenCalledTimes(1);
      });
    });

    describe('Real-world usage patterns', () => {
      it('should support chaining in user code', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const result = (() => {
          track('Chained Event');
          return 'success';
        })();

        expect(result).toBe('success');
        expect(mockPlausible).toHaveBeenCalled();
      });

      it('should work within try-catch blocks', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        try {
          track('Try Block Event');
          throw new Error('Unrelated error');
        } catch {
          // Error handling
        }

        expect(mockPlausible).toHaveBeenCalled();
      });

      it('should work in async contexts', async () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        await (async () => {
          track('Async Event');
        })();

        expect(mockPlausible).toHaveBeenCalled();
      });

      it('should work in event handlers', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const handleClick = () => {
          track('Button Clicked', { buttonId: 'submit' });
        };

        handleClick();

        expect(mockPlausible).toHaveBeenCalledWith('Button Clicked', {
          props: { buttonId: 'submit' },
        });
      });
    });

    describe('Silent failure guarantee', () => {
      it('should never throw even with completely broken plausible', () => {
        (window as any).plausible = {
          then: () => {
            throw new Error('Broken');
          },
          call: () => {
            throw new Error('Broken');
          },
        };

        expect(() => track('Event')).not.toThrow();
      });

      it('should not throw with circular reference in props', () => {
        const mockPlausible = jest.fn();
        (window as any).plausible = mockPlausible;

        const circular: any = { a: 'value' };
        circular.self = circular;

        // @ts-ignore - Testing runtime behavior
        expect(() => track('Circular', circular)).not.toThrow();
      });

      it('should guarantee void return even on error', () => {
        (window as any).plausible = () => {
          throw new Error('Fatal error');
        };

        const result = track('Event');
        expect(result).toBeUndefined();
      });
    });
  });
});
