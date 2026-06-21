"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Card({ room, index = 0 }) {
  const maxChips = 3;
  const displayAmenities = room.amenities?.slice(0, maxChips) || [];
  const remainingCount = (room.amenities?.length || 0) - maxChips;
  const truncatedDesc =
    room.description?.length > 90
      ? room.description.substring(0, 90) + "..."
      : room.description || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-full card-hover shadow-sm"
    >
      {/* Image with overlay */}
      <div className="relative h-48 w-full bg-background overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Floor badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[11px] px-2.5 py-1 rounded-full font-semibold border border-slate-200/30 dark:border-slate-700/50 shadow-sm">
          <MapPin className="h-3 w-3 text-primary" />
          {room.floor}
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 right-3 flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs px-2.5 py-1 rounded-full font-bold border border-slate-200/30 dark:border-slate-700/50 shadow-sm">
          <DollarSign className="h-3.5 w-3.5 text-amber-500" />
          <span>{room.hourlyRate}<span className="text-[10px] font-normal text-muted">/hr</span></span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-base font-bold text-foreground truncate leading-snug">
            {room.name}
          </h3>
          <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed h-8">
            {truncatedDesc}
          </p>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>{room.capacity} seats</span>
        </div>

        {/* Amenity chips */}
        <div className="flex flex-wrap gap-1.5 flex-1 items-start content-start">
          {displayAmenities.map((amenity) => (
            <span
              key={amenity}
              className="bg-background text-muted text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-border"
            >
              {amenity}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="pt-1 mt-auto">
          <Link
            href={`/rooms/${room.id}`}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
