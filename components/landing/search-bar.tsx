"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Country {
  name: string;
  flag: string;
}

interface SearchBarProps {
  countries: Country[];
}

export function SearchBar({ countries }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("LandingPage");

  const getCountrySlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const handleCountrySelect = (countryName: string) => {
    const slug = getCountrySlug(countryName);
    router.push(`/${slug}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl relative mb-16" ref={searchRef}>
      <input
        type="text"
        placeholder={t("input")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 shadow-sm"
      />
      {isSearchFocused && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-auto z-10">
          {countries.map((country) => (
            <button
              key={country.name}
              className={`flex items-center gap-3 w-full p-3 hover:bg-gray-50 text-left ${
                search &&
                !country.name.toLowerCase().includes(search.toLowerCase())
                  ? "hidden"
                  : ""
              }`}
              onClick={() => {
                handleCountrySelect(country.name);
                setIsSearchFocused(false);
              }}
            >
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{country.name}</span>
            </button>
          ))}
        </div>
      )}
      <button
        aria-label={t("input")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}
