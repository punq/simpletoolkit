# AI Agent Instructions for SimplePDFToolkit

## Project Overview
This is a Next.js-based web application that provides local, privacy-focused PDF manipulation tools. The app runs entirely in the browser using pdf-lib, with no server uploads required. Currently supports PDF merging and splitting operations.

## Key Architecture Points
- **Client-Side Processing**: All PDF operations happen in the browser using `pdf-lib`
  - Merge tool: `app/components/MergeTool.tsx`
  - Split tool: `app/components/SplitTool.tsx`
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

### UI/UX Conventions
- Drag-and-drop interface with file reordering
- Progress indicators during PDF operations
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
    ErrorBoundary.tsx  # Error handling wrapper
    SuccessMessage.tsx # Operation completion UI
  tools/               # Tool-specific pages
    merge/page.tsx     # Merge tool page
    split/page.tsx     # Split tool page
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