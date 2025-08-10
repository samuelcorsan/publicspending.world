import { useInfiniteQuery } from "@tanstack/react-query";
import { ValidTopic } from "@/lib/types";

interface Country {
  name: string;
  code: string;
  flag: string;
  population: number;
  gdpNominal: number;
  worldGdpShare: number;
  revenue: any[];
  spending: any[];
  currency: string;
  capital?: string;
  debtToGdp?: number;
  rank: number;
}

interface PaginatedResponse {
  countries: Country[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCountries: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface FetchCountriesParams {
  pageParam?: number;
  topic: ValidTopic;
  sortOrder?: "asc" | "desc";
}

const fetchCountriesPage = async ({
  pageParam = 1,
  topic,
  sortOrder = "desc",
}: FetchCountriesParams): Promise<PaginatedResponse> => {
  const url = `/api/countries-live?page=${pageParam}&topic=${topic}&sortOrder=${sortOrder}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.status}`);
  }

  return response.json();
};

export const useInfiniteCountries = (
  topic: ValidTopic,
  sortOrder: "asc" | "desc" = "desc"
) => {
  return useInfiniteQuery({
    queryKey: ["countries", topic, sortOrder],
    queryFn: ({ pageParam }) =>
      fetchCountriesPage({ pageParam, topic, sortOrder }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
