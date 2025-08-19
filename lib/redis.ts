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
