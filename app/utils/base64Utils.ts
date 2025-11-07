/**
 * Base64 Encoding/Decoding Utilities
 * Provides 100% client-side Base64 encoding and decoding with full Unicode support
 * 
 * Supports:
 * - Standard Base64 (RFC 4648 Section 4): Uses +, /, and = padding
 * - URL-Safe Base64 (RFC 4648 Section 5): Uses -, _, no padding
 * - Full Unicode support via TextEncoder/TextDecoder
 * - Handles missing padding (=) characters in Base64 strings (common with URL-safe)
 * 
 * Performance:
 * - Pure functions for easy memoization
 * - Native browser APIs (btoa/atob)
 * - Zero dependencies
 * - Instant processing
 * 
 * Privacy & Security:
 * ✅ ZERO NETWORK CALLS - All processing happens in the browser
 * ✅ NO fetch() or XMLHttpRequest usage
 * ✅ NO external API calls
 * ✅ NO data transmission to any server
 * ✅ Uses only native Web APIs: btoa(), atob(), TextEncoder, TextDecoder
 * ✅ 100% client-side processing
 * ✅ No data leaves the browser
 * 
 * Edge Cases Handled:
 * - Missing padding characters (=) - automatically added when needed
 * - Invalid Base64 characters - clear error messages
 * - Oversized inputs - size validation with helpful feedback
 * - Malformed UTF-8 sequences - graceful error handling
 * - Empty inputs - valid operation returning empty string
 */

/**
 * Encoding/Decoding mode
 */
export type Base64Mode = 'standard' | 'url-safe';

/**
 * Operation result with validation
 */
export interface Base64Result {
  output: string;
  isValid: boolean;
  error?: string;
}

/**
 * Maximum input size (10MB)
 */
export const MAX_INPUT_SIZE = 10 * 1024 * 1024;

/**
 * Validates input size
 */
export function isValidInputSize(input: string): boolean {
  return new Blob([input]).size <= MAX_INPUT_SIZE;
}

/**
 * Encodes a string to Standard Base64 (with + and / and = padding)
 * Handles full Unicode using TextEncoder
 * 
 * @param input - Raw text to encode
 * @returns Base64Result with encoded output or error
 */
export function encodeStandard(input: string): Base64Result {
  if (!input) {
    return { output: '', isValid: true };
  }

  if (!isValidInputSize(input)) {
    return {
      output: '',
      isValid: false,
      error: `Input is too large. Maximum size is ${(MAX_INPUT_SIZE / (1024 * 1024)).toFixed(1)}MB`,
    };
  }

  try {
    // Convert string to UTF-8 bytes using TextEncoder
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    
    // Convert bytes to binary string
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    
    // Encode to Base64 using native btoa
    const base64 = btoa(binaryString);
    
    return {
      output: base64,
      isValid: true,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      output: '',
      isValid: false,
      error: `Encoding failed: ${err.message}`,
    };
  }
}

/**
 * Decodes Standard Base64 (with + and / and = padding)
 * Handles full Unicode using TextDecoder
 * 
 * @param input - Base64 string to decode
 * @returns Base64Result with decoded output or error
 */
export function decodeStandard(input: string): Base64Result {
  if (!input) {
    return { output: '', isValid: true };
  }

  if (!isValidInputSize(input)) {
    return {
      output: '',
      isValid: false,
      error: `Input is too large. Maximum size is ${(MAX_INPUT_SIZE / (1024 * 1024)).toFixed(1)}MB`,
    };
  }

  try {
    // Decode Base64 using native atob
    const binaryString = atob(input);
    
    // Convert binary string to bytes
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decode UTF-8 bytes to string using TextDecoder
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const decoded = decoder.decode(bytes);
    
    return {
      output: decoded,
      isValid: true,
    };
  } catch (error: unknown) {
    const err = error as Error;
    
    // Provide helpful error messages
    if (err.name === 'InvalidCharacterError' || err.message.includes('invalid character')) {
      return {
        output: '',
        isValid: false,
        error: 'Invalid Base64 string: Contains invalid characters',
      };
    }
    
    if (err.message.includes('UTF-8') || err.message.includes('decode')) {
      return {
        output: '',
        isValid: false,
        error: 'Decoding failed: Invalid UTF-8 sequence',
      };
    }
    
    return {
      output: '',
      isValid: false,
      error: `Decoding failed: ${err.message}`,
    };
  }
}

/**
 * Encodes a string to URL-Safe Base64 (RFC 4648 Section 5)
 * Uses - instead of +, _ instead of /, and omits padding (=)
 * 
 * @param input - Raw text to encode
 * @returns Base64Result with URL-safe encoded output or error
 */
export function encodeUrlSafe(input: string): Base64Result {
  const standardResult = encodeStandard(input);
  
  if (!standardResult.isValid) {
    return standardResult;
  }
  
  // Convert standard Base64 to URL-safe Base64
  const urlSafe = standardResult.output
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Remove padding
  
  return {
    output: urlSafe,
    isValid: true,
  };
}

/**
 * Decodes URL-Safe Base64 (RFC 4648 Section 5)
 * Handles - instead of +, _ instead of /, and missing padding
 * 
 * @param input - URL-safe Base64 string to decode
 * @returns Base64Result with decoded output or error
 */
