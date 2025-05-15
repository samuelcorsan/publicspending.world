"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChartBarIcon,
  GlobeAltIcon,
  UsersIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

const validTopics = [
  "population",
  "gdp-nominal",
  "world-gdp-share",
  "spending",
  "revenue",
] as const;
type ValidTopic = (typeof validTopics)[number];

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

interface Country {
  name: string;
  code: string;
  flag: string;
  capital: string;
  gdpNominal: number;
  worldGdpShare: number;
  population: number;
  spending: Array<{ subtype: string; amount: number }>;
  revenue: Array<{ subtype: string; amount: number }>;
}

interface WorldRankingsProps {
  countries: Country[];
}

export function WorldRankings({ countries }: WorldRankingsProps) {
  const router = useRouter();

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

  const getValue = (country: Country, topic: ValidTopic): number => {
    if (topic === "gdp-nominal") return country.gdpNominal;
    if (topic === "world-gdp-share") return country.worldGdpShare;
    if (topic === "spending")
      return country.spending.find((item) => item.subtype === "total")?.amount ?? 0;
    if (topic === "revenue")
      return country.revenue.find((item) => item.subtype === "total")?.amount ?? 0;
    if (topic === "population") return country.population;
    return 0;
  };

  const getTopicData = (topic: ValidTopic) => {
    let sortedData = countries.map((country) => ({
      ...country,
      flag: country.flag.replace("w40", "w320"),
    }));

    return sortedData
      .sort((a, b) => getValue(b, topic) - getValue(a, topic))
      .slice(0, 10);
  };

  const handleCountrySelect = (countryName: string) => {
    const slug = countryName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${slug}`);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-blue-500 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          World Rankings
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the world's leading economies and their key metrics. Our prestigious
          rankings showcase the most comprehensive and up-to-date global economic data.
        </p>
      </div>

      <Tabs defaultValue="population" className="w-full space-y-4">
        <TabsList className="w-full flex justify-start overflow-x-auto scrollbar-hide bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200">
          {validTopics.map((topic) => {
            const TopicIcon = TopicIcons[topic];
            const isDisabled = topic !== "population";
            return (
              <TabsTrigger
                key={topic}
                value={topic}
                disabled={isDisabled}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-lg
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed backdrop-blur-sm"
                      : "data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-white/50"
                  }`}
              >
                <TopicIcon />
                {TopicTitles[topic]}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {validTopics.map((topic) => (
          <TabsContent key={topic} value={topic}>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="w-16 sm:w-24 font-medium text-gray-500">Rank</div>
                <div className="font-medium text-gray-500">Country</div>
                <div className="w-32 sm:w-48 text-right font-medium text-gray-500">
                  {TopicTitles[topic]}
                </div>
              </div>
              <div className="relative">
                <ul className="divide-y divide-gray-100">
                  {getTopicData(topic).map((country, index) => (
                    <li
                      key={country.code}
                      className={`hover:bg-blue-50 transition-colors duration-150 ${
                        index >= 4
                          ? "blur-[6px] border-none"
                          : "border-b border-gray-100"
                      }`}
                      onClick={() => handleCountrySelect(country.name)}
                    >
                      <div className="px-3 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 items-center cursor-pointer">
                        <div className="w-16 sm:w-24 flex items-center">
                          <span
                            className={`
                              text-lg sm:text-2xl font-bold rounded-lg px-2 sm:px-4 py-1 sm:py-2
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
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {country.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {country.capital}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base sm:text-lg font-semibold text-gray-900">
                            {topic === "world-gdp-share"
                              ? `${getValue(country, topic)}%`
                              : formatNumber(getValue(country, topic))}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ top: "200px" }}
                >
                  <Link
                    href="/ranking"
                    className="z-10 group transition-transform hover:scale-105"
                  >
                    <button className="bg-blue-500 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-all shadow-lg text-lg font-semibold cursor-pointer flex items-center gap-2 group-hover:gap-3">
                      View Complete Rankings
                      <svg
                        className="w-5 h-5 transition-transform group-hover:transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
