import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const CACHE_KEYS = {
  CONTROVERSIES: "controversies",
  LAST_UPDATE: "controversies:last_update",
  COUNTRY_DATA: (country: string) => `controversies:${country}`,
  ALL_COUNTRIES: "controversies:countries_list",
} as const;

export interface CachedControversyData {
  country: string;
  countryCode: string;
  total: number;
  aiSummary: string | null;
  articles: Array<{
    title: string;
    description?: string;
    source?: string;
    author?: string;
    publishedAt: string;
    url: string;
    faviconUrl?: string;
  }>;
  lastUpdated: string;
  processingTime: number;
}

export class ControversiesCache {
  static async setCountryData(
    countryCode: string,
    data: CachedControversyData
  ): Promise<void> {
    const key = CACHE_KEYS.COUNTRY_DATA(countryCode);
    const pipeline = redis.pipeline();

    pipeline.setex(key, 8 * 24 * 60 * 60, JSON.stringify(data));
    pipeline.sadd(CACHE_KEYS.ALL_COUNTRIES, countryCode);
    pipeline.set(CACHE_KEYS.LAST_UPDATE, new Date().toISOString());

    await pipeline.exec();
  }

  static async getCountryData(
    countryCode: string
  ): Promise<CachedControversyData | null> {
    const key = CACHE_KEYS.COUNTRY_DATA(countryCode);
    const data = await redis.get(key);

    if (!data || typeof data !== "string") {
      return null;
    }

    try {
      return JSON.parse(data) as CachedControversyData;
    } catch {
      return null;
    }
  }

  static async getAllCountries(): Promise<string[]> {
    return (await redis.smembers(CACHE_KEYS.ALL_COUNTRIES)) || [];
  }

  static async getLastUpdate(): Promise<string | null> {
    return await redis.get(CACHE_KEYS.LAST_UPDATE);
  }

  static async getCacheStats(): Promise<{
    totalCountries: number;
    lastUpdate: string | null;
    availableCountries: string[];
  }> {
    const pipeline = redis.pipeline();
    pipeline.scard(CACHE_KEYS.ALL_COUNTRIES);
    pipeline.get(CACHE_KEYS.LAST_UPDATE);
    pipeline.smembers(CACHE_KEYS.ALL_COUNTRIES);

    const results = await pipeline.exec();

    return {
      totalCountries: (results[0] as number) || 0,
      lastUpdate: (results[1] as string) || null,
      availableCountries: (results[2] as string[]) || [],
    };
  }

  static async deleteCountryData(countryCode: string): Promise<void> {
    const pipeline = redis.pipeline();
    pipeline.del(CACHE_KEYS.COUNTRY_DATA(countryCode));
    pipeline.srem(CACHE_KEYS.ALL_COUNTRIES, countryCode);
    await pipeline.exec();
  }

  static async clearAll(): Promise<void> {
    const countries = await this.getAllCountries();
    const pipeline = redis.pipeline();

    countries.forEach((country) => {
      pipeline.del(CACHE_KEYS.COUNTRY_DATA(country));
    });

    pipeline.del(CACHE_KEYS.ALL_COUNTRIES);
    pipeline.del(CACHE_KEYS.LAST_UPDATE);

    await pipeline.exec();
  }
}
