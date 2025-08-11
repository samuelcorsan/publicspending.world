export interface Country {
  name: string;
  keywords: string[];
  searchTerms: string[];
  domains: string;
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
  urlToImage?: string;
}

export interface APIResponse {
  success: boolean;
  country?: string;
  countryCode?: string;
  total?: number;
  articles?: FormattedArticle[];
  error?: string;
  message?: string;
}

export interface QueryValidation {
  query: string;
  length: number;
  isValid: boolean;
}
