import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/services/api/data-updater";
import { CountryDataCache, CountryRankingData } from "@/lib/redis";
import { ValidTopic } from "@/types/country";

const dataUpdater = new DataUpdater();

const getValue = (country: CountryRankingData, topic: ValidTopic): number => {
  switch (topic) {
    case "population":
      return country.population || 0;
    case "gdp-nominal":
      return country.gdpNominal || 0;
    case "world-gdp-share":
      return country.worldGdpShare || 0;
    default:
      return 0;
  }
};

const sortCountries = (
  countries: CountryRankingData[],
  topic: ValidTopic,
  sortOrder: "asc" | "desc"
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
];

async function getAllCountries(): Promise<CountryRankingData[]> {
  const rankings = await dataUpdater.getRankings();
  if (rankings.length > 0) {
    return rankings;
  }

  await dataUpdater.updateRankings();
  return await dataUpdater.getRankings();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const topic = searchParams.get("topic") as ValidTopic;
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";
    const mode = searchParams.get("mode");

    if (mode === "search") {
      const allCountries = await CountryDataCache.getAllStaticCountries();
      const countriesData = await Promise.all(
        allCountries.map(async (countryCode) => {
          const data = await CountryDataCache.getStaticCountryData(countryCode);
          return data;
        })
      );

      const formattedCountries = countriesData
        .filter(Boolean)
        .map((country) => ({
          name: country!.name,
          code: country!.code,
          flag: `https://flagcdn.com/w40/${country!.code.toLowerCase()}.png`,
          capital: country!.capital || "",
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return NextResponse.json({ countries: formattedCountries });
    }
    if (!topic || !VALID_TOPICS.includes(topic)) {
      return NextResponse.json(
        { error: "Invalid topic parameter" },
        { status: 400 }
      );
    }

    const countries = await getAllCountries();
    const sortedCountries = sortCountries(countries, topic, sortOrder);
    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCountries = sortedCountries.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedCountries.length / pageSize);

    const formattedCountries = await Promise.all(
      paginatedCountries.map(async (country, index) => {
        const staticData = await CountryDataCache.getStaticCountryData(
          country.code
        );
        return {
          rank: startIndex + index + 1,
          name: country.name,
          code: country.code,
          flag: `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`,
          capital: staticData?.capital || "",
          gdpNominal: country.gdpNominal || 0,
          worldGdpShare: country.worldGdpShare || 0,
          population: country.population || 0,
          spending: staticData?.spending || [],
          revenue: staticData?.revenue || [],
        };
      })
    );

    const response = {
      countries: formattedCountries,
      pagination: {
        currentPage: page,
        totalPages,
        totalCountries: sortedCountries.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      topic,
      sortOrder,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in countries API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
