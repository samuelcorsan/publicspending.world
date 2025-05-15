"use client";

import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/Footer";
import countryData from "./api/data.json";
import { SearchBar } from "@/components/SearchBar";
import { WorldRankings } from "@/components/WorldRankings";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex flex-col items-center pt-32 px-4 md:px-8 lg:px-16">
          <main className="max-w-7xl w-full">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                World Public
                <br />
                Spending Data
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl">
                Better <span className="text-blue-500">insights</span>, better{" "}
                <span className="text-blue-500">transparency</span>, no
                barriers.
              </p>

              <SearchBar countries={countryData} />
              <WorldRankings countries={countryData} />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
