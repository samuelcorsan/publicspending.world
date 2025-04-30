export interface RevenueItem {
  name: string;
  amount: number;
  subtype: string;
}

export interface SpendingItem {
  name: string;
  amount: number;
  subtype: string;
}

export interface TaxBurdenPerCapita {
  amount: number;
  currency: string;
  convertedCurrencyAmount?: number;
  convertedCurrency?: string;
}

export interface Country {
  name: string;

  code: string;
  flag: string;
  population: number;
  gdpNominal: number;
  worldGdpShare: number;
  revenue: RevenueItem[];
  spending: SpendingItem[];
  currency: string;
  capital?: string;
  taxBurdenPerCapita?: TaxBurdenPerCapita;
  debtToGdp?: number;
}

export const validTopics = [
  "population",
  "gdp-nominal",
  "world-gdp-share",
  "spending",
  "revenue",
] as const;
export type ValidTopic = (typeof validTopics)[number];
