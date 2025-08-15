"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { WorldRankings } from "@/components/ranking/world-rankings";
import Hero from "@/components/landing/hero";
import { ErrorState } from "@/components/ui/error-state";
import { SkeletonRankings } from "@/components/ui/skeleton-rankings";

export default function Home() {
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/countries?page=1&topic=population&sortOrder=desc")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        const countries = data.countries || [];
        setCountryData(countries);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex flex-col items-center pt-2 px-4 md:px-8 lg:px-16">
          <main className="max-w-7xl w-full">
            <div className="flex flex-col items-center text-center mb-12">
              <Hero />
              {loading ? (
                <SkeletonRankings />
              ) : error ? (
                <ErrorState
                  title="Failed to load rankings"
                  message={error}
                  onRetry={() => window.location.reload()}
                />
              ) : (
                <WorldRankings countries={countryData} />
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
