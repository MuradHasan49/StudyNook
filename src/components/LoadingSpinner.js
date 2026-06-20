import React from "react";

export default function LoadingSpinner({ message = "Loading study spaces..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <div className="h-16 w-16 rounded-full border-4 border-slate-200 dark:border-slate-800 animate-pulse-slow"></div>
        {/* Spinning inner arc */}
        <div className="absolute h-16 w-16 rounded-full border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse text-sm">
        {message}
      </p>
    </div>
  );
}
