"use client";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading the data. Please try again.",
  showRetry = true,
  showHome = false,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-50 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        
        <div className="flex flex-col gap-3">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          
          {showHome && (
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function InlineErrorState({
  message = "Failed to load data",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3 px-6 py-3 bg-red-50 border border-red-200 rounded-full">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <span className="text-red-700 text-sm font-medium">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
