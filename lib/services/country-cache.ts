import { DataUpdater } from "./data-updater";

const dataUpdater = new DataUpdater();

let cachedCountries: any[] | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export async function getCachedCountries(): Promise<any[]> {
  const now = Date.now();

  if (cachedCountries && now < cacheExpiry) {
    return cachedCountries;
  }

  const staticCountries = dataUpdater.getStaticData();

  const countriesWithLiveData = await Promise.allSettled(
    staticCountries.map(async (country) => {
      try {
        return await dataUpdater.updateCountryData(country.code);
      } catch {
        return {
          ...country,
          population: country.population || 0,
          gdpNominal: country.gdpNominal || 0,
          worldGdpShare: country.worldGdpShare || 0,
          debtToGdp: 0,
          lastUpdated: new Date().toISOString(),
        };
      }
    })
  );

  cachedCountries = countriesWithLiveData.map((result, index) =>
    result.status === "fulfilled"
      ? result.value
      : {
          ...staticCountries[index],
          population: staticCountries[index].population || 0,
          gdpNominal: staticCountries[index].gdpNominal || 0,
          worldGdpShare: staticCountries[index].worldGdpShare || 0,
          debtToGdp: 60,
          lastUpdated: new Date().toISOString(),
        }
  );

  cacheExpiry = now + CACHE_DURATION;
  return cachedCountries;
}
