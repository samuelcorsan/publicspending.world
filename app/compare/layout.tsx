import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Countries Government Spending",
  description:
    "Compare countries government spending, GDP, corruption levels, and budget allocations. Side-by-side analysis of public expenditure, revenue sources, and fiscal policies between any two nations worldwide.",
  keywords:
    "compare countries, compare government spending, compare countries GDP, compare countries corruption, country budget comparison, fiscal policy comparison, government expenditure analysis, public spending comparison tool, compare nations spending, countries vs comparison",
  openGraph: {
    title: "Compare Countries Government Budget & Spending Analysis",
    description:
      "Compare countries government spending, GDP, corruption and revenue sources between any two nations. Analyze fiscal policies and budgets side-by-side.",
    url: "https://publicspending.world/compare",
    siteName: "publicspending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Countries Government Spending & Budget Analysis",
    description:
      "Compare countries government spending, GDP, corruption levels. Side-by-side comparison of government budgets and revenue sources worldwide.",
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
