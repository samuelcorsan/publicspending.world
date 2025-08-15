import { WorldBankAPI } from "@/services/data-sources/world-bank";
import {
  CountryDataCache,
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
      const staticData = await CountryDataCache.getStaticCountryData(
        countryCode
      );
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
    const staticCountries = await CountryDataCache.getAllStaticCountries();
    const countriesWithLiveData = await Promise.allSettled(
      staticCountries.map(async (countryCode) => {
        try {
          return await this.updateCountryData(countryCode);
        } catch (error) {
          const staticData = await CountryDataCache.getStaticCountryData(
            countryCode
          );
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
      await CountryDataCache.setRankings(rankings);
    }
  }

  async getRankings(): Promise<CountryRankingData[]> {
    const cachedRankings = await CountryDataCache.getRankings();
    if (cachedRankings && cachedRankings.length > 0) {
      return cachedRankings;
    }
    await this.updateRankings();
    const freshRankings = await CountryDataCache.getRankings();
    return freshRankings || [];
  }

  async getStaticData(): Promise<StaticCountryData[]> {
    const countryCodes = await CountryDataCache.getAllStaticCountries();
    const countries = await Promise.all(
      countryCodes.map((code) => CountryDataCache.getStaticCountryData(code))
    );
    return countries.filter(Boolean) as StaticCountryData[];
  }
}
