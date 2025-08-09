import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDP Rankings - Countries by Nominal GDP (Gross Domestic Product)",
  description: "Explore countries ranked by nominal GDP. Discover the world's largest economies and their economic output in absolute terms.",
  keywords: "GDP rankings, nominal GDP, largest economies, economic output, country GDP, world economy, economic data, gross domestic product rankings",
  openGraph: {
    title: "Global GDP Rankings - Countries by Economic Output",
    description: "See how countries rank by nominal GDP. Explore the world's largest economies and their economic performance.",
    url: "https://publicspending.world/ranking/gdp-nominal",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World GDP Rankings - Largest Economies by GDP",
    description: "Discover which countries have the highest nominal GDP and economic output worldwide.",
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