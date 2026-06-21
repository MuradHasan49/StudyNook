"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-20 px-6 bg-card border border-border rounded-3xl text-center space-y-5"
    >
      {Icon && (
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
          <div className="relative p-5 bg-background rounded-2xl border border-border">
            <Icon className="h-10 w-10 text-primary" />
          </div>
        </div>
      )}

      <div className="space-y-2 max-w-sm">
        <h3 className="font-bold text-xl text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}
