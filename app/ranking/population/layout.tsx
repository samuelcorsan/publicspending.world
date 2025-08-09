import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Population Rankings | Countries by Population 2025 | World Demographics",
  description: "Population rankings by country 2025. Countries ranked by population size - most populated countries, world demographics and population statistics by nation.",
  keywords: "population rankings, countries by population, population by country, most populated countries, world population ranking, countries population 2025, demographic rankings, world demographics, global population",
  openGraph: {
    title: "Population Rankings - Countries by Population 2025",
    description: "See countries ranked by population 2025. Most populous nations and countries demographic data worldwide.",
    url: "https://publicspending.world/ranking/population",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Population Rankings | Countries by Population",
    description: "Population rankings by country. Discover countries with largest populations worldwide with demographic data.",
  },
  alternates: {
    canonical: "https://publicspending.world/ranking/population",
  },
};

export default function PopulationRankingLayout({
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