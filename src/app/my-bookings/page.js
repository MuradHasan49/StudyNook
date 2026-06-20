"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Calendar, Clock, DollarSign, Ban, ShieldAlert, CheckCircle, AlertTriangle, ArrowRight, X } from "lucide-react";
import toast from "react-hot-toast";

export default function MyBookings() {
  const { rooms, bookings, currentUser, cancelBooking, loading } = useApp();
  const router = useRouter();

  // Modal control
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = "StudyNook – My Bookings";
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please login to access your bookings.");
      router.push("/login?redirect=/my-bookings");
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return <LoadingSpinner message="Retrieving your reservation schedule..." />;
  }

  // Filter bookings belonging to user
  const myBookings = bookings.filter((b) => b.userId === currentUser.id);

  // Helper check: if booking date is today or in the future
  const isFutureBooking = (bookingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Split date string to prevent local timezone offsets issues
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
    const res = await cancelBooking(selectedBookingId);
    setShowCancelModal(false);
    if (res.success) {
      toast.success("Booking cancelled successfully.");
    } else {
      toast.error(res.message || "Failed to cancel booking.");
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            My Room Bookings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            View booking confirmation status, track slot durations, or cancel upcoming reservations.
          </p>
        </div>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-750 dark:text-primary-400 dark:hover:text-primary-350 self-start sm:self-center"
        >
          Book another room
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Bookings Display Container */}
      {myBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl space-y-4 text-center">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 text-slate-400 rounded-full">
            <Calendar className="h-10 w-10 text-primary-500" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
            You have no bookings yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Explore our available library classrooms, research pods, and smart collaboration suites to reserve your first slot!
          </p>
          <Link
            href="/rooms"
            className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition"
          >
            Find a Study Room
          </Link>
        </div>
      ) : (
        /* Booking Table & Cards Container */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                  <th className="px-6 py-4">Room Details</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time Slot</th>
                  <th className="px-6 py-4">Total Cost</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {myBookings.map((booking) => {
                  const room = rooms.find((r) => r.id === booking.roomId) || {
                    name: "Removed Study Room",
                    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800"
                  };
                  const futureBooking = isFutureBooking(booking.date);
                  const isConfirmed = booking.status === "confirmed";

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      {/* Room info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="h-12 w-20 object-cover rounded-lg border border-slate-200/20"
                          />
                          <div>
                            <span className="font-extrabold text-sm text-slate-850 dark:text-slate-100 block max-w-[200px] truncate">
                              {room.name}
                            </span>
                            {booking.specialNote && (
                              <span className="text-[10px] text-slate-450 truncate block max-w-[200px]" title={booking.specialNote}>
                                Note: {booking.specialNote}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm font-semibold text-slate-650 dark:text-slate-350">
                        {booking.date}
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 text-sm font-semibold text-slate-650 dark:text-slate-350">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-primary-500" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </td>

                      {/* Cost */}
                      <td className="px-6 py-4 text-sm font-black text-slate-800 dark:text-slate-150">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-accent-gold" />
                          <span>{booking.totalCost}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                            <Ban className="h-3 w-3" />
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        {isConfirmed && futureBooking ? (
                          <button
                            onClick={() => handleCancelClick(booking.id)}
                            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs rounded-lg transition"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-850">
            {myBookings.map((booking) => {
              const room = rooms.find((r) => r.id === booking.roomId) || {
                name: "Removed Study Room",
                image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800"
              };
              const futureBooking = isFutureBooking(booking.date);
              const isConfirmed = booking.status === "confirmed";

              return (
                <div key={booking.id} className="p-5 space-y-4">
                  {/* Title & Image row */}
                  <div className="flex items-center gap-3">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-10 w-16 object-cover rounded-lg border border-slate-200/20"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-sm text-slate-850 dark:text-slate-100 block truncate">
                        {room.name}
                      </span>
                      {booking.specialNote && (
                        <span className="text-[10px] text-slate-400 truncate block">
                          Note: {booking.specialNote}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booking details grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-100 dark:border-slate-850 py-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{booking.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Time Slot</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{booking.startTime} - {booking.endTime}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Paid</p>
                      <p className="font-extrabold text-slate-800 dark:text-slate-150 mt-0.5">${booking.totalCost}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                      <div className="mt-0.5">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400">
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cancel Action */}
                  {isConfirmed && futureBooking && (
                    <button
                      onClick={() => handleCancelClick(booking.id)}
                      className="w-full py-2 bg-red-55 text-red-600 font-bold text-xs rounded-xl text-center block"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CANCEL BOOKING CONFIRMATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-850 animate-slide-up text-center space-y-5">
            <div className="mx-auto p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full w-fit">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Cancel Reservation?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Are you sure you want to cancel this booking? This slot will be re-opened for other student groups immediately.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="py-2.5 bg-red-650 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-md transition"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
