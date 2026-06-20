"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  // Set page title
  useEffect(() => {
    document.title = "StudyNook – Page Not Found";
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 bg-slate-50 dark:bg-slate-950/20 text-center space-y-6">
      <div className="relative">
        {/* Decorative backdrop glow */}
        <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-3xl scale-150"></div>
        {/* Animated Compass Icon */}
        <div className="relative p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-xl w-fit mx-auto text-primary-600 dark:text-primary-400 animate-bounce">
          <Compass className="h-16 w-16" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          We looked high and low but couldn&apos;t locate the route or study space you were searching for. It might have been moved or deleted.
        </p>
      </div>

      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-750 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/20 active:scale-95 transition"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
