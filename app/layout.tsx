import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "World Public Spending",
              url: "https://publicspending.world",
              description:
                "Explore public spending data from countries around the world. Access transparent, up-to-date information about government expenditures, budgets, and financial allocations globally.",
              publisher: {
                "@type": "Organization",
                name: "World Public Spending",
                url: "https://publicspending.world",
              },
            }),
          }}
        />
      </head>
      <body className={`${merriweather.className} antialiased`}>
        {children}
        <Toaster richColors expand={true} position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://publicspending.world"),
  title: {
    default: "publicspending.world - Global Government Budget & Spending Data",
    template: "%s | publicspending.world",
  },
  description:
    "Explore public spending data from 190+ countries worldwide. Access transparent, up-to-date information about government expenditures, budgets, and financial allocations. Compare fiscal policies globally.",
  keywords: [
    "public spending",
    "government expenditure",
    "global budget data",
    "fiscal transparency",
    "government finance",
    "public finance",
    "budget analysis",
    "government spending comparison",
    "fiscal policy",
    "budget transparency",
    "public accountability",
    "government revenue",
    "tax spending",
    "public sector finances",
  ],
  authors: [
    { name: "publicspending.world", url: "https://publicspending.world" },
  ],
  creator: "publicspending.world",
  publisher: "publicspending.world",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "publicspending.world - Global Government Budget & Spending Data",
    description:
      "Explore public spending data from 190+ countries worldwide. Compare government budgets, spending patterns, and fiscal transparency globally.",
    url: "https://publicspending.world",
    siteName: "publicspending.world",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "publicspending.world - Global Government Spending Data",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "publicspending.world - Global Government Budget Data",
    description:
      "Explore public spending data from 190+ countries worldwide. Compare government budgets and fiscal transparency.",
    images: ["/og-image.png"],
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
  alternates: {
    canonical: "https://publicspending.world",
  },
  category: "Government & Politics",
};
