"use client";
import { useState, useEffect } from "react";
import RankingList from "@/components/ranking/ranking-list";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function GDPRankingPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/countries-live')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/ranking"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            All Rankings
          </Link>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading GDP rankings...</span>
          </div>
        ) : (
          <RankingList topic="gdp-nominal" showHeader={true} countries={countries} />
        )}
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            GDP (Nominal) represents the total value of goods and services produced 
            within each country at current market prices in USD.
          </p>
        </div>
      </div>
    </div>
  );
}