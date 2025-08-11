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
  private baseUrl = 'https://api.worldbank.org/v2';
  
  async getCountryData(countryCode: string) {

    const indicators = {
      gdpNominal: 'NY.GDP.MKTP.CD',
      population: 'SP.POP.TOTL',
      debtToGdp: 'GC.DOD.TOTL.GD.ZS'
    };

    const promises = Object.entries(indicators).map(([key, indicator]) =>
      this.fetchIndicator(countryCode, indicator).then(value => ({ [key]: value }))
    );

    const results = await Promise.all(promises);
    return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }

  private async fetchIndicator(countryCode: string, indicator: string): Promise<number | null> {
    try {
      const url = `${this.baseUrl}/country/${countryCode}/indicator/${indicator}?format=json&date=2023:2024&per_page=2`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`World Bank API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length < 2) {
        return null;
      }

      const indicatorData = data[1] as WorldBankIndicator[];
      const latestData = indicatorData.find(item => item.value !== null);
      
      return latestData?.value || null;
    } catch (error) {
      return null;
    }
  }

  async getWorldGdpShare(countryCode: string): Promise<number | null> {
    try {
      const worldGdp = await this.fetchIndicator('WLD', 'NY.GDP.MKTP.CD');
      const countryGdp = await this.fetchIndicator(countryCode, 'NY.GDP.MKTP.CD');
      
      if (!worldGdp || !countryGdp) return null;
      
      const share = (countryGdp / worldGdp) * 100;
      return Math.round(share * 1000) / 1000;
    } catch (error) {
      return null;
    }
  }
}