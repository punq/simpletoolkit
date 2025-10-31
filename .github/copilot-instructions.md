# AI Agent Instructions for PDF Merger

## Project Overview
This is a Next.js-based web application that allows users to merge multiple PDF files locally in their browser. The app prioritizes privacy and simplicity - all processing happens client-side using pdf-lib, with no server uploads required.

## Key Architecture Points
- **Client-Side Processing**: All PDF merging happens in the browser using `pdf-lib` (`app/components/MergeTool.tsx`)
- **Next.js App Router**: Uses the new `/app` directory structure for routing
- **UI Components**: Built with React and styled using Tailwind CSS
- **Zero Server Dependencies**: No backend APIs - purely static site deployment

## Project Structure
```
app/
  components/      # Reusable React components
    MergeTool.tsx  # Core PDF merging functionality
  tools/
    merge/
      page.tsx    # Main merge tool page
  page.tsx        # Landing page
  layout.tsx      # Root layout with metadata
public/           # Static assets and pages
```

## Development Workflow
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Access app at `http://localhost:3000`

## Key Implementation Details
- Max file limit of 20 PDFs enforced in `MergeTool.tsx`
- Drag-and-drop reordering using React state management
- Error handling for encrypted/malformed PDFs with user feedback
- Dark mode support via Tailwind CSS classes

## Common Tasks
- **Adding New Tools**: Create new page under `app/tools/[toolname]/page.tsx`
- **Styling**: Use Tailwind CSS utility classes, defined in `app/globals.css`
- **PDF Processing**: Use `pdf-lib` methods in client components (see `MergeTool.tsx`)

## Important Conventions
- Client components must use `"use client"` directive
- Keep components focused on single responsibilities
- Minimize bundle size - avoid large dependencies
- Handle loading/error states for PDF operations