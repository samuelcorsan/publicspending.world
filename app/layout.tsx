import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "World Public Spending - Transparency and Open Data on Public Spending",
  description:
    "Explore public spending data from countries around the world. Access transparent, up-to-date information about government expenditures, budgets, and financial allocations globally.",
  keywords:
    "public spending, government transparency, open data, government budgets, public finance, government expenditure, fiscal transparency",
  authors: [{ name: "World Public Spending" }],
  creator: "World Public Spending",
  publisher: "World Public Spending",
  openGraph: {
    title: "World Public Spending - Global Public Finance Transparency",
    description:
      "Explore public spending data from countries around the world. Access transparent, up-to-date information about government expenditures, budgets, and financial allocations globally.",
    url: "https://publicspending.world",
    siteName: "World Public Spending",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "World Public Spending - Transparency Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Public Spending - Global Public Finance Transparency",
    description:
      "Explore public spending data from countries around the world. Access transparent, up-to-date information about government expenditures.",
    images: ["/og-image.jpg"],
    creator: "@worldpublicspending",
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
};

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
