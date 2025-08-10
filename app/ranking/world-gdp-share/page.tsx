"use client";
import RankingList from "@/components/ranking/ranking-list";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function WorldGDPShareRankingPage() {
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

        <RankingList topic="world-gdp-share" showHeader={true} />

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            World GDP Share represents each country's percentage contribution to
            the total global gross domestic product, showing economic influence
            on the world stage.
          </p>
        </div>
      </div>
    </div>
  );
}
