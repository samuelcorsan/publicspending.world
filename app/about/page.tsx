import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About publicspending.world - Government Transparency & Budget Data",
  description:
    "Learn about publicspending.world's mission to provide transparent, accessible government spending data worldwide. Discover how we promote fiscal transparency and public accountability.",
  keywords:
    "about public spending, government transparency, fiscal accountability, budget transparency, public finance data, government spending analysis",
  openGraph: {
    title: "About publicspending.world - Promoting Government Transparency",
    description:
      "Empowering citizens with transparent government spending data worldwide. Learn about our mission for fiscal accountability.",
    url: "https://publicspending.world/about",
    siteName: "publicspending.world",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About publicspending.world - Government Transparency",
    description:
      "Learn about our mission to make government spending transparent and accessible worldwide.",
  },
  alternates: {
    canonical: "https://publicspending.world/about",
  },
};

export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight text-gray-900">
                About publicspending.world
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Understanding how governments spend public money to build a more
                transparent and accountable world.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <div className="group relative bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide clear, accessible information about government
                spending worldwide, empowering citizens to understand how their
                tax money is being used and hold their governments accountable.
              </p>
            </div>

            <div className="group relative bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  What We Offer
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive data on government revenues, expenditures, and
                financial transparency for countries around the world, presented
                in an easy-to-understand format.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the powerful tools that make government spending data
                accessible and understandable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Comprehensive Data
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Access detailed information about government spending, revenue
                  sources, and financial allocations across multiple countries
                  with up-to-date fiscal data.
                </p>
              </div>

              <div className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Visual Analytics
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Interactive charts and visualizations that transform complex
                  financial data into clear, understandable insights you can
                  explore and compare.
                </p>
              </div>

              <div className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Global Coverage
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Data from countries worldwide, enabling cross-national
                  comparisons and global transparency insights across different
                  regions and economies.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Contribute to Transparency
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Help us improve government transparency by contributing to our
              open-source project. Your contributions can help make public
              financial data more accessible to everyone.
            </p>
            <a
              href="https://github.com/samuelcorsan/publicspending.world"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
                text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                transition-colors duration-150"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
