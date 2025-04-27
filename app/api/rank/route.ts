import { NextResponse } from "next/server";
import data from "../data.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy"); // "population" or "gdpNominal" or "worldGdpShare" or "spending" or "revenue"
  const sortOrder = searchParams.get("sortOrder"); // "asc" or "desc"

  const sortedData = [...data]
    .sort((a, b) => {
      if (sortBy === "population") {
        return sortOrder === "asc"
          ? a.population - b.population
          : b.population - a.population;
      } else if (sortBy === "gdpNominal") {
        return sortOrder === "asc"
          ? a.gdpNominal - b.gdpNominal
          : b.gdpNominal - a.gdpNominal;
      } else if (sortBy === "worldGdpShare") {
        return sortOrder === "asc"
          ? a.worldGdpShare - b.worldGdpShare
          : b.worldGdpShare - a.worldGdpShare;
      } else if (sortBy === "spending") {
        return sortOrder === "asc"
          ? (a.spending.find((item) => item.name === "Total Spending")
              ?.amount ?? 0) -
              (b.spending.find((item) => item.name === "Total Spending")
                ?.amount ?? 0)
          : (b.spending.find((item) => item.name === "Total Spending")
              ?.amount ?? 0) -
              (a.spending.find((item) => item.name === "Total Spending")
                ?.amount ?? 0);
      } else if (sortBy === "revenue") {
        return sortOrder === "asc"
          ? (a.revenue.find((item) => item.name === "Total Revenue")?.amount ??
              0) -
              (b.revenue.find((item) => item.name === "Total Revenue")
                ?.amount ?? 0)
          : (b.revenue.find((item) => item.name === "Total Revenue")?.amount ??
              0) -
              (a.revenue.find((item) => item.name === "Total Revenue")
                ?.amount ?? 0);
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
