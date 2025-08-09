import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Spending Rankings - Countries by Public Expenditure",
  description: "Explore countries ranked by government spending and public expenditure. Discover which nations allocate the most resources to public services and infrastructure.",
  keywords: "government spending rankings, public expenditure, government budget, fiscal spending, public sector spending, government outlays, budget expenditure rankings",
  openGraph: {
    title: "Government Spending Rankings - Public Expenditure by Country",
    description: "See how countries rank by government spending. Explore public expenditure and fiscal allocation worldwide.",
    url: "https://publicspending.world/ranking/spending",
    siteName: "PublicSpending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Spending Rankings Worldwide",
    description: "Discover which countries have the highest government spending and public expenditure levels.",
  },
  alternates: {
    canonical: "https://publicspending.world/ranking/spending",
  },
};

export default function SpendingRankingLayout({
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