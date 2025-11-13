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

// Additionally copy CMaps and WASM files if present so the worker doesn't
// attempt network fetches at runtime. This is best-effort and non-fatal.
try {
  const cmapsSrc = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'cmaps');
  const cmapsDest = path.join(destDir, 'cmaps');
  if (fs.existsSync(cmapsSrc)) {
    if (!fs.existsSync(cmapsDest)) fs.mkdirSync(cmapsDest, { recursive: true });
    const files = fs.readdirSync(cmapsSrc);
    files.forEach((f) => {
      const srcf = path.join(cmapsSrc, f);
      const destf = path.join(cmapsDest, f);
      try {
        fs.copyFileSync(srcf, destf);
      } catch {
        // ignore individual file copy errors
      }
    });
    console.log('✓ Copied PDF.js CMaps to public/pdf-worker/cmaps/');
  } else {
    console.warn('⚠ CMaps not found at', cmapsSrc);
  }
} catch (err) {
  console.warn('⚠ Error copying cmaps (non-fatal):', String(err.message || err));
}

try {
  const wasmSrcDir = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'wasm');
  const wasmDestDir = path.join(destDir, 'wasm');
  if (fs.existsSync(wasmSrcDir)) {
    if (!fs.existsSync(wasmDestDir)) fs.mkdirSync(wasmDestDir, { recursive: true });
    const wasmFiles = fs.readdirSync(wasmSrcDir).filter((n) => n.endsWith('.wasm'));
    wasmFiles.forEach((f) => {
      const srcf = path.join(wasmSrcDir, f);
      const destf = path.join(wasmDestDir, f);
      try {
        fs.copyFileSync(srcf, destf);
      } catch {
        // ignore individual file copy errors
      }
    });
    console.log('✓ Copied WASM files to public/pdf-worker/wasm/');
  } else {
    console.warn('⚠ WASM directory not found at', wasmSrcDir);
  }
} catch (err) {
  console.warn('⚠ Error copying wasm files (non-fatal):', String(err.message || err));
}
