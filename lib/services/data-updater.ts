import { WorldBankAPI } from '../data-sources/world-bank';
import staticCountries from '../../app/api/data.json';

interface StaticCountryData {
  name: string;
  code: string;
  organizations: string[];
  capital: string;
  currency: string;
  languages: string[];
  timezone: string;
  continent: string;
  flag: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export class DataUpdater {
  private worldBank: WorldBankAPI;
  private staticData: Map<string, StaticCountryData> = new Map();

  constructor() {
    this.worldBank = new WorldBankAPI();
    this.loadStaticData();
  }

  private async loadStaticData() {
    try {
      staticCountries.forEach((country: any) => {
        this.staticData.set(country.code, {
          name: country.name,
          code: country.code,
          organizations: country.organizations,
          capital: country.capital,
          currency: country.currency,
          languages: country.languages,
          timezone: country.timezone,
          continent: country.continent,
          flag: country.flag,
          coordinates: country.coordinates
        });
      });
    } catch (error) {
      // Static data loading failed
    }
  }

  async updateCountryData(countryCode: string): Promise<any> {
    const staticData = this.staticData.get(countryCode);
    if (!staticData) {
      throw new Error(`No static data found for country code: ${countryCode}`);
    }

    const originalData = await this.getOriginalCountryData(countryCode);

    try {
      const worldBankData = await this.worldBank.getCountryData(countryCode);
      const worldGdpShare = await this.worldBank.getWorldGdpShare(countryCode);

      const hasValidData = (worldBankData.population || 0) > 0 || (worldBankData.gdpNominal || 0) > 0;

      if (!hasValidData && originalData) {
        return {
          ...staticData,
          population: originalData.population || 0,
          gdpNominal: originalData.gdpNominal || 0,
          worldGdpShare: originalData.worldGdpShare || 0,
          debtToGdp: originalData.debtToGdp || 0,
          controversies: originalData.controversies || 'No recent data available.',
          spendingEfficiency: originalData.spendingEfficiency || 'Standard monitoring in place.',
          revenue: originalData.revenue || [],
          spending: originalData.spending || [],
          lastUpdated: new Date().toISOString()
        };
      }

      return {
        ...staticData,
        population: worldBankData.population || originalData?.population || 0,
        gdpNominal: worldBankData.gdpNominal || originalData?.gdpNominal || 0,
        worldGdpShare: worldGdpShare || originalData?.worldGdpShare || 0,
        debtToGdp: worldBankData.debtToGdp || originalData?.debtToGdp || 0,
        controversies: originalData?.controversies || 'No recent data available.',
        spendingEfficiency: originalData?.spendingEfficiency || 'Standard monitoring in place.',
        revenue: originalData?.revenue || [],
        spending: originalData?.spending || [],
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      if (originalData) {
        return {
          ...staticData,
          population: originalData.population || 0,
          gdpNominal: originalData.gdpNominal || 0,
          worldGdpShare: originalData.worldGdpShare || 0,
          debtToGdp: originalData.debtToGdp || 0,
          controversies: originalData.controversies || 'No recent data available.',
          spendingEfficiency: originalData.spendingEfficiency || 'Standard monitoring in place.',
          revenue: originalData.revenue || [],
          spending: originalData.spending || [],
          lastUpdated: new Date().toISOString()
        };
      }

      throw error;
    }
  }

  private async getOriginalCountryData(countryCode: string): Promise<any> {
    try {
      return staticCountries.find((country: any) => country.code === countryCode);
    } catch (error) {
      return null;
    }
  }

  getStaticData(): any[] {
    return staticCountries;
  }

}