/**
 * Analytics Edge Cases Test Suite
 * 
 * Tests boundary conditions, special values, concurrent execution, and type safety.
 */

import { track, type AnalyticsProps } from '@/app/utils/analytics';

describe('analytics - edge cases', () => {
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

  describe('Property edge cases', () => {
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

      const longString = 'x'.repeat(1000);
      track('Long String', { longValue: longString });

      expect(mockPlausible).toHaveBeenCalledTimes(1);
    });
  });

  describe('Concurrent and rapid execution', () => {
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
});
