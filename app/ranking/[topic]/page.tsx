import { notFound } from "next/navigation";
import data from "../../api/data.json";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

const validTopics = [
  "population",
  "gdp-nominal",
  "world-gdp-share",
  "spending",
  "revenue",
] as const;
type ValidTopic = (typeof validTopics)[number];

interface CountryData {
  name: string;
  flag: string;
  code: string;
  population: number;
  gdpNominal: number;
  worldGdpShare: number;
  spending: number;
  revenue: number;
}

const formatNumber = (num: number) => {
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  return num.toLocaleString();
};

const getCountrySlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

const getValue = (country: CountryData, topic: ValidTopic): number => {
  if (topic === "gdp-nominal") return country.gdpNominal;
  if (topic === "world-gdp-share") return country.worldGdpShare;
  return country[topic];
};

const getTopicData = (topic: ValidTopic): CountryData[] => {
  let sortedData = [...data].map((country) => ({
    name: country.name,
    flag: country.flag.replace("w40", "w320"),
    code: country.code,
    population: country.population,
    gdpNominal: country.gdpNominal,
    worldGdpShare: country.worldGdpShare,
    spending:
      country.spending.find((item) => item.subtype === "total")?.amount ?? 0,
    revenue:
      country.revenue.find((item) => item.subtype === "total")?.amount ?? 0,
  }));

  return sortedData.sort((a, b) => getValue(b, topic) - getValue(a, topic));
};

const TopicTitles: Record<ValidTopic, string> = {
  population: "Population",
  "gdp-nominal": "GDP (Nominal)",
  "world-gdp-share": "World GDP Share",
  spending: "Government Spending",
  revenue: "Government Revenue",
};

const TopicDescriptions: Record<ValidTopic, string> = {
  population:
    "Countries ranked by total population size. Compare demographic data and population statistics for all nations.",
  "gdp-nominal":
    "Countries ranked by Gross Domestic Product (GDP). Compare economic output and market value of goods and services by nation.",
  "world-gdp-share":
    "Countries ranked by their share of global GDP. See which nations contribute most to the world economy.",
  spending:
    "Countries ranked by government spending. Compare public expenditure and state budgets across nations.",
  revenue:
    "Countries ranked by government revenue. Compare tax collection and public income across different nations.",
};

//TODO: To fix
/* export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!validTopics.includes(topic as ValidTopic)) {
    notFound();
  }

  const title = TopicTitles[topic as ValidTopic];
  const description = TopicDescriptions[topic as ValidTopic];

  return {
    title: `${title} Ranking | publicspending.world`,
    description,
    openGraph: {
      title: `Countries Ranked by ${title} | Global ${title} Rankings`,
      description,
      url: `https://publicspending.world/ranking/${topic}`,
      siteName: "publicspending.world",
      type: "website",
    },
    alternates: {
      canonical: `https://publicspending.world/ranking/${topic}`,
    },
  };
} */

export default function RankingPage({ params }: { params: { topic: string } }) {
  if (!validTopics.includes(params.topic as ValidTopic)) {
    notFound();
  }

  const topic = params.topic as ValidTopic;
  const rankingData = getTopicData(topic);
  const topicTitle = TopicTitles[topic];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Countries Ranked by {topicTitle}
          </h1>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200">
            {rankingData.map((country, index) => (
              <li key={country.code} className="hover:bg-gray-50">
                <Link
                  href={`/${getCountrySlug(country.name)}`}
                  className="px-6 py-4 flex items-center"
                >
                  <div className="flex-shrink-0 w-16 text-2xl font-bold text-gray-500">
                    #{index + 1}
                  </div>
                  <div className="flex-shrink-0 h-10 w-10 mr-4 flex items-center justify-center">
                    <Image
                      src={country.flag}
                      alt={`${country.name} flag`}
                      width={40}
                      height={40}
                      className="rounded-sm object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-medium text-gray-900">
                      {country.name}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {topic === "world-gdp-share"
                        ? `${country.worldGdpShare}%`
                        : formatNumber(getValue(country, topic))}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
