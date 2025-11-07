/**
 * Text List Utilities - Ultra-Performant List Processing Functions
 * 
 * High-performance, privacy-focused text list manipulation utilities
 * 
 * SECURITY & PRIVACY AUDIT:
 * ✅ ZERO NETWORK CALLS - No fetch(), XMLHttpRequest, or axios
 * ✅ NO external API calls - All processing uses native JavaScript
 * ✅ NO data transmission - Everything stays in the browser
 * ✅ Uses only: native String methods, Set, Array operations
 * 
 * Performance Characteristics:
 * - Deduplication: O(n) using Set data structure
 * - Sorting: O(n log n) using native Array.sort()
 * - Case conversion: O(n) with optimized string operations
 * - Empty line removal: O(n) with filter
 * - Can handle 100,000+ lines instantly
 * 
 * Features:
 * - Remove exact duplicate lines (case-sensitive)
 * - Sort alphabetically (A-Z or Z-A)
 * - Case conversion (UPPERCASE, lowercase, Title Case, camelCase, snake_case)
 * - Remove empty/whitespace-only lines
 * - Preserve original line ordering when not sorting
 * 
 * @module textListUtils
 */

// Maximum input size: 10MB
export const MAX_INPUT_SIZE = 10 * 1024 * 1024;

/**
 * Sort direction options
 */
export type SortDirection = 'asc' | 'desc' | 'none';

/**
 * Case conversion options
 */
export type CaseConversion = 
  | 'none' 
  | 'uppercase' 
  | 'lowercase' 
  | 'titlecase' 
  | 'camelcase' 
  | 'snakecase';

/**
 * List processing options
 */
export interface ListProcessingOptions {
  /** Remove duplicate lines (keeps first occurrence) */
  removeDuplicates: boolean;
  
  /** Sort direction (asc = A-Z, desc = Z-A, none = no sorting) */
  sortDirection: SortDirection;
  
  /** Case conversion to apply */
  caseConversion: CaseConversion;
  
  /** Remove empty and whitespace-only lines */
  removeEmptyLines: boolean;
}

/**
 * Result of list processing operation
 */
export interface ListProcessingResult {
  /** The processed output text */
  output: string;
  
  /** Number of lines in input */
  inputLineCount: number;
  
  /** Number of lines in output */
  outputLineCount: number;
  
  /** Number of duplicate lines removed */
  duplicatesRemoved: number;
  
  /** Number of empty lines removed */
  emptyLinesRemoved: number;
  
  /** Whether the output was sorted */
  wasSorted: boolean;
  
  /** Case conversion applied */
  caseConverted: CaseConversion;
}

/**
 * Validate input size
 * 
 * @param input - The text input to validate
 * @returns True if input is within size limits, false otherwise
 * 
 * @example
 * ```typescript
 * isValidInputSize("small text"); // true
 * isValidInputSize("x".repeat(11 * 1024 * 1024)); // false
 * ```
 */
export function isValidInputSize(input: string): boolean {
  const size = new Blob([input]).size;
  return size <= MAX_INPUT_SIZE;
}

/**
 * Remove duplicate lines from text, preserving order
 * 
 * Uses Set data structure for O(n) performance.
 * Case-sensitive comparison - "Hello" and "hello" are different.
 * Keeps the first occurrence of each unique line.
 * 
 * @param lines - Array of text lines
 * @returns Array of unique lines in original order
 * 
 * @example
 * ```typescript
 * deduplicateLines(["apple", "banana", "apple", "cherry"]);
 * // Returns: ["apple", "banana", "cherry"]
 * ```
 */
export function deduplicateLines(lines: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      result.push(line);
    }
  }
  
  return result;
}

