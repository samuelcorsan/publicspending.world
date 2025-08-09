import { NextResponse } from "next/server";
import data from "../data.json";

const parseAmount = (amount: string | number): number => {
  if (typeof amount === "number") return amount;
  return parseFloat(amount.split(" ")[0]);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");

  const sortedData = [...data]
    .sort((a, b) => {
      if (sortBy === "spending") {
        return sortOrder === "asc"
          ? parseAmount(
              a.spending.find((item) => item.subtype === "total")?.amount ?? 0
            ) -
              parseAmount(
                b.spending.find((item) => item.subtype === "total")?.amount ?? 0
              )
          : parseAmount(
              b.spending.find((item) => item.subtype === "total")?.amount ?? 0
            ) -
              parseAmount(
                a.spending.find((item) => item.subtype === "total")?.amount ?? 0
              );
      } else if (sortBy === "revenue") {
        return sortOrder === "asc"
          ? parseAmount(
              a.revenue.find((item) => item.subtype === "total")?.amount ?? 0
            ) -
              parseAmount(
                b.revenue.find((item) => item.subtype === "total")?.amount ?? 0
              )
          : parseAmount(
              b.revenue.find((item) => item.subtype === "total")?.amount ?? 0
            ) -
              parseAmount(
                a.revenue.find((item) => item.subtype === "total")?.amount ?? 0
              );
      }
      return 0;
    })
    .map((item, index) => ({
      rank: index + 1,
      name: item.name,
      flag: item.flag,
      code: item.code,
      languages: item.languages,
      organizations: item.organizations,
    }));

  return NextResponse.json(sortedData);
}
