/**
 * Post-install script to copy PDF.js worker file to public directory
 * This ensures the worker is available for client-side PDF rendering
 */

const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const destDir = path.join(__dirname, '..', 'public', 'pdf-worker');
const destFile = path.join(destDir, 'pdf.worker.min.mjs');

try {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log('✓ Created public/pdf-worker directory');
  }

  // Copy worker file
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, destFile);
    console.log('✓ Copied PDF.js worker file to public/pdf-worker/');
  } else {
    console.warn('⚠ Warning: PDF.js worker file not found at', sourceFile);
  }
} catch (error) {
  console.error('✗ Error copying PDF.js worker:', error.message);
  // Don't fail the install if this script fails
  process.exit(0);
}
