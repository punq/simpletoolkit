# Simple Toolkit

Collection of tiny, single-purpose web tools (simpletoolkit.app). Merge up to 20 PDF files locally in your browser. No uploads, no accounts — fast and private.

## Quick start

Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

Open http://localhost:3000 in your browser. Select up to 20 PDF files, reorder them if needed, then click "Merge PDFs" to download a single merged PDF. All processing happens in your browser — files are not uploaded to any server.

## Files added

- `app/page.tsx` — main client UI for selecting, reordering, and merging PDFs.
- `public/donate.html` — placeholder donate page with PayPal/BuyMeACoffee links (replace with your handles).
- `public/privacy.html` — short privacy statement explaining local processing.

## Notes

- The app uses `pdf-lib` to merge PDFs in the browser. Encrypted or heavily malformed PDFs may be skipped; skipped files are reported to the user.
- For very large PDFs or many large pages, browser memory can be a constraint. Consider server-side merging for large enterprise usage.

## Learn More

To learn more about Next.js, take a look at the following resources:


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Analytics (Plausible)

This project includes optional, privacy-friendly analytics using Plausible. To enable analytics for your deployed site only, set the environment variable `NEXT_PUBLIC_PLAUSIBLE=1` in your Vercel (or other) production environment. When enabled the app will load Plausible's script and fire lightweight events for important actions:

- `Files Added` — when a user adds PDFs (drag, drop, or file picker)
- `Merge Started` — when a merge operation begins
- `Merge Completed` — when a merge finishes (includes number of skipped files)
- `Merge Failed` — when a merge throws an error

No analytics run in development unless you explicitly set the env var locally.
