import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "@/constants/controversies-countries";
import { NewsService } from "@/services/controversies/news-service";
import { AIService } from "@/services/controversies/ai-service";
import { redis, CachedControversyData } from "@/lib/redis";
import { Country } from "@/types/controversies";

const newsService = new NewsService();
const aiService = new AIService();

async function processCountryBatch(
  countries: Array<[string, Country]>
): Promise<
  Array<{
    country: string;
    success: boolean;
    error?: string;
    processingTime: number;
  }>
> {
  const results: Array<{
    country: string;
    success: boolean;
    error?: string;
    processingTime: number;
  }> = [];

  const processCountry = async ([countryCode, countryInfo]: [
    string,
    Country
  ]) => {
    const countryStartTime = Date.now();

    try {
      const existingDataRaw = await redis.get(`controversies:${countryCode}`);
      let existingData: CachedControversyData | null = null;
      
      if (existingDataRaw && typeof existingDataRaw === "string") {
        try {
          existingData = JSON.parse(existingDataRaw) as CachedControversyData;
        } catch {
          existingData = null;
        }
      }
      const now = Date.now();
      const sixDaysAgo = now - 6 * 24 * 60 * 60 * 1000;

      if (
        existingData &&
        new Date(existingData.lastUpdated).getTime() > sixDaysAgo
      ) {
        return {
          country: countryInfo.name,
          success: true,
          processingTime: Date.now() - countryStartTime,
          skipped: true,
        };
      }

      const data = await newsService.fetchPoliticalNews(countryCode, 30);
      const formattedArticles = newsService.formatArticles(data.articles || []);

      let aiSummary: string | null = null;
      if (
        data.articles &&
        data.articles.length > 0 &&
        process.env.GROQ_API_KEY
      ) {
        const topArticles = data.articles.slice(0, 3);
        aiSummary = await aiService.generatePoliticalSummary(
          topArticles,
          countryCode
        );
      }

      const processingTime = Date.now() - countryStartTime;

      const cachedData: CachedControversyData = {
        country: countryInfo.name,
        countryCode: countryCode,
        total: formattedArticles.length,
        aiSummary,
        articles: formattedArticles,
        lastUpdated: new Date().toISOString(),
        processingTime,
      };

      await redis.pipeline()
        .setex(`controversies:${countryCode}`, 8 * 24 * 60 * 60, JSON.stringify(cachedData))
        .sadd("controversies:countries_list", countryCode)
        .set("controversies:last_update", new Date().toISOString())
        .exec();

      return {
        country: countryInfo.name,
        success: true,
        processingTime,
      };
    } catch (error) {
      console.error("Error processing country:", countryCode, error);
      return {
        country: countryCode,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        processingTime: Date.now() - countryStartTime,
      };
    }
  };

  const parallelBatchSize = 5;
  for (let i = 0; i < countries.length; i += parallelBatchSize) {
    const batch = countries.slice(i, i + parallelBatchSize);
    const batchResults = await Promise.allSettled(batch.map(processCountry));

    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        results.push({
          country: "Unknown",
          success: false,
          error: result.reason?.message || "Unknown error",
          processingTime: 0,
        });
      }
    });

    if (i + parallelBatchSize < countries.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const batchParam = url.searchParams.get("batch");
  const batchSize = 15;

  const allCountries = Object.entries(COUNTRIES);
  const totalBatches = Math.ceil(allCountries.length / batchSize);

  let countriesToProcess: Array<[string, Country]>;
  let batchNumber: number;

  if (batchParam) {
    batchNumber = parseInt(batchParam);
    const startIndex = (batchNumber - 1) * batchSize;
    countriesToProcess = allCountries.slice(startIndex, startIndex + batchSize);
  } else {
    batchNumber = 1;
    countriesToProcess = allCountries.slice(0, batchSize);
  }

  if (countriesToProcess.length === 0) {
    return NextResponse.json({
      success: false,
      error: "Invalid batch number or no countries to process",
      totalBatches,
    });
  }

  const results = await processCountryBatch(countriesToProcess);

  const totalTime = Date.now() - startTime;
  const successCount = results.filter((r) => r.success).length;
  const errorCount = results.filter((r) => !r.success).length;
  const pipeline = redis.pipeline();
  pipeline.scard("controversies:countries_list");
  pipeline.get("controversies:last_update");
  pipeline.smembers("controversies:countries_list");
  
  const cacheResults = await pipeline.exec();
  const cacheStats = {
    totalCountries: (cacheResults[0] as number) || 0,
    lastUpdate: (cacheResults[1] as string) || null,
    availableCountries: (cacheResults[2] as string[]) || [],
  };

  return NextResponse.json({
    success: true,
    message: `Batch ${batchNumber}/${totalBatches}: Updated ${successCount} countries successfully`,
    batch: {
      current: batchNumber,
      total: totalBatches,
      countriesInBatch: countriesToProcess.length,
      nextBatch: batchNumber < totalBatches ? batchNumber + 1 : null,
    },
    stats: {
      successCount,
      errorCount,
      totalTime,
      averageTimePerCountry: Math.round(totalTime / countriesToProcess.length),
    },
    cacheStats,
    results: results.map((r) => ({
      country: r.country,
      success: r.success,
      processingTime: r.processingTime,
      ...(r.error && { error: r.error }),
    })),
  });
}
