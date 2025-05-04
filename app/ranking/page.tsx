"use client";

import { notFound } from "next/navigation";
import data from "../api/data.json";
import Image from "next/image";
import Link from "next/link";
import { Country, validTopics, ValidTopic } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChartBarIcon,
  GlobeAltIcon,
  UsersIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

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

const getValue = (country: Country, topic: ValidTopic): number => {
  if (topic === "gdp-nominal") return country.gdpNominal;
  if (topic === "world-gdp-share") return country.worldGdpShare;
  if (topic === "spending")
    return (
      country.spending.find((item) => item.subtype === "total")?.amount ?? 0
    );
  if (topic === "revenue")
    return (
      country.revenue.find((item) => item.subtype === "total")?.amount ?? 0
    );
  if (topic === "population") return country.population;
  return 0;
};

const getTopicData = (topic: ValidTopic): Country[] => {
  let sortedData = [...data].map((country) => ({
    name: country.name,
    flag: country.flag.replace("w40", "w320"),
    code: country.code,
    population: country.population,
    gdpNominal: country.gdpNominal,
    worldGdpShare: country.worldGdpShare,
    spending: country.spending,
    revenue: country.revenue,
    currency: country.currency,
    capital: country.capital,
    taxBurdenPerCapita: country.taxBurdenPerCapita,
    debtToGdp: country.debtToGdp,
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

const TopicIcons: Record<ValidTopic, React.ElementType> = {
  population: UsersIcon,
  "gdp-nominal": ChartBarIcon,
  "world-gdp-share": GlobeAltIcon,
  spending: BanknotesIcon,
  revenue: BuildingLibraryIcon,
};

const TopicDescriptions: Record<ValidTopic, string> = {
  population: "Total number of inhabitants in each country",
  "gdp-nominal": "Gross Domestic Product in current US dollars",
  "world-gdp-share": "Percentage share of global GDP",
  spending: "Total government expenditure",
  revenue: "Total government income and tax collection",
};

const RankingList = ({ topic }: { topic: ValidTopic }) => {
  const rankingData = getTopicData(topic);
  const topicTitle = TopicTitles[topic];
  const TopicIcon = TopicIcons[topic];

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="w-24 font-medium text-gray-500">Rank</div>
        <div className="font-medium text-gray-500">Country</div>
        <div className="w-48 text-right font-medium text-gray-500">
          {topicTitle}
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {rankingData.map((country, index) => (
          <li
            key={country.code}
            className="hover:bg-blue-50 transition-colors duration-150"
          >
            <Link
              href={`/${getCountrySlug(country.name)}`}
              className="px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center"
            >
              <div className="w-24 flex items-center">
                <span
                  className={`
                  text-2xl font-bold rounded-lg px-4 py-2
                  ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : index === 1
                      ? "bg-gray-100 text-gray-700"
                      : index === 2
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-400"
                  }
                `}
                >
                  #{index + 1}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex-shrink-0">
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={40}
                    height={40}
                    className="rounded-sm object-contain shadow-sm"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{country.name}</p>
                  <p className="text-sm text-gray-500">{country.capital}</p>
                </div>
              </div>
              <div className="w-48 text-right">
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
  );
};

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="population" className="w-full space-y-8">
          <div className="space-y-4">
            <TabsList className="w-full flex justify-center bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200">
              {validTopics.map((topic) => {
                const TopicIcon = TopicIcons[topic];
                return (
                  <TabsTrigger
                    key={topic}
                    value={topic}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-white/50 rounded-lg"
                  >
                    <TopicIcon className="w-4 h-4" />
                    {TopicTitles[topic]}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {validTopics.map((topic) => (
            <TabsContent key={topic} value={topic}>
              <RankingList topic={topic} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
