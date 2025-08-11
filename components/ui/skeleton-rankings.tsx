"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { validTopics } from "@/types/country";
import { TopicTitles, TopicIcons } from "@/components/ranking/ranking-list";

export function SkeletonRankings() {
  const [activeTab, setActiveTab] = useState("population");

  return (
    <div className="w-full">
      <Tabs
        defaultValue="population"
        className="w-full space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full flex justify-start overflow-x-auto scrollbar-hide bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200">
          {validTopics.map((topic) => {
            const TopicIcon = TopicIcons[topic];
            return (
              <TabsTrigger
                key={topic}
                value={topic}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-white/50"
              >
                <TopicIcon className="w-4 h-4" />
                {TopicTitles[topic]}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {validTopics.map((topic) => (
          <TabsContent key={topic} value={topic}>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="w-16 sm:w-24 font-medium text-gray-500">
                  Rank
                </div>
                <div className="font-medium text-gray-500">Country</div>
                <div className="w-32 sm:w-48 text-right font-medium text-gray-500">
                  {TopicTitles[topic]}
                </div>
              </div>
              <div className="relative">
                <ul className="divide-y divide-gray-100">
                  {Array.from({ length: 10 }, (_, index) => (
                    <li
                      key={index}
                      className={`px-3 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 items-center animate-pulse ${
                        index >= 4 ? "blur-[6px] opacity-50" : ""
                      }`}
                    >
                      {/* Rank skeleton */}
                      <div className="w-16 sm:w-24 flex items-center">
                        <div className="h-8 sm:h-12 w-12 sm:w-16 bg-gray-200 rounded-xl"></div>
                      </div>

                      {/* Country info skeleton */}
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-sm flex-shrink-0"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 sm:h-5 bg-gray-200 rounded w-32 sm:w-40"></div>
                          <div className="h-3 sm:h-4 bg-gray-100 rounded w-20 sm:w-24"></div>
                        </div>
                      </div>

                      {/* Value skeleton */}
                      <div className="w-32 sm:w-48 text-right">
                        <div className="h-5 sm:h-6 bg-gray-200 rounded w-20 sm:w-28 ml-auto"></div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Blur overlay for bottom items - same as real component */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* View all button skeleton */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 bg-gray-300 animate-pulse px-6 py-3 rounded-lg">
          <div className="h-5 w-24 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  );
}
