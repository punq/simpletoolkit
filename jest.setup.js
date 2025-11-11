import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock browser APIs
global.URL.createObjectURL = jest.fn(() => 'mock-object-url')
global.URL.revokeObjectURL = jest.fn()

// Mock Plausible analytics
if (typeof window !== 'undefined') {
  window.plausible = jest.fn()
}

// Mock DOM methods
global.confirm = jest.fn(() => true)
HTMLElement.prototype.scrollIntoView = jest.fn()

// Suppress known jsdom limitations (not actual errors)
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  const message = args[0]?.toString() || '';
  if (message.includes('Not implemented: navigation')) return;
  if (message.includes('Not implemented: HTMLCanvasElement')) return;
  if (message.includes('inside a test was not wrapped in act')) return;
  originalError(...args);
};

console.warn = (...args) => {
  const message = args[0]?.toString() || '';
  if (message.includes('Not implemented')) return;
  originalWarn(...args);
};

