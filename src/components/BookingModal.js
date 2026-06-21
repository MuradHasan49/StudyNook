"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { Calendar as CalendarIcon, Clock, DollarSign, PenTool } from "lucide-react";
import toast from "react-hot-toast";

export default function BookingModal({ room, onClose }) {
  const { bookRoom } = useApp();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTimes = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const getAvailableEndTimes = () => {
    const startHr = parseInt(startTime.split(":")[0]);
    const list = [];
    for (let hr = startHr + 1; hr <= 21; hr++) {
      list.push(String(hr).padStart(2, "0") + ":00");
    }
    return list;
  };

  const endTimes = getAvailableEndTimes();

  useEffect(() => {
    const startHr = parseInt(startTime.split(":")[0]);
    const endHr = parseInt(endTime.split(":")[0]);
    if (endHr <= startHr) {
      setEndTime(String(startHr + 1).padStart(2, "0") + ":00");
    }
  }, [startTime]);

  useEffect(() => {
    const startHr = parseInt(startTime.split(":")[0]);
    const endHr = parseInt(endTime.split(":")[0]);
    if (endHr > startHr) {
      setTotalCost((endHr - startHr) * room.hourlyRate);
    } else {
      setTotalCost(room.hourlyRate);
    }
  }, [startTime, endTime, room.hourlyRate]);

  const hours = parseInt(endTime.split(":")[0]) - parseInt(startTime.split(":")[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setIsSubmitting(true);
    const res = await bookRoom({
      roomId: room.id,
      date, startTime, endTime, specialNote
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Room booked successfully!");
      onClose();
    } else {
      toast.error(res.message || "Conflict found! Room already booked for this slot.");
    }
  };

  const selectCls = "w-full py-2.5 px-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";
  const inputCls = "w-full py-2.5 px-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Book Study Room"
      subtitle={room.name}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Rate Indicator */}
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
          <span className="text-sm font-semibold text-primary">Hourly Rate</span>
          <span className="text-sm font-black text-primary">${room.hourlyRate}/hr</span>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" /> Date
          </label>
          <input
            type="date"
            required
            min={getTodayString()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3" /> Start
            </label>
            <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className={selectCls}>
              {startTimes.map((t) => <option key={t} value={t} className="bg-card text-foreground">{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3" /> End
            </label>
            <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className={selectCls}>
              {endTimes.map((t) => <option key={t} value={t} className="bg-card text-foreground">{t}</option>)}
            </select>
          </div>
        </div>

        {/* Duration pill */}
        {hours > 0 && (
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted bg-background px-3 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              {hours} hour{hours > 1 ? "s" : ""} reserved
            </span>
          </div>
        )}

        {/* Note */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
            <PenTool className="h-3 w-3" /> Special Note <span className="normal-case font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="e.g. Need external monitors, quiet area, extra seating..."
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            rows={2}
            className={inputCls + " resize-none"}
          />
        </div>

        {/* Cost + Submit */}
        <div className="border-t border-border pt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Estimated Total</p>
            <p className="text-3xl font-black text-foreground flex items-center mt-0.5">
              <DollarSign className="h-6 w-6 text-amber-500" />
              {totalCost}
            </p>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="flex-shrink-0"
          >
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
}
