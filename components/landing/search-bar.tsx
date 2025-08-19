"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Country {
  name: string;
  flag: string;
}

interface SearchBarProps {
  countries: Country[];
  isLoading?: boolean;
  error?: string | null;
}

export function SearchBar({
  countries,
  isLoading = false,
  error = null,
}: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getCountrySlug = useCallback((name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      search ? country.name.toLowerCase().includes(search.toLowerCase()) : true
    );
  }, [countries, search]);

  const handleCountrySelect = useCallback(
    async (countryName: string) => {
      try {
        setIsNavigating(true);
        const slug = getCountrySlug(countryName);
        await router.push(`/${slug}`);
      } catch (err) {
        console.error("Navigation failed:", err);
      } finally {
        setIsNavigating(false);
        setIsSearchFocused(false);
        setSelectedIndex(-1);
      }
    },
    [getCountrySlug, router]
  );

  const navigateOptions = useCallback(
    (direction: 1 | -1) => {
      setSelectedIndex((prev) => {
        if (filteredCountries.length === 0) return -1;
        if (direction === 1) {
          return prev < filteredCountries.length - 1 ? prev + 1 : 0;
        } else {
          return prev > 0 ? prev - 1 : filteredCountries.length - 1;
        }
      });
    },
    [filteredCountries.length]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        navigateOptions(e.shiftKey ? -1 : 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateOptions(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateOptions(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCountries.length) {
          handleCountrySelect(filteredCountries[selectedIndex].name);
        } else if (filteredCountries.length > 0) {
          handleCountrySelect(filteredCountries[0].name);
        }
      } else if (e.key === "Escape") {
        setIsSearchFocused(false);
        setSelectedIndex(-1);
      }
    },
    [navigateOptions, selectedIndex, filteredCountries, handleCountrySelect]
  );

  const handleSearchClick = useCallback(() => {
    if (filteredCountries.length > 0) {
      handleCountrySelect(filteredCountries[0].name);
    }
  }, [filteredCountries, handleCountrySelect]);

  const resetSelection = useCallback(() => {
    setIsSearchFocused(false);
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        resetSelection();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [resetSelection]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [search]);

  if (error) {
    return (
      <div className="w-full max-w-2xl relative mb-16">
        <div className="w-full px-6 py-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Failed to load countries. Please try refreshing the page.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-2xl relative mb-16"
      ref={searchRef}
      suppressHydrationWarning
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Search countries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isNavigating}
          aria-label="Search for countries"
          aria-haspopup="listbox"
          aria-controls="countries-listbox"
          aria-activedescendant={
            selectedIndex >= 0 ? `country-${selectedIndex}` : undefined
          }
          className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          suppressHydrationWarning
        />
        {isLoading && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200 border-t-blue-500 border-r-blue-500"></div>
          </div>
        )}
        {isNavigating && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-200 border-t-green-500 border-r-green-500"></div>
          </div>
        )}
      </div>

      {isSearchFocused && (
        <div
          id="countries-listbox"
          role="listbox"
          aria-label="Countries"
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-60 overflow-auto z-10"
        >
          {filteredCountries.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {search
                ? "No countries found matching your search."
                : "No countries available."}
            </div>
          ) : (
            filteredCountries.map((country, index) => (
              <button
                key={country.name}
                id={`country-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={`flex items-center gap-3 w-full p-3 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleCountrySelect(country.name)}
              >
                <Image
                  src={country.flag}
                  alt={`${country.name} flag`}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span>{country.name}</span>
              </button>
            ))
          )}
        </div>
      )}

      <button
        aria-label="Search countries"
        onClick={handleSearchClick}
        disabled={isLoading || isNavigating || filteredCountries.length === 0}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
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
