import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDP Rankings | Countries by GDP Nominal 2025 | Largest Economies",
  description: "GDP rankings by country 2025. Countries ranked by nominal GDP - world's largest economies, economic output and gross domestic product data by nation.",
  keywords: "GDP rankings, countries by GDP, GDP by country, nominal GDP rankings, largest economies, world GDP ranking, economic ranking, countries GDP 2025, GDP per country, world economy rankings",
  openGraph: {
    title: "GDP Rankings - Countries by GDP 2025",
    description: "See countries ranked by GDP nominal 2025. Explore world's largest economies and economic output by country.",
    url: "https://publicspending.world/ranking/gdp-nominal",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDP Rankings | Countries by GDP 2025",
    description: "GDP rankings by country. Discover countries with highest GDP nominal and economic output worldwide.",
  },
  alternates: {
    canonical: "https://publicspending.world/ranking/gdp-nominal",
  },
};

export default function GDPRankingLayout({
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