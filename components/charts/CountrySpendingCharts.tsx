"use client";

import * as React from "react";
import { SpendingPieChart } from "./SpendingPieChart";

interface SpendingItem {
  name: string;
  amount: number;
  subtype: string;
}

interface CountryData {
  name: string;
  currency: string;
  spending: SpendingItem[];
}

export function CountrySpendingCharts({ data }: { data: CountryData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {data.map((country) => (
        <SpendingPieChart key={country.name} countryData={country} />
      ))}
    </div>
  );
}
