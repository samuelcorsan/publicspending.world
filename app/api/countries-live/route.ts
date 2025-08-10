import { NextRequest, NextResponse } from "next/server";
import { ValidTopic } from "@/lib/types";
import { getCachedCountries } from "@/lib/services/country-cache";

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
    return NextResponse.json(
      { error: "Failed to fetch countries data" },
      { status: 500 }
    );
  }
}
