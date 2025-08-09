import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Population Rankings - Countries by Population Size",
  description: "Discover countries ranked by population size worldwide. Explore demographic data and population statistics for nations across the globe.",
  keywords: "population rankings, countries by population, world population, demographic data, population statistics, most populated countries, global demographics",
  openGraph: {
    title: "Global Population Rankings - Countries by Population Size",
    description: "See how countries rank by population size. From the most populous nations to smaller countries, explore global demographic data.",
    url: "https://publicspending.world/ranking/population",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Population Rankings by Country",
    description: "Discover which countries have the largest populations worldwide with interactive demographic rankings.",
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