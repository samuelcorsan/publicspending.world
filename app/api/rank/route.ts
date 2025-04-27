import { NextResponse } from "next/server";
import data from "../data.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy"); // "population"
  const sortOrder = searchParams.get("sortOrder"); // "asc" or "desc"

  const sortedData = [...data]
    .sort((a, b) => {
      if (sortBy === "population") {
        return sortOrder === "asc"
          ? a.population - b.population
          : b.population - a.population;
      }
      return 0;
    })
    .map((item, index) => ({
      rank: index + 1,
      name: item.name,
      population: item.population,
      flag: item.flag,
      code: item.code,
      languages: item.languages,
      organizations: item.organizations,
    }));

  return NextResponse.json(sortedData);
}
