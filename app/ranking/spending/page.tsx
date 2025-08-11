"use client";
import RankingList from "@/components/ranking/ranking-list";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { DataAccuracyWarning } from "@/components/ui/data-accuracy-warning";

export default function SpendingRankingPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/ranking"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            All Rankings
          </Link>

          <DataAccuracyWarning
            type="spending"
            className="mb-0 flex-shrink-0"
            compact
          />
        </div>

        <RankingList topic="spending" showHeader={true} />

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Government spending represents the total public expenditure
            allocated by each country for public services, infrastructure,
            defense, and social programs.
          </p>
        </div>
      </div>
    </div>
  );
}
