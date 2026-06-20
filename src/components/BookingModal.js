"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { X, Calendar as CalendarIcon, Clock, DollarSign, PenTool } from "lucide-react";
import toast from "react-hot-toast";

export default function BookingModal({ room, onClose }) {
  const { bookRoom } = useApp();
  
  // Set date default to today
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [specialNote, setSpecialNote] = useState("");
  const [totalCost, setTotalCost] = useState(room.hourlyRate);

  // Time options definition
  const startTimes = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  // Dynamic End Time selection based on Start Time
  const getAvailableEndTimes = () => {
    const startHr = parseInt(startTime.split(":")[0]);
    const list = [];
    for (let hr = startHr + 1; hr <= 21; hr++) {
      const hrStr = String(hr).padStart(2, "0") + ":00";
      list.push(hrStr);
    }
    return list;
  };

  const endTimes = getAvailableEndTimes();

  // Reset end time if start time changes and previous end time is invalid
  useEffect(() => {
    const startHr = parseInt(startTime.split(":")[0]);
    const endHr = parseInt(endTime.split(":")[0]);
    if (endHr <= startHr) {
      setEndTime(String(startHr + 1).padStart(2, "0") + ":00");
    }
  }, [startTime]);

  // Compute Total Cost in real-time
  useEffect(() => {
    const startHr = parseInt(startTime.split(":")[0]);
    const endHr = parseInt(endTime.split(":")[0]);
    if (endHr > startHr) {
      setTotalCost((endHr - startHr) * room.hourlyRate);
    } else {
      setTotalCost(room.hourlyRate);
    }
  }, [startTime, endTime, room.hourlyRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error("Please pick today or a future date.");
      return;
    }

    const startHr = parseInt(startTime.split(":")[0]);
    const endHr = parseInt(endTime.split(":")[0]);
    if (endHr <= startHr) {
      toast.error("End time must be after start time.");
      return;
    }

    // Call Context action
    const res = await bookRoom({
      roomId: room.id,
      date,
      startTime,
      endTime,
      specialNote
    });

    if (res.success) {
      toast.success("Room booked successfully!");
      onClose();
    } else {
      toast.error(res.message || "Conflict found! Room already booked.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Book Study Room</h3>
            <p className="text-xs text-slate-400 truncate max-w-[250px]">{room.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Rate Indicator */}
          <div className="bg-primary-50 dark:bg-primary-950/20 rounded-xl p-3 flex justify-between items-center text-sm font-semibold text-primary-600 dark:text-primary-400">
            <span>Hourly Rate:</span>
            <span>${room.hourlyRate}/hr</span>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              Date
            </label>
            <input
              type="date"
              required
              min={getTodayString()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* Times Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              >
                {startTimes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Clock className="h-3 w-3" />
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              >
                {endTimes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              <PenTool className="h-3 w-3" />
              Special Note (Optional)
            </label>
            <textarea
              placeholder="e.g. Need external monitors, quiet area, extra seating..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
            />
          </div>

          {/* Total Cost Display */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Estimated Total</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white flex items-center">
                <DollarSign className="h-5 w-5 text-accent-gold" />
                {totalCost}
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-3 font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/20 active:scale-95 transition duration-150"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
