"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import BookingModal from "@/components/BookingModal";
import { 
  MapPin, Users, DollarSign, Layers, CheckSquare, 
  Trash2, Edit, CalendarDays, ArrowLeft, ShieldCheck, 
  Sparkles, CheckCircle2, AlertTriangle, X 
} from "lucide-react";
import toast from "react-hot-toast";

export default function RoomDetails({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const { 
    rooms, currentUser, updateRoom, deleteRoom, loading 
  } = useApp();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  
  // Modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const [editHourlyRate, setEditHourlyRate] = useState("");
  const [editAmenities, setEditAmenities] = useState([]);

  const amenitiesOptions = [
    "Whiteboard", "Projector", "Wi-Fi", 
    "Power Outlets", "Quiet Zone", "Air Conditioning"
  ];

  // Find room once rooms data is loaded
  useEffect(() => {
    if (!loading && rooms.length > 0) {
      const found = rooms.find((r) => r.id === id);
      if (found) {
        setRoom(found);
        // Pre-fill edit form
        setEditName(found.name);
        setEditDescription(found.description);
        setEditImage(found.image);
        setEditFloor(found.floor);
        setEditCapacity(String(found.capacity));
        setEditHourlyRate(String(found.hourlyRate));
        setEditAmenities(found.amenities);

        // Set Tab Title
        document.title = `StudyNook – ${found.name}`;
      } else {
        toast.error("Room not found.");
        router.push("/rooms");
      }
    }
  }, [id, rooms, loading, router]);

  if (loading || !room) {
    return <LoadingSpinner message="Gathering room specifications..." />;
  }

  const isOwner = currentUser && room.ownerId === currentUser.id;

  // Edit Room submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(editHourlyRate) < 0 || parseInt(editCapacity) < 1) {
      toast.error("Invalid hourly rate or seat capacity.");
      return;
    }

    const res = await updateRoom(room.id, {
      name: editName,
      description: editDescription,
      image: editImage,
      floor: editFloor,
      capacity: parseInt(editCapacity),
      hourlyRate: parseFloat(editHourlyRate),
      amenities: editAmenities
    });

    if (res.success) {
      toast.success("Room updated successfully!");
      setShowEditModal(false);
    } else {
      toast.error(res.message || "Failed to update room.");
    }
  };

  // Delete Room action
  const handleDeleteConfirm = async () => {
    const res = await deleteRoom(room.id);
    if (res.success) {
      toast.success("Room deleted successfully.");
      router.push("/my-listings");
    } else {
      toast.error(res.message || "Failed to delete room.");
    }
  };

  // Toggle Amenity Checkbox
  const handleAmenityToggle = (amenity) => {
    if (editAmenities.includes(amenity)) {
      setEditAmenities(editAmenities.filter((a) => a !== amenity));
    } else {
      setEditAmenities([...editAmenities, amenity]);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Image & Amenities list */}
        <div className="p-6 sm:p-8 space-y-6 border-r border-slate-100 dark:border-slate-850">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/20 shadow-sm">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Room Amenities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 text-sm text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800"
                >
                  <CheckCircle2 className="h-4.5 w-4.5 text-primary-500 flex-shrink-0" />
                  <span className="font-semibold">{amenity}</span>
                </div>
              ))}
              {room.amenities.length === 0 && (
                <p className="text-slate-450 text-sm">No special amenities listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Descriptions, Booking Stats, and CTAs */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header tags */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-black/60 dark:bg-slate-950 border border-white/10 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {room.floor}
              </span>
              <span className="bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Seat Capacity: {room.capacity}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-snug">
                {room.name}
              </h1>
              {isOwner && (
                <div className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Your Listing
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                {room.description}
              </p>
            </div>

            {/* Booking Stat Panel */}
            <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 grid grid-cols-2 gap-4 border border-slate-100 dark:border-slate-850">
              <div className="text-center border-r border-slate-200 dark:border-slate-800 py-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hourly rate</p>
                <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-1 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent-gold" />
                  {room.hourlyRate}
                </p>
              </div>
              <div className="text-center py-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Times booked</p>
                <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-1 flex items-center justify-center gap-1.5">
                  <CalendarDays className="h-5 w-5 text-primary-500" />
                  {room.bookingCount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Action button panel */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-850 mt-8 flex flex-col gap-3">
            {isOwner ? (
              /* OWNER PANEL */
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center justify-center gap-1.5 py-3.5 border border-primary-200 dark:border-primary-900/60 font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-xl transition duration-150 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  Edit Room
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-1.5 py-3.5 bg-red-600 hover:bg-red-700 font-bold text-white rounded-xl shadow-lg shadow-red-500/10 active:scale-95 transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Room
                </button>
              </div>
            ) : (
              /* BOOK NOW ACTION */
              currentUser ? (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 font-bold text-white rounded-xl shadow-xl shadow-primary-500/20 hover:scale-[1.01] active:scale-[0.99] transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 text-base"
                >
                  <CalendarDays className="h-5 w-5" />
                  Book Now
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/login?redirect=/rooms/${room.id}`)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 dark:bg-slate-750 dark:hover:bg-slate-700 font-bold text-white rounded-xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 text-base"
                >
                  Login to Book
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: BOOKING MODAL */}
      {showBookingModal && (
        <BookingModal
          room={room}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {/* MODAL 2: EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-850 animate-slide-up">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-800 dark:text-white">Edit Room Listing</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Room Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Image URL</label>
                <input
                  type="url"
                  required
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Floor</label>
                  <input
                    type="text"
                    required
                    value={editFloor}
                    onChange={(e) => setEditFloor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Hourly Rate ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editHourlyRate}
                    onChange={(e) => setEditHourlyRate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase block">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesOptions.map((amenity) => {
                    const checked = editAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 w-full text-left"
                      >
                        {checked ? (
                          <CheckSquare className="h-4.5 w-4.5 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <div className="h-4.5 w-4.5 rounded border border-slate-350 dark:border-slate-700" />
                        )}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 font-semibold rounded-xl text-slate-650 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-750 text-white font-bold rounded-xl text-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-850 animate-slide-up text-center space-y-5">
            <div className="mx-auto p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Delete Room Listing?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-slate-700 dark:text-slate-250"> {room.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-md transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
