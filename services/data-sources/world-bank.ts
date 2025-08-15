import { CountryDataCache } from "@/lib/redis";

interface WorldBankIndicator {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export class WorldBankAPI {
  private baseUrl = "https://api.worldbank.org/v2/country";

  private async fetchIndicator(
    countryCode: string,
    indicator: string
  ): Promise<number | null> {
    try {
      const url = `${this.baseUrl}/${countryCode}/indicator/${indicator}?format=json&per_page=1&most_recent_year=1`;
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data && data[1] && data[1][0]) {
        return data[1][0].value;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getCountryData(countryCode: string) {
    const indicators = {
      population: "SP.POP.TOTL",
      gdpNominal: "NY.GDP.MKTP.CD",
      debtToGdp: "GC.DOD.TOTL.GD.ZS",
    };

    const promises = Object.entries(indicators).map(
      async ([key, indicator]) => {
        const value = await this.fetchIndicator(countryCode, indicator);
        return { [key]: value };
      }
    );

    const results = await Promise.all(promises);
    return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }

  async getWorldGdpShare(countryCode: string): Promise<number | null> {
    try {
      const worldGdp = await this.fetchIndicator("WLD", "NY.GDP.MKTP.CD");
      const countryGdp = await this.fetchIndicator(
        countryCode,
        "NY.GDP.MKTP.CD"
      );

      if (!worldGdp || !countryGdp) {
        return null;
      }

      const share = (countryGdp / worldGdp) * 100;
      return Math.round(share * 1000) / 1000;
    } catch (error) {
      return null;
    }
  }
}
