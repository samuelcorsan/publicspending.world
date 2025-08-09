import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Rankings | GDP Rankings, Population Rankings & Government Spending",
  description: "World rankings by GDP, population, government spending, revenue and economic indicators. Compare countries rankings across key fiscal metrics and economic data worldwide.",
  keywords: "world rankings, GDP rankings, population rankings, country rankings, government spending rankings, economic rankings, fiscal rankings, countries by GDP, countries by population, world economic data, global rankings",
  openGraph: {
    title: "World Rankings - GDP, Population & Government Spending",
    description: "Discover world rankings by GDP, population, government spending. Interactive global rankings and countries comparison across economic indicators.",
    url: "https://publicspending.world/ranking",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Rankings - GDP & Population Rankings",
    description: "Explore world rankings by GDP, population, government spending. Comprehensive countries rankings and economic indicators worldwide.",
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
