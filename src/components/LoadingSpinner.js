import React from "react";

export default function LoadingSpinner({ message = "Loading study spaces..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-border" />
        <div className="absolute h-16 w-16 rounded-full border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute h-10 w-10 rounded-full border-2 border-t-transparent border-r-primary-400/40 border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
}
