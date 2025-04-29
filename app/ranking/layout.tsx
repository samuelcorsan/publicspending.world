import Link from "next/link";

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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/ranking/spending"
                  className="text-xl font-bold text-gray-800 hover:text-gray-600"
                >
                  publicspending.world
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/ranking/${topic.id}`}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    {topic.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
