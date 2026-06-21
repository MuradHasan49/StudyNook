"use client";

import React from "react";

/* ── Card Skeleton ─────────────────────────────────── */
export function CardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/75 overflow-hidden">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-3.5 w-full rounded-lg" />
        <div className="skeleton h-3.5 w-2/3 rounded-lg" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-12 rounded-full" />
        </div>
        <div className="skeleton h-9 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

/* ── Cards Grid Skeleton ────────────────────────────── */
export function CardsGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Table Row Skeleton ─────────────────────────────── */
export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-16 rounded-lg" />
          <div className="skeleton h-4 w-32 rounded-lg" />
        </div>
      </td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-24 rounded-lg" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-28 rounded-lg" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-14 rounded-lg" /></td>
      <td className="px-6 py-4"><div className="skeleton h-6 w-20 rounded-full" /></td>
      <td className="px-6 py-4 text-right"><div className="skeleton h-7 w-16 rounded-lg ml-auto" /></td>
    </tr>
  );
}

/* ── Table Skeleton ─────────────────────────────────── */
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-card border border-border/75 rounded-3xl overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/40 dark:bg-slate-950/40 border-b border-border/50">
              {["Room", "Date", "Time Slot", "Cost", "Status", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-left">
                  <div className="skeleton h-3 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="block md:hidden divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-5 space-y-3">
            <div className="flex gap-3">
              <div className="skeleton h-10 w-16 rounded-lg" />
              <div className="skeleton h-4 w-40 rounded-lg self-center" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-8 w-full rounded-lg" />
              <div className="skeleton h-8 w-full rounded-lg" />
              <div className="skeleton h-8 w-full rounded-lg" />
              <div className="skeleton h-8 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page Skeleton (hero + cards) ───────────────────── */
export function PageSkeleton() {
  return (
    <div className="w-full">
      {/* Hero skeleton */}
      <div className="skeleton h-80 w-full rounded-none mb-0" style={{ borderRadius: 0 }} />
      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="skeleton h-8 w-64 rounded-lg mb-4" />
        <div className="skeleton h-4 w-96 rounded-lg mb-10" />
        <CardsGridSkeleton count={6} />
      </div>
    </div>
  );
}

/* ── Default Loader (full page spinner) ─────────────── */
export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-border" />
        <div className="absolute h-16 w-16 rounded-full border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse text-sm">
        {message}
      </p>
    </div>
  );
}
