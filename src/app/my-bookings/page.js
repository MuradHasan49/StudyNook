"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Loader from "@/components/Loader";
import { TableSkeleton } from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import {
  Calendar, Clock, DollarSign, Ban, ShieldAlert,
  CheckCircle, AlertTriangle, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const isConfirmed = status === "confirmed";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
      isConfirmed
        ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900"
        : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900"
    }`}>
      {isConfirmed
        ? <CheckCircle className="h-3 w-3" />
        : <Ban className="h-3 w-3" />
      }
      {isConfirmed ? "Confirmed" : "Cancelled"}
    </span>
  );
};

export default function MyBookings() {
  const { rooms, bookings, currentUser, cancelBooking, loading } = useApp();
  const router = useRouter();

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => { document.title = "StudyNook — My Bookings"; }, []);

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please login to access your bookings.");
      router.push("/login?redirect=/my-bookings");
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) return <Loader message="Retrieving your reservation schedule..." />;

  const myBookings = bookings.filter((b) => b.userId === currentUser.id);

  const isFutureBooking = (bookingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [yyyy, mm, dd] = bookingDate.split("-");
    const bDate = new Date(yyyy, mm - 1, dd);
    bDate.setHours(0, 0, 0, 0);
    return bDate >= today;
  };

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    const res = await cancelBooking(selectedBookingId);
    setIsCancelling(false);
    setShowCancelModal(false);
    if (res.success) {
      toast.success("Booking cancelled successfully.");
    } else {
      toast.error(res.message || "Failed to cancel booking.");
    }
  };

  const confirmedCount = myBookings.filter(b => b.status === "confirmed").length;  return (
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
            My Bookings
          </h1>
          <p className="text-sm text-muted">
            View status, track reservations, or cancel upcoming bookings.
          </p>
        </div>
        <Link href="/rooms">
          <Button variant="outline" rightIcon={ArrowRight} size="md">
            Book Another Room
          </Button>
        </Link>
      </motion.div>

      {/* Stats row */}
      {myBookings.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:max-w-xs">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-green-700 dark:text-green-400">{confirmedCount}</p>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-0.5">Confirmed</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-foreground">{myBookings.length - confirmedCount}</p>
            <p className="text-xs font-semibold text-muted mt-0.5">Cancelled</p>
          </div>
        </div>
      )}

      {/* Bookings */}
      {myBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings yet"
          description="Explore our available library classrooms, research pods, and collaboration suites to reserve your first slot!"
          actionLabel="Find a Study Room"
          actionHref="/rooms"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/60 border-b border-border">
                  {["Room", "Date", "Time Slot", "Total Cost", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myBookings.map((booking, i) => {
                  const room = rooms.find((r) => r.id === booking.roomId) || {
                    name: "Removed Study Room",
                    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800"
                  };
                  const future = isFutureBooking(booking.date);
                  const confirmed = booking.status === "confirmed";

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={room.image} alt={room.name} className="h-10 w-16 object-cover rounded-lg border border-border/50 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-foreground block truncate max-w-[180px]">{room.name}</span>
                            {booking.specialNote && (
                              <span className="text-[10px] text-muted truncate block max-w-[180px]">Note: {booking.specialNote}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-muted whitespace-nowrap">{booking.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-muted whitespace-nowrap">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {booking.startTime} — {booking.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-black text-foreground">
                          <DollarSign className="h-3.5 w-3.5 text-amber-500" />
                          {booking.totalCost}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {confirmed && future ? (
                          <button
                            onClick={() => handleCancelClick(booking.id)}
                            className="px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden divide-y divide-border">
            {myBookings.map((booking) => {
              const room = rooms.find((r) => r.id === booking.roomId) || {
                name: "Removed Study Room",
                image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800"
              };
              const future = isFutureBooking(booking.date);
              const confirmed = booking.status === "confirmed";

              return (
                <div key={booking.id} className={`p-5 space-y-4 ${confirmed ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-400"}`}>
                  <div className="flex items-center gap-3">
                    <img src={room.image} alt={room.name} className="h-12 w-20 object-cover rounded-lg border border-border/50 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{room.name}</p>
                      {booking.specialNote && (
                        <p className="text-[10px] text-muted truncate">Note: {booking.specialNote}</p>
                      )}
                      <div className="mt-1"><StatusBadge status={booking.status} /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">Date</p>
                      <p className="font-bold text-foreground">{booking.date}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">Time</p>
                      <p className="font-bold text-foreground">{booking.startTime} – {booking.endTime}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 col-span-2">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">Total Cost</p>
                      <p className="font-black text-foreground">${booking.totalCost}</p>
                    </div>
                  </div>

                  {confirmed && future && (
                    <button
                      onClick={() => handleCancelClick(booking.id)}
                      className="w-full py-2.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Cancel Confirm Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        maxWidth="max-w-sm"
      >
        <div className="p-6 text-center space-y-5">
          <div className="mx-auto w-fit p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Cancel Reservation?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">
              This booking slot will be freed immediately for other students. This action cannot be undone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => setShowCancelModal(false)} className="w-full">
              Keep it
            </Button>
            <Button variant="danger" onClick={handleConfirmCancel} isLoading={isCancelling} className="w-full">
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
