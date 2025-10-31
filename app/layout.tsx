import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Toolkit — Tiny web tools",
  description:
    "A collection of tiny, privacy-first web tools. Merge PDFs locally in your browser — no uploads, no accounts.",
  openGraph: {
    title: "Simple Toolkit — Tiny web tools",
    description:
      "A collection of tiny, privacy-first web tools. Merge PDFs locally in your browser — no uploads, no accounts.",
    url: "https://simpletoolkit.app/",
    siteName: "Simple Toolkit",
    images: [
      {
        url: "/next.svg",
        width: 1200,
        height: 630,
        alt: "Simple Toolkit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/next.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enablePlausible =
    process.env.NEXT_PUBLIC_PLAUSIBLE === "1" ||
    process.env.NEXT_PUBLIC_PLAUSIBLE === "true";
  return (
    <html lang="en">
      <head>
        {/* Plausible analytics — only enabled when NEXT_PUBLIC_PLAUSIBLE env var is set to 1 or true */}
        {enablePlausible && (
          <>
            <Script
              src="https://plausible.io/js/pa-h9uphsLdTwdLeCKe911Cm.js"
              strategy="afterInteractive"
            />
            <Script
              id="plausible-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html:
                  `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
