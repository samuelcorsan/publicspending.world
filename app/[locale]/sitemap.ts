import { MetadataRoute } from "next";
import data from "../api/data.json";

// Valid ranking topics
const validTopics = [
  "population",
  "gdp-nominal",
  "world-gdp-share",
  "spending",
  "revenue",
] as const;

const getCountrySlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://publicspending.world";

  // Static routes
  const staticRoutes = ["", "/compare", "/ranking"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Country routes
  const countryRoutes = data.map((country) => ({
    url: `${baseUrl}/${getCountrySlug(country.name)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...countryRoutes];
}
