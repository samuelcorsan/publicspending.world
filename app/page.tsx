"use client";

import { useEffect, useRef, useState } from "react";
import { CountryCard } from "@/components/CountryCard";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/Footer";
import countryData from "./api/data.json";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChartBarIcon,
  GlobeAltIcon,
  UsersIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { BentoGridCharts } from "@/components/charts/BentoGridCharts";

export default function Home() {
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const filteredCountries = countryData.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCountrySlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const handleCountrySelect = (countryName: string) => {
    const slug = getCountrySlug(countryName);
    router.push(`/${slug}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!carouselRef.current || isHovered) return;

    const scrollContainer = carouselRef.current;
    const totalWidth = scrollContainer.scrollWidth;
    const containerWidth = scrollContainer.offsetWidth;
    let currentScroll = scrollContainer.scrollLeft;
    let animationFrameId: number;

    const scroll = () => {
      if (!carouselRef.current) return;

      currentScroll += 1;
      if (currentScroll >= totalWidth - containerWidth) {
        currentScroll = 0;
      }

      carouselRef.current.scrollLeft = currentScroll;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

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

  const getValue = (country: any, topic: ValidTopic): number => {
    if (topic === "gdp-nominal") return country.gdpNominal;
    if (topic === "world-gdp-share") return country.worldGdpShare;
    if (topic === "spending")
      return (
        country.spending.find((item: any) => item.subtype === "total")
          ?.amount ?? 0
      );
    if (topic === "revenue")
      return (
        country.revenue.find((item: any) => item.subtype === "total")?.amount ??
        0
      );
    if (topic === "population") return country.population;
    return 0;
  };

  const getTopicData = (topic: ValidTopic) => {
    let sortedData = [...countryData].map((country) => ({
      ...country,
      flag: country.flag.replace("w40", "w320"),
    }));

    return sortedData
      .sort((a, b) => getValue(b, topic) - getValue(a, topic))
      .slice(0, 10);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex flex-col items-center pt-32 px-4 md:px-8 lg:px-16">
          <main className="max-w-7xl w-full">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                World Public
                <br />
                Spending Data
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl">
                Better <span className="text-blue-500">insights</span>, better{" "}
                <span className="text-blue-500">transparency</span>, no
                barriers.
              </p>

              <div className="w-full max-w-2xl relative mb-16" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search for a country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 shadow-sm"
                />
                {isSearchFocused && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-auto z-10">
                    {countryData.map((country) => (
                      <button
                        key={country.name}
                        className={`flex items-center gap-3 w-full p-3 hover:bg-gray-50 text-left ${
                          search &&
                          !country.name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                            ? "hidden"
                            : ""
                        }`}
                        onClick={() => {
                          handleCountrySelect(country.name);
                          setIsSearchFocused(false);
                        }}
                      >
                        <img
                          src={country.flag}
                          alt={`${country.name} flag`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

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
                    Discover the world's leading economies and their key
                    metrics. Our prestigious rankings showcase the most
                    comprehensive and up-to-date global economic data.
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
                          <TopicIcon className="w-4 h-4" />
                          {TopicTitles[topic]}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {validTopics.map((topic) => (
                    <TabsContent key={topic} value={topic}>
                      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                          <div className="w-16 sm:w-24 font-medium text-gray-500">
                            Rank
                          </div>
                          <div className="font-medium text-gray-500">
                            Country
                          </div>
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
                                onClick={() =>
                                  handleCountrySelect(country.name)
                                }
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
                                        : formatNumber(
                                            getValue(country, topic)
                                          )}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          {/* Centered View Rankings button */}
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
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
