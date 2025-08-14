import { NextRequest, NextResponse } from "next/server";
import { DataUpdater } from "@/services/api/data-updater";
import { RateLimiter } from "@/lib/rate-limiter";
import { getClientIP } from "@/lib/utils";

const dataUpdater = new DataUpdater();

async function getCachedCountryData(countryCode: string) {
  "use cache";
  return await dataUpdater.updateCountryData(countryCode);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateLimitResult = await RateLimiter.checkRateLimit(
      clientIP,
      "country-detail"
    );

    if (!rateLimitResult.success || rateLimitResult.blocked) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message:
            "Too many requests. Please wait before making another request.",
          resetTime: rateLimitResult.resetTime,
          remaining: rateLimitResult.remaining,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "1",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
            "Retry-After": Math.ceil(
              rateLimitResult.resetTime - Math.floor(Date.now() / 1000)
            ).toString(),
          },
        }
      );
    }

    const { countryCode } = await params;

    const countryData = await getCachedCountryData(countryCode.toUpperCase());

    if (!countryData) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json(countryData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch country data" },
      { status: 500 }
    );
  }
}
