import '@testing-library/jest-dom'

// Mock window.URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-object-url')
global.URL.revokeObjectURL = jest.fn()

// Mock plausible analytics
if (typeof window !== 'undefined') {
  window.plausible = jest.fn()
}

// Mock DOM methods
HTMLElement.prototype.scrollIntoView = jest.fn()
