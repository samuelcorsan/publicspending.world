import { SpendingPieChart } from "@/components/charts/spending-pie-chart";
import { RevenuePieChart } from "@/components/charts/revenue-pie-chart";
import { AnimatedCountryStats } from "@/components/countries/animated-country-stats";
import { NationalIncidentsToast } from "@/components/countries/national-incidents-toast";
import { SourceFavicons } from "@/components/countries/source-favicons";
import { AlertCircle, Gauge, BarChart2, Clock } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Footer } from "@/components/global/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ControversyData, COUNTRY_CODE_MAP } from "@/types/controversies";

type Props = {
  params: Promise<{ country: string }>;
};

async function getCountryData(country: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/name/${country}`;

    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function getControversyData(
  country: string
): Promise<ControversyData | null> {
  try {
    const countryCode = COUNTRY_CODE_MAP[country.toLowerCase()];
    if (!countryCode) {
      return null;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/get-controversies?country=${countryCode}`;

    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.success ? data : null;
  } catch {
    return null;
  }
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;

  const [countryData, controversyData] = await Promise.all([
    getCountryData(country),
    getControversyData(country),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Country",
    name: countryData.name,
    identifier: countryData.code,
    description: `Government spending and budget information for ${
      countryData.name
    }. GDP: $${(countryData.gdpNominal / 1e12).toFixed(2)}T, Population: ${(
      countryData.population / 1e6
    ).toFixed(1)}M`,
    url: `https://publicspending.world/${country}`,
    geo: {
      "@type": "GeoCoordinates",
      addressCountry: countryData.code,
    },
    government: {
      "@type": "GovernmentOrganization",
      name: `Government of ${countryData.name}`,
      foundingLocation: {
        "@type": "Place",
        name: countryData.capital,
      },
    },
    mainEntity: {
      "@type": "Dataset",
      name: `${countryData.name} Public Spending Data`,
      description: `Government budget, revenue, and expenditure data for ${countryData.name}`,
      keywords: [
        `${countryData.name} budget`,
        "government spending",
        "public expenditure",
      ],
    },
  };

  return (
    <>
      <Script
        id={`structured-data-${countryData.code}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
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
          <div className="container mx-auto px-4 py-12">
            <AnimatedCountryStats
              name={countryData.name}
              code={countryData.code}
              gdpNominal={countryData.gdpNominal}
              population={countryData.population}
              capital={countryData.capital}
              currency={countryData.currency}
            />

            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg text-gray-900 mb-3 text-center font-bold">
                Member Organizations
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {countryData.organizations.map((org: string) => (
                  <span
                    key={org}
                    className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-xl text-sm font-medium"
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
            <TabsList className="w-full flex justify-start overflow-x-auto scrollbar-hide bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200">
              <TabsTrigger
                value="overview"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-white/50 rounded-xl"
              >
                <BarChart2 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-white/50 rounded-xl"
              >
                <AlertCircle className="w-4 h-4" />
                Analysis
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
                    <Tooltip text="Government revenue sources and their amounts" />
                  </h3>
                  <div className="space-y-4">
                    {countryData.revenue.map(
                      (item: {
                        name: string;
                        subtype: string;
                        amount: number;
                      }) => (
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
                      )
                    )}
                  </div>
                </section>
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-6">
                    <BarChart2 className="w-6 h-6 mr-2 text-green-500" />
                    Spending Allocation
                    <Tooltip text="Government spending allocation by category" />
                  </h3>
                  <div className="space-y-4">
                    {countryData.spending.map(
                      (item: {
                        name: string;
                        subtype: string;
                        amount: number;
                      }) => (
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
                      )
                    )}
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center text-2xl font-semibold text-gray-900">
                      <AlertCircle className="w-6 h-6 mr-2 text-red-500" />{" "}
                      Recent Controversies
                    </h3>
                    {controversyData && (
                      <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                        <Clock className="w-4 h-4 mr-1" />
                        Updated a few days ago
                      </span>
                    )}
                  </div>

                  {controversyData ? (
                    <div className="space-y-4">
                      {controversyData.cached && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            Last updated:{" "}
                            {new Date(
                              controversyData.lastUpdated!
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {controversyData.aiSummary && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Political Summary
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {controversyData.aiSummary}
                          </p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">
                            Sources
                          </h4>
                          <SourceFavicons articles={controversyData.articles} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 px-6 py-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <span className="text-lg font-semibold text-blue-800">
                          No Controversies Data Yet
                        </span>
                      </div>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        This country doesn&apos;t have controversies data yet.
                        We&apos;re building a comprehensive system to track and
                        analyze political controversies and government incidents
                        across all countries in real-time.
                      </p>
                    </div>
                  )}
                </section>
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-4">
                    <Gauge className="w-6 h-6 mr-2 text-yellow-500" /> Spending
                    Efficiency
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 px-6 py-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-6 h-6 text-yellow-600" />
                      <span className="text-lg font-semibold text-yellow-800">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-yellow-700 text-sm leading-relaxed">
                      We&apos;re adding spending efficiency metrics that will
                      update in real-time, showing how effectively each country
                      allocates and manages their government budget.
                    </p>
                  </div>
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const countryName = formatCountryName(country);

  try {
    const countryData = await getCountryData(country);
    const gdpFormatted = (countryData.gdpNominal / 1e12).toFixed(2);
    const populationFormatted = (countryData.population / 1e6).toFixed(1);

    return {
      title: `${countryName} Public Spending`,
      description: `${countryName} public spending, government budget and fiscal data 2025. GDP: $${gdpFormatted}T, Population: ${populationFormatted}M. ${countryName} government expenditure, revenue sources and budget allocation analysis.`,
      keywords: `${countryName} public spending, ${countryName} government spending, ${countryName} budget, ${countryName} GDP, ${countryName} government budget, ${countryName} public expenditure, ${countryName} fiscal policy, ${countryName} economy, government revenue ${countryName}, public finance ${countryName}`,
      openGraph: {
        title: `${countryName} Public Spending & Government Budget 2025`,
        description: `${countryName} public spending and government budget 2025. GDP: $${gdpFormatted}T, Population: ${populationFormatted}M. ${countryName} fiscal data and budget allocation.`,
        url: `https://publicspending.world/${country}`,
        siteName: "publicspending.world",
      },
      twitter: {
        card: "summary_large_image",
        title: `${countryName} Public Spending & Government Budget`,
        description: `${countryName} public spending data 2025. GDP: $${gdpFormatted}T, Population: ${populationFormatted}M. Government budget breakdown.`,
      },
      alternates: {
        canonical: `https://publicspending.world/${country}`,
      },
    };
  } catch {
    return {
      title: `${countryName} - Public Spending Data | publicspending.world`,
      description: `Explore ${countryName}'s government spending and budget information on publicspending.world`,
    };
  }
}

function formatCountryName(country: string): string {
  return country
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
