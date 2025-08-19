import { NextResponse } from "next/server";
import { CountryDataCache } from "@/lib/redis";

export async function GET() {
  try {
    const allCountries = await CountryDataCache.getAllStaticCountries();
    const countriesData = await Promise.all(
      allCountries.map(async (countryCode) => {
        const data = await CountryDataCache.getStaticCountryData(countryCode);
        return data;
      })
    );

    const formattedCountries = countriesData
      .filter(Boolean)
      .map((country) => ({
        name: country!.name,
        code: country!.code,
        flag: `https://flagcdn.com/w40/${country!.code.toLowerCase()}.png`,
        capital: country!.capital || "",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ countries: formattedCountries });
  } catch (error) {
    console.error("Error in all-countries API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
