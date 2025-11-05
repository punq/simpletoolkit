import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Toolkit — Free Browser-Based Tools | No Ads, No Tracking",
  description:
    "Free, privacy-first web tools that work entirely in your browser. No uploads, no accounts, no watermarks, no bloat. Featuring PDF merging and more simple tools that respect your privacy.",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", url: "/favicon.ico", sizes: "any" }
    ],
    apple: { url: "/apple-touch-icon.png" }
  },
  manifest: "/site.webmanifest",
  keywords: [
    "free tools",
    "online tools",
    "privacy-first",
    "browser-based tools",
    "pdf merger",
    "no watermark",
    "no signup",
    "free pdf tools",
    "local pdf processing",
    "simple tools",
  ],
  openGraph: {
    title: "Simple Toolkit — Free Browser-Based Tools | No Ads, No Tracking",
    description:
      "Free, privacy-first web tools that work entirely in your browser. No uploads, no accounts, no watermarks, no bloat. Featuring PDF merging and more simple tools that respect your privacy.",
    url: "https://simpletoolkit.app/",
    siteName: "Simple Toolkit",
    images: [
      {
        url: "/stkapp.png",
        width: 1200,
        height: 630,
        alt: "Simple Toolkit - Free Browser Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Toolkit — Free Browser-Based Tools",
    description: "Free, privacy-first web tools that work in your browser. No uploads, no tracking.",
    images: ["/stkapp.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification=tpwJ3Is5KaLH2qJu9XSkxAa5UWhQA3Ch4uuiOfsvSVQ", // You'll need to replace this with your actual Google Search Console verification token
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
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Simple Toolkit",
            "url": "https://simpletoolkit.app",
            "description": "Free, privacy-first web tools that work entirely in your browser. No uploads, no accounts, no watermarks, no bloat.",
            "applicationCategory": "Utility",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "PDF Merging",
              "Browser-based processing",
              "No file uploads required",
              "No watermarks",
              "Privacy-focused"
            ]
          })}
        </script>
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 container mx-auto max-w-screen-xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
