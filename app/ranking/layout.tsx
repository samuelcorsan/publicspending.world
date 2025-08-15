import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "World Rankings | GDP Rankings, Population Rankings & Economic Indicators",
  description:
    "World rankings by GDP, population and economic indicators. Compare countries rankings across key economic metrics and demographic data worldwide.",
  keywords:
    "world rankings, GDP rankings, population rankings, country rankings, economic rankings, countries by GDP, countries by population, world economic data, global rankings",
  openGraph: {
    title: "World Rankings - GDP, Population & Economic Indicators",
    description:
      "Discover world rankings by GDP, population and economic indicators. Interactive global rankings and countries comparison across economic data.",
    url: "https://publicspending.world/ranking",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Rankings - GDP & Population Rankings",
    description:
      "Explore world rankings by GDP, population and economic indicators. Comprehensive countries rankings and economic data worldwide.",
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
