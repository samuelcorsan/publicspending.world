"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DebtToGdpDisplayProps {
  debtToGdp?: number;
  gdpNominal?: number;
  taxBurdenPerCapita?: {
    amount?: number;
    convertedCurrencyAmount?: number;
    convertedCurrency?: string;
  };
  currency?: string;
}

export function DebtToGdpDisplay({
  debtToGdp,
  gdpNominal,
  taxBurdenPerCapita,
  currency,
}: DebtToGdpDisplayProps) {
  const [showLocal, setShowLocal] = useState(false);

  if (!debtToGdp || !gdpNominal) {
    return <span>No data available.</span>;
  }

  const debtUsd = gdpNominal * (debtToGdp / 100);
  let debtLocal: number | null = null;
  let localCurrency: string | null = null;
  if (
    taxBurdenPerCapita &&
    taxBurdenPerCapita.convertedCurrencyAmount &&
    taxBurdenPerCapita.amount &&
    taxBurdenPerCapita.convertedCurrency
  ) {
    const usdToLocal =
      taxBurdenPerCapita.convertedCurrencyAmount / taxBurdenPerCapita.amount;
    debtLocal = debtUsd * usdToLocal;
    localCurrency = taxBurdenPerCapita.convertedCurrency;
  }

  const canToggle = !!(debtLocal && localCurrency);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">Debt to GDP:</span>
        <span className="text-lg">{debtToGdp}%</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-semibold">Government Debt:</span>
        <span className="font-mono text-base">
          {showLocal && canToggle && debtLocal && localCurrency
            ? `${debtLocal.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })} ${localCurrency}`
            : `$${debtUsd.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })} USD`}
        </span>
        <button
          type="button"
          aria-label="Toggle currency"
          className={`flex items-center cursor-pointer ml-2 px-3 py-1 rounded-full text-sm font-medium border border-blue-600 transition-colors
            ${
              canToggle
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            }`}
          onClick={() => canToggle && setShowLocal((v) => !v)}
          disabled={!canToggle}
        >
          {canToggle
            ? showLocal
              ? "Show in USD"
              : "Show in local currency"
            : "Show in local currency"}
        </button>
      </div>
    </div>
  );
}
