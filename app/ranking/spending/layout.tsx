import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Spending Rankings | Countries by Public Spending 2025",
  description: "Government spending rankings by country 2025. Countries ranked by public expenditure, fiscal spending and government budget allocation worldwide.",
  keywords: "government spending rankings, countries by government spending, public spending by country, government expenditure rankings, fiscal spending rankings, public sector spending, budget spending rankings, countries public spending 2025",
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