"use client";

import { SearchBar } from "./search-bar";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const DynamicGlobe = dynamic(() => import("@/components/landing/globe"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch("/api/countries?mode=search")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch countries");
        }
        return res.json();
      })
      .then((data) => {
        setCountries(data.countries || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
        setError(err.message || "Failed to load countries");
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="relative z-[1] w-full">
      <div className="relative h-[820px] w-full before:absolute before:inset-0 before:bottom-0 before:z-[1] md:before:[mask-image:radial-gradient(ellipse_30%_40%_at_50%_20%,transparent_50%,#000_100%)] before:[mask-image:radial-gradient(ellipse_70%_30%_at_50%_20%,transparent_50%,#000_100%)] before:bg-gray-50 dark:before:bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="h-full w-full flex items-center justify-center"></div>
        </div>

        <div className="absolute inset-0 h-full w-full">
          <DynamicGlobe />
        </div>
      </div>

      <div className="px-6 lg:px-8 absolute inset-x-0 top-1/4 z-10">
        <div className="mx-auto max-w-5xl py-16 sm:py-28">
          <div className="text-center max-w-3xl mx-auto relative z-[1]">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-800 dark:text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 via-white to-neutral-300 sm:text-6xl">
              Explore Government Spending Worldwide
            </h1>
            <h2 className="mt-6 md:mt-8 text-balance text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Discover how governments around the world allocate and spend
              public funds. Compare spending patterns, explore fiscal policies,
              and gain insights into public financial transparency.
            </h2>
            <div className="mt-8 md:mt-10 flex items-center justify-center gap-x-6">
              <SearchBar
                countries={countries}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
