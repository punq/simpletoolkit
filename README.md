# Simple Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Privacy-first, browser-based tools for PDFs, images, and more. All processing happens locally — your files never leave your device.

**Live Demo**: [simpletoolkit.app](https://simpletoolkit.app)

## Features

- **🔒 100% Private**: All processing happens in your browser using WebAssembly
- **🚀 Fast & Responsive**: No server uploads or processing delays
- **💰 Free Forever**: No ads, no watermarks, no premium tiers
- **🎯 Simple UX**: Clean, intuitive interface
- **♿ Accessible**: Full keyboard navigation and ARIA support

### Available Tools

#### PDF Tools
- **Merge PDF**: Combine multiple PDFs with drag-and-drop reordering
- **Split PDF**: Extract pages, ranges, or split into individual files
- **Rearrange PDF**: Reorder pages and rotate as needed
- **Compress PDF**: Reduce file size with adjustable compression levels

#### Image Tools
- **EXIF Stripper**: Remove metadata (EXIF, GPS, camera info) from JPEG and PNG images

#### Data Tools
- **Data Formatter & Validator**: Format, validate, and convert JSON, YAML, and XML with real-time syntax highlighting, detailed error reporting, and cross-format conversion — all processed instantly in your browser

## Why Open Source?

This project is open source for **transparency and trust**, not to encourage creating your own version. Our code is public so you can:

- ** Verify Privacy Claims**: See for yourself that files never leave your browser
- ** Audit Security**: Review our code for vulnerabilities or security issues
- ** Trust the Process**: Understand exactly how your data is handled
- ** Learn from Implementation**: See how client-side PDF/image processing works

**We encourage using the live app at [simpletoolkit.app](https://simpletoolkit.app)** rather than self-hosting or forking. The source code is here for verification, not replication.

## Local Development (For Verification)

If you want to verify the code runs as described:

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  components/     # React components for all tools
    MergeTool.tsx              # PDF merge functionality
    SplitTool.tsx              # PDF split functionality
    RearrangeTool.tsx          # PDF rearrange functionality
    CompressTool.tsx           # PDF compression functionality
    ExifStripperTool.tsx       # Image EXIF metadata removal
    DataFormatterValidator.tsx # JSON/YAML/XML formatter & validator
  utils/          # Shared utilities
    pdfUtils.ts         # PDF processing helpers
    imageUtils.ts       # Image processing helpers (EXIF stripping)
    dataFormatterUtils.ts # Data formatting, validation, conversion
    analytics.ts        # Analytics tracking helpers
  tools/          # Individual tool pages (Next.js routes)
    merge/
    split/
    rearrange/
    compress/
    exif-stripper/
    data-formatter/   # NEW: JSON/YAML/XML formatter
public/           # Static assets
__tests__/        # Comprehensive test suites (266 tests)
  components/     # Component tests
  utils/          # Utility function tests
```

## Tech Stack

- **Next.js 16** (App Router) with Turbopack
- **React 19**
- **TypeScript** (strict mode)
- **pdf-lib** for client-side PDF manipulation
- **Native Web APIs** for all processing:
  - PDF: `pdf-lib` library
  - Images: File API, ArrayBuffer, DataView
  - JSON: Native `JSON.parse()` / `JSON.stringify()`
  - XML: `DOMParser` / `XMLSerializer`
  - YAML: Custom lightweight parser (no dependencies)
- **Tailwind CSS 4** for styling
- **Jest & Testing Library** for tests (266 tests, 100% passing)

## Architecture

All operations happen **100% client-side** with zero server uploads:

- **PDFs**: `pdf-lib` for manipulation (merge, split, compress, rearrange)
- **Images**: Native Web APIs for EXIF stripping (File API, ArrayBuffer, DataView)
- **Data**: Native browser APIs for formatting and validation
  - JSON: V8-optimized `JSON.parse()` / `JSON.stringify()`
  - XML: `DOMParser` / `XMLSerializer`
  - YAML: Custom lightweight parser (no external dependencies)

This architecture ensures:

- **🔒 Privacy**: Files and data never leave the user's device
- **⚡ Speed**: No network latency, instant processing
- **🛡️ Security**: No server-side vulnerabilities or data breaches
- **📦 Simplicity**: Static site deployment (Vercel, Netlify, etc.)
- **💰 Cost-Effective**: No backend infrastructure required

### Security Measures

- Content Security Policy (CSP) headers
- Input validation and sanitization
- Size limits enforced:
  - PDFs: 50MB per file
  - Images: Standard browser limits
  - Data formatter: 10MB input text
- No `eval()` or `innerHTML` usage
- Encrypted PDF detection and graceful handling
- XSS prevention in data formatter
- Regular dependency audits (`npm audit`)

## Learn More

To learn more about Next.js, take a look at the following resources:


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Analytics (Plausible)

This project includes optional, privacy-friendly analytics using Plausible. To enable analytics for your deployed site only, set the environment variable `NEXT_PUBLIC_PLAUSIBLE=1` in your production environment.

When enabled, the app tracks:
- Page views
- Tool usage events (file added, merge started, etc.)
- **No personal data or file content is ever tracked**

Analytics never run in development unless explicitly enabled.

## Contributing

We welcome contributions that improve the project! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Note**: This project is open source for transparency and verification. We encourage contributions to improve the main app rather than creating forks for separate deployments.

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

-  [Report a Bug](https://github.com/punq/simpletoolkit/issues)
-  [Request a Feature](https://github.com/punq/simpletoolkit/issues)
-  [Discussions](https://github.com/punq/simpletoolkit/discussions)
-  [Verify Source Code](https://github.com/punq/simpletoolkit) - Review our code to confirm privacy claims
-  [Donate](https://simpletoolkit.app/donate)

## Transparency & Trust

This repository exists to provide **verifiable transparency**. You can:
- Inspect the source code to confirm files are processed locally
- Audit security measures and privacy protections
- Review test suites (266 tests) to understand behavior
- Run the code locally to verify it matches the deployed app
- Report security issues or privacy concerns

**Use the live app**: We recommend using [simpletoolkit.app](https://simpletoolkit.app) for the best experience, with the confidence that you can verify everything in this repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- PDF processing powered by [pdf-lib](https://pdf-lib.js.org/)
- Analytics by [Plausible](https://plausible.io/)

---

Made with ❤️ for privacy-conscious users
