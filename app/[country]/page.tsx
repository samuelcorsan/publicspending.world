import { notFound } from "next/navigation";
import { SpendingPieChart } from "@/components/charts/SpendingPieChart";
import { RevenuePieChart } from "@/components/charts/RevenuePieChart";
import { AnimatedCountryStats } from "@/components/AnimatedCountryStats";
import { NationalIncidentsToast } from "@/components/NationalIncidentsToast";
import Link from "next/link";
import { AlertCircle, Gauge, BarChart2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Footer } from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    <>
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

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs
            defaultValue="overview"
            className="w-full space-y-4 sm:space-y-8"
          >
            <TabsList className="w-full flex justify-center bg-white/50 backdrop-blur-sm p-1.5 rounded-xl shadow-sm border border-gray-200">
              <TabsTrigger
                value="overview"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-white/50 rounded-lg"
              >
                <BarChart2 className="w-4 h-4" />
                Financial Overview
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-white/50 rounded-lg"
              >
                <AlertCircle className="w-4 h-4" />
                Analysis & Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
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
                          {(item.amount / 1e9).toFixed(2)}B{" "}
                          {countryData.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-6">
                    <BarChart2 className="w-6 h-6 mr-2 text-green-500" />{" "}
                    Spending Allocation
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
                          {(item.amount / 1e9).toFixed(2)}B{" "}
                          {countryData.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-4">
                    <AlertCircle className="w-6 h-6 mr-2 text-red-500" />{" "}
                    Controversies
                    <Tooltip text="Fiscal controversies highlight political, social, or economic challenges that can affect a country's stability and future policy direction." />
                  </h3>
                  <p className="mb-2 text-gray-700">
                    {countryData.controversies ||
                      "No major recent controversies reported."}
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
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
