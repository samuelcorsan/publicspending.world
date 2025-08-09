"use client";
import Link from "next/link";
import { validTopics } from "@/lib/types";
import { TopicTitles, TopicIcons } from "@/components/ranking/ranking-list";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Global Rankings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore comprehensive rankings of countries by key economic and demographic indicators. 
            Compare nations across different metrics to understand global trends.
          </p>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {validTopics.slice(0, 3).map((topic) => {
              const TopicIcon = TopicIcons[topic];
              const topicTitle = TopicTitles[topic];
              
              return (
                <Link
                  key={topic}
                  href={`/ranking/${topic}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <TopicIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-900">
                    {topicTitle}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {getTopicDescription(topic)}
                  </p>
                </Link>
              );
            })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {validTopics.slice(3, 5).map((topic) => {
              const TopicIcon = TopicIcons[topic];
              const topicTitle = TopicTitles[topic];
              
              return (
                <Link
                  key={topic}
                  href={`/ranking/${topic}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <TopicIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-900">
                    {topicTitle}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {getTopicDescription(topic)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function getTopicDescription(topic: string): string {
  switch (topic) {
    case "population":
      return "Discover the world's most and least populated countries, exploring demographic trends and population distribution.";
    case "gdp-nominal":
      return "Explore the largest economies by nominal GDP, showcasing economic output and market size across nations.";
    case "world-gdp-share":
      return "See each country's contribution to the global economy as a percentage of world GDP.";
    case "spending":
      return "Compare government spending levels and public expenditure across different countries and regions.";
    case "revenue":
      return "Analyze government revenue collection and fiscal capacity of nations worldwide.";
    default:
      return "Explore detailed rankings and comparisons for this category.";
  }
}
