import '@testing-library/jest-dom'

declare global {
  var plausible: jest.Mock
  
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toHaveAttribute(attr: string, value?: string): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveValue(value: string | string[] | number): R
    }
  }
}

export {}
