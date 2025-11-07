# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the current version.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please do the following:

1. **DO NOT** open a public issue
2. Email security details to the project maintainers (create a private security advisory on GitHub)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge your email within 48 hours and provide a detailed response within 7 days.

## Security Considerations

### Client-Side Processing

This application processes PDFs entirely in the browser using `pdf-lib`. No files are uploaded to servers.

### Current Security Measures

1. **Content Security Policy (CSP)**: Strict CSP headers prevent XSS attacks
2. **Input Validation**: All file inputs are validated (type, size)
3. **Filename Sanitization**: Filenames are sanitized before download
4. **No Eval**: No `eval()`, `innerHTML`, or unsafe dynamic code execution
5. **HTTPS Only**: Strict Transport Security enforced
6. **No Cookies**: Session storage only for non-sensitive operation counts
7. **Dependency Scanning**: Regular `npm audit` checks
8. **TypeScript Strict Mode**: Catches type-related bugs at compile time

### Known Limitations

1. **Browser Memory**: Very large PDFs (>100MB) may cause browser memory issues
2. **Encrypted PDFs**: Password-protected PDFs cannot be processed client-side
3. **Malformed PDFs**: Corrupted PDFs may cause unexpected behavior

### Safe Usage Recommendations

- Keep your browser updated
- Only process PDFs from trusted sources
- Don't process sensitive documents on shared/public computers
- Clear browser cache after processing sensitive files

## Dependencies

We minimize dependencies and regularly update them:
- `next` - React framework
- `react` - UI library
- `pdf-lib` - Client-side PDF manipulation
- Development dependencies only for building/testing

Run `npm audit` to check for vulnerabilities.

## Privacy

All processing happens locally. We do not:
- Upload files to servers
- Store files in databases
- Access file contents server-side
- Track file metadata

Optional analytics (Plausible) only track page views and events, never file data.
