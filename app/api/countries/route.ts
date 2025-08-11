import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/services/api/data-updater";
import { unstable_cacheLife as cacheLife } from "next/cache";

const dataUpdater = new DataUpdater();

async function getAllCountries() {
  "use cache";
  cacheLife("weeks");

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
          debtToGdp: 0,
          lastUpdated: new Date().toISOString(),
        };
      }
    })
  );

  return countriesWithLiveData.map((result, index) =>
    result.status === "fulfilled"
      ? result.value
      : {
          ...staticCountries[index],
          population: staticCountries[index].population || 0,
          gdpNominal: staticCountries[index].gdpNominal || 0,
          worldGdpShare: staticCountries[index].worldGdpShare || 0,
          debtToGdp: 60,
          lastUpdated: new Date().toISOString(),
        }
  );
}

export async function GET(req: NextRequest) {
  try {
    const allCountries = await getAllCountries();
    return NextResponse.json(allCountries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch countries data" },
      { status: 500 }
    );
  }
}
