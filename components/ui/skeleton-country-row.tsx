"use client";

interface SkeletonCountryRowProps {
  showRank?: boolean;
}

export function SkeletonCountryRow({ showRank = true }: SkeletonCountryRowProps) {
  return (
        <li className="px-3 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 items-center animate-pulse">
      <div className="w-16 sm:w-24 flex items-center">
        {showRank && (
          <div className="h-8 sm:h-12 w-12 sm:w-16 bg-gray-200 rounded-xl"></div>
        )}
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
  );
}

export function SkeletonCountryList({ count = 20, showHeader = true }: { count?: number; showHeader?: boolean }) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      {showHeader && (
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-64 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Table header skeleton */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="w-16 sm:w-24">
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="w-32 sm:w-48 text-right">
          <div className="h-4 bg-gray-200 rounded w-20 ml-auto animate-pulse"></div>
        </div>
      </div>
      
      {/* Country rows skeleton */}
      <ul className="divide-y divide-gray-100">
        {Array.from({ length: count }, (_, index) => (
          <SkeletonCountryRow key={index} />
        ))}
      </ul>
    </div>
  );
}
