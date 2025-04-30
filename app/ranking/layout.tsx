import Link from "next/link";
import { Navbar } from "../../components/navigation/Navbar";

const topics = [
  { id: "population", name: "Population List" },
  { id: "gdp-nominal", name: "GDP List" },
  { id: "world-gdp-share", name: "GDP Share List" },
  { id: "spending", name: "Spending List" },
  { id: "revenue", name: "Revenue List" },
];

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar rankingTopics={topics} hideAbout={true} />
      <main>{children}</main>
    </div>
  );
}
