import { NextResponse } from "next/server";
import { DataUpdater } from "@/lib/services/data-updater";

function formatCountryName(urlCountry: string): string {
  return urlCountry
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const dataUpdater = new DataUpdater();

async function getCachedCountryByName(countryCode: string) {
  'use cache';
  return await dataUpdater.updateCountryData(countryCode);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params;
    const formattedCountryName = formatCountryName(country);

    const { default: staticData } = await import('../../data.json');
    
    let countryEntry = staticData.find((item: any) => item.name === formattedCountryName);

    if (!countryEntry) {
      countryEntry = staticData.find(
        (item: any) => item.name.toLowerCase() === formattedCountryName.toLowerCase()
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
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    const liveCountryData = await getCachedCountryByName(countryEntry.code);
    
    return NextResponse.json(liveCountryData);
  } catch (error) {
    console.error("Error in name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
