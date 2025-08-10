"use client";
import Image from "next/image";
import Link from "next/link";
import { Country, ValidTopic } from "@/lib/types";
import {
  ChartBarIcon,
  GlobeAltIcon,
  UsersIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { SVGProps } from "react";
import { useInfiniteCountries } from "@/lib/hooks/use-infinite-countries";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { SkeletonCountryList } from "@/components/ui/skeleton-country-row";
import { InlineErrorState } from "@/components/ui/error-state";

const formatNumber = (num: number): string => {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  return num.toLocaleString();
};

const getCountrySlug = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, "-");

const getValue = (country: Country, topic: ValidTopic): number => {
  switch (topic) {
    case "gdp-nominal":
      return country.gdpNominal;
    case "world-gdp-share":
      return country.worldGdpShare;
    case "spending":
      return (
        country.spending.find((item) => item.subtype === "total")?.amount ?? 0
      );
    case "revenue":
      return (
        country.revenue.find((item) => item.subtype === "total")?.amount ?? 0
      );
    case "population":
      return country.population;
    default:
      return 0;
  }
};

export const TopicTitles: Record<ValidTopic, string> = {
  population: "Population",
  "gdp-nominal": "GDP (Nominal)",
  "world-gdp-share": "World GDP Share",
  spending: "Government Spending",
  revenue: "Government Revenue",
};

export const TopicIcons: Record<
  ValidTopic,
  React.ComponentType<SVGProps<SVGSVGElement>>
> = {
  population: UsersIcon,
  "gdp-nominal": ChartBarIcon,
  "world-gdp-share": GlobeAltIcon,
  spending: BanknotesIcon,
  revenue: BuildingLibraryIcon,
};

interface RankingListProps {
  topic: ValidTopic;
  showHeader?: boolean;
}

const getRankBadgeClass = (rank: number): string => {
  if (rank === 1) return "bg-yellow-100 text-yellow-700";
  if (rank === 2) return "bg-gray-100 text-gray-700";
  if (rank === 3) return "bg-orange-100 text-orange-700";
  return "text-gray-400";
};

const RankingHeader = ({
  TopicIcon,
  topicTitle,
}: {
  TopicIcon: any;
  topicTitle: string;
}) => (
  <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
    <div className="flex items-center gap-3">
      <TopicIcon className="w-8 h-8 text-blue-600" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {topicTitle} Rankings
        </h1>
        <p className="text-gray-600 mt-1">
          Global country rankings by {topicTitle.toLowerCase()}
        </p>
      </div>
    </div>
  </div>
);

const LoadingState = ({
  showHeader,
  TopicIcon,
  topicTitle,
}: {
  showHeader: boolean;
  TopicIcon: any;
  topicTitle: string;
}) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
    {showHeader && (
      <RankingHeader TopicIcon={TopicIcon} topicTitle={topicTitle} />
    )}

    {/* Table header */}
    <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="w-16 sm:w-24 font-medium text-gray-500">Rank</div>
      <div className="font-medium text-gray-500">Country</div>
      <div className="w-32 sm:w-48 text-right font-medium text-gray-500">
        {topicTitle}
      </div>
    </div>

    {/* Skeleton rows */}
    <ul className="divide-y divide-gray-100">
      {Array.from({ length: 20 }, (_, index) => (
        <li
          key={index}
          className="px-3 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 items-center animate-pulse"
        >
          <div className="w-16 sm:w-24 flex items-center">
            <div className="h-8 sm:h-12 w-12 sm:w-16 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-sm flex-shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-32 sm:w-40"></div>
              <div className="h-3 sm:h-4 bg-gray-100 rounded w-20 sm:w-24"></div>
            </div>
          </div>
          <div className="w-32 sm:w-48 text-right">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-20 sm:w-28 ml-auto"></div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const RankingErrorState = ({
  TopicIcon,
  topicTitle,
  showHeader,
  onRetry,
}: {
  TopicIcon: any;
  topicTitle: string;
  showHeader: boolean;
  onRetry?: () => void;
}) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
    {showHeader && (
      <RankingHeader TopicIcon={TopicIcon} topicTitle={topicTitle} />
    )}
    <InlineErrorState message="Failed to load ranking data" onRetry={onRetry} />
  </div>
);

export default function RankingList({
  topic,
  showHeader = true,
}: RankingListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteCountries(topic);

  const topicTitle = TopicTitles[topic];
  const TopicIcon = TopicIcons[topic];
  const allCountries = data?.pages.flatMap((page) => page.countries) || [];

  if (isLoading)
    return (
      <LoadingState
        showHeader={showHeader}
        TopicIcon={TopicIcon}
        topicTitle={topicTitle}
      />
    );
  if (error)
    return (
      <RankingErrorState
        TopicIcon={TopicIcon}
        topicTitle={topicTitle}
        showHeader={showHeader}
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      {showHeader && (
        <RankingHeader TopicIcon={TopicIcon} topicTitle={topicTitle} />
      )}

      <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="w-16 sm:w-24 font-medium text-gray-500">Rank</div>
        <div className="font-medium text-gray-500">Country</div>
        <div className="w-32 sm:w-48 text-right font-medium text-gray-500">
          {topicTitle}
        </div>
      </div>

      <InfiniteScroll
        onLoadMore={() => fetchNextPage()}
        hasNextPage={!!hasNextPage}
        isLoading={isFetchingNextPage}
      >
        <ul className="divide-y divide-gray-100">
          {allCountries.map((country, index) => (
            <li
              key={`${country.code}-${country.rank}`}
              className="hover:bg-blue-50 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${(index % 20) * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <Link
                href={`/${getCountrySlug(country.name)}`}
                className="px-3 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 items-center"
              >
                <div className="w-16 sm:w-24 flex items-center">
                  <span
                    className={`text-lg sm:text-2xl font-bold rounded-xl px-2 sm:px-4 py-1 sm:py-2 ${getRankBadgeClass(
                      country.rank
                    )}`}
                  >
                    #{country.rank}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    <Image
                      src={country.flag.replace("w40", "w320")}
                      alt={`${country.name} flag`}
                      width={40}
                      height={40}
                      className="rounded-sm object-contain shadow-sm"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {country.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {country.capital}
                    </p>
                  </div>
                </div>
                <div className="w-32 sm:w-48 text-right">
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {topic === "world-gdp-share"
                      ? `${country.worldGdpShare}%`
                      : formatNumber(getValue(country, topic))}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
