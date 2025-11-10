# PDF.js Worker

This directory contains the PDF.js worker file (`pdf.worker.min.mjs`) which is required for client-side PDF rendering in the PDF Redactor tool.

## Why is this needed?

PDF.js requires a web worker to render PDFs without blocking the main thread. The worker file must be served from the same origin as the app to avoid CORS issues.

## Automatic Setup

The worker file is automatically copied from `node_modules/pdfjs-dist/build/` during:
- `npm install` (via postinstall script)
- Manual execution: `node scripts/copy-pdf-worker.js`

## Version

Current worker version: **5.4.394** (matches pdfjs-dist package version)

## Troubleshooting

If you see errors like "Setting up fake worker failed", ensure:
1. The worker file exists: `public/pdf-worker/pdf.worker.min.mjs`
2. The file is accessible at `/pdf-worker/pdf.worker.min.mjs` in your browser
3. Run `npm install` to copy the latest worker file
