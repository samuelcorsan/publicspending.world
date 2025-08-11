import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "@/constants/controversies-countries";
import { NewsService } from "@/services/controversies/news-service";
import { AIService } from "@/services/controversies/ai-service";
import { validateControversiesParams } from "@/lib/validation";
import { APIResponse } from "@/types/controversies";
import { ControversiesCache } from "@/lib/redis";

const newsService = new NewsService();
const aiService = new AIService();

export async function GET(
  request: NextRequest
): Promise<NextResponse<APIResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const validation = validateControversiesParams(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: validation.error.issues
            .map((err: any) => err.message)
            .join(", "),
        },
        { status: 400 }
      );
    }

    const { country, limit } = validation.data;

    const cachedData = await ControversiesCache.getCountryData(country);

    if (cachedData) {
      const limitedArticles = cachedData.articles.slice(0, limit);

      return NextResponse.json({
        success: true,
        country: cachedData.country,
        countryCode: cachedData.countryCode,
        total: limitedArticles.length,
        aiSummary: cachedData.aiSummary,
        articles: limitedArticles,
        cached: true,
        lastUpdated: cachedData.lastUpdated,
        cacheAge: Math.floor(
          (Date.now() - new Date(cachedData.lastUpdated).getTime()) /
            1000 /
            60 /
            60
        ),
      });
    }

    const data = await newsService.fetchPoliticalNews(country, limit);
    const formattedArticles = newsService.formatArticles(data.articles || []);

    let aiSummary: string | null = null;
    if (data.articles && data.articles.length > 0 && process.env.GROQ_API_KEY) {
      aiSummary = await aiService.generatePoliticalSummary(
        data.articles,
        country
      );
    }

    return NextResponse.json({
      success: true,
      country: COUNTRIES[country]?.name || country,
      countryCode: country,
      total: formattedArticles.length,
      aiSummary,
      articles: formattedArticles,
      cached: false,
    });
  } catch (error: any) {
    const errorMessage =
      process.env.NODE_ENV === "production" && !error.isOperational
        ? "Internal server error"
        : error.message;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error.statusCode || 500 }
    );
  }
}
