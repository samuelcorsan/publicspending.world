import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

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
        <NextIntlClientProvider>
          {children}
          <Toaster richColors expand={true} position="top-right" />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations("Metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: t("authors") }],
    creator: t("creator"),
    publisher: t("publisher"),
    openGraph: {
      title: t("openGraph.title"),
      description: t("openGraph.description"),
      url: t("openGraph.url"),
      siteName: t("openGraph.siteName"),
      /*images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "World Public Spending - Transparency Portal",
        },
      ],*/
      locale: t("openGraph.locale"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitter.title"),
      description: t("twitter.description"),
      /*images: ["/og-image.jpg"],*/
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
      canonical: t("alternates.canonical"),
    },
  };
}
