const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function createPdf(text, outPath) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([400, 200]);
  const { height } = page.getSize();
  page.drawText(text, { x: 20, y: height - 40, size: 20 });
  const bytes = await doc.save();
  fs.writeFileSync(outPath, Buffer.from(bytes));
  return outPath;
}

async function merge(paths, outPath) {
  const merged = await PDFDocument.create();
  let totalPages = 0;
  for (const p of paths) {
    const bytes = fs.readFileSync(p);
    const pdf = await PDFDocument.load(bytes);
    const copied = await merged.copyPages(pdf, pdf.getPageIndices());
    copied.forEach((pg) => merged.addPage(pg));
    totalPages += pdf.getPageCount();
  }
  const mergedBytes = await merged.save();
  fs.writeFileSync(outPath, Buffer.from(mergedBytes));
  // verify
  const mergedPdf = await PDFDocument.load(fs.readFileSync(outPath));
  const mergedCount = mergedPdf.getPageCount();
  return { expected: totalPages, actual: mergedCount };
}

(async () => {
  try {
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const a = path.join(tmpDir, 'a.pdf');
    const b = path.join(tmpDir, 'b.pdf');
    const out = path.join(tmpDir, 'merged.pdf');

    await createPdf('First PDF - page 1', a);
    // create a 2-page PDF for variety
    const docb = await PDFDocument.create();
    const page1 = docb.addPage([300, 200]);
    const page2 = docb.addPage([300, 200]);
    if (page1.drawText && page2) {
      // Pages created successfully
    }
    const bBytes = await docb.save();
    fs.writeFileSync(b, Buffer.from(bBytes));

    const result = await merge([a, b], out);
    console.log('Merge result:', result);
    if (result.expected === result.actual) {
      console.log('SUCCESS: Merged PDF has expected page count. Output at', out);
      process.exit(0);
    } else {
      console.error('FAIL: Page count mismatch', result);
      process.exit(2);
    }
  } catch (err) {
    console.error('Error during test merge:', err);
    process.exit(1);
  }
})();
