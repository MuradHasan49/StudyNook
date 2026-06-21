"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-200
        text-slate-500 hover:text-slate-700 hover:bg-slate-100
        dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
        ${className}
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Sun className="h-5 w-5 text-amber-400" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
