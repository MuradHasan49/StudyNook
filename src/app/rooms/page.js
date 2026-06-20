"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  Search, SlidersHorizontal, MapPin, Users, DollarSign, 
  CheckSquare, Square, RefreshCw, AlertCircle 
} from "lucide-react";

export default function Rooms() {
  const { rooms, loading } = useApp();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxPrice, setMaxPrice] = useState(30);
  const [selectedFloor, setSelectedFloor] = useState("All");

  const amenitiesList = [
    "Whiteboard", "Projector", "Wi-Fi", 
    "Power Outlets", "Quiet Zone", "Air Conditioning"
  ];

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = "StudyNook – Available Rooms";
  }, []);

  // Floor Options list builder
  const floorOptions = ["All", ...new Set(rooms.map(r => r.floor))];

  // Handle Amenity Checkbox toggle
  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Reset Filters action
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedAmenities([]);
    setMaxPrice(30);
    setSelectedFloor("All");
  };

  // Filter logic
  const filteredRooms = rooms.filter((room) => {
    // 1. Search by name (case-insensitive)
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Amenities check (must contain ALL selected amenities)
    const matchesAmenities = selectedAmenities.every((amenity) => 
      room.amenities.includes(amenity)
    );
    
    // 3. Hourly Rate check
    const matchesPrice = room.hourlyRate <= maxPrice;

    // 4. Floor check
    const matchesFloor = selectedFloor === "All" || room.floor === selectedFloor;

    return matchesSearch && matchesAmenities && matchesPrice && matchesFloor;
  });

  if (loading) {
    return <LoadingSpinner message="Locating available study spaces..." />;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in space-y-8">
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
          Available Study Rooms
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Browse, filter, and reserve quiet spaces customized for your group size and study needs.
        </p>
      </div>

      {/* Grid Container: Filters Sidebar + Rooms Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* FILTERS PANEL */}
        <aside className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6 lg:sticky lg:top-20">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4 text-primary-500" />
              Filter Rooms
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-primary-600 hover:text-primary-750 dark:text-primary-400 flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="h-3 w-3" />
              Reset All
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Search by Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Innovation Room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 pl-9 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Floor selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Floor</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              {floorOptions.map((floor) => (
                <option key={floor} value={floor}>
                  {floor === "All" ? "All Floors" : floor}
                </option>
              ))}
            </select>
          </div>

          {/* Hourly Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>Max Hourly Rate</span>
              <span className="text-primary-600 dark:text-primary-400 font-extrabold">${maxPrice}/hr</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>$5</span>
              <span>$30</span>
            </div>
          </div>

          {/* Amenities Checklist */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase block">Amenities</label>
            <div className="space-y-2">
              {amenitiesList.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityChange(amenity)}
                    className="flex items-center space-x-2 text-sm text-slate-650 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white transition w-full text-left"
                  >
                    {checked ? (
                      <CheckSquare className="h-4.5 w-4.5 text-primary-600 dark:text-primary-400 fill-primary-100 dark:fill-primary-950/20" />
                    ) : (
                      <Square className="h-4.5 w-4.5 text-slate-300 dark:text-slate-700" />
                    )}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ROOMS CATALOG LISTING */}
        <main className="col-span-1 lg:col-span-3">
          {filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 text-slate-400 rounded-full">
                <AlertCircle className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
                No rooms found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm text-center">
                We couldn&apos;t find any study spots matching your search criteria. Try modifying your filters or search query.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => {
                const maxChips = 3;
                const displayAmenities = room.amenities.slice(0, maxChips);
                const remainingCount = room.amenities.length - maxChips;
                const truncatedDesc =
                  room.description.length > 100
                    ? room.description.substring(0, 100) + "..."
                    : room.description;

                return (
                  <div
                    key={room.id}
                    className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Image */}
                    <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary-400" />
                        {room.floor}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1 space-y-3.5">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">
                          {room.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 h-8.5 leading-relaxed">
                          {truncatedDesc}
                        </p>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-850 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-primary-500" />
                          <span>Cap: {room.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-accent-gold" />
                          <span>${room.hourlyRate}/hr</span>
                        </div>
                      </div>

                      {/* Amenities chips */}
                      <div className="flex flex-wrap gap-1">
                        {displayAmenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {remainingCount > 0 && (
                          <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                            +{remainingCount} more
                          </span>
                        )}
                      </div>

                      {/* Button */}
                      <div className="pt-1.5 mt-auto">
                        <Link
                          href={`/rooms/${room.id}`}
                          className="w-full inline-flex items-center justify-center px-3 py-2 border border-primary-100 dark:border-primary-900/40 text-xs font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white rounded-lg transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