/**
 * Sort lines alphabetically
 * 
 * Uses native Array.sort() with localeCompare for proper Unicode handling.
 * Performs case-sensitive sorting by default.
 * 
 * @param lines - Array of text lines
 * @param direction - Sort direction ('asc' = A-Z, 'desc' = Z-A)
 * @returns Sorted array of lines
 * 
 * @example
 * ```typescript
 * sortLines(["Zebra", "Apple", "banana"], 'asc');
 * // Returns: ["Apple", "Zebra", "banana"]
 * 
 * sortLines(["Zebra", "Apple", "banana"], 'desc');
 * // Returns: ["banana", "Zebra", "Apple"]
 * ```
 */
export function sortLines(lines: string[], direction: SortDirection): string[] {
  if (direction === 'none') {
    return lines;
  }
  
  const sorted = [...lines].sort((a, b) => {
    return a.localeCompare(b, undefined, { sensitivity: 'variant' });
  });
  
  return direction === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Remove empty and whitespace-only lines
 * 
 * Removes lines that are empty or contain only whitespace characters.
 * Uses optimized filter with trim() check.
 * 
 * @param lines - Array of text lines
 * @returns Array of lines with empty lines removed
 * 
 * @example
 * ```typescript
 * removeEmptyLines(["apple", "  ", "banana", "", "cherry"]);
 * // Returns: ["apple", "banana", "cherry"]
 * ```
 */
export function removeEmptyLines(lines: string[]): string[] {
  return lines.filter(line => line.trim().length > 0);
}

/**
 * Convert string to Title Case
 * 
 * Capitalizes the first letter of each word.
 * Handles multiple spaces and special characters correctly.
 * 
 * @param str - Input string
 * @returns Title cased string
 * 
 * @example
 * ```typescript
 * toTitleCase("hello world"); // "Hello World"
 * toTitleCase("the-quick-brown-fox"); // "The-Quick-Brown-Fox"
 * ```
 */
export function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Convert string to camelCase
 * 
 * First word lowercase, subsequent words capitalized, no spaces/underscores.
 * Handles spaces, hyphens, underscores as word separators.
 * 
 * @param str - Input string
 * @returns camelCase string
 * 
 * @example
 * ```typescript
 * toCamelCase("hello world"); // "helloWorld"
 * toCamelCase("the_quick_brown"); // "theQuickBrown"
 * toCamelCase("THE-QUICK-BROWN"); // "theQuickBrown"
 * ```
 */
export function toCamelCase(str: string): string {
  const words = str
    .replace(/[_-]/g, ' ')
    .trim()
    .split(/\s+/);
  
  if (words.length === 0) return '';
  
  const first = words[0].toLowerCase();
  const rest = words.slice(1).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  
  return first + rest.join('');
}

/**
 * Convert string to snake_case
 * 
 * All lowercase with underscores between words.
 * Handles spaces, hyphens, and camelCase as word separators.
 * 
 * @param str - Input string
 * @returns snake_case string
 * 
 * @example
 * ```typescript
 * toSnakeCase("hello world"); // "hello_world"
 * toSnakeCase("helloWorld"); // "hello_world"
 * toSnakeCase("THE-QUICK-BROWN"); // "the_quick_brown"
 * ```
 */
export function toSnakeCase(str: string): string {
  return str
    // Handle camelCase: insert space before capitals
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace spaces and hyphens with underscores
    .replace(/[\s-]+/g, '_')
    // Convert to lowercase
    .toLowerCase()
    // Remove multiple consecutive underscores
    .replace(/_+/g, '_')
    // Remove leading/trailing underscores
    .replace(/^_+|_+$/g, '');
}

/**
 * Apply case conversion to a string
 * 
 * @param str - Input string
 * @param conversion - Case conversion type
 * @returns Converted string
 * 
 * @example
 * ```typescript
 * convertCase("hello world", 'uppercase'); // "HELLO WORLD"
 * convertCase("HELLO WORLD", 'lowercase'); // "hello world"
 * convertCase("hello world", 'titlecase'); // "Hello World"
 * convertCase("hello world", 'camelcase'); // "helloWorld"
 * convertCase("hello world", 'snakecase'); // "hello_world"
 * ```
 */
export function convertCase(str: string, conversion: CaseConversion): string {
  switch (conversion) {
    case 'uppercase':
      return str.toUpperCase();
    case 'lowercase':
      return str.toLowerCase();
    case 'titlecase':
      return toTitleCase(str);
    case 'camelcase':
      return toCamelCase(str);
    case 'snakecase':
      return toSnakeCase(str);
    case 'none':
    default:
      return str;
  }
}

/**
 * Process a list of text lines with specified transformations
 * 
 * Applies transformations in optimal order:
 * 1. Case conversion (if any)
 * 2. Remove empty lines (if enabled)
 * 3. Remove duplicates (if enabled)
 * 4. Sort (if enabled)
 * 
 * This order ensures:
 * - Case conversion happens first so deduplication works correctly
 * - Empty line removal happens before deduplication for efficiency
 * - Sorting happens last to get final alphabetical order
 * 
 * @param input - Multi-line text input
 * @param options - Processing options
 * @returns Processing result with statistics
 * 
 * @example
 * ```typescript
 * const result = processList("apple\nbanana\napple\n\ncherry", {
 *   removeDuplicates: true,
 *   sortDirection: 'asc',
 *   caseConversion: 'lowercase',
 *   removeEmptyLines: true
 * });
 * // result.output: "apple\nbanana\ncherry"
 * // result.duplicatesRemoved: 1
 * // result.emptyLinesRemoved: 1
 * ```
 */
export function processList(
  input: string,
  options: ListProcessingOptions
): ListProcessingResult {
  // Validate input size
  if (!isValidInputSize(input)) {
    throw new Error(`Input exceeds maximum size of ${MAX_INPUT_SIZE / (1024 * 1024)}MB`);
  }
  
  // Split input into lines
  let lines = input.split(/\r?\n/);
  const inputLineCount = lines.length;
  
  // Track statistics
  let duplicatesRemoved = 0;
  let emptyLinesRemoved = 0;
  
  // Step 1: Apply case conversion
  if (options.caseConversion !== 'none') {
    lines = lines.map(line => convertCase(line, options.caseConversion));
  }
  
  // Step 2: Remove empty lines
  if (options.removeEmptyLines) {
    const beforeCount = lines.length;
    lines = removeEmptyLines(lines);
    emptyLinesRemoved = beforeCount - lines.length;
  }
  
  // Step 3: Remove duplicates
  if (options.removeDuplicates) {
    const beforeCount = lines.length;
    lines = deduplicateLines(lines);
    duplicatesRemoved = beforeCount - lines.length;
  }
  
  // Step 4: Sort
  const wasSorted = options.sortDirection !== 'none';
  if (wasSorted) {
    lines = sortLines(lines, options.sortDirection);
  }
  
  // Generate output
  const output = lines.join('\n');
  const outputLineCount = lines.length;
  
  return {
    output,
    inputLineCount,
    outputLineCount,
    duplicatesRemoved,
    emptyLinesRemoved,
    wasSorted,
    caseConverted: options.caseConversion,
  };
}

/**
 * Get statistics for text input without processing
 * 
 * @param input - Multi-line text input
 * @returns Basic statistics about the input
 * 
 * @example
 * ```typescript
 * getTextStats("apple\nbanana\napple\n\ncherry");
 * // Returns: { lineCount: 5, uniqueLines: 4, emptyLines: 1 }
 * ```
 */
export function getTextStats(input: string): {
  lineCount: number;
  uniqueLines: number;
  emptyLines: number;
  characterCount: number;
} {
  if (!input) {
    return {
      lineCount: 0,
      uniqueLines: 0,
      emptyLines: 0,
      characterCount: 0,
    };
  }
  
  const lines = input.split(/\r?\n/);
  const uniqueSet = new Set(lines);
  const emptyCount = lines.filter(line => line.trim().length === 0).length;
  
  return {
    lineCount: lines.length,
    uniqueLines: uniqueSet.size,
    emptyLines: emptyCount,
    characterCount: input.length,
  };
}
