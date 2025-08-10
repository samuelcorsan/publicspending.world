import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/lib/services/data-updater";
import { ValidTopic } from "@/lib/types";

const dataUpdater = new DataUpdater();
const ITEMS_PER_PAGE = 20;

const getValue = (country: any, topic: ValidTopic): number => {
  switch (topic) {
    case "gdp-nominal":
      return country.gdpNominal || 0;
    case "world-gdp-share":
      return country.worldGdpShare || 0;
    case "spending":
      return (
        country.spending?.find((item: any) => item.subtype === "total")
          ?.amount || 0
      );
    case "revenue":
      return (
        country.revenue?.find((item: any) => item.subtype === "total")
          ?.amount || 0
      );
    case "population":
      return country.population || 0;
    default:
      return 0;
  }
};

const sortCountries = (
  countries: any[],
  topic: ValidTopic,
  sortOrder: "asc" | "desc" = "desc"
) => {
  return [...countries].sort((a, b) => {
    const aValue = getValue(a, topic);
    const bValue = getValue(b, topic);
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });
};

const VALID_TOPICS: ValidTopic[] = [
  "population",
  "gdp-nominal",
  "world-gdp-share",
  "spending",
  "revenue",
];

// Cache for countries data with 5-minute expiry
let cachedCountries: any[] | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedCountries(): Promise<any[]> {
  const now = Date.now();

  if (cachedCountries && now < cacheExpiry) {
    return cachedCountries;
  }

  // Refresh cache
  const staticCountries = dataUpdater.getStaticData();

  const countriesWithLiveData = await Promise.allSettled(
    staticCountries.map(async (country) => {
      try {
        return await dataUpdater.updateCountryData(country.code);
      } catch {
        return {
          ...country,
          population: country.population || 1000000,
          gdpNominal: country.gdpNominal || 50000000000,
          worldGdpShare: country.worldGdpShare || 0.1,
          debtToGdp: country.debtToGdp || 60,
          lastUpdated: new Date().toISOString(),
        };
      }
    })
  );

  cachedCountries = countriesWithLiveData.map((result, index) =>
    result.status === "fulfilled"
      ? result.value
      : {
          ...staticCountries[index],
          population: staticCountries[index].population || 1000000,
          gdpNominal: staticCountries[index].gdpNominal || 50000000000,
          worldGdpShare: staticCountries[index].worldGdpShare || 0.1,
          debtToGdp: staticCountries[index].debtToGdp || 60,
          lastUpdated: new Date().toISOString(),
        }
  );

  cacheExpiry = now + CACHE_DURATION;
  return cachedCountries;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const topic = searchParams.get("topic") as ValidTopic;
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    if (!topic || !VALID_TOPICS.includes(topic)) {
      return NextResponse.json(
        { error: "Invalid topic parameter" },
        { status: 400 }
      );
    }

    const allCountries = await getCachedCountries();
    const sortedCountries = sortCountries(allCountries, topic, sortOrder);

    const totalCountries = sortedCountries.length;
    const totalPages = Math.ceil(totalCountries / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const countriesForPage = sortedCountries.slice(startIndex, endIndex);
    const countriesWithRank = countriesForPage.map((country, index) => ({
      ...country,
      rank: startIndex + index + 1,
    }));

    return NextResponse.json({
      countries: countriesWithRank,
      pagination: {
        currentPage: page,
        totalPages,
        totalCountries,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries data" },
      { status: 500 }
    );
  }
}
