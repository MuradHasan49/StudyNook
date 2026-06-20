"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  ArrowRight, Shield, Zap, Coffee, Compass, 
  MapPin, Users, DollarSign, Layers, Sparkles 
} from "lucide-react";

export default function Home() {
  const { rooms, loading } = useApp();

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = "StudyNook – Home";
  }, []);

  // Sort and retrieve latest 6 rooms
  const latestRooms = [...rooms]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (loading) {
    return <LoadingSpinner message="Opening the StudyNook catalog..." />;
  }

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* 1. HERO BANNER */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        {/* Decorative subtle background shapes */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/35 text-primary-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3 animate-pulse text-accent-amber" />
            University Room Booking Made Easy
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Find Your Perfect <br />
            <span className="bg-gradient-to-r from-primary-400 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
              Study Room
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-350 max-w-2xl mx-auto leading-relaxed font-medium">
            Browse and book quiet, private study rooms in your library. List your own room, manage bookings, and boost your productivity.
          </p>

          <div className="pt-6">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 text-base"
            >
              Explore Rooms
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION - LATEST ROOMS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
              Recently Listed Rooms
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Discover the latest quiet workspaces added to our inventory.
            </p>
          </div>
          <Link
            href="/rooms"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-bold flex items-center gap-1 transition-colors self-center md:self-end"
          >
            See all study spots
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latestRooms.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-500">No rooms listed yet. Be the first to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestRooms.map((room) => {
              // Limit chips shown to max 3
              const maxChips = 3;
              const displayAmenities = room.amenities.slice(0, maxChips);
              const remainingCount = room.amenities.length - maxChips;

              // Truncate description to 100 characters
              const truncatedDesc =
                room.description.length > 100
                  ? room.description.substring(0, 100) + "..."
                  : room.description;

              return (
                <div
                  key={room.id}
                  className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-800/80 overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Uniform Image Size wrapper */}
                  <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-950">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary-450" />
                      {room.floor}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-1 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">
                        {room.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 h-10 leading-relaxed">
                        {truncatedDesc}
                      </p>
                    </div>

                    {/* Stats capacity/rate */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-850 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary-500" />
                        <span>Cap: {room.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-accent-gold" />
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

                    {/* View Details Button */}
                    <div className="pt-2 mt-auto">
                      <Link
                        href={`/rooms/${room.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-primary-100 dark:border-primary-900/40 text-sm font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white rounded-xl transition duration-200"
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
      </section>

      {/* 3. EXTRA STATIC SECTION 1 - STUDYNOOK PERKS */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
              Why Book With StudyNook?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              We design features that streamline your learning, collaborating, and room hosting experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Perk 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-2xl w-fit">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Conflict-Free Booking</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Our database constraints prevent double-booking. Book with total confidence that your room is yours at your selected time slot.
              </p>
            </div>

            {/* Perk 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="p-3 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-2xl w-fit">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Real-Time Approvals</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Skip standard waiting queues. Book rooms, receive your instant reservation pass, and unlock the private room straight away.
              </p>
            </div>

            {/* Perk 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-955/50 text-amber-600 dark:text-amber-400 rounded-2xl w-fit">
                <Coffee className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Host & Earn Credit</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Control a room in the library or labs? List your unused slots, help other students study, and receive points or monetary compensation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXTRA STATIC SECTION 2 - HOW IT WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            Three Steps To Success
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Learn how quickly you can secure your workspace and get to studying.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-4 flex-1 w-[calc(100%-32px)] h-0.5 bg-slate-200 dark:bg-slate-850 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent p-6 lg:p-0 rounded-2xl border border-slate-200/40 lg:border-none">
              <div className="h-12 w-12 rounded-full bg-primary-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-primary-500/20 border-4 border-white dark:border-slate-950">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Discover Study Nooks</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Filter spaces by capacity, floor, hourly rate, or required amenities like whiteboard or high-speed Wi-Fi.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent p-6 lg:p-0 rounded-2xl border border-slate-200/40 lg:border-none">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 border-4 border-white dark:border-slate-950">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Reserve Your Slots</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Pick a slot date and hour range. Real-time cost updates. Confirm with conflict resolution.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent p-6 lg:p-0 rounded-2xl border border-slate-200/40 lg:border-none">
              <div className="h-12 w-12 rounded-full bg-violet-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-violet-500/20 border-4 border-white dark:border-slate-950">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Unlock & Excel</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Access your bookings dashboard, check details, walk in, hook up your screens, and start collaborating.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
