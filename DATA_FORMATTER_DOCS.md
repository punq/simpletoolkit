# Data Formatter & Validator Feature Documentation

## Overview

The Data Formatter & Validator is a powerful tool for formatting, validating, and converting between JSON, YAML, and XML formats. All processing happens 100% client-side with instant results.

## Features

### ✨ Core Capabilities

1. **Format & Validate**
   - Real-time syntax validation
   - Auto-formatting with proper indentation
   - Detailed error reporting with line/column numbers
   - Syntax highlighting with color-coded tokens

2. **Format Conversion**
   - JSON ↔ YAML ↔ XML
   - Preserves data structure during conversion
   - Handles nested objects and arrays
   - Supports complex data types

3. **Minification**
   - Remove unnecessary whitespace
   - Reduce file size for all formats
   - Preserves data integrity

4. **Auto-Detection**
   - Automatically detects input format
   - Smart format inference based on content
   - Can be toggled on/off

5. **Output Actions**
   - Copy to clipboard
   - Download as file
   - Live preview with syntax highlighting

### ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Format or Convert
- `Ctrl/Cmd + M` - Minify
- `Ctrl/Cmd + K` - Clear input

### 🎨 User Interface

#### Split-Panel Design
- **Left Panel**: Raw input with textarea
- **Right Panel**: Formatted output with syntax highlighting
- **Controls**: Format selection, mode toggle, action buttons

#### Format Selection
- Radio buttons for JSON, YAML, XML
- Auto-detect checkbox
- Visual indicators for active format

#### Operation Modes
- **Format & Validate**: Beautify and validate single format
- **Convert Format**: Transform between different formats

## Technical Implementation

### Architecture

```
DataFormatterValidator.tsx (870 lines)
├── State Management
│   ├── input/output state
│   ├── format selection (source/target)
│   ├── validation results
│   ├── processing state
│   └── success feedback
├── Event Handlers
│   ├── handleFormat()
│   ├── handleConvert()
│   ├── handleMinify()
│   ├── handleCopyOutput()
│   └── handleDownloadOutput()
└── UI Components
    ├── Format selection controls
    ├── Mode toggle buttons
    ├── Input/output panels
    ├── Error display
    └── Success messages

dataFormatterUtils.ts (942 lines)
├── JSON Processing
│   ├── validateAndFormatJSON()
│   ├── minifyJSON()
│   └── Native JSON.parse/stringify
├── YAML Processing
│   ├── validateAndFormatYAML()
│   ├── minifyYAML()
│   ├── parseYAML() - Custom parser
│   └── stringifyYAML() - Custom serializer
├── XML Processing
│   ├── formatXML()
│   ├── minifyXML()
│   ├── validateXML() - DOMParser
│   └── xmlToJSON() / jsonToXML()
├── Conversion
│   ├── convertData()
│   └── Cross-format conversion logic
├── Utilities
│   ├── detectFormat()
│   ├── highlightSyntax()
│   ├── sanitizeInput()
│   └── isValidInputSize()
└── Constants
    └── MAX_INPUT_SIZE = 10MB
```

### Performance Optimizations

1. **Native APIs**
   - JSON: V8-optimized `JSON.parse()` / `JSON.stringify()`
   - XML: Browser-native `DOMParser` / `XMLSerializer`
   - YAML: Lightweight custom parser (no dependencies)

2. **React Optimizations**
   - `useMemo` for computed values (detected format, input size check)
   - `useCallback` for stable function references
   - `requestIdleCallback` for non-blocking operations
   - Debounced validation for large inputs

3. **Memory Management**
   - Input size limit (10MB)
   - Efficient string manipulation
   - Proper cleanup in useEffect hooks

### Security Measures

1. **Input Sanitization**
   - `sanitizeInput()` function truncates to MAX_INPUT_SIZE
   - XSS prevention in output rendering
   - No `eval()` or `innerHTML` usage

2. **Validation**
   - Try-catch blocks around all parsing operations
   - Detailed error messages without exposing internals
   - Graceful degradation for invalid input

3. **Privacy**
   - Zero network requests
   - No external dependencies for parsing
   - All processing in browser memory

## Testing

### Test Coverage

**Component Tests** (`DataFormatterValidator.test.tsx` - 35 tests):
- Initial render and default state
- User input handling
- Format selection and auto-detection
- Format & validate mode operations
- Convert format mode operations
- Output actions (copy, download)
- Keyboard shortcuts
- Minify functionality
- Error handling
- Accessibility features
- Success message integration
- UI state management
- Analytics tracking

**Utility Tests** (`dataFormatterUtils.test.ts` - extensive coverage):
- JSON validation and formatting
- YAML validation and formatting
- XML validation and formatting
- Format conversion (all combinations)
- Minification for all formats
- Syntax highlighting
- Format detection
- Input size validation
- Edge cases and error handling

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- DataFormatterValidator

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Accessibility

### WCAG 2.1 AA Compliance

1. **Keyboard Navigation**
   - All controls accessible via keyboard
   - Logical tab order
   - Keyboard shortcuts for common actions
   - Focus indicators on all interactive elements

2. **Screen Reader Support**
   - ARIA labels on all inputs and buttons
   - `role="alert"` for error messages
   - `aria-live="assertive"` for validation feedback
   - `aria-pressed` states on toggle buttons
   - `aria-busy` during processing

3. **Visual Design**
   - High contrast color scheme
   - Clear focus indicators
   - Readable font sizes
   - Color not sole indicator of state

## Usage Examples

### Format JSON
```javascript
// Input (minified)
{"users":[{"id":1,"name":"John"}]}

// Output (formatted)
{
  "users": [
    {
      "id": 1,
      "name": "John"
    }
  ]
}
```

### Convert JSON to YAML
```javascript
// Input (JSON)
{
  "name": "John",
  "age": 30
}

// Output (YAML)
name: John
age: 30
```

### Validate XML
```xml
<!-- Input (invalid) -->
<root>
  <item>Missing closing tag
</root>

<!-- Error Report -->
Invalid XML: Opening and ending tag mismatch: item line 2 and root
Location: Line 3, Column 8
```

## Future Enhancements

Potential features for future versions:

1. **Additional Formats**
   - TOML support
   - CSV/TSV conversion
   - Properties files

2. **Advanced Features**
   - JSON Schema validation
   - XPath/JSONPath queries
   - Find/replace functionality
   - Diff comparison

3. **Editor Improvements**
   - Line numbers in input
   - Code folding
   - Bracket matching
   - Multi-cursor editing

4. **Export Options**
   - Batch processing
   - Custom indentation settings
   - Format-specific options

## Contributing

When adding features to the Data Formatter:

1. **Maintain Client-Side Processing**
   - No network requests
   - Use native APIs when possible
   - Keep bundle size minimal

2. **Write Tests**
   - Add component tests for UI features
   - Add utility tests for data processing
   - Maintain 100% test pass rate

3. **Follow Patterns**
   - Use TypeScript strict mode
   - Add JSDoc comments
   - Handle errors gracefully
   - Maintain accessibility

4. **Document Changes**
   - Update this file
   - Add to CHANGELOG.md
   - Update README.md if needed

## Resources

- [JSON Specification](https://www.json.org/)
- [YAML Specification](https://yaml.org/spec/)
- [XML Specification](https://www.w3.org/TR/xml/)
- [MDN: DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
- [MDN: JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
