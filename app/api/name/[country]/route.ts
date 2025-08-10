import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/lib/services/data-updater";

function formatCountryName(urlCountry: string): string {
  return urlCountry
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const dataUpdater = new DataUpdater();

async function getCountryWithFallback(countryEntry: any) {
  try {
    const liveData = await dataUpdater.updateCountryData(countryEntry.code);
    if (liveData) {
      return liveData;
    }
  } catch (error) {
    console.log(
      `Failed to get live data for ${countryEntry.code}, using static data`
    );
  }

  return {
    ...countryEntry,
    population: countryEntry.population || 0,
    gdpNominal: countryEntry.gdpNominal || 0,
    worldGdpShare: countryEntry.worldGdpShare || 0,
    debtToGdp: countryEntry.debtToGdp || 0,
    lastUpdated: new Date().toISOString(),
    national_incidents: countryEntry.national_incidents || [],
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params;
    const formattedCountryName = formatCountryName(country);

    const { default: staticData } = await import("../../data.json");

    let countryEntry = staticData.find(
      (item: any) => item.name === formattedCountryName
    );

    if (!countryEntry) {
      countryEntry = staticData.find(
        (item: any) =>
          item.name.toLowerCase() === formattedCountryName.toLowerCase()
      );
    }

    if (!countryEntry) {
      const searchWords = formattedCountryName.toLowerCase().split(" ");
      countryEntry = staticData.find((item: any) => {
        const itemWords = item.name.toLowerCase().split(" ");
        return searchWords.every((word) => itemWords.includes(word));
      });
    }

    if (!countryEntry) {
      console.log(`Country not found: ${formattedCountryName}`);
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    const countryData = await getCountryWithFallback(countryEntry);

    return NextResponse.json(countryData);
  } catch (error) {
    console.error("Error in country API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
