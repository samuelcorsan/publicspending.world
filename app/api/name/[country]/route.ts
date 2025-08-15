import { NextRequest, NextResponse } from "next/server";
import { CountryDataCache, StaticCountryData } from "@/lib/redis";
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
    let liveData = await CountryDataCache.getCountryLiveData(countryEntry.code);

    if (!liveData) {
      const cachedRankings = await CountryDataCache.getRankings();
      if (cachedRankings) {
        const foundRanking = cachedRankings.find(
          (ranking) => ranking.code === countryEntry.code
        );
        if (foundRanking) {
          liveData = foundRanking;
        }
      }
    }

    if (!liveData) {
      const dataUpdater = new DataUpdater();
      liveData = await dataUpdater.updateCountryData(countryEntry.code);
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
  } catch {
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

    const [allCountries, cachedRankings] = await Promise.all([
      CountryDataCache.getAllStaticCountries(),
      CountryDataCache.getRankings(),
    ]);

    const countryMap = new Map<string, StaticCountryData>();
    const countryNameMap = new Map<string, string>();

    const staticDataPromises = allCountries.map(async (countryCode) => {
      const data = await CountryDataCache.getStaticCountryData(countryCode);
      if (data) {
        countryMap.set(countryCode, data);
        countryNameMap.set(data.name.toLowerCase(), countryCode);
        countryNameMap.set(
          data.name.toLowerCase().replace(/\s+/g, "-"),
          countryCode
        );
        countryNameMap.set(
          data.name.toLowerCase().replace(/\s+/g, ""),
          countryCode
        );
      }
    });

    await Promise.all(staticDataPromises);

    let countryCode = countryNameMap.get(formattedCountryName.toLowerCase());

    if (!countryCode) {
      const searchWords = formattedCountryName.toLowerCase().split(" ");
      for (const [name, code] of countryNameMap.entries()) {
        const itemWords = name.split(" ");
        if (searchWords.every((word: string) => itemWords.includes(word))) {
          countryCode = code;
          break;
        }
      }
    }

    if (!countryCode) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    const countryEntry = countryMap.get(countryCode);
    if (!countryEntry) {
      return NextResponse.json(
        { error: "Country data not found" },
        { status: 404 }
      );
    }

    const countryData = await getCountryWithFallback(countryEntry);

    const responseTime = Date.now() - startTime;
    console.log(`Country API response time: ${responseTime}ms for ${country}`);

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
