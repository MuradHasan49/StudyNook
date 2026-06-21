"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import { CardsGridSkeleton } from "@/components/Loader";
import {
  Search, SlidersHorizontal, RefreshCw, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function Rooms() {
  const { rooms, loading } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxPrice, setMaxPrice] = useState(30);
  const [selectedFloor, setSelectedFloor] = useState("All");

  const amenitiesList = [
    "Whiteboard", "Projector", "Wi-Fi",
    "Power Outlets", "Quiet Zone", "Air Conditioning"
  ];

  useEffect(() => {
    document.title = "StudyNook — Available Rooms";
  }, []);

  const floorOptions = ["All", ...new Set(rooms.map(r => r.floor))];

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedAmenities([]);
    setMaxPrice(30);
    setSelectedFloor("All");
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAmenities = selectedAmenities.every(a => room.amenities.includes(a));
    const matchesPrice = room.hourlyRate <= maxPrice;
    const matchesFloor = selectedFloor === "All" || room.floor === selectedFloor;
    return matchesSearch && matchesAmenities && matchesPrice && matchesFloor;
  });

  const hasActiveFilters = searchTerm || selectedAmenities.length > 0 || maxPrice < 30 || selectedFloor !== "All";

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <p className="text-xs font-bold text-primary uppercase tracking-widest">
          Browse & Book
        </p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Available Study Rooms
        </h1>
        <p className="text-muted max-w-xl">
          Browse, filter, and reserve quiet spaces tailored for your group size and study needs.
        </p>
      </motion.div>

      {/* Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Filter Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6 lg:sticky lg:top-20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h2 className="font-bold text-sm text-foreground">Filters</h2>
              {hasActiveFilters && (
                <span className="h-5 w-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {selectedAmenities.length + (searchTerm ? 1 : 0) + (maxPrice < 30 ? 1 : 0) + (selectedFloor !== "All" ? 1 : 0)}
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-90 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Room name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Floor */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Floor</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              {floorOptions.map((floor) => (
                <option key={floor} value={floor} className="bg-card text-foreground">
                  {floor === "All" ? "All Floors" : floor}
                </option>
              ))}
            </select>
          </div>

          {/* Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Max Rate</label>
              <span className="text-sm font-bold text-primary">${maxPrice}/hr</span>
            </div>
            <input
              type="range"
              min="5" max="30" step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border"
            />
            <div className="flex justify-between text-[10px] font-semibold text-muted">
              <span>$5</span>
              <span>$30</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider block">Amenities</label>
            <div className="space-y-1.5">
              {amenitiesList.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityChange(amenity)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                      checked
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checked
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}>
                      {checked && (
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.aside>

        {/* Results */}
        <main className="col-span-1 lg:col-span-3">
          {loading ? (
            <CardsGridSkeleton count={6} />
          ) : filteredRooms.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="No rooms found"
              description="We couldn't find any study spots matching your criteria. Try adjusting your filters or search query."
              actionLabel="Clear All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted">
                  <span className="font-bold text-foreground">{filteredRooms.length}</span> room{filteredRooms.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredRooms.map((room, index) => (
                  <Card key={room.id || room._id} room={room} index={index} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
