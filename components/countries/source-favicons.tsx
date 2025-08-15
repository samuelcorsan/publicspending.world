"use client";

import { useState } from "react";
import Image from "next/image";

interface Article {
  source?: string;
  faviconUrl?: string;
  url: string;
  title: string;
  description?: string;
}

interface SourceFaviconsProps {
  articles: Article[];
}

export function SourceFavicons({ articles }: SourceFaviconsProps) {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  const uniqueSources = Array.from(
    new Map(
      articles
        .map((a) => ({
          source: a.source,
          faviconUrl: a.faviconUrl,
          url: a.url,
          title: a.title,
        }))
        .filter((item) => item.source && item.faviconUrl)
        .map((item) => [item.source, item])
    ).values()
  ).slice(0, 8);

  const toggleSource = (source: string) => {
    if (expandedSource === source) {
      setExpandedSource(null);
    } else {
      setExpandedSource(source);
    }
  };

  return (
    <div className="flex -space-x-2">
      {uniqueSources.map((item, index) => {
        const sourceArticles = articles.filter((a) => a.source === item.source);
        const isExpanded = expandedSource === item.source;

        return (
          <div key={index} className="relative">
            <button
              onClick={() => toggleSource(item.source!)}
              className="relative hover:z-10 transition-transform hover:scale-110 block cursor-pointer"
              title={`${item.source} - ${sourceArticles.length} article${
                sourceArticles.length > 1 ? "s" : ""
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center">
                {item.faviconUrl && item.source && (
                  <Image
                    src={item.faviconUrl}
                    alt={item.source}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full"
                  />
                )}
              </div>
              {sourceArticles.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {sourceArticles.length}
                </div>
              )}
            </button>

            {isExpanded && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setExpandedSource(null)}
                />
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-80">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">
                      {item.source}
                    </h4>
                    <button
                      onClick={() => setExpandedSource(null)}
                      className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {sourceArticles.map((article, articleIndex) => (
                      <div
                        key={articleIndex}
                        className="border-b border-gray-100 pb-2 last:border-b-0"
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm block mb-1 line-clamp-2"
                        >
                          {article.title}
                        </a>
                        {article.description && (
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {article.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
