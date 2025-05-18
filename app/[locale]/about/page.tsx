"use client";
import { Navbar } from "@/components/global/Navbar";
import { Footer } from "@/components/global/Footer";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("AboutPage");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {t("missionTitle")}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t("missionText")}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {t("offerTitle")}
              </h2>
              <p className="text-gray-600 leading-relaxed">{t("offerText")}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              {t("featuresTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2 text-blue-600">
                  {t("feature1Title")}
                </h3>
                <p className="text-gray-600">{t("feature1Text")}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-blue-600">
                  {t("feature2Title")}
                </h3>
                <p className="text-gray-600">{t("feature2Text")}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-blue-600">
                  {t("feature3Title")}
                </h3>
                <p className="text-gray-600">{t("feature3Text")}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              {t("contributeTitle")}
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t("contributeText")}
            </p>
            <a
              href="https://github.com/samuelcorsan/publicspending.world"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
                text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                transition-colors duration-150"
            >
              {t("viewOnGitHub")}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
