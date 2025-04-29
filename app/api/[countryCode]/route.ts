import { NextResponse } from "next/server";
import data from "../data.json";

export async function GET(
  request: Request,
  { params }: { params: { countryCode: string } }
) {
  const countryCode = params.countryCode;
  const countryData = data.find((item) => item.code === countryCode);
  return NextResponse.json(countryData);
}
