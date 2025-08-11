import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "@/constants/controversies-countries";
import { NewsService } from "@/services/controversies/news-service";
import { AIService } from "@/services/controversies/ai-service";
import { ControversiesCache, CachedControversyData } from "@/lib/redis";

const newsService = new NewsService();
const aiService = new AIService();

async function processCountryBatch(
  countries: Array<[string, any]>,
  batchNumber: number
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

  const processCountry = async ([countryCode, countryInfo]: [string, any]) => {
    const countryStartTime = Date.now();

    try {
      const existingData = await ControversiesCache.getCountryData(countryCode);
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

      await ControversiesCache.setCountryData(countryCode, cachedData);

      return {
        country: countryInfo.name,
        success: true,
        processingTime,
      };
    } catch (error: any) {
      const processingTime = Date.now() - countryStartTime;

      return {
        country: countryInfo.name,
        success: false,
        error: error.message,
        processingTime,
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

  let countriesToProcess: Array<[string, any]>;
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

  const results = await processCountryBatch(countriesToProcess, batchNumber);

  const totalTime = Date.now() - startTime;
  const successCount = results.filter((r) => r.success).length;
  const errorCount = results.filter((r) => !r.success).length;
  const cacheStats = await ControversiesCache.getCacheStats();

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
