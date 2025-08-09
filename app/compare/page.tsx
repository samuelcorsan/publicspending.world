"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/global/navbar";
import { AnimatedCountryStats } from "@/components/countries/animated-country-stats";
import { SpendingPieChart } from "@/components/charts/spending-pie-chart";
import { RevenuePieChart } from "@/components/charts/revenue-pie-chart";
import countryData from "@/app/api/data.json";
import type { Country } from "@/lib/types";
import { Footer } from "@/components/global/footer";

function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [selectedA, setSelectedA] = useState<Country | null>(null);
  const [selectedB, setSelectedB] = useState<Country | null>(null);
  const [focusA, setFocusA] = useState(false);
  const [focusB, setFocusB] = useState(false);
  
  const dropdownRefA = useRef<HTMLDivElement>(null);
  const dropdownRefB = useRef<HTMLDivElement>(null);

  const filteredA = (countryData as Country[]).filter((c) =>
    c.name.toLowerCase().includes(searchA.toLowerCase())
  );
  const filteredB = (countryData as Country[]).filter((c) =>
    c.name.toLowerCase().includes(searchB.toLowerCase())
  );

  useEffect(() => {
    const a = searchParams.get("a");
    const b = searchParams.get("b");
    if (a) {
      const foundA = (countryData as Country[]).find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === a.toLowerCase()
      );
      if (foundA) {
        setSelectedA(foundA);
        setSearchA(foundA.name);
      }
    }
    if (b) {
      const foundB = (countryData as Country[]).find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === b.toLowerCase()
      );
      if (foundB) {
        setSelectedB(foundB);
        setSearchB(foundB.name);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedA && selectedB) {
      const slugA = selectedA.name.toLowerCase().replace(/\s+/g, "-");
      const slugB = selectedB.name.toLowerCase().replace(/\s+/g, "-");
      router.replace(`/compare?a=${slugA}&b=${slugB}`);
    }
  }, [selectedA, selectedB, router]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRefA.current && !dropdownRefA.current.contains(event.target as Node)) {
        setFocusA(false);
      }
      if (dropdownRefB.current && !dropdownRefB.current.contains(event.target as Node)) {
        setFocusB(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectA = (country: Country) => {
    if (selectedB && country.code === selectedB.code) return;
    setSelectedA(country);
    setFocusA(false);
    setSearchA(country.name);
  };
  const handleSelectB = (country: Country) => {
    if (selectedA && country.code === selectedA.code) return;
    setSelectedB(country);
    setFocusB(false);
    setSearchB(country.name);
  };

  const bothSelected = !!(selectedA && selectedB);
  const mainPadding = bothSelected ? "pt-16" : "pt-24";
  const containerPadding = bothSelected ? "py-6" : "py-12";
  const selectorsMargin = bothSelected ? "mb-6" : "mb-12";
  const titleMargin = bothSelected ? "mb-4" : "mb-10";
  const selectorsJustify = bothSelected ? "items-center" : "items-center";
  const selectorsTopMargin = bothSelected ? "mt-4" : "";

  return (
    <>
      <Navbar />
      <main className={`min-h-screen bg-gray-50 ${mainPadding}`}>
        <div className={`container mx-auto px-4 ${containerPadding}`}>
          {!bothSelected && (
            <>
              <div className="text-center mb-12">
                <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 ${titleMargin}`}>
                  Compare Countries
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Select two countries to see a detailed side-by-side comparison of their
                  public spending, revenue sources, and key economic indicators.
                </p>
                
              </div>
            </>
          )}
          
          <div className={`${selectorsMargin} ${selectorsTopMargin}`} suppressHydrationWarning>
            {/* Reset button when both countries are selected */}
            {bothSelected && (
              <div className="text-center mb-6">
                <button
                  onClick={() => {
                    setSelectedA(null);
                    setSelectedB(null);
                    setSearchA("");
                    setSearchB("");
                    router.replace('/compare');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Compare Different Countries
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center max-w-5xl mx-auto">
              {/* First country selector */}
              <div className="flex justify-center">
                <div ref={dropdownRefA} className="w-full max-w-md relative">
                  {!bothSelected && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Country
                    </label>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={searchA}
                      onChange={(e) => {
                        setSearchA(e.target.value);
                        setFocusA(true);
                      }}
                      onFocus={() => setFocusA(true)}
                      className="w-full px-6 py-4 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all duration-200"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  {focusA && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl max-h-60 overflow-auto z-10">
                      {filteredA
                        .filter(
                          (country) =>
                            !selectedB || country.code !== selectedB.code
                        )
                        .map((country) => (
                          <button
                            key={country.name}
                            className="flex items-center gap-3 w-full p-4 hover:bg-blue-50 text-left transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                            onClick={() => handleSelectA(country)}
                          >
                            <img
                              src={country.flag}
                              alt={`${country.name} flag`}
                              className="w-6 h-6 rounded-full object-cover shadow-sm"
                            />
                            <span className="font-medium text-gray-900">{country.name}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* VS divider */}
              <div className="flex items-center justify-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 px-6">VS</div>
              </div>
              
              {/* Second country selector */}
              <div className="flex justify-center">
                <div ref={dropdownRefB} className="w-full max-w-md relative">
                  {!bothSelected && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Second Country
                    </label>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={searchB}
                      onChange={(e) => {
                        setSearchB(e.target.value);
                        setFocusB(true);
                      }}
                      onFocus={() => setFocusB(true)}
                      className="w-full px-6 py-4 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all duration-200"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  {focusB && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl max-h-60 overflow-auto z-10">
                      {filteredB
                        .filter(
                          (country) =>
                            !selectedA || country.code !== selectedA.code
                        )
                        .map((country) => (
                          <button
                            key={country.name}
                            className="flex items-center gap-3 w-full p-4 hover:bg-blue-50 text-left transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                            onClick={() => handleSelectB(country)}
                          >
                            <img
                              src={country.flag}
                              alt={`${country.name} flag`}
                              className="w-6 h-6 rounded-full object-cover shadow-sm"
                            />
                            <span className="font-medium text-gray-900">{country.name}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {selectedA && selectedB && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              {[selectedA, selectedB].map((country, idx) => (
                <section
                  key={country.code + "-" + idx}
                  className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center"
                >
                  <h2 className="text-xl font-bold mb-2 text-gray-900">
                    {country.name}
                  </h2>
                  <span className="text-gray-500 mb-4">{country.code}</span>
                  <AnimatedCountryStats
                    name={country.name}
                    code={country.code}
                    gdpNominal={country.gdpNominal}
                    population={country.population}
                    capital={country.capital || ""}
                    currency={country.currency}
                  />
                  <div className="w-full mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Revenue
                    </h3>
                    <RevenuePieChart countryData={country} />
                  </div>
                  <div className="w-full mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Spending
                    </h3>
                    <SpendingPieChart countryData={country} />
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ComparePageWithSuspense() {
  return (
    <Suspense>
      <ComparePage />
    </Suspense>
  );
}
