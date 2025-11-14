
# Simple Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Privacy-first, browser-based tools for PDFs, images, and data. All processing happens locally—your files never leave your device.

**Live Demo:** [simpletoolkit.app](https://simpletoolkit.app)

## Features

- 100% Private: All processing happens in your browser using WebAssembly and native browser APIs
- Fast & Responsive: No server uploads or processing delays
- Free Forever: No ads, no watermarks, no premium tiers
- Simple UX: Clean, intuitive interface
- Accessible: Full keyboard navigation and ARIA support

### Available Tools

#### PDF Tools
- Merge PDF: Combine multiple PDFs with drag-and-drop reordering
- Split PDF: Extract pages, ranges, or split into individual files
- Rearrange PDF: Reorder and rotate pages visually
- Compress PDF: Reduce file size with adjustable compression levels
- Redact PDF: Securely redact sensitive content with visual black boxes and text removal
- PDF Text Extractor: Extract text from PDF files locally

#### Image Tools
- EXIF Stripper: Remove metadata (EXIF, GPS, camera info) from JPEG and PNG images
- Image Converter: Convert images between formats (JPEG, PNG, WebP, etc.)

#### Data Tools
- Data Formatter & Validator: Format, validate, and convert JSON, YAML, and XML with real-time syntax highlighting, error reporting, and cross-format conversion
- Base64 Encoder/Decoder: Encode and decode Base64 and Base64URL data
- JWT Utility: Decode and inspect JWT tokens locally
- Text List Utility: Format, deduplicate, and sort lists of text

## Why Open Source?

This project is open source for transparency and trust. Our code is public so you can:

- Verify privacy claims: See for yourself that files never leave your browser
- Audit security: Review our code for vulnerabilities or security issues
- Trust the process: Understand exactly how your data is handled
- Learn from implementation: See how client-side PDF/image/data processing works

**We encourage using the live app at [simpletoolkit.app](https://simpletoolkit.app)** rather than self-hosting or forking. The source code is here for verification, not replication.

## Local Development (For Verification)

To verify the code runs as described:

```powershell
npm install   # Automatically copies PDF.js worker via postinstall script
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** The `npm install` command automatically copies the PDF.js worker file needed for the PDF Redactor tool. If you encounter rendering issues, run `node scripts/copy-pdf-worker.js` to manually copy the worker.

## Project Structure

```
app/
  components/           # Shared React components for all tools
    MergeTool.tsx              # PDF merge functionality
    SplitTool.tsx              # PDF split functionality
    RearrangeTool.tsx          # PDF rearrange functionality
    CompressTool.tsx           # PDF compression functionality
    PDFRedactor.tsx            # PDF redaction functionality
    ExifStripperTool.tsx       # Image EXIF metadata removal
    ImageConverterTool.tsx     # Image format conversion
    DataFormatterValidator.tsx # JSON/YAML/XML formatter & validator
    Base64UrlEncoder.tsx       # Base64 encoder/decoder
    JwtUtility.tsx             # JWT decoder/inspector
    TextListUtility.tsx        # Text list formatter
    PdfTextExtractor.tsx       # PDF text extraction
    ErrorBoundary.tsx          # Error handling wrapper
    SuccessMessage.tsx         # Operation completion UI
    Loading.tsx                # Progress/loading indicator
    Toast.tsx                  # Notification system
    Footer.tsx, Header.tsx     # Layout/navigation
  utils/                # Utility modules
    pdfUtils.ts               # PDF processing helpers
    imageUtils.ts             # Image processing helpers (EXIF stripping, conversion)
    dataFormatterUtils.ts     # Data formatting, validation, conversion
    base64Utils.ts            # Base64 helpers
    analytics.ts              # Analytics tracking helpers
  tools/                # Tool-specific pages (Next.js routes)
    merge/
    split/
    rearrange/
    compress/
    redact/
    exif-stripper/
    image-converter/
    data-formatter/
    base64/
    jwt/
    pdf-text-extractor/
    text-list/
public/                 # Static assets
  pdf-worker/           # PDF.js worker for client-side rendering
__tests__/              # Comprehensive test suites
  components/           # Component tests
  utils/                # Utility function tests
```

## Tech Stack

- Next.js 16 (App Router) with Turbopack
- React 19
- TypeScript (strict mode)
- pdf-lib for client-side PDF manipulation
- pdfjs-dist for PDF rendering (Redactor tool)
- Native Web APIs for all processing:
  - PDF: pdf-lib for manipulation, pdfjs-dist for rendering
  - Images: File API, ArrayBuffer, DataView
  - JSON: Native JSON.parse() / JSON.stringify()
  - XML: DOMParser / XMLSerializer
  - YAML: Custom lightweight parser (no dependencies)
- Tailwind CSS 4 for styling
- Jest & Testing Library for tests

## Architecture

All operations happen 100% client-side with zero server uploads:

- PDFs: pdf-lib for manipulation (merge, split, compress, rearrange, redact, extract text)
- Images: Native Web APIs for EXIF stripping and format conversion
- Data: Native browser APIs for formatting and validation
  - JSON: V8-optimized JSON.parse() / JSON.stringify()
  - XML: DOMParser / XMLSerializer
  - YAML: Custom lightweight parser (no external dependencies)

This architecture ensures:

- Privacy: Files and data never leave the user's device
- Speed: No network latency, instant processing
- Security: No server-side vulnerabilities or data breaches
- Simplicity: Static site deployment (Vercel, Netlify, etc.)
- Cost-Effective: No backend infrastructure required

### Security Measures

- Content Security Policy (CSP) headers
- Input validation and sanitization
- Size limits enforced:
  - PDFs: 50MB per file
  - Images: Standard browser limits
  - Data formatter: 10MB input text
- No eval() or innerHTML usage
- Encrypted PDF detection and graceful handling
- XSS prevention in data formatter
- Regular dependency audits (npm audit)

## Learn More

To learn more about Next.js, take a look at the following resources:

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Analytics (Plausible)

This project includes optional, privacy-friendly analytics using Plausible. Analytics are opt-in for end users: the app will not send any analytics data unless the deployment enables Plausible via `NEXT_PUBLIC_PLAUSIBLE=1` and a site visitor explicitly grants consent through the on-site privacy controls (consent pill / footer toggle).

When enabled and consented, the app tracks:
- Page views
- Tool usage events (file added, merge started, etc.)

No personal data or file content is ever tracked; free-form strings and user-provided values are sanitized before being sent. Analytics never run in development unless explicitly enabled.

## Contributing

We welcome contributions that improve the project! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Note: This project is open source for transparency and verification. We encourage contributions to improve the main app rather than creating forks for separate deployments.

### Development Guidelines

1. Follow TypeScript strict mode
2. Write comprehensive tests for new features (use Jest + Testing Library)
3. Ensure all tools work client-side only (no server uploads)
4. Maintain WCAG 2.1 AA accessibility standards
5. Run `npm run lint` and `npm test` before committing
6. Document all exported functions with JSDoc comments
7. Keep bundle size minimal (avoid large dependencies)

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Security

Found a security issue? Please read our [Security Policy](SECURITY.md) for responsible disclosure guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Verification

- [Report a Bug](https://github.com/punq/simpletoolkit/issues)
- [Request a Feature](https://github.com/punq/simpletoolkit/issues)
- [Discussions](https://github.com/punq/simpletoolkit/discussions)
- [Verify Source Code](https://github.com/punq/simpletoolkit) - Review our code to confirm privacy claims
- [Donate](https://simpletoolkit.app/donate)

## Transparency & Trust

This repository exists to provide verifiable transparency. You can:
- Inspect the source code to confirm files are processed locally
- Audit security measures and privacy protections
- Review test suites to understand behavior
- Run the code locally to verify it matches the deployed app
- Report security issues or privacy concerns

**Use the live app:** We recommend using [simpletoolkit.app](https://simpletoolkit.app) for the best experience, with the confidence that you can verify everything in this repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- PDF processing powered by [pdf-lib](https://pdf-lib.js.org/)
- Analytics by [Plausible](https://plausible.io/)

---
Made with ❤️ for privacy-conscious users