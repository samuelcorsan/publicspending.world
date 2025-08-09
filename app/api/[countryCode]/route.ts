import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/lib/services/data-updater";

const dataUpdater = new DataUpdater();

async function getCachedCountryData(countryCode: string) {
  'use cache';
  return await dataUpdater.updateCountryData(countryCode);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    const { countryCode } = await params;
    
    const countryData = await getCachedCountryData(countryCode.toUpperCase());
    
    if (!countryData) {
      return NextResponse.json(
        { error: "Country not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(countryData);
  } catch (error) {
    console.error("Error fetching country data:", error);
    return NextResponse.json(
      { error: "Failed to fetch country data" }, 
      { status: 500 }
    );
  }
}
