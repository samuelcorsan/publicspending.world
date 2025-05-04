import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/Footer";
export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              About Public Spending World
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore how countries around the world collect and spend public
              money. Understanding taxes. Understanding world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We believe that public finances should be transparent,
                accessible, and understandable for everyone. Our mission is to
                break down tax revenues and government expenditures, showing
                exactly where your money goes and empowering citizens with
                knowledge about public spending worldwide.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                What We Offer
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our platform provides insights into controversial taxes, their
                efficiency and fairness, and the real impact of public spending
                on society. We aggregate and standardize financial data from
                countries across the globe, making it easy to analyze and
                understand how governments manage public resources.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2 text-blue-600">
                  Tax Analysis
                </h3>
                <p className="text-gray-600">
                  Explore controversial taxes, understand their necessity, and
                  evaluate their efficiency and fairness across different
                  countries.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-blue-600">
                  Spending Impact
                </h3>
                <p className="text-gray-600">
                  Discover the real impact of public spending on society through
                  comprehensive data analysis and visualization.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-blue-600">
                  Global Insights
                </h3>
                <p className="text-gray-600">
                  Compare how different countries collect and spend public
                  money, with regular updates and historical trends.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Get Involved
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Want to contribute data about your country? Whether you're a
              developer, data scientist, or citizen interested in public
              finance, your contributions are welcome! Help us make public
              finances more transparent for everyone.
            </p>
            <a
              href="https://github.com/samuelcorsan/publicspending.world"
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
