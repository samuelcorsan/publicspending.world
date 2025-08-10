"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { validTopics } from "@/lib/types";
import { TopicTitles, TopicIcons } from "@/components/ranking/ranking-list";

export function SkeletonRankings() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      {/* Real title - no skeleton needed */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          World Rankings
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the top countries by key economic and demographic indicators
        </p>
      </div>

      {/* Real tabs - no skeleton needed */}
      <Tabs defaultValue="population" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          {validTopics.map((topic) => {
            const TopicIcon = TopicIcons[topic];
            const topicTitle = TopicTitles[topic];
            return (
              <TabsTrigger
                key={topic}
                value={topic}
                className="flex items-center gap-2 text-sm"
              >
                <TopicIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{topicTitle}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Only the ranking data needs skeleton */}
        {validTopics.map((topic) => {
          const TopicIcon = TopicIcons[topic];
          const topicTitle = TopicTitles[topic];

          return (
            <TabsContent key={topic} value={topic}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                {/* Real header - no skeleton needed */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TopicIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Top 10 Countries by {topicTitle}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500">Live Data</span>
                  </div>
                </div>

                {/* Real table header - no skeleton needed */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-500">Rank</div>
                  <div className="text-sm font-medium text-gray-500">
                    Country
                  </div>
                  <div className="text-sm font-medium text-gray-500 text-right">
                    {topicTitle}
                  </div>
                </div>

                {/* Only skeleton the country data */}
                <div className="divide-y divide-gray-100">
                  {Array.from({ length: 10 }, (_, index) => (
                    <div
                      key={index}
                      className={`px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center animate-pulse ${
                        index >= 4 ? "opacity-50" : ""
                      }`}
                    >
                      {/* Rank skeleton */}
                      <div className="w-16 flex items-center">
                        <div className="h-10 w-12 bg-gray-200 rounded-xl"></div>
                      </div>

                      {/* Country info skeleton */}
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-gray-200 rounded-sm flex-shrink-0"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-100 rounded w-20"></div>
                        </div>
                      </div>

                      {/* Value skeleton */}
                      <div className="w-24 text-right">
                        <div className="h-5 bg-gray-200 rounded w-20 ml-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Blur overlay for bottom items */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Real view all button - no skeleton needed */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed">
          Loading...
        </div>
      </div>
    </div>
  );
}
