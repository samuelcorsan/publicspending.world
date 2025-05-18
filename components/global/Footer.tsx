"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 mb-4">
              {t("brand")}
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">{t("description")}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              {t("linksTitle")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-500"
                >
                  {t("links.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/samuelcorsan/publicspending.world"
                  className="text-gray-600 hover:text-blue-500"
                  target="_blank"
                >
                  {t("links.github")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-500"
                >
                  {t("links.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-500 text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
};
