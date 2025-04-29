import { notFound } from "next/navigation";
import { SpendingPieChart } from "@/components/charts/SpendingPieChart";
import { RevenuePieChart } from "@/components/charts/RevenuePieChart";
import { AnimatedCountryStats } from "@/components/AnimatedCountryStats";
import { NationalIncidentsToast } from "@/components/NationalIncidentsToast";
import { Metadata } from "next";

type Props = {
  params: Promise<{ country: string }>;
};

async function getCountryData(country: string) {
  try {
    const res = await fetch(
      `${
        process.env.VERCEL_URL || "http://localhost:3000"
      }/api/name/${country}`,
      { cache: "no-store" }
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

type CountryPageProps = {
  params: Promise<{ country: string }>;
};

export default async function CountryPage({ params }: Props) {
  const { country } = await params;

  const countryData = await getCountryData(country);

  return (
    <main className="min-h-screen bg-gray-50">
      <NationalIncidentsToast incidents={countryData.national_incidents} />
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xl font-bold text-gray-900 text-center hover:underline">
            <a href="/">publicspending.world</a>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <section className="bg-white rounded-xl shadow-sm p-8">
            <RevenuePieChart countryData={countryData} />
          </section>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <SpendingPieChart countryData={countryData} />
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Revenue Sources
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Spending Allocation
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
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
