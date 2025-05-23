"use client";

import { SearchBar } from "./SearchBar";
import countryData from "@/app/api/data.json";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const DynamicGlobe = dynamic(() => import("@/components/landing/globe"), {
  ssr: false,
});

export default function Hero() {
  const t = useTranslations("LandingPage");

  return (
    <div className="relative z-[1] w-full">
      <div className="relative h-[900px] w-full before:absolute before:inset-0 before:bottom-0 before:z-[1] md:before:[mask-image:radial-gradient(ellipse_30%_40%_at_50%_20%,transparent_50%,#000_100%)] before:[mask-image:radial-gradient(ellipse_70%_30%_at_50%_20%,transparent_50%,#000_100%)] before:bg-gray-50 dark:before:bg-black">
        <DynamicGlobe />
      </div>

      <div className="px-6 lg:px-8 absolute inset-x-0 top-1/4 z-10">
        <div className="mx-auto max-w-5xl py-16 sm:py-28">
          <div className="text-center max-w-3xl mx-auto relative z-[1]">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-800 dark:text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 via-white to-neutral-300 sm:text-6xl">
              {t("title")}
            </h1>
            <h2 className="mt-6 md:mt-8 text-balance text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
              {t("description")}
            </h2>
            <div className="mt-8 md:mt-10 flex items-center justify-center gap-x-6">
              <SearchBar countries={countryData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
