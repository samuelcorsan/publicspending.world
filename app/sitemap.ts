import { MetadataRoute } from "next";
import data from "./api/data.json";
import { validTopics } from "@/lib/types";

const getCountrySlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://publicspending.world";

  // Static routes
  const staticRoutes = [
    { route: "", priority: 1, changeFreq: "daily" as const },
    { route: "/compare", priority: 0.8, changeFreq: "daily" as const },
    { route: "/ranking", priority: 0.8, changeFreq: "daily" as const },
    { route: "/about", priority: 0.6, changeFreq: "monthly" as const },
    { route: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
  ].map(({ route, priority, changeFreq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority: priority,
  }));

  // Ranking category routes
  const rankingRoutes = validTopics.map((topic) => ({
    url: `${baseUrl}/ranking/${topic}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Country routes
  const countryRoutes = data.map((country) => ({
    url: `${baseUrl}/${getCountrySlug(country.name)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...rankingRoutes, ...countryRoutes];
}