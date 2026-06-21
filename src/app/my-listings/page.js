"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Loader from "@/components/Loader";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { BookOpen, PlusCircle, ArrowRight, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function MyListings() {
  const { rooms, currentUser, loading } = useApp();
  const router = useRouter();

  useEffect(() => { document.title = "StudyNook — My Listings"; }, []);

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please login to access your room listings.");
      router.push("/login?redirect=/my-listings");
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) return <Loader message="Opening your study room archive..." />;

  const myListings = rooms.filter((r) => r.ownerId === currentUser.id);
  const totalBookings = myListings.reduce((sum, r) => sum + (r.bookingCount || 0), 0);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-border pb-6"
      >
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Dashboard</p>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            My Study Rooms
          </h1>
          <p className="text-muted text-sm">
            Manage your listed spaces, edit details, or check popularity stats.
          </p>
        </div>
        <Link href="/add-room">
          <Button variant="primary" leftIcon={PlusCircle} size="md">
            Add New Room
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      {myListings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {[
            { label: "Total Listings", value: myListings.length, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
            { label: "Total Bookings", value: totalBookings, icon: BarChart2, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50/60 dark:bg-indigo-950/20" },
            { label: "Avg. Bookings", value: myListings.length ? (totalBookings / myListings.length).toFixed(1) : "—", icon: ArrowRight, color: "text-violet-650 dark:text-violet-400", bg: "bg-violet-50/60 dark:bg-violet-950/20" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className={`p-3 ${stat.bg} rounded-xl flex-shrink-0`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs font-semibold text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Grid */}
      {myListings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No rooms listed yet"
          description="You haven't listed any study spaces. Share your unused rooms and help fellow students find the perfect spot."
          actionLabel="Create Your First Listing"
          actionHref="/add-room"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((room, index) => (
            <div key={room.id || room._id} className="relative group">
              <Card room={room} index={index} />
              {/* Manage overlay on hover */}
              <Link
                href={`/rooms/${room.id}`}
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto"
              >
                <div className="w-full py-2.5 px-4 bg-black/80 backdrop-blur-sm text-white text-xs font-bold text-center rounded-xl">
                  Manage this room →
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
