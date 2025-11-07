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

## Quick Start

## Quick start

Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  components/     # React components for PDF and image tools
  utils/          # Shared utilities (pdfUtils, imageUtils, analytics)
  tools/          # Individual tool pages
public/           # Static assets
__tests__/        # Test suites
```

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript** (strict mode)
- **pdf-lib** for client-side PDF manipulation
- **Native Web APIs** for image processing (File API, ArrayBuffer, DataView)
- **Tailwind CSS 4** for styling
- **Jest & Testing Library** for tests

## Architecture

All file operations happen **100% client-side** using `pdf-lib` for PDFs and native Web APIs for images. No backend servers or file uploads required. This ensures:

- **Privacy**: Files never leave the user's device
- **Speed**: No network latency
- **Security**: No server-side vulnerabilities
- **Simplicity**: Static site deployment

### Security Measures

- Content Security Policy (CSP) headers
- Input validation and sanitization
- File size limits (50MB per file)
- No `eval()` or `innerHTML`
- Encrypted PDF detection
- Regular dependency audits

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

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Guidelines

1. Follow TypeScript strict mode
2. Write tests for new features
3. Ensure all tools work client-side only
4. Maintain accessibility standards
5. Run `npm run lint` before committing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Security

Found a security issue? Please read our [Security Policy](SECURITY.md) for responsible disclosure guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report a Bug](https://github.com/punq/simpletoolkit/issues)
- 💡 [Request a Feature](https://github.com/punq/simpletoolkit/issues)
- 💬 [Discussions](https://github.com/punq/simpletoolkit/discussions)
- 💖 [Donate](https://simpletoolkit.app/donate)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- PDF processing powered by [pdf-lib](https://pdf-lib.js.org/)
- Analytics by [Plausible](https://plausible.io/)

---

Made with ❤️ for privacy-conscious users
