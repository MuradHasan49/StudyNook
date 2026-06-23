"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";
import { motion } from "framer-motion";

export default function NotFound() {
  useEffect(() => {
    document.title = "StudyNook — Page Not Found";
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 bg-background text-foreground text-center space-y-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* 404 Number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <div className="text-[120px] sm:text-[180px] font-black leading-none select-none animate-pulse-slow" style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #a78bfa 50%, #6366f1 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          opacity: 0.15,
        }}>
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="p-6 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-2xl flex items-center justify-center"
          >
            <LogoIcon className="h-14 w-14" />
          </motion.div>
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 space-y-3 max-w-md"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Page Not Found
        </h1>
        <p className="text-muted leading-relaxed">
          We looked high and low but couldn&apos;t find the page or study space you were looking for. It might have been moved or deleted.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="relative z-10 flex flex-col sm:flex-row gap-3"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/rooms"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-border text-foreground font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
        >
          Browse Rooms
        </Link>
      </motion.div>
    </div>
  );
}
