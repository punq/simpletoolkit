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
  metadataBase: new URL('https://simpletoolkit.app'),
  title: "Simple Toolkit — Privacy-First Tools | No Ads, No Tracking, Always Free",
  description:
    "Free browser-based tools for PDFs, images, and more. 100% private—files never leave your device. No uploads, no accounts, no watermarks, no ads. Professional tools that respect your privacy.",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico", sizes: "any" },
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: [{ url: "/favicon.ico" }],
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
    title: "Simple Toolkit — Privacy-First Tools | No Ads, No Tracking",
    description:
      "Free browser-based tools for PDFs, images, and more. 100% private—files never leave your device. No uploads, no accounts, no watermarks. Professional tools that respect your privacy.",
    url: "https://simpletoolkit.app/",
    siteName: "Simple Toolkit",
    images: [
      {
        url: "/stkapp.png",
        width: 1200,
        height: 630,
        alt: "Simple Toolkit - Privacy-First Browser Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Toolkit — Privacy-First Tools",
    description: "Free browser-based tools. 100% private—files never leave your device. No uploads, no tracking, no ads.",
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
            "description": "Free browser-based tools for PDFs, images, and more. 100% private—files never leave your device. No uploads, no accounts, no watermarks, no ads.",
            "applicationCategory": "Utility",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "PDF Merging and Splitting",
              "Image Processing",
              "Text Tools",
              "100% Browser-based Processing",
              "No File Uploads Required",
              "No Watermarks Ever",
              "No Ads or Tracking",
              "Privacy-First Architecture"
            ],
            "browserRequirements": "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge."
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Are my files uploaded to a server?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. All file processing happens locally in your browser using JavaScript. Your files never leave your device and are not uploaded to any server."
                }
              },
              {
                "@type": "Question",
                "name": "Is Simple Toolkit really free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Simple Toolkit is completely free with no hidden fees, premium tiers, or paywalls. The project runs on donations from users who find it valuable."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to create an account?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Simple Toolkit requires no signup, login, or account creation. Just visit the site and start using the tools immediately."
                }
              },
              {
                "@type": "Question",
                "name": "Are there any file size limits?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "There are no artificial limits imposed by Simple Toolkit. The only limitations are those of your browser and device capabilities."
                }
              }
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
        {/* Service Worker Registration (client-only, resilient) */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
