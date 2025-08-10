import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/lib/services/data-updater";

const dataUpdater = new DataUpdater();

let cachedAllCountries: any[] | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

async function getAllCountries(): Promise<any[]> {
  const now = Date.now();

  if (cachedAllCountries && now < cacheExpiry) {
    return cachedAllCountries;
  }

  const staticCountries = dataUpdater.getStaticData();

  const countriesWithLiveData = await Promise.allSettled(
    staticCountries.map(async (country) => {
      try {
        return await dataUpdater.updateCountryData(country.code);
      } catch {
        return {
          ...country,
          population: country.population || 0,
          gdpNominal: country.gdpNominal || 0,
          worldGdpShare: country.worldGdpShare || 0,
          debtToGdp: country.debtToGdp || 0,
          lastUpdated: new Date().toISOString(),
        };
      }
    })
  );

  cachedAllCountries = countriesWithLiveData.map((result, index) =>
    result.status === "fulfilled"
      ? result.value
      : {
          ...staticCountries[index],
          population: staticCountries[index].population || 0,
          gdpNominal: staticCountries[index].gdpNominal || 0,
          worldGdpShare: staticCountries[index].worldGdpShare || 0,
          debtToGdp: staticCountries[index].debtToGdp || 0,
          lastUpdated: new Date().toISOString(),
        }
  );

  cacheExpiry = now + CACHE_DURATION;
  return cachedAllCountries;
}

export async function GET(req: NextRequest) {
  try {
    const allCountries = await getAllCountries();
    return NextResponse.json(allCountries);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries data" },
      { status: 500 }
    );
  }
}
