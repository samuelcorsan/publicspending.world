"use client";

import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import countryData from "./api/data.json";
import { WorldRankings } from "@/components/landing/world-rankings";
import Hero from "@/components/landing/hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex flex-col items-center pt-2 px-4 md:px-8 lg:px-16">
          <main className="max-w-7xl w-full">
            <div className="flex flex-col items-center text-center mb-12">
              <Hero />
              <WorldRankings countries={countryData} />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
