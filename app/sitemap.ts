import { MetadataRoute } from "next";
import data from "./api/data.json";
import { validTopics } from "@/lib/types";

const currentDate = new Date();
const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

const getCountrySlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://publicspending.world";

  const staticRoutes = [
    { route: "", priority: 1.0, changeFreq: "weekly" as const },
    { route: "/compare", priority: 0.9, changeFreq: "weekly" as const },
    { route: "/ranking", priority: 0.9, changeFreq: "weekly" as const },
    { route: "/about", priority: 0.5, changeFreq: "monthly" as const },
    { route: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
  ].map(({ route, priority, changeFreq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: changeFreq,
    priority: priority,
  }));

  const rankingRoutes = validTopics.map((topic) => ({
    url: `${baseUrl}/ranking/${topic}`,
    lastModified: oneWeekAgo,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const countryRoutes = data.map((country) => ({
    url: `${baseUrl}/${getCountrySlug(country.name)}`,
    lastModified: oneWeekAgo,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...rankingRoutes, ...countryRoutes];
}
