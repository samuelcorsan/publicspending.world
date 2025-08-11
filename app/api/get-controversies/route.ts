import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "@/constants/controversies-countries";
import { NewsService } from "@/services/controversies/news-service";
import { validateControversiesParams } from "@/lib/validation";
import { APIResponse } from "@/types/controversies";

const newsService = new NewsService();

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

    const data = await newsService.fetchPoliticalNews(country, limit);
    const formattedArticles = newsService.formatArticles(data.articles || []);

    return NextResponse.json({
      success: true,
      country: COUNTRIES[country]?.name || country,
      countryCode: country,
      total: formattedArticles.length,
      articles: formattedArticles,
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
