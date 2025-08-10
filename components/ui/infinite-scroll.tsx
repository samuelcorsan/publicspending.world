"use client";
import { useEffect, useRef, useCallback } from "react";
import { InlineLoadingIndicator } from "./loading-indicator";
import { SkeletonCountryRow } from "./skeleton-country-row";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

const OBSERVER_OPTIONS = {
  rootMargin: "100px",
  threshold: 0.1,
} as const;

export function InfiniteScroll({
  onLoadMore,
  hasNextPage,
  isLoading,
  children,
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasNextPage, isLoading]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      handleIntersection,
      OBSERVER_OPTIONS
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div>
      {children}
      {isLoading && (
        <ul className="divide-y divide-gray-100">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonCountryRow key={`skeleton-${index}`} />
          ))}
        </ul>
      )}
      {hasNextPage && !isLoading && (
        <div ref={observerRef}>
          <InlineLoadingIndicator />
        </div>
      )}
    </div>
  );
}
