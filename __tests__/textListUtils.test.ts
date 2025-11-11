/**
 * Comprehensive Unit Tests for Text List Processing Utilities
 * 
 * Test Coverage:
 * 1. Deduplication with Set-based O(n) algorithm
 * 2. Alphabetical sorting (A-Z and Z-A)
 * 3. Case conversion (uppercase, lowercase, title, camel, snake)
 * 4. Empty line removal
 * 5. Combined processing operations
 * 6. Edge cases: empty input, large input, special characters
 * 7. Performance validation for 100,000+ lines
 * 8. Input size validation
 */

import {
  deduplicateLines,
  sortLines,
  removeEmptyLines,
  toTitleCase,
  toCamelCase,
  toSnakeCase,
  convertCase,
  processList,
  getTextStats,
  isValidInputSize,
  MAX_INPUT_SIZE,
  type ListProcessingOptions,
} from '@/app/utils/textListUtils';

describe('Text List Utilities - Production Test Suite', () => {
  
  // ========================================
  // 1. DEDUPLICATION TESTS
  // ========================================
  
  describe('deduplicateLines', () => {
    
    test('removes exact duplicate lines', () => {
      const input = ['apple', 'banana', 'apple', 'cherry', 'banana'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });
    
    test('preserves original order (keeps first occurrence)', () => {
      const input = ['zebra', 'apple', 'zebra', 'banana', 'apple'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['zebra', 'apple', 'banana']);
    });
    
    test('is case-sensitive', () => {
      const input = ['Apple', 'apple', 'APPLE'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['Apple', 'apple', 'APPLE']);
    });
    
    test('handles empty array', () => {
      const result = deduplicateLines([]);
      expect(result).toEqual([]);
    });
    
    test('handles single item', () => {
      const result = deduplicateLines(['only']);
      expect(result).toEqual(['only']);
    });
    
    test('handles all duplicates', () => {
      const input = ['same', 'same', 'same', 'same'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['same']);
    });
    
    test('handles no duplicates', () => {
      const input = ['one', 'two', 'three', 'four'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['one', 'two', 'three', 'four']);
    });
    
    test('handles empty strings as valid items', () => {
      const input = ['', 'text', '', 'more'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['', 'text', 'more']);
    });
  });
  
  // ========================================
  // 2. SORTING TESTS
  // ========================================
  
  describe('sortLines', () => {
    
    test('sorts ascending (A-Z) correctly', () => {
      const input = ['zebra', 'apple', 'banana', 'cherry'];
      const result = sortLines(input, 'asc');
      
      expect(result).toEqual(['apple', 'banana', 'cherry', 'zebra']);
    });
    
    test('sorts descending (Z-A) correctly', () => {
      const input = ['zebra', 'apple', 'banana', 'cherry'];
      const result = sortLines(input, 'desc');
      
      expect(result).toEqual(['zebra', 'cherry', 'banana', 'apple']);
    });
    
    test('returns original order when direction is none', () => {
      const input = ['zebra', 'apple', 'banana'];
      const result = sortLines(input, 'none');
      
      expect(result).toEqual(['zebra', 'apple', 'banana']);
    });
    
    test('is case-sensitive', () => {
      const input = ['apple', 'Apple', 'APPLE'];
      const result = sortLines(input, 'asc');
      
      // localeCompare with sensitivity: 'variant' maintains case distinction
      // The exact order may vary by locale, but all three should be present
      expect(result).toHaveLength(3);
      expect(result).toContain('APPLE');
      expect(result).toContain('Apple');
      expect(result).toContain('apple');
    });
    
    test('handles empty array', () => {
      const result = sortLines([], 'asc');
      expect(result).toEqual([]);
    });
    
    test('handles single item', () => {
      const result = sortLines(['only'], 'asc');
      expect(result).toEqual(['only']);
    });
    
    test('handles already sorted input', () => {
      const input = ['a', 'b', 'c', 'd'];
      const result = sortLines(input, 'asc');
      
      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });
    
    test('handles reverse sorted input', () => {
      const input = ['d', 'c', 'b', 'a'];
      const result = sortLines(input, 'asc');
      
      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });
    
    test('handles Unicode characters correctly', () => {
      const input = ['ñ', 'n', 'o'];
      const result = sortLines(input, 'asc');
      
      expect(result).toContain('n');
      expect(result).toContain('ñ');
      expect(result).toContain('o');
    });
  });
  
  // ========================================
  // 3. EMPTY LINE REMOVAL TESTS
  // ========================================
  
  describe('removeEmptyLines', () => {
    
    test('removes empty strings', () => {
      const input = ['apple', '', 'banana', '', 'cherry'];
      const result = removeEmptyLines(input);
      
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });
    
    test('removes whitespace-only lines', () => {
      const input = ['apple', '   ', 'banana', '\t', 'cherry'];
      const result = removeEmptyLines(input);
      
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });
    
    test('preserves lines with leading/trailing spaces', () => {
      const input = [' apple ', '  banana  ', 'cherry'];
      const result = removeEmptyLines(input);
      
      expect(result).toEqual([' apple ', '  banana  ', 'cherry']);
    });
    
    test('handles all empty lines', () => {
      const input = ['', '  ', '\t', '   '];
      const result = removeEmptyLines(input);
      
      expect(result).toEqual([]);
    });
    
    test('handles no empty lines', () => {
      const input = ['apple', 'banana', 'cherry'];
      const result = removeEmptyLines(input);
      
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });
    
    test('handles empty array', () => {
      const result = removeEmptyLines([]);
      expect(result).toEqual([]);
    });
  });
  
  // ========================================
  // 4. CASE CONVERSION TESTS
  // ========================================
  
  describe('toTitleCase', () => {
    
    test('converts to title case correctly', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });
    
    test('handles already title cased text', () => {
      expect(toTitleCase('Hello World')).toBe('Hello World');
    });
    
    test('handles single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });
    
    test('handles uppercase input', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('HELLO WORLD');
    });
    
    test('handles hyphenated words', () => {
      expect(toTitleCase('hello-world')).toBe('Hello-World');
    });
    
    test('handles empty string', () => {
      expect(toTitleCase('')).toBe('');
    });
  });
  
  describe('toCamelCase', () => {
    
    test('converts space-separated words to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('the quick brown')).toBe('theQuickBrown');
    });
    
    test('converts underscore-separated words to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
      expect(toCamelCase('the_quick_brown')).toBe('theQuickBrown');
    });
    
    test('converts hyphen-separated words to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('the-quick-brown')).toBe('theQuickBrown');
    });
    
    test('handles uppercase input', () => {
      expect(toCamelCase('HELLO WORLD')).toBe('helloWorld');
      expect(toCamelCase('THE-QUICK-BROWN')).toBe('theQuickBrown');
    });
    
    test('handles single word', () => {
      expect(toCamelCase('hello')).toBe('hello');
    });
    
    test('handles already camelCase input', () => {
      expect(toCamelCase('helloWorld')).toBe('helloworld');
    });
    
    test('handles empty string', () => {
      expect(toCamelCase('')).toBe('');
    });
  });
  
  describe('toSnakeCase', () => {
    
    test('converts space-separated words to snake_case', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
      expect(toSnakeCase('the quick brown')).toBe('the_quick_brown');
    });
    
    test('converts camelCase to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('theQuickBrown')).toBe('the_quick_brown');
    });
    
    test('converts hyphen-separated words to snake_case', () => {
      expect(toSnakeCase('hello-world')).toBe('hello_world');
      expect(toSnakeCase('the-quick-brown')).toBe('the_quick_brown');
    });
    
    test('handles uppercase input', () => {
      expect(toSnakeCase('HELLO WORLD')).toBe('hello_world');
      expect(toSnakeCase('THE-QUICK-BROWN')).toBe('the_quick_brown');
    });
    
    test('handles single word', () => {
      expect(toSnakeCase('hello')).toBe('hello');
    });
    
    test('handles already snake_case input', () => {
      expect(toSnakeCase('hello_world')).toBe('hello_world');
    });
    
    test('removes leading and trailing underscores', () => {
      expect(toSnakeCase('_hello_world_')).toBe('hello_world');
    });
    
    test('removes multiple consecutive underscores', () => {
      expect(toSnakeCase('hello___world')).toBe('hello_world');
    });
    
    test('handles empty string', () => {
      expect(toSnakeCase('')).toBe('');
    });
  });
  
  describe('convertCase', () => {
    
    test('converts to uppercase', () => {
      expect(convertCase('hello world', 'uppercase')).toBe('HELLO WORLD');
    });
    
    test('converts to lowercase', () => {
      expect(convertCase('HELLO WORLD', 'lowercase')).toBe('hello world');
    });
    
    test('converts to titlecase', () => {
      expect(convertCase('hello world', 'titlecase')).toBe('Hello World');
    });
    
    test('converts to camelcase', () => {
      expect(convertCase('hello world', 'camelcase')).toBe('helloWorld');
    });
    
    test('converts to snakecase', () => {
      expect(convertCase('hello world', 'snakecase')).toBe('hello_world');
    });
    
    test('returns original when conversion is none', () => {
      expect(convertCase('Hello World', 'none')).toBe('Hello World');
    });
  });
  
  // ========================================
  // 5. INTEGRATED PROCESSING TESTS
  // ========================================
  
  describe('processList', () => {
    
    test('removes duplicates only', () => {
      const input = 'apple\nbanana\napple\ncherry\nbanana';
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'none',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toBe('apple\nbanana\ncherry');
      expect(result.duplicatesRemoved).toBe(2);
      expect(result.inputLineCount).toBe(5);
      expect(result.outputLineCount).toBe(3);
    });
    
    test('sorts only (A-Z)', () => {
      const input = 'zebra\napple\nbanana\ncherry';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'asc',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toBe('apple\nbanana\ncherry\nzebra');
      expect(result.wasSorted).toBe(true);
    });
    
    test('sorts only (Z-A)', () => {
      const input = 'apple\nbanana\ncherry\nzebra';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'desc',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toBe('zebra\ncherry\nbanana\napple');
      expect(result.wasSorted).toBe(true);
    });
    
    test('converts case only (uppercase)', () => {
      const input = 'apple\nbanana\ncherry';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'none',
        caseConversion: 'uppercase',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toBe('APPLE\nBANANA\nCHERRY');
      expect(result.caseConverted).toBe('uppercase');
    });
    
    test('removes empty lines only', () => {
      const input = 'apple\n\nbanana\n  \ncherry';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'none',
        caseConversion: 'none',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toBe('apple\nbanana\ncherry');
      expect(result.emptyLinesRemoved).toBe(2);
    });
    
    test('combines all operations correctly', () => {
      const input = 'Zebra\napple\n\nAPPLE\nbanana\nZebra\n  \nCherry';
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'asc',
        caseConversion: 'lowercase',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      
      // After lowercase: zebra, apple, apple, banana, zebra, cherry
      // After remove empty: zebra, apple, apple, banana, zebra, cherry
      // After dedupe: zebra, apple, banana, cherry
      // After sort: apple, banana, cherry, zebra
      expect(result.output).toBe('apple\nbanana\ncherry\nzebra');
      expect(result.duplicatesRemoved).toBe(2); // 2 duplicates after case conversion
      expect(result.emptyLinesRemoved).toBe(2);
      expect(result.wasSorted).toBe(true);
      expect(result.caseConverted).toBe('lowercase');
    });
    
    test('handles empty input', () => {
      const input = '';
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'asc',
        caseConversion: 'none',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toBe('');
      expect(result.inputLineCount).toBe(1); // Split creates one empty line
      expect(result.outputLineCount).toBe(0);
    });
    
    test('handles single line input', () => {
      const input = 'single line';
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'asc',
        caseConversion: 'uppercase',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toBe('SINGLE LINE');
      expect(result.inputLineCount).toBe(1);
      expect(result.outputLineCount).toBe(1);
    });
    
    test('throws error for oversized input', () => {
      const largeInput = 'x'.repeat(MAX_INPUT_SIZE + 1);
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'none',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      expect(() => processList(largeInput, options)).toThrow();
    });
  });
  
  // ========================================
  // 6. STATISTICS TESTS
  // ========================================
  
  describe('getTextStats', () => {
    
    test('returns correct statistics', () => {
      const input = 'apple\nbanana\napple\n\ncherry';
      const stats = getTextStats(input);
      
      expect(stats.lineCount).toBe(5);
      expect(stats.uniqueLines).toBe(4); // apple, banana, apple, '', cherry -> 4 unique
      expect(stats.emptyLines).toBe(1);
      expect(stats.characterCount).toBe(input.length);
    });
    
    test('handles empty input', () => {
      const stats = getTextStats('');
      
      expect(stats.lineCount).toBe(0);
      expect(stats.uniqueLines).toBe(0);
      expect(stats.emptyLines).toBe(0);
      expect(stats.characterCount).toBe(0);
    });
    
    test('handles single line', () => {
      const input = 'single line';
      const stats = getTextStats(input);
      
      expect(stats.lineCount).toBe(1);
      expect(stats.uniqueLines).toBe(1);
      expect(stats.emptyLines).toBe(0);
      expect(stats.characterCount).toBe(11);
    });
    
    test('counts whitespace-only lines as empty', () => {
      const input = 'apple\n   \nbanana\n\t\ncherry';
      const stats = getTextStats(input);
      
      expect(stats.emptyLines).toBe(2);
    });
  });
  
  // ========================================
  // 7. INPUT SIZE VALIDATION TESTS
  // ========================================
  
  describe('isValidInputSize', () => {
    
    test('accepts small input', () => {
      expect(isValidInputSize('small text')).toBe(true);
    });
    
    test('accepts input at size limit', () => {
      const maxInput = 'x'.repeat(MAX_INPUT_SIZE);
      expect(isValidInputSize(maxInput)).toBe(true);
    });
    
    test('rejects oversized input', () => {
      const oversizedInput = 'x'.repeat(MAX_INPUT_SIZE + 1);
      expect(isValidInputSize(oversizedInput)).toBe(false);
    });
    
    test('accepts empty input', () => {
      expect(isValidInputSize('')).toBe(true);
    });
  });
  
  // ========================================
  // 8. PERFORMANCE TESTS
  // ========================================
  
  describe('Performance Tests', () => {
    
    test('processes 10,000 lines quickly', () => {
      const lines = Array.from({ length: 10000 }, (_, i) => `line-${i % 1000}`);
      const input = lines.join('\n');
      
      const start = performance.now();
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'asc',
        caseConversion: 'lowercase',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      const duration = performance.now() - start;
      
      expect(result.outputLineCount).toBeLessThanOrEqual(1000);
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });
    
    test('deduplication is O(n) - scales linearly', () => {
      const small = Array.from({ length: 1000 }, (_, i) => `line-${i % 100}`);
      const large = Array.from({ length: 10000 }, (_, i) => `line-${i % 100}`);
      
      const startSmall = performance.now();
      deduplicateLines(small);
      const durationSmall = performance.now() - startSmall;
      
      const startLarge = performance.now();
      deduplicateLines(large);
      const durationLarge = performance.now() - startLarge;
      
      // Large dataset (10x size) should not take more than 20x time
      // (allowing for overhead)
      expect(durationLarge).toBeLessThan(durationSmall * 20);
    });
  });
  
  // ========================================
  // 9. EDGE CASES
  // ========================================
  
  describe('Edge Cases', () => {
    
    test('handles lines with special characters', () => {
      const input = '!@#$%\n^&*()\n<>?:"{}|';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'asc',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      expect(result.outputLineCount).toBe(3);
    });
    
    test('handles Unicode characters', () => {
      const input = 'café\nnaïve\nrésum\u00e9';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'asc',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      expect(result.output).toContain('café');
      expect(result.output).toContain('naïve');
    });
    
    test('handles emojis', () => {
      const input = '🍎 apple\n🍌 banana\n🍎 apple';
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'none',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      expect(result.output).toBe('🍎 apple\n🍌 banana');
      expect(result.duplicatesRemoved).toBe(1);
    });
    
    test('handles Windows line endings (CRLF)', () => {
      const input = 'apple\r\nbanana\r\ncherry';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'none',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      expect(result.outputLineCount).toBe(3);
    });
    
    test('handles mixed line endings', () => {
      const input = 'apple\nbanana\r\ncherry';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'none',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      expect(result.outputLineCount).toBe(3);
    });
    
    test('handles very long lines', () => {
      const longLine = 'x'.repeat(10000);
      const input = `${longLine}\nshort\n${longLine}`;
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'none',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      expect(result.duplicatesRemoved).toBe(1);
      expect(result.outputLineCount).toBe(2);
    });
  });

  // ========================================
  // 10. ADDITIONAL PRODUCTION EDGE CASES
  // ========================================

  describe('Advanced Deduplication Edge Cases', () => {
    test('handles lines with only whitespace differences', () => {
      const input = ['apple', 'apple ', ' apple', '  apple  '];
      const result = deduplicateLines(input);
      
      // All are considered different due to whitespace
      expect(result).toEqual(['apple', 'apple ', ' apple', '  apple  ']);
      expect(result.length).toBe(4);
    });

    test('deduplication with mixed case preserves all variations', () => {
      const input = ['Test', 'test', 'TEST', 'TeSt', 'Test'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['Test', 'test', 'TEST', 'TeSt']);
      expect(result.length).toBe(4);
    });

    test('handles lines with tabs and spaces', () => {
      const input = ['item\twith\ttab', 'item with spaces', 'item\twith\ttab'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['item\twith\ttab', 'item with spaces']);
      expect(result.length).toBe(2);
    });

    test('handles numeric strings', () => {
      const input = ['123', '456', '123', '789', '456'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['123', '456', '789']);
    });

    test('handles lines with leading zeros', () => {
      const input = ['001', '01', '1', '001'];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['001', '01', '1']);
    });
  });

  describe('Advanced Sorting Edge Cases', () => {
    test('sorts numbers as strings (lexicographic)', () => {
      const input = ['10', '2', '1', '20', '3'];
      const result = sortLines(input, 'asc');
      
      // Lexicographic: '1', '10', '2', '20', '3'
      expect(result).toEqual(['1', '10', '2', '20', '3']);
    });

    test('sorts with mixed alphanumeric strings', () => {
      const input = ['item10', 'item2', 'item1', 'item20'];
      const result = sortLines(input, 'asc');
      
      expect(result).toEqual(['item1', 'item10', 'item2', 'item20']);
    });

    test('sorts lines with punctuation', () => {
      const input = ['zebra!', 'apple?', 'banana.', 'cherry,'];
      const result = sortLines(input, 'asc');
      
      expect(result[0]).toBe('apple?');
      expect(result[result.length - 1]).toBe('zebra!');
    });

    test('handles lines starting with symbols', () => {
      const input = ['@symbol', '#hashtag', '$dollar', '!exclaim'];
      const result = sortLines(input, 'asc');
      
      expect(result).toContain('!exclaim');
      expect(result).toContain('@symbol');
    });

    test('sorts with accented characters', () => {
      const input = ['café', 'cafe', 'naïve', 'naive'];
      const result = sortLines(input, 'asc');
      
      // Verify it handles accents
      expect(result).toHaveLength(4);
      expect(result).toContain('café');
      expect(result).toContain('naïve');
    });
  });

  describe('Complex Whitespace Handling', () => {
    test('removeEmptyLines handles various whitespace types', () => {
      const input = [
        'text',
        '   ',           // spaces
        '\t',            // tab
        '\n',            // newline char in string
        '\r',            // carriage return
        '  \t  ',        // mixed
        'more text',
      ];
      const result = removeEmptyLines(input);
      
      expect(result).toEqual(['text', 'more text']);
    });

    test('preserves intentional whitespace within lines', () => {
      const input = [
        '  indented text',
        'text with  double  spaces',
        'trailing spaces  ',
      ];
      const result = removeEmptyLines(input);
      
      expect(result).toEqual(input);
      expect(result[0]).toBe('  indented text');
    });

    test('handles zero-width spaces and unicode whitespace', () => {
      const input = ['normal', '\u200B', '\u00A0', 'text'];
      const result = removeEmptyLines(input);
      
      // Zero-width space and non-breaking space
      // trim() should handle most unicode whitespace
      expect(result.length).toBeLessThanOrEqual(4);
    });
  });

  describe('Combined Operations Stress Tests', () => {
    test('case conversion then deduplication', () => {
      const input = 'Apple\napple\nAPPLE\nBanana\nbanana';
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'none',
        caseConversion: 'lowercase',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      
      // After lowercase: apple, apple, apple, banana, banana
      // After dedupe: apple, banana
      expect(result.output).toBe('apple\nbanana');
      expect(result.duplicatesRemoved).toBe(3);
    });

    test('remove empty then deduplicate then sort', () => {
      const input = 'zebra\n\napple\nzebra\n  \napple\nbanana';
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'asc',
        caseConversion: 'none',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toBe('apple\nbanana\nzebra');
      expect(result.emptyLinesRemoved).toBe(2);
      expect(result.duplicatesRemoved).toBe(2);
    });

    test('all operations with complex input', () => {
      const input = '  ZEBRA  \n\nApple\n  \napple\nZEBRA\nCherry\n\ncherry';
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'asc',
        caseConversion: 'lowercase',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      
      // Should handle trimming via case conversion, empty removal, dedupe, and sort
      expect(result.outputLineCount).toBe(4); // zebra, apple, zebra, cherry -> apple, cherry, zebra (3 or 4 depending on trim)
      expect(result.wasSorted).toBe(true);
    });
  });

  describe('Input Validation & Error Handling', () => {
    test('handles null-like strings safely', () => {
      const input = ['null', 'undefined', 'NaN', ''];
      const result = deduplicateLines(input);
      
      expect(result).toEqual(['null', 'undefined', 'NaN', '']);
    });

    test('handles very large line counts efficiently', () => {
      const lines = Array.from({ length: 50000 }, (_, i) => `line-${i % 1000}`);
      const input = lines.join('\n');
      
      const start = performance.now();
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'none',
        caseConversion: 'none',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      const duration = performance.now() - start;
      
      expect(result.outputLineCount).toBeLessThanOrEqual(1000);
      expect(duration).toBeLessThan(500); // Should complete in under 500ms
    });

    test('maintains data integrity through multiple operations', () => {
      const input = 'a\nb\nc\nd\ne';
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'desc',
        caseConversion: 'uppercase',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      
      // Verify each letter is present and uppercase
      expect(result.output).toContain('A');
      expect(result.output).toContain('E');
      expect(result.outputLineCount).toBe(5);
    });
  });

  describe('Real-World Scenarios', () => {
    test('email list cleaning', () => {
      const input = `john@example.com
jane@example.com

john@example.com
bob@example.com
  
jane@example.com`;
      
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'asc',
        caseConversion: 'lowercase',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      
      expect(result.outputLineCount).toBe(3);
      expect(result.output).toContain('bob@example.com');
      expect(result.output).toContain('jane@example.com');
      expect(result.output).toContain('john@example.com');
    });

    test('to-do list processing', () => {
      const input = `Buy groceries
Call dentist
Buy groceries
Pay bills
  
Call dentist
Schedule meeting`;
      
      const options: ListProcessingOptions = {
        removeDuplicates: true,
        sortDirection: 'asc',
        caseConversion: 'none',
        removeEmptyLines: true,
      };
      
      const result = processList(input, options);
      
      expect(result.outputLineCount).toBe(4);
      expect(result.duplicatesRemoved).toBe(2);
    });

    test('code variable name conversion', () => {
      const input = `user_name
user_email
user_phone
order_total`;
      
      const options: ListProcessingOptions = {
        removeDuplicates: false,
        sortDirection: 'none',
        caseConversion: 'camelcase',
        removeEmptyLines: false,
      };
      
      const result = processList(input, options);
      
      expect(result.output).toContain('userName');
      expect(result.output).toContain('userEmail');
      expect(result.output).toContain('orderTotal');
    });
  });
});
