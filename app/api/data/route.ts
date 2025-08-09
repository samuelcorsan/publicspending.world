import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/lib/services/data-updater";

const dataUpdater = new DataUpdater();

export async function GET(req: NextRequest) {
  try {
    const allData = dataUpdater.getStaticData();
    return NextResponse.json(allData);
  } catch (error) {
    console.error("Error fetching all country data:", error);
    return NextResponse.json(
      { error: "Failed to fetch country data" }, 
      { status: 500 }
    );
  }
}