export interface Country {
  name: string;
  keywords: string[];
  searchTerms: string[];
  domains: string[];
}

export interface Article {
  title: string;
  description?: string;
  source?: { name: string };
  author?: string;
  publishedAt: string;
  url: string;
  urlToImage?: string;
}

export interface NewsAPIResponse {
  articles: Article[];
  totalResults: number;
  status: string;
}

export interface FormattedArticle {
  title: string;
  description?: string;
  source?: string;
  author?: string;
  publishedAt: string;
  url: string;
  faviconUrl?: string;
}

export interface APIResponse {
  success: boolean;
  country?: string;
  countryCode?: string;
  total?: number;
  aiSummary?: string | null;
  articles?: FormattedArticle[];
  error?: string;
  message?: string;
  cached?: boolean;
  lastUpdated?: string;
  cacheAge?: number;
}

export interface ControversyData {
  success: boolean;
  country: string;
  countryCode: string;
  total: number;
  aiSummary: string | null;
  articles: FormattedArticle[];
  cached?: boolean;
  lastUpdated?: string;
  cacheAge?: number;
}

export const COUNTRY_CODE_MAP: Record<string, string> = {
  "united-states": "us",
  usa: "us",
  america: "us",
  "united-kingdom": "uk",
  uk: "uk",
  britain: "uk",
  france: "fr",
  germany: "de",
  china: "cn",
  russia: "ru",
  india: "in",
  brazil: "br",
  japan: "jp",
  canada: "ca",
  australia: "au",
  mexico: "mx",
  "south-korea": "kr",
  italy: "it",
  spain: "es",
  argentina: "ar",
  "south-africa": "za",
  nigeria: "ng",
  egypt: "eg",
  turkey: "tr",
  indonesia: "id",
  pakistan: "pk",
  bangladesh: "bd",
  "saudi-arabia": "sa",
  israel: "il",
  ukraine: "ua",
  thailand: "th",
  poland: "pl",
  netherlands: "nl",
  sweden: "se",
};

export interface QueryValidation {
  query: string;
  length: number;
  isValid: boolean;
}
