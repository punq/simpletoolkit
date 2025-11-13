import { redactPdfData } from '@/app/utils/pdfUtils';
import { PDFDocument } from 'pdf-lib';

// Helper to create an in-memory PDF with single line of text
async function createSamplePDF(text = 'SECRET-1234') {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 200]);
  page.drawText(text, { x: 50, y: 150, size: 24 });
  return await pdfDoc.save();
}

describe('redactPdfData integration', () => {
  jest.setTimeout(20000);

  it('removes visible text from flattened output', async () => {
    const secret = 'SECRET-1234';
    const pdfBytes = await createSamplePDF(secret);
    const file = new File([new Uint8Array(pdfBytes)], 'secret.pdf', { type: 'application/pdf' });
    // Provide arrayBuffer for jsdom
    (file as any).arrayBuffer = async () => pdfBytes.buffer || pdfBytes;

    // Area chosen to cover the text drawn at x:50 y:150 size:24
    const area = { pageNumber: 1, x: 40, y: 20, width: 320, height: 80 };

    const result = await redactPdfData(file, [area], true);
    expect(result).toBeDefined();
    expect(result.flattened).toBe(true);

  // Use the raw bytes returned in the result for deterministic inspection in tests.
  const decoded = new TextDecoder('latin1').decode(result.redactedBytes);
  expect(decoded.includes(secret)).toBe(false);
  });

  it('removes visible text from unflattened output (best-effort)', async () => {
    const secret = 'TOPSECRET-999';
    const pdfBytes = await createSamplePDF(secret);
    const file = new File([new Uint8Array(pdfBytes)], 'secret2.pdf', { type: 'application/pdf' });
    (file as any).arrayBuffer = async () => pdfBytes.buffer || pdfBytes;

    const area = { pageNumber: 1, x: 40, y: 20, width: 320, height: 80 };
    const result = await redactPdfData(file, [area], false);
    expect(result).toBeDefined();
    expect(result.flattened).toBe(false);

  const decoded = new TextDecoder('latin1').decode(result.redactedBytes);
  // Unflattened is best-effort; at minimum the raw bytes should not contain the secret string.
  expect(decoded.includes(secret)).toBe(false);
  });
});
