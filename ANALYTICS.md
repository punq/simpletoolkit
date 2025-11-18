# Analytics (Plausible) — Event Schema & Recommendations

This document describes the custom Plausible events we've instrumented and recommended dashboards and privacy-safe practices.

## Design Principles
- Privacy-first: never send filenames or personal data.
- Low-cardinality: use buckets where needed (size, duration) to make dashboards stable.
- Operation IDs: attach `operationId` to relate start/complete/fail events.
- `tool` property: every event includes `tool` so you can easily filter reports.

## Instrumented Events (examples)
- Files Added
  - props: { count: number, method?: 'drop-zone' | 'picker', tool }

- Merge Started
  - props: { files, totalSizeBytes, sizeBucket, tool: 'merge', operationId }

- Merge Completed
  - props: { files, skipped, totalSizeBytes, sizeBucket, pages, durationMs, tool: 'merge', operationId }

- Merge Failed
  - props: { error, tool: 'merge', operationId }

- File Loaded (Split / Compress / Rearrange)
  - props: { pages, tool }

- Split Completed
  - props: { mode: 'pages'|'range'|'every-n'|'individual', pages?, parts?, start?, end?, n?, tool: 'split', operationId, durationMs }

- PDF Selected (Compress)
  - props: { size, pages, tool: 'compress' }

- PDF Compressed
  - props: { originalSize, compressedSize, compressionLevel, reductionPercent, tool: 'compress', operationId, durationMs }

- Metadata Stripped (Exif stripper)
  - props: { count, filesWithExif, filesWithoutExif, totalOriginalSize, totalNewSize, reduction, tool: 'exif-stripper', operationId, durationMs }

- Rearrange Export Completed
  - props: { pages, rotated, tool: 'rearrange', operationId, durationMs }

- Image Conversion (Image Converter)
  - props: { files, format, tool: 'image-converter', operationId, durationMs }

- Base64 Encode/Decode (Base64Tool)
  - props: { direction: 'encode'|'decode', mode, outputLength, tool: 'base64', operationId }

- Text List Utility
  - props: { inputLines, outputLines, removeDuplicates, sortDirection, tool: 'text-list', operationId }

- JWT Utility
  - props: { alg?: 'HS256'|'RS256', valid?: boolean, tool: 'jwt' }

- PDF Redactor
  - props: { pages?: number, areas?: number, flattened?: boolean, originalSize?, redactedSize?, tool: 'redact', operationId }

## Dashboard Ideas (Plausible)
1. Event `Merge Completed` — count over time (daily) — shows adoption
2. Breakdown `Merge Completed` by `sizeBucket` — shows large merges
3. Segment: `tool=merge` and `skipped > 0` — failure rate
4. Funnel: `Files Added` -> `Merge Started` -> `Merge Completed` — conversion
5. Custom chart: average `durationMs` for `Merge Completed` by `files` bucket

## Analytics & Hosting
This document describes events used by the official deployment. We do not provide recommendations or support for running a separate, public deployment of the application or analytics. The repository is provided to verify what the app tracks and why — if you have questions about analytics setup used by the official site, open an issue.

## Exporting Data
- You can export events via Plausible API (requires API key); for example, fetch events in Node and aggregate daily counts by using `fetch`.
- Example: `scripts/export-analytics.js` (not included) — use Plausible API docs for endpoints.

## Next steps
- Add `tool` and `operationId` to any future custom events.
- Add dashboards for top-priority tools: merge & compress.
- Consider sampling for high-volume event types like EXIF strip per-file events.

We don't provide export scripts for self-hosted deployments in this repository; reach out via issues if you need help understanding or verifying the event schema used by the public deployment.
