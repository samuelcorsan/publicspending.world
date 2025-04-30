"use client";
import { Card } from "./ui/card";

interface CountryCardProps {
  name: string;
  flag: string;
  population: number;
  gdpNominal: number;
  worldGdpShare: number;
  revenue: Array<{
    name: string;
    amount: number;
    subtype: string;
  }>;
  spending: Array<{
    name: string;
    amount: number;
    subtype: string;
  }>;
  code: string;
  currency: string;
}

const formatNumber = (num: number) => {
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  return num.toLocaleString();
};

export function CountryCard({
  name,
  flag,
  population,
  gdpNominal,
  worldGdpShare,
  revenue,
  spending,
  code,
  currency,
}: CountryCardProps) {
  const totalRevenue = revenue.find((r) => r.subtype === "total")?.amount || 0;
  const totalSpending =
    spending.find((s) => s.subtype === "total")?.amount || 0;
  const deficit = totalSpending - totalRevenue;

  const topSpending = spending
    .filter((s) => s.subtype !== "total")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const spendingData = topSpending.map((item) => ({
    name: item.name.split(" ")[0],
    value: item.amount,
    percentage: ((item.amount / totalSpending) * 100).toFixed(1),
  }));

  return (
    <Card className="p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all min-w-[400px] bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src={flag}
            alt={`${name} flag`}
            className="w-10 h-10 rounded-lg object-cover shadow-sm"
          />
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">
              {code} · {currency}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Population</p>
          <p className="font-semibold">{population.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            GDP Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-blue-600">Nominal GDP</p>
              <p className="font-bold text-blue-900">
                ${formatNumber(gdpNominal)}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600">World Share</p>
              <p className="font-bold text-blue-900">{worldGdpShare}%</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            Budget Overview
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-green-600">Revenue</p>
              <p className="font-bold text-green-900">
                {formatNumber(totalRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-green-600">Spending</p>
              <p className="font-bold text-green-900">
                {formatNumber(totalSpending)}
              </p>
            </div>
            <div>
              <p className="text-xs text-green-600">Balance</p>
              <p
                className={`font-bold ${
                  deficit > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {deficit > 0 ? "-" : "+"}
                {formatNumber(Math.abs(deficit))}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-800 mb-3">
            Top Spending Categories
          </h4>
          <div className="space-y-2">
            {spendingData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="min-w-[100px] text-right">
                  <p className="text-xs font-medium text-gray-600">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
