import { NextRequest, NextResponse } from "next/server";
import { redis, StaticCountryData, CountryRankingData } from "@/lib/redis";
import { DataUpdater } from "@/services/api/data-updater";

function formatCountryName(urlCountry: string): string {
  return urlCountry
    .split("-")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

async function getCountryWithFallback(countryEntry: StaticCountryData) {
  try {
    const cachedRankings = await redis.get("rankings") as CountryRankingData[] | null;
    let liveData: CountryRankingData | null = null;

    if (cachedRankings) {
      const foundRanking = cachedRankings.find(
        (ranking) => ranking.code === countryEntry.code
      );
      if (foundRanking) {
        liveData = foundRanking;
      }
    }

    if (!liveData) {
      try {
        const dataUpdater = new DataUpdater();
        liveData = await dataUpdater.updateCountryData(countryEntry.code);
      } catch (error) {
        liveData = null;
      }
    }

    return {
      name: countryEntry.name,
      code: countryEntry.code,
      organizations: countryEntry.organizations || [],
      capital: countryEntry.capital || "",
      currency: countryEntry.currency || "",
      languages: countryEntry.languages || [],
      timezone: countryEntry.timezone || "",
      continent: countryEntry.continent || "",
      flag: countryEntry.flag || "",
      revenue: countryEntry.revenue || [],
      spending: countryEntry.spending || [],
      population: liveData?.population || 0,
      gdpNominal: liveData?.gdpNominal || 0,
      worldGdpShare: liveData?.worldGdpShare || 0,
      debtToGdp: liveData?.debtToGdp || 0,
      controversies: "Data available via controversies API",
      spendingEfficiency: "Standard monitoring in place",
      national_incidents: [],
      lastUpdated: liveData?.lastUpdated || new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: countryEntry.name,
      code: countryEntry.code,
      organizations: countryEntry.organizations || [],
      capital: countryEntry.capital || "",
      currency: countryEntry.currency || "",
      languages: countryEntry.languages || [],
      timezone: countryEntry.timezone || "",
      continent: countryEntry.continent || "",
      flag: countryEntry.flag || "",
      revenue: countryEntry.revenue || [],
      spending: countryEntry.spending || [],
      population: 0,
      gdpNominal: 0,
      worldGdpShare: 0,
      debtToGdp: 0,
      controversies: "Data available via controversies API",
      spendingEfficiency: "Standard monitoring in place",
      national_incidents: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  const startTime = Date.now();

  try {
    const { country } = await params;
    const formattedCountryName = formatCountryName(country);

    // Try common country codes first (optimization for common cases)
    const commonCodes = [
      formattedCountryName.slice(0, 2).toUpperCase(),
      formattedCountryName === "denmark" ? "DK" : null,
      formattedCountryName === "china" ? "CN" : null,
      formattedCountryName === "united-states" ? "US" : null,
      formattedCountryName === "united-kingdom" ? "GB" : null,
    ].filter(Boolean) as string[];

    let countryEntry: StaticCountryData | null = null;
    let targetCountryCode: string | null = null;

    // Try direct code lookup first
    for (const code of commonCodes) {
      const data = await redis.get(`static:${code}`) as StaticCountryData | null;
      if (data && data.name.toLowerCase().replace(/\s+/g, "-") === formattedCountryName.toLowerCase()) {
        countryEntry = data;
        targetCountryCode = code;
        break;
      }
    }

    // If not found, fallback to searching all countries
    if (!countryEntry) {
      const allCountries = (await redis.smembers("static:countries_list")) || [];
      
      for (const countryCode of allCountries) {
        const data = await redis.get(`static:${countryCode}`) as StaticCountryData | null;
        if (data) {
          const nameVariations = [
            data.name.toLowerCase(),
            data.name.toLowerCase().replace(/\s+/g, "-"),
            data.name.toLowerCase().replace(/\s+/g, "")
          ];
          
          if (nameVariations.includes(formattedCountryName.toLowerCase())) {
            targetCountryCode = countryCode;
            countryEntry = data;
            break;
          }
        }
      }
    }

    if (!targetCountryCode || !countryEntry) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    const countryData = await getCountryWithFallback(countryEntry);

    return NextResponse.json(countryData);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`Country API error after ${responseTime}ms:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
