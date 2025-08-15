import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Countries Economic Data",
  description:
    "Compare countries GDP, population, and economic indicators. Side-by-side analysis of economic data and demographic information between any two nations worldwide.",
  keywords:
    "compare countries, compare countries GDP, compare countries population, country comparison, economic comparison, demographic comparison, countries vs comparison, economic data analysis",
  openGraph: {
    title: "Compare Countries Economic & Demographic Data",
    description:
      "Compare countries GDP, population and economic indicators between any two nations. Analyze economic data and demographics side-by-side.",
    url: "https://publicspending.world/compare",
    siteName: "publicspending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Countries Economic Data Analysis",
    description:
      "Compare countries GDP, population and economic indicators. Side-by-side comparison of economic data and demographic information worldwide.",
  },
  alternates: {
    canonical: "https://publicspending.world/compare",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
