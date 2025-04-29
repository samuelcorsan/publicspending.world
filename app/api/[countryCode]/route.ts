import { NextRequest, NextResponse } from "next/server";
import data from "../data.json";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode } = await params;
  const countryData = data.find((item) => item.code === countryCode);
  return NextResponse.json(countryData);
}
