import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Revenue Rankings | Countries by Revenue 2025 | Tax Revenue",
  description: "Government revenue rankings by country 2025. Countries ranked by public revenue, tax revenue and fiscal capacity worldwide.",
  keywords: "government revenue rankings, countries by revenue, revenue by country, tax revenue rankings, government income rankings, fiscal capacity rankings, public revenue rankings, countries revenue 2025",
  openGraph: {
    title: "Government Revenue Rankings - Public Revenue by Country",
    description: "See how countries rank by government revenue collection. Explore public income and fiscal capacity worldwide.",
    url: "https://publicspending.world/ranking/revenue",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Revenue Rankings Worldwide",
    description: "Discover which countries generate the most government revenue and have the highest fiscal capacity.",
  },
  alternates: {
    canonical: "https://publicspending.world/ranking/revenue",
  },
};

export default function RevenueRankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}