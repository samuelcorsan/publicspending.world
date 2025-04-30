import { notFound } from "next/navigation";
import { SpendingPieChart } from "@/components/charts/SpendingPieChart";
import { RevenuePieChart } from "@/components/charts/RevenuePieChart";
import { AnimatedCountryStats } from "@/components/AnimatedCountryStats";
import { NationalIncidentsToast } from "@/components/NationalIncidentsToast";
import Link from "next/link";
import { AlertCircle, Gauge, BarChart2, Wallet, Info } from "lucide-react";
import { DebtToGdpDisplay } from "@/components/DebtToGdpDisplay";
import { Tooltip } from "@/components/ui/tooltip";

type Props = {
  params: Promise<{ country: string }>;
};

async function getCountryData(country: string) {
  try {
    const res = await fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "https://publicspending.world"
          : "http://localhost:3000"
      }/api/name/${country}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;

  const countryData = await getCountryData(country);
  return (
    <main className="min-h-screen bg-gray-50">
      <NationalIncidentsToast incidents={countryData.national_incidents} />
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xl font-bold text-gray-900 text-center hover:underline">
            <Link href="/">publicspending.world</Link>
          </p>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-20">
          <AnimatedCountryStats
            name={countryData.name}
            code={countryData.code}
            gdpNominal={countryData.gdpNominal}
            population={countryData.population}
            capital={countryData.capital}
            currency={countryData.currency}
          />

          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg text-gray-900 mb-4 text-center font-bold">
              Member Organizations
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {countryData.organizations.map((org: string) => (
                <span
                  key={org}
                  className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 transition-all duration-700`}
        >
          <section className="bg-white rounded-xl shadow-sm p-8">
            <RevenuePieChart countryData={countryData} />
          </section>
          <section className="bg-white rounded-xl shadow-sm p-8">
            <SpendingPieChart countryData={countryData} />
          </section>
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700`}
        >
          <section className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-6">
              <BarChart2 className="w-6 h-6 mr-2 text-blue-500" /> Revenue
              Sources
              <Tooltip text="Shows the main sources of government income, helping to understand how the country funds its public services." />
            </h3>
            <div className="space-y-4">
              {countryData.revenue.map((item: any) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-gray-900">
                    {(item.amount / 1e9).toFixed(2)}B {countryData.currency}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-6">
              <BarChart2 className="w-6 h-6 mr-2 text-green-500" /> Spending
              Allocation
              <Tooltip text="Shows how government funds are distributed across different sectors, revealing national priorities and commitments." />
            </h3>
            <div className="space-y-4">
              {countryData.spending.map((item: any) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-gray-900">
                    {(item.amount / 1e9).toFixed(2)}B {countryData.currency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <section className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-4">
              <AlertCircle className="w-6 h-6 mr-2 text-red-500" />{" "}
              Controversies
              <Tooltip text="Fiscal controversies highlight political, social, or economic challenges that can affect a country's stability and future policy direction." />
            </h3>
            <p className="mb-2 text-gray-700">
              {countryData.controversies || "No major controversies reported."}
            </p>
          </section>
          <section className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-4">
              <Gauge className="w-6 h-6 mr-2 text-yellow-500" /> Spending
              Efficiency
              <Tooltip text="Measures how well public funds are used to achieve desired outcomes. High efficiency means more value for taxpayers and better services." />
            </h3>
            <p className="mb-2 text-gray-700">
              {countryData.spendingEfficiency ||
                "No data on spending efficiency."}
            </p>
          </section>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-4">
              <BarChart2 className="w-6 h-6 mr-2 text-purple-500" /> Debt to GDP
              <Tooltip text="Shows the size of a country's government debt compared to its economy. High ratios may signal fiscal risk, while lower ratios suggest more sustainable finances." />
            </h3>
            <div className="mb-2 text-gray-700">
              <DebtToGdpDisplay
                debtToGdp={countryData.debtToGdp}
                gdpNominal={countryData.gdpNominal}
                taxBurdenPerCapita={countryData.taxBurdenPerCapita}
              />
            </div>
          </section>
          <section className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-4">
              <Wallet className="w-6 h-6 mr-2 text-orange-500" /> Tax Burden Per
              Capita (beta)
              <span className="relative ml-2 group">
                <Info
                  tabIndex={0}
                  className="inline w-6 h-6 text-gray-400 cursor-pointer hover:text-blue-600 focus:text-blue-600 outline-none"
                />
                <span className="absolute left-1/2 top-8 z-10 w-72 -translate-x-1/2 rounded bg-gray-900 px-4 py-3 text-xs text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200 shadow-lg">
                  <b>Tax Burden Level:</b>
                  <br />
                  <span className="block mt-1">
                    <span className="text-green-300 font-bold">
                      Green (Low):
                    </span>{" "}
                    Less than $10,000 per capita
                  </span>
                  <span className="block">
                    <span className="text-orange-300 font-bold">
                      Orange (Moderate):
                    </span>{" "}
                    $10,000 - $20,000 per capita
                  </span>
                  <span className="block">
                    <span className="text-red-300 font-bold">Red (High):</span>{" "}
                    $20,000 - $30,000 per capita
                  </span>
                  <span className="block">
                    <span className="text-purple-300 font-bold">
                      Purple (Very High):
                    </span>{" "}
                    Over $30,000 per capita
                  </span>
                </span>
              </span>
            </h3>
            <div className="mb-2 flex flex-col items-start">
              {countryData.taxBurdenPerCapita &&
              countryData.taxBurdenPerCapita.amount ? (
                <>
                  <span className="text-xl font-bold text-gray-900">
                    ${countryData.taxBurdenPerCapita.amount.toLocaleString()}{" "}
                    USD
                  </span>
                  {countryData.taxBurdenPerCapita.convertedCurrencyAmount &&
                    countryData.taxBurdenPerCapita.convertedCurrency && (
                      <span className="text-lg text-gray-700">
                        {countryData.taxBurdenPerCapita.convertedCurrencyAmount.toLocaleString()}{" "}
                        {countryData.taxBurdenPerCapita.convertedCurrency}
                      </span>
                    )}
                  {(() => {
                    const amount = countryData.taxBurdenPerCapita.amount;
                    let color = "text-green-500";
                    let label = "Low";
                    if (amount > 10000 && amount <= 20000) {
                      color = "text-orange-400";
                      label = "Moderate";
                    } else if (amount > 20000 && amount <= 30000) {
                      color = "text-red-500";
                      label = "High";
                    } else if (amount > 30000) {
                      color = "text-purple-600";
                      label = "Very High";
                    }
                    return (
                      <span className="mt-2 text-base font-semibold">
                        Level: <span className={color}>{label}</span>
                      </span>
                    );
                  })()}
                </>
              ) : (
                <span>No data available.</span>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// TODO: To fix params error in build
/* export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const countryName = formatCountryName(country);
  return {
    title: `${countryName} - Public Spending`,
    description: `Public spending and revenue information for ${countryName}`,
  };
} 
function formatCountryName(country: string): string {
  return country
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
*/
