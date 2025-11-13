declare module 'pdfjs-dist/legacy/build/pdf' {
  export const GlobalWorkerOptions: { workerSrc?: string };
  export function getDocument(opts: { data?: ArrayBuffer | null; password?: string }): { promise: Promise<unknown> };
}
