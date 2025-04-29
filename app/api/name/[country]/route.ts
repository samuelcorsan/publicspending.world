import { NextResponse } from "next/server";
import data from "../../data.json";

function formatCountryName(urlCountry: string): string {
  return urlCountry
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params;
    const formattedCountryName = formatCountryName(country);

    let countryData = data.find((item) => item.name === formattedCountryName);

    if (!countryData) {
      countryData = data.find(
        (item) => item.name.toLowerCase() === formattedCountryName.toLowerCase()
      );
    }

    if (!countryData) {
      const searchWords = formattedCountryName.toLowerCase().split(" ");
      countryData = data.find((item) => {
        const itemWords = item.name.toLowerCase().split(" ");
        return searchWords.every((word) => itemWords.includes(word));
      });
    }

    if (!countryData) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json(countryData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
