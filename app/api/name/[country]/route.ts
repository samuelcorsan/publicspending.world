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
  const dataUpdater = new DataUpdater();

  try {
    const liveData = await dataUpdater.updateCountryData(countryEntry.code);
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
      population: liveData.population || 0,
      gdpNominal: liveData.gdpNominal || 0,
      worldGdpShare: liveData.worldGdpShare || 0,
      debtToGdp: liveData.debtToGdp || 0,
      controversies: "Data available via controversies API",
      spendingEfficiency: "Standard monitoring in place",
      national_incidents: [],
      lastUpdated: liveData.lastUpdated,
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
  try {
    const { country } = await params;
    const formattedCountryName = formatCountryName(country);

    const allCountries = await CountryDataCache.getAllStaticCountries();
    let countryEntry = null;

    for (const countryCode of allCountries) {
      const data = await CountryDataCache.getStaticCountryData(countryCode);
      if (data && data.name === formattedCountryName) {
        countryEntry = data;
        break;
      }
    }

    if (!countryEntry) {
      for (const countryCode of allCountries) {
        const data = await CountryDataCache.getStaticCountryData(countryCode);
        if (
          data &&
          data.name.toLowerCase() === formattedCountryName.toLowerCase()
        ) {
          countryEntry = data;
          break;
        }
      }
    }

    if (!countryEntry) {
      const searchWords = formattedCountryName.toLowerCase().split(" ");
      for (const countryCode of allCountries) {
        const data = await CountryDataCache.getStaticCountryData(countryCode);
        if (data) {
          const itemWords = data.name.toLowerCase().split(" ");
          if (searchWords.every((word: string) => itemWords.includes(word))) {
            countryEntry = data;
            break;
          }
        }
      }
    }

    if (!countryEntry) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    const countryData = await getCountryWithFallback(countryEntry);

    return NextResponse.json(countryData);
  } catch (error) {
    console.error("Error in country name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
