"use client";
import {
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface DataAccuracyWarningProps {
  type: "spending" | "revenue";
  className?: string;
  compact?: boolean;
}

export function DataAccuracyWarning({
  type,
  className = "",
  compact = false,
}: DataAccuracyWarningProps) {
  const dataTypeText =
    type === "spending" ? "government spending" : "government revenue";

  if (compact) {
    return (
      <div
        className={`bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2 ${className}`}
      >
        <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="text-xs text-amber-700 font-medium whitespace-nowrap">
          Data may be outdated - working on live updates
        </span>
      </div>
    );
  }

  return (
    <div
      className={`bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-amber-800">
              Data Accuracy Notice
            </h3>
            <ClockIcon className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-sm text-amber-700 leading-relaxed">
            The {dataTypeText} data shown may not be completely accurate. We are
            currently working on implementing real-time data sources to provide
            more up-to-date and precise information.
          </p>
        </div>
      </div>
    </div>
  );
}
