import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "World GDP Share Rankings - Countries by Global Economic Contribution",
  description: "Explore countries ranked by their share of world GDP. Discover each nation's percentage contribution to the global economy.",
  keywords: "world GDP share, global economy share, economic contribution, country GDP percentage, world economy rankings, global economic data",
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