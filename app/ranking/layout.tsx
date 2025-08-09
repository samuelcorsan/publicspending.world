import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Country Rankings - Economic & Demographic Data",
  description: "Explore comprehensive country rankings by GDP, population, government spending, and revenue. Compare economic indicators and fiscal data across all nations.",
  keywords: "country rankings, GDP rankings, population rankings, government spending rankings, global economic data, country comparison, world statistics, economic indicators",
  openGraph: {
    title: "Global Country Rankings - Economic & Demographic Data",
    description: "Discover how countries rank across key economic and demographic indicators. Interactive global rankings and comparisons.",
    url: "https://publicspending.world/ranking",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Country Rankings Hub",
    description: "Explore comprehensive rankings of countries by economic and demographic indicators worldwide.",
  },
  alternates: {
    canonical: "https://publicspending.world/ranking",
  },
};

export default function RankingLayout({
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
