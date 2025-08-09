import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Countries - Government Spending Analysis",
  description:
    "Compare government spending, revenue sources, and budget allocations between countries. Side-by-side analysis of public expenditure and fiscal policies worldwide.",
  keywords:
    "compare government spending, country budget comparison, fiscal policy comparison, government expenditure analysis, public spending comparison tool",
  openGraph: {
    title: "Compare Countries - Government Budget Analysis",
    description:
      "Compare government spending and revenue sources between any two countries. Analyze fiscal policies side-by-side.",
    url: "https://publicspending.world/compare",
    siteName: "publicspending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Government Spending Between Countries",
    description:
      "Side-by-side comparison of government budgets, spending, and revenue sources worldwide.",
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
