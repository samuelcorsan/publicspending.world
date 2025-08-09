import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "World GDP Share Rankings | Countries by Global Economy Share 2025",
  description: "World GDP share rankings by country 2025. Countries ranked by their percentage of global economy and world GDP contribution.",
  keywords: "world GDP share rankings, countries by GDP share, global economy share, world economy rankings, country GDP percentage, economic contribution rankings, global economic share, countries world GDP 2025",
  openGraph: {
    title: "World GDP Share Rankings - Global Economic Contribution",
    description: "See how countries contribute to the world economy. Rankings by percentage share of global GDP.",
    url: "https://publicspending.world/ranking/world-gdp-share",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World GDP Share Rankings by Country",
    description: "Discover each country's percentage contribution to the global economy and world GDP.",
  },
  alternates: {
    canonical: "https://publicspending.world/ranking/world-gdp-share",
  },
};

export default function WorldGDPShareRankingLayout({
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