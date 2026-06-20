"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { List, MapPin, Users, DollarSign, Layers, ArrowRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function MyListings() {
  const { rooms, currentUser, loading } = useApp();
  const router = useRouter();

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = "StudyNook – My Listings";
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please login to access your room listings.");
      router.push("/login?redirect=/my-listings");
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return <LoadingSpinner message="Opening your study room archive..." />;
  }

  // Filter listings created by user
  const myListings = rooms.filter((r) => r.ownerId === currentUser.id);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            My Study Room Listings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Manage study rooms you own, edit specifications, or check popularity bookings.
          </p>
        </div>
        
        <Link
          href="/add-room"
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-750 text-white font-bold text-sm rounded-xl shadow-md transition self-start sm:self-center"
        >
          Add Room
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid listing */}
      {myListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl space-y-4 text-center">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 text-slate-400 rounded-full">
            <BookOpen className="h-10 w-10 text-primary-500" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
            No study rooms listed yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            You haven&apos;t added any private spaces or laboratory rooms. List a room to earn benefits or help study teams.
          </p>
          <Link
            href="/add-room"
            className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((room) => {
            const maxChips = 3;
            const displayAmenities = room.amenities.slice(0, maxChips);
            const remainingCount = room.amenities.length - maxChips;
            const truncatedDesc =
              room.description.length > 80
                ? room.description.substring(0, 80) + "..."
                : room.description;

            return (
              <div
                key={room.id || room._id}
                className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 overflow-hidden flex flex-col h-full hover:shadow-md transition"
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {truncatedDesc}
                    </p>
                  </div>

                  {/* Info table */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-850 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary-500" />
                      <span>Seats: {room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-accent-gold" />
                      <span>${room.hourlyRate}/hr</span>
                    </div>
                  </div>

                  {/* Amenities */}
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

                  {/* Actions */}
                  <div className="pt-2 mt-auto">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="w-full inline-flex items-center justify-center px-3 py-2 border border-slate-200 dark:border-slate-850 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                      Manage Listing
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
