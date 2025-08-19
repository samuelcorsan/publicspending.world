import { WorldBankAPI } from "@/services/data-sources/world-bank";
import {
  redis,
  StaticCountryData,
  CountryRankingData,
} from "@/lib/redis";

export class DataUpdater {
  private worldBankAPI: WorldBankAPI;

  constructor() {
    this.worldBankAPI = new WorldBankAPI();
  }

  async updateCountryData(countryCode: string) {
    try {
      const staticData = await redis.get(`static:${countryCode}`) as StaticCountryData | null;
      if (!staticData) {
        throw new Error(`No static data found for country: ${countryCode}`);
      }

      const worldBankData = await this.worldBankAPI.getCountryData(countryCode);
      const gdpShare = await this.worldBankAPI.getWorldGdpShare(countryCode);

      const updatedData: CountryRankingData = {
        code: countryCode,
        name: staticData.name,
        population: worldBankData.population || 0,
        gdpNominal: worldBankData.gdpNominal || 0,
        worldGdpShare: gdpShare || 0,
        debtToGdp: worldBankData.debtToGdp || 0,
        controversies: "Data available via controversies API",
        spendingEfficiency: "Standard monitoring in place",
        lastUpdated: new Date().toISOString(),
      };

      return updatedData;
    } catch (error) {
      throw new Error(
        `Failed to update country data for ${countryCode}: ${error}`
      );
    }
  }

  async getAllCountries(): Promise<CountryRankingData[]> {
    const staticCountries = (await redis.smembers("static:countries_list")) || [];
    const countriesWithLiveData = await Promise.allSettled(
      staticCountries.map(async (countryCode) => {
        try {
          return await this.updateCountryData(countryCode);
        } catch (error) {
          const staticData = await redis.get(`static:${countryCode}`) as StaticCountryData | null;
          return {
            code: countryCode,
            name: staticData?.name || countryCode,
            population: 0,
            gdpNominal: 0,
            worldGdpShare: 0,
            debtToGdp: 0,
            controversies: "Data available via controversies API",
            spendingEfficiency: "Standard monitoring in place",
            lastUpdated: new Date().toISOString(),
          };
        }
      })
    );
    return countriesWithLiveData.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : {
            code: "unknown",
            name: "Unknown",
            population: 0,
            gdpNominal: 0,
            worldGdpShare: 0,
            debtToGdp: 0,
            controversies: "Data available via controversies API",
            spendingEfficiency: "Standard monitoring in place",
            lastUpdated: new Date().toISOString(),
          }
    );
  }

  async updateRankings(): Promise<void> {
    const rankings = await this.getAllCountries();
    if (rankings.length > 0) {
      await redis.setex("rankings", 24 * 60 * 60, rankings);
    }
  }

  async getRankings(): Promise<CountryRankingData[]> {
    const cachedRankings = await redis.get("rankings") as CountryRankingData[] | null;
    if (cachedRankings && cachedRankings.length > 0) {
      return cachedRankings;
    }

    await this.updateRankings();
    const freshRankings = await redis.get("rankings") as CountryRankingData[] | null;
    return freshRankings || [];
  }

  async getStaticData(): Promise<StaticCountryData[]> {
    const countryCodes = (await redis.smembers("static:countries_list")) || [];
    const countries = await Promise.all(
      countryCodes.map(async (code) => await redis.get(`static:${code}`) as StaticCountryData | null)
    );
    return countries.filter(Boolean) as StaticCountryData[];
  }
}
