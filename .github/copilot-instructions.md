# AI Agent Instructions for SimplePDFToolkit

## Project Overview
This is a Next.js-based web application that provides local, privacy-focused file manipulation tools. The app runs entirely in the browser with no server uploads required. Currently supports PDF operations (merge, split, rearrange, compress) and image privacy tools (EXIF metadata stripping).

## Key Architecture Points
- **Client-Side Processing**: All operations happen in the browser
  - PDF tools use `pdf-lib`
  - Image tools use native Web APIs (File API, ArrayBuffer, DataView)
  - Merge tool: `app/components/MergeTool.tsx`
  - Split tool: `app/components/SplitTool.tsx`
  - Rearrange tool: `app/components/RearrangeTool.tsx`
  - Compress tool: `app/components/CompressTool.tsx`
  - EXIF Stripper: `app/components/ExifStripperTool.tsx`
- **Next.js App Router**: Uses the new `/app` directory structure for routing
- **Privacy-First**: No data leaves user's browser - processing is 100% local
- **Zero Server Dependencies**: Purely static site deployment
- **Analytics**: Optional Plausible analytics with fail-safe tracking helpers

## Core Features & Patterns
### PDF Processing
- All PDF operations use `pdf-lib` in client components
- Common error handling patterns for encrypted/invalid PDFs
- File size and count limits enforced client-side
- Example from `MergeTool.tsx`:
  ```typescript
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  ```

### Image Processing
- EXIF/metadata stripping uses native Web APIs (no external libraries)
- Ultra-performant binary parsing with DataView
- Supports JPEG (strips APP1/APP2 markers) and PNG (removes metadata chunks)
- Memory-efficient streaming approach
- Example from `ExifStripperTool.tsx`:
  ```typescript
  const result = await stripImageMetadata(file);
  downloadImage(result.blob, file.name);
  ```

### UI/UX Conventions
- Drag-and-drop interface with file reordering
- Progress indicators during operations
- Error boundaries for graceful failure handling
- Success messages with download prompts
- Dark mode support via Tailwind CSS

## Development Workflow
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev` 
3. Build production: `npm run build`
4. Access app at `http://localhost:3000`

## Project Structure
```
app/
  components/           # Shared React components
    MergeTool.tsx      # PDF merge functionality
    SplitTool.tsx      # PDF split functionality
    RearrangeTool.tsx  # PDF rearrange functionality
    CompressTool.tsx   # PDF compress functionality
    ExifStripperTool.tsx # Image EXIF/metadata stripping
    ErrorBoundary.tsx  # Error handling wrapper
    SuccessMessage.tsx # Operation completion UI
  utils/               # Utility modules
    pdfUtils.ts        # PDF processing helpers
    imageUtils.ts      # Image processing helpers (EXIF stripping)
    analytics.ts       # Analytics tracking helpers
  tools/               # Tool-specific pages
    merge/page.tsx     # Merge tool page
    split/page.tsx     # Split tool page
    rearrange/page.tsx # Rearrange tool page
    compress/page.tsx  # Compress tool page
    exif-stripper/page.tsx # EXIF stripper page
```
  page.tsx             # Landing page
```

## Common Tasks & Patterns
- **Adding New Tools**: 
  1. Create component in `app/components/`
  2. Add page under `app/tools/[toolname]/page.tsx`
  3. Update navigation in `Header.tsx`
- **Error Handling**: Use `ErrorBoundary` component and state-based error messages
- **Analytics**: Use `track()` helper for safe Plausible event tracking
- **PDF Processing**: Always handle loading states and potential errors

## Important Conventions
- All tool components must use `"use client"` directive
- Keep PDF processing logic separate from UI components
- Use TypeScript for type safety
- Always handle loading and error states
- Follow privacy-first principles - no external services
- Keep bundle size minimal - avoid large dependencies