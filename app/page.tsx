"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { WorldRankings } from "@/components/landing/world-rankings";
import Hero from "@/components/landing/hero";

export default function Home() {
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setCountryData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
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
                  <span className="ml-3 text-gray-600">Loading countries...</span>
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