export function decodeUrlSafe(input: string): Base64Result {
  if (!input) {
    return { output: '', isValid: true };
  }

  if (!isValidInputSize(input)) {
    return {
      output: '',
      isValid: false,
      error: `Input is too large. Maximum size is ${(MAX_INPUT_SIZE / (1024 * 1024)).toFixed(1)}MB`,
    };
  }

  try {
    // Convert URL-safe Base64 to standard Base64
    let standard = input
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    const paddingNeeded = (4 - (standard.length % 4)) % 4;
    standard += '='.repeat(paddingNeeded);
    
    // Decode using standard Base64 decoder
    return decodeStandard(standard);
  } catch (error: unknown) {
    const err = error as Error;
    return {
      output: '',
      isValid: false,
      error: `URL-safe decoding failed: ${err.message}`,
    };
  }
}

/**
 * Auto-detects Base64 format (standard vs URL-safe)
 * 
 * @param input - Base64 string to analyze
 * @returns Detected mode
 */
export function detectBase64Mode(input: string): Base64Mode {
  if (!input) return 'standard';
  
  // Check for URL-safe characters
  const hasUrlSafeChars = /-/.test(input) || /_/.test(input);
  const hasStandardChars = /\+/.test(input) || /\//.test(input);
  
  // If has URL-safe chars and no standard chars, it's URL-safe
  if (hasUrlSafeChars && !hasStandardChars) {
    return 'url-safe';
  }
  
  // If has no padding and no standard chars, likely URL-safe
  if (!hasStandardChars && !input.endsWith('=')) {
    return 'url-safe';
  }
  
  return 'standard';
}

/**
 * Validates if a string is valid Base64 (standard or URL-safe)
 * Performs strict character validation before attempting decode
 * 
 * @param input - String to validate
 * @param mode - Base64 mode to validate against
 * @returns true if valid, false otherwise
 */
export function isValidBase64(input: string, mode: Base64Mode = 'standard'): boolean {
  if (!input) return true;
  
  // Check for invalid characters first (prevents decode errors)
  const standardPattern = /^[A-Za-z0-9+/]*={0,2}$/;
  const urlSafePattern = /^[A-Za-z0-9\-_]*$/;
  
  const pattern = mode === 'url-safe' ? urlSafePattern : standardPattern;
  
  if (!pattern.test(input)) {
    return false;
  }
  
  // Additional validation: Check if length is valid for Base64
  // Base64 length should be divisible by 4 (after adding padding)
  if (mode === 'standard') {
    // For standard Base64, length must be divisible by 4
    if (input.length % 4 !== 0) {
      return false;
    }
  }
  
  // Try to decode to verify it's actually valid Base64
  try {
    const result = mode === 'url-safe' ? decodeUrlSafe(input) : decodeStandard(input);
    return result.isValid;
  } catch {
    return false;
  }
}

/**
 * Validates Base64 input and provides detailed error feedback
 * 
 * @param input - Base64 string to validate
 * @param mode - Base64 mode to validate against
 * @returns Validation result with detailed error message
 */
export function validateBase64Input(input: string, mode: Base64Mode = 'standard'): Base64Result {
  if (!input) {
    return { output: '', isValid: true };
  }
  
  if (!isValidInputSize(input)) {
    return {
      output: '',
      isValid: false,
      error: `Input is too large. Maximum size is ${(MAX_INPUT_SIZE / (1024 * 1024)).toFixed(1)}MB`,
    };
  }
  
  // Check for invalid characters with helpful feedback
  const standardPattern = /^[A-Za-z0-9+/]*={0,2}$/;
  const urlSafePattern = /^[A-Za-z0-9\-_]*$/;
  
  if (mode === 'standard') {
    if (!standardPattern.test(input)) {
      const invalidChars = input.match(/[^A-Za-z0-9+/=]/g);
      if (invalidChars) {
        const uniqueInvalid = [...new Set(invalidChars)].join(', ');
        return {
          output: '',
          isValid: false,
          error: `Invalid characters for Standard Base64: ${uniqueInvalid}. Expected: A-Z, a-z, 0-9, +, /, =`,
        };
      }
    }
    
    // Check padding placement
    const paddingIndex = input.indexOf('=');
    if (paddingIndex !== -1 && paddingIndex < input.length - 2) {
      return {
        output: '',
        isValid: false,
        error: 'Invalid padding: = characters must only appear at the end',
      };
    }
    
    // Check length
    if (input.length % 4 !== 0) {
      return {
        output: '',
        isValid: false,
        error: `Invalid length: Standard Base64 length must be divisible by 4 (current: ${input.length})`,
      };
    }
  } else {
    if (!urlSafePattern.test(input)) {
      const invalidChars = input.match(/[^A-Za-z0-9\-_]/g);
      if (invalidChars) {
        const uniqueInvalid = [...new Set(invalidChars)].join(', ');
        return {
          output: '',
          isValid: false,
          error: `Invalid characters for URL-Safe Base64: ${uniqueInvalid}. Expected: A-Z, a-z, 0-9, -, _`,
        };
      }
    }
  }
  
  return { output: input, isValid: true };
}

/**
 * Encodes data based on mode
 * 
 * @param input - Raw text to encode
 * @param mode - Encoding mode (standard or url-safe)
 * @returns Base64Result with encoded output or error
 */
export function encode(input: string, mode: Base64Mode): Base64Result {
  return mode === 'url-safe' ? encodeUrlSafe(input) : encodeStandard(input);
}

/**
 * Decodes data based on mode
 * 
 * @param input - Base64 string to decode
 * @param mode - Decoding mode (standard or url-safe)
 * @returns Base64Result with decoded output or error
 */
export function decode(input: string, mode: Base64Mode): Base64Result {
  return mode === 'url-safe' ? decodeUrlSafe(input) : decodeStandard(input);
}
