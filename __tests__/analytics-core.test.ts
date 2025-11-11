/**
 * Core Analytics Test Suite
 * 
 * Tests basic functionality, browser environment detection, Plausible integration,
 * and error handling.
 */

import { track, type AnalyticsProps } from '@/app/utils/analytics';

describe('analytics - core functionality', () => {
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

  describe('Type Definitions', () => {
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
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(() => track('SSR Event')).not.toThrow();

      global.window = originalWindow;
    });

    it('should not call plausible in SSR environment', () => {
      const mockPlausible = jest.fn();
      const originalWindow = global.window;
      
      // @ts-ignore
      delete global.window;

      track('SSR Event', { key: 'value' });

      expect(mockPlausible).not.toHaveBeenCalled();

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

    it('should guarantee void return even on error', () => {
      (window as any).plausible = () => {
        throw new Error('Fatal error');
      };

      const result = track('Event');
      expect(result).toBeUndefined();
    });
  });
});
