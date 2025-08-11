"use client";

interface LoadingIndicatorProps {
  variant?: "spinner" | "dots" | "pulse";
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingIndicator({
  variant = "spinner",
  size = "md",
  text = "Loading...",
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  if (variant === "dots") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</span>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}
        />
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      />
      <span className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</span>
    </div>
  );
}

export function InlineLoadingIndicator() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full border border-blue-100">
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${index * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
        <span className="text-blue-700 text-sm font-medium">
          Loading more countries
        </span>
      </div>
    </div>
  );
}
