"use client";
import RankingList from "@/components/ranking/ranking-list";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function RevenueRankingPage() {
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
        
        <RankingList topic="revenue" showHeader={true} />
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Government revenue represents the total income collected by each country through 
            taxes, fees, and other sources to fund public services and operations.
          </p>
        </div>
      </div>
    </div>
  );
}