import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFaviconUrl(url: string): string {
  if (!url) return "";

  const cleanDomain = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=32`;
}
