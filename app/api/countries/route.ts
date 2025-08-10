import { NextRequest, NextResponse } from "next/server";
import { getCachedCountries } from "@/lib/services/country-cache";

export async function GET(req: NextRequest) {
  try {
    const allCountries = await getCachedCountries();
    return NextResponse.json(allCountries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch countries data" },
      { status: 500 }
    );
  }
}
