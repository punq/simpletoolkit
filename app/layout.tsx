import type { Metadata } from "next";
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
