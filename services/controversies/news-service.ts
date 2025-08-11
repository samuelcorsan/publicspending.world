import {
  Article,
  NewsAPIResponse,
  QueryValidation,
  FormattedArticle,
} from "@/types/controversies";
import {
  COUNTRIES,
  LANGUAGE_CODES,
  POLITICAL_TERMS,
} from "@/constants/controversies-countries";
import { getFaviconUrl } from "@/lib/utils";

export class NewsService {
  private validateQueryLength(
    keywords: string[],
    searchTerms: string[],
    countryCode: string
  ): QueryValidation {
    const politicalKeywords = keywords.slice(0, 6).join(" OR ");

    const countryTerms = searchTerms.slice(0, 3).join(" OR ");

    const languageKey = LANGUAGE_CODES[countryCode.toLowerCase()] || "default";
    const generalPoliticalTerms = POLITICAL_TERMS[languageKey].join(" OR ");

    const testQuery = `(${politicalKeywords}) AND (${countryTerms}) AND (${generalPoliticalTerms})`;

    return {
      query: testQuery,
      length: testQuery.length,
      isValid: testQuery.length <= 500,
    };
  }

  async fetchPoliticalNews(
    countryCode: string,
    limit = 50
  ): Promise<NewsAPIResponse> {
    const API_KEY = process.env.NEWSAPI_KEY;
    if (!API_KEY) {
      throw new Error("NEWSAPI_KEY environment variable is required");
    }

    const country = COUNTRIES[countryCode.toLowerCase()];
    if (!country) {
      throw new Error(
        `Unsupported country code: ${countryCode}. Supported countries: ${Object.keys(
          COUNTRIES
        ).join(", ")}`
      );
    }

    const keywords = country.keywords;
    const searchTerms = country.searchTerms;
    const domains = country.domains;

    const validation = this.validateQueryLength(
      keywords,
      searchTerms,
      countryCode
    );
    if (!validation.isValid) {
      throw new Error(
        `Query too long (${validation.length} chars). NewsAPI limit is 500 chars. Try fewer keywords.`
      );
    }

    const q = validation.query;

    const languageCode = LANGUAGE_CODES[countryCode.toLowerCase()] || "en";

    const params = new URLSearchParams({
      q,
      language: languageCode,
      pageSize: String(Math.min(limit, 100)),
      sortBy: "relevancy",
      domains: domains.join(","),
    });

    const url = `https://newsapi.org/v2/everything?${params.toString()}`;
    const response = await fetch(url, {
      headers: { "X-Api-Key": API_KEY },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `NewsAPI error: ${response.status} ${response.statusText} ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  }

  formatArticles(articles: Article[]): FormattedArticle[] {
    return articles.map((article) => ({
      title: article.title,
      description: article.description,
      source: article.source?.name,
      author: article.author,
      publishedAt: article.publishedAt,
      url: article.url,
      faviconUrl: article.url ? getFaviconUrl(article.url) : undefined,
    }));
  }
}
