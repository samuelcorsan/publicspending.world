"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { WorldRankings } from "@/components/landing/world-rankings";
import Hero from "@/components/landing/hero";

export default function Home() {
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/countries-live')
      .then(res => {
        if (res.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before making more requests.');
        }
        return res.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setCountryData(data);
        setLoading(false);
      })
      .catch(error => {
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
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">
                    Loading countries...
                  </span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
                    <div className="text-red-600 text-lg font-semibold mb-2">
                      Error
                    </div>
                    <div className="text-red-700 mb-4">{error}</div>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
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
