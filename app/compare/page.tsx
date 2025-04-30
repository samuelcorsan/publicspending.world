"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { AnimatedCountryStats } from "@/components/AnimatedCountryStats";
import { SpendingPieChart } from "@/components/charts/SpendingPieChart";
import { RevenuePieChart } from "@/components/charts/RevenuePieChart";
import { DebtToGdpDisplay } from "@/components/DebtToGdpDisplay";
import countryData from "@/app/api/data.json";
import type { Country } from "@/lib/types";

function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [selectedA, setSelectedA] = useState<Country | null>(null);
  const [selectedB, setSelectedB] = useState<Country | null>(null);
  const [focusA, setFocusA] = useState(false);
  const [focusB, setFocusB] = useState(false);

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
              <h1
                className={`text-4xl md:text-5xl font-extrabold text-center text-gray-900 ${titleMargin}`}
              >
                Compare Countries
              </h1>
              <p className="text-lg text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Select two countries to see a side-by-side comparison of their
                public spending, revenue, and key economic indicators.
              </p>
            </>
          )}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${selectorsMargin} ${selectorsTopMargin}`}
          >
            <div className={`flex flex-col ${selectorsJustify}`}>
              <div className="w-full max-w-md relative mb-4">
                <input
                  type="text"
                  placeholder="Select first country..."
                  value={searchA}
                  onChange={(e) => {
                    setSearchA(e.target.value);
                    setFocusA(true);
                  }}
                  onFocus={() => setFocusA(true)}
                  className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 shadow-sm"
                />
                {focusA && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-auto z-10">
                    {filteredA
                      .filter(
                        (country) =>
                          !selectedB || country.code !== selectedB.code
                      )
                      .map((country) => (
                        <button
                          key={country.name}
                          className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 text-left"
                          onClick={() => handleSelectA(country)}
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
              </div>
            </div>

            <div className={`flex flex-col ${selectorsJustify}`}>
              <div className="w-full max-w-md relative mb-4">
                <input
                  type="text"
                  placeholder="Select second country..."
                  value={searchB}
                  onChange={(e) => {
                    setSearchB(e.target.value);
                    setFocusB(true);
                  }}
                  onFocus={() => setFocusB(true)}
                  className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 shadow-sm"
                />
                {focusB && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-auto z-10">
                    {filteredB
                      .filter(
                        (country) =>
                          !selectedA || country.code !== selectedA.code
                      )
                      .map((country) => (
                        <button
                          key={country.name}
                          className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 text-left"
                          onClick={() => handleSelectB(country)}
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
                  <div className="w-full mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Tax Burden Per Capita (beta)
                    </h3>
                    <span className="text-xl font-bold text-gray-900">
                      {country.taxBurdenPerCapita &&
                      country.taxBurdenPerCapita.amount
                        ? `$${country.taxBurdenPerCapita.amount.toLocaleString()} USD`
                        : "No data"}
                    </span>
                  </div>
                  <div className="w-full mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Debt to GDP
                    </h3>
                    <DebtToGdpDisplay
                      debtToGdp={country.debtToGdp}
                      gdpNominal={country.gdpNominal}
                      taxBurdenPerCapita={country.taxBurdenPerCapita}
                    />
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
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
