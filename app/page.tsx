"use client";

import { useEffect, useRef, useState } from "react";
import { CountryCard } from "@/components/CountryCard";
import { Navbar } from "@/components/navigation/Navbar";
import countryData from "./api/data.json";
import { useRouter } from "next/navigation";

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
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold">Featured Countries</h2>
                  <button className="text-blue-500 hover:underline">
                    View All ↗
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                  <div
                    ref={carouselRef}
                    className="flex gap-5 overflow-x-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {[...countryData, ...countryData].map((country, index) => (
                      <div
                        key={`${country.name}-${index}`}
                        className="flex-shrink-0"
                        onClick={() => handleCountrySelect(country.name)}
                        style={{ cursor: "pointer" }}
                      >
                        <CountryCard
                          name={country.name}
                          flag={country.flag}
                          population={country.population}
                          gdpNominal={country.gdpNominal}
                          worldGdpShare={country.worldGdpShare}
                          revenue={country.revenue}
                          spending={country.spending}
                          code={country.code}
                          currency={country.currency}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
