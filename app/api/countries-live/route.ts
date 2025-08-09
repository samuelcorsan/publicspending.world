import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/lib/services/data-updater";

const dataUpdater = new DataUpdater();

async function getLiveDataForCountries() {
  'use cache';
  const staticCountries = dataUpdater.getStaticData();
  
  // Fetch live data for all countries
  const countriesWithLiveData = await Promise.allSettled(
    staticCountries.map(async (country) => {
      try {
        const liveData = await dataUpdater.updateCountryData(country.code);
        return liveData;
      } catch (error) {
        return {
          ...country,
          population: country.population || 1000000,
          gdpNominal: country.gdpNominal || 50000000000,
          worldGdpShare: country.worldGdpShare || 0.1,
          debtToGdp: country.debtToGdp || 60,
          lastUpdated: new Date().toISOString()
        };
      }
    })
  );

  // Extract successful results and failed fallbacks
  return countriesWithLiveData.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      const country = staticCountries[index];
      return {
        ...country,
        population: country.population || 1000000,
        gdpNominal: country.gdpNominal || 50000000000,
        worldGdpShare: country.worldGdpShare || 0.1,
        debtToGdp: country.debtToGdp || 60,
        lastUpdated: new Date().toISOString()
      };
    }
  });
}

export async function GET(req: NextRequest) {
  try {
    const countriesWithLiveData = await getLiveDataForCountries();
    return NextResponse.json(countriesWithLiveData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" }, 
      { status: 500 }
    );
  }
}