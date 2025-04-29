import { NextResponse } from "next/server";
import data from "../data.json";

export async function GET(
  request: Request,
  context: { params: { countryCode: string } }
) {
  const params = await context.params;
  const countryCode = params.countryCode;
  const countryData = data.find((item) => item.code === countryCode);
  return NextResponse.json(countryData);
}
