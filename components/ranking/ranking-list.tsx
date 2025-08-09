"use client";
import Image from "next/image";
import Link from "next/link";
import { Country, ValidTopic } from "@/lib/types";
import {
  ChartBarIcon,
  GlobeAltIcon,
  UsersIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { SVGProps } from "react";

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

const getTopicData = (topic: ValidTopic, countries: any[]): Country[] => {
  if (!countries || countries.length === 0) return [];
  
  let sortedData = [...countries].map((country) => ({
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
    debtToGdp: country.debtToGdp,
  }));

  return sortedData.sort((a, b) => getValue(b, topic) - getValue(a, topic));
};

export const TopicTitles: Record<ValidTopic, string> = {
  population: "Population",
  "gdp-nominal": "GDP (Nominal)",
  "world-gdp-share": "World GDP Share",
  spending: "Government Spending",
  revenue: "Government Revenue",
};

export const TopicIcons: Record<
  ValidTopic,
  React.ComponentType<SVGProps<SVGSVGElement>>
> = {
  population: UsersIcon,
  "gdp-nominal": ChartBarIcon,
  "world-gdp-share": GlobeAltIcon,
  spending: BanknotesIcon,
  revenue: BuildingLibraryIcon,
};

interface RankingListProps {
  topic: ValidTopic;
  showHeader?: boolean;
  countries?: any[];
}

export default function RankingList({ topic, showHeader = true, countries = [] }: RankingListProps) {
  const rankingData = getTopicData(topic, countries);
  const topicTitle = TopicTitles[topic];
  const TopicIcon = TopicIcons[topic];

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      {showHeader && (
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <TopicIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{topicTitle} Rankings</h1>
              <p className="text-gray-600 mt-1">
                Global country rankings by {topicTitle.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="w-16 sm:w-24 font-medium text-gray-500">
          Rank
        </div>
        <div className="font-medium text-gray-500">Country</div>
        <div className="w-32 sm:w-48 text-right font-medium text-gray-500">
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
              className="px-3 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 items-center"
            >
              <div className="w-16 sm:w-24 flex items-center">
                <span
                  className={`
                  text-lg sm:text-2xl font-bold rounded-xl px-2 sm:px-4 py-1 sm:py-2
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
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
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
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {country.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {country.capital}
                  </p>
                </div>
              </div>
              <div className="w-32 sm:w-48 text-right">
                <p className="text-base sm:text-lg font-semibold text-gray-900">
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
}