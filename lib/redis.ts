import { Redis } from "@upstash/redis";

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error(
    "Missing Redis environment variables. Please set KV_REST_API_URL and KV_REST_API_TOKEN in your .env.local file"
  );
}

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export const CACHE_KEYS = {
  CONTROVERSIES: "controversies",
  LAST_UPDATE: "controversies:last_update",
  COUNTRY_DATA: (country: string) => `controversies:${country}`,
  ALL_COUNTRIES: "controversies:countries_list",
  STATIC_COUNTRY_DATA: (country: string) => `static:${country}`,
  ALL_STATIC_COUNTRIES: "static:countries_list",
  RANKINGS: "rankings",
  COUNTRY_LIVE_DATA: (country: string) => `live:${country}`,
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

export interface StaticCountryData {
  name: string;
  code: string;
  organizations: string[];
  capital: string;
  currency: string;
  languages: string[];
  timezone: string;
  continent: string;
  flag: string;
  revenue: Array<{
    name: string;
    subtype: string;
    amount: number;
  }>;
  spending: Array<{
    name: string;
    subtype: string;
    amount: number;
  }>;
}

export interface CountryRankingData {
  code: string;
  name: string;
  population: number;
  gdpNominal: number;
  worldGdpShare: number;
  debtToGdp: number;
  controversies: string;
  spendingEfficiency: string;
  lastUpdated: string;
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

export class CountryDataCache {
  static async setStaticCountryData(
    countryCode: string,
    data: StaticCountryData
  ): Promise<void> {
    const key = CACHE_KEYS.STATIC_COUNTRY_DATA(countryCode);
    const pipeline = redis.pipeline();

    pipeline.set(key, data);
    pipeline.sadd(CACHE_KEYS.ALL_STATIC_COUNTRIES, countryCode);

    await pipeline.exec();
  }

  static async getStaticCountryData(
    countryCode: string
  ): Promise<StaticCountryData | null> {
    const key = CACHE_KEYS.STATIC_COUNTRY_DATA(countryCode);
    const data = await redis.get(key);

    if (!data) {
      return null;
    }

    return data as StaticCountryData;
  }

  static async getAllStaticCountries(): Promise<string[]> {
    return (await redis.smembers(CACHE_KEYS.ALL_STATIC_COUNTRIES)) || [];
  }

  static async setRankings(rankings: CountryRankingData[]): Promise<void> {
    await redis.setex(CACHE_KEYS.RANKINGS, 24 * 60 * 60, rankings);
  }

  static async getRankings(): Promise<CountryRankingData[] | null> {
    const data = await redis.get(CACHE_KEYS.RANKINGS);
    if (!data) return null;

    return data as CountryRankingData[];
  }

  static async setCountryLiveData(
    countryCode: string,
    data: CountryRankingData
  ): Promise<void> {
    const key = CACHE_KEYS.COUNTRY_LIVE_DATA(countryCode);
    await redis.setex(key, 24 * 60 * 60, data);
  }

  static async getCountryLiveData(
    countryCode: string
  ): Promise<CountryRankingData | null> {
    const key = CACHE_KEYS.COUNTRY_LIVE_DATA(countryCode);
    const data = await redis.get(key);
    if (!data) return null;
    return data as CountryRankingData;
  }

  static async clearAll(): Promise<void> {
    const countries = await this.getAllStaticCountries();
    const pipeline = redis.pipeline();

    countries.forEach((country) => {
      pipeline.del(CACHE_KEYS.STATIC_COUNTRY_DATA(country));
      pipeline.del(CACHE_KEYS.COUNTRY_LIVE_DATA(country));
    });

    pipeline.del(CACHE_KEYS.ALL_STATIC_COUNTRIES);
    pipeline.del(CACHE_KEYS.RANKINGS);

    await pipeline.exec();
  }
}
