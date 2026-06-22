"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Loader from "@/components/Loader";
import BookingModal from "@/components/BookingModal";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import {
  MapPin, Users, DollarSign, CheckCircle2,
  Trash2, Edit, CalendarDays, ArrowLeft, ShieldCheck,
  AlertTriangle, CheckSquare, X
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function RoomDetails({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const { rooms, currentUser, updateRoom, deleteRoom, loading } = useApp();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const [editHourlyRate, setEditHourlyRate] = useState("");
  const [editAmenities, setEditAmenities] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const amenitiesOptions = [
    "Whiteboard", "Projector", "Wi-Fi",
    "Power Outlets", "Quiet Zone", "Air Conditioning"
  ];

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        toast.error("Please login to view room details.");
        router.push(`/login?redirect=/rooms/${id}`);
        return;
      }

      if (rooms.length > 0) {
        const found = rooms.find((r) => r.id === id);
        if (found) {
          setRoom(found);
          setEditName(found.name);
          setEditDescription(found.description);
          setEditImage(found.image);
          setEditFloor(found.floor);
          setEditCapacity(String(found.capacity));
          setEditHourlyRate(String(found.hourlyRate));
          setEditAmenities(found.amenities);
          document.title = `StudyNook — ${found.name}`;
        } else {
          toast.error("Room not found.");
          router.push("/rooms");
        }
      }
    }
  }, [id, rooms, loading, router, currentUser]);

  if (loading || !currentUser || !room) {
    return <Loader message="Checking authorization and gathering room specifications..." />;
  }

  const isOwner = currentUser && room.ownerId === currentUser.id;

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(editHourlyRate) < 0 || parseInt(editCapacity) < 1) {
      toast.error("Invalid hourly rate or seat capacity.");
      return;
    }
    setIsSaving(true);
    const res = await updateRoom(room.id, {
      name: editName, description: editDescription,
      image: editImage, floor: editFloor,
      capacity: parseInt(editCapacity),
      hourlyRate: parseFloat(editHourlyRate),
      amenities: editAmenities
    });
    setIsSaving(false);
    if (res.success) {
      toast.success("Room updated successfully!");
      setShowEditModal(false);
    } else {
      toast.error(res.message || "Failed to update room.");
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const res = await deleteRoom(room.id);
    setIsDeleting(false);
    if (res.success) {
      toast.success("Room deleted successfully.");
      router.push("/my-listings");
    } else {
      toast.error(res.message || "Failed to delete room.");
    }
  };

  const handleAmenityToggle = (amenity) => {
    setEditAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition";

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-primary transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* Main grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start"
      >
        {/* Left: Image + Amenities */}
        <div className="lg:col-span-3 space-y-5">
          <div className="relative rounded-2xl overflow-hidden bg-background border border-border shadow-sm">
            <img
              src={room.image}
              alt={room.name}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {isOwner && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Your Listing
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Room Amenities</h3>
            {room.amenities.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-foreground bg-background px-3 py-2 rounded-xl border border-border"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No special amenities listed.</p>
            )}
          </div>
        </div>

        {/* Right: Info + Booking */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-background text-foreground text-xs font-semibold rounded-full border border-border">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {room.floor}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                <Users className="h-3.5 w-3.5" />
                {room.capacity} seats
              </span>
            </div>

            {/* Name */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
                {room.name}
              </h1>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-muted leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background border border-border/50 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">Hourly Rate</p>
                <p className="text-2xl font-black text-foreground flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                  {room.hourlyRate}
                </p>
              </div>
              <div className="bg-background border border-border/50 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">Times Booked</p>
                <p className="text-2xl font-black text-foreground flex items-center justify-center gap-1.5">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  {room.bookingCount || 0}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-border">
              {isOwner ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      leftIcon={Edit}
                      onClick={() => setShowEditModal(true)}
                      className="w-full"
                    >
                      Edit Room
                    </Button>
                    <Button
                      variant="danger"
                      leftIcon={Trash2}
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={CalendarDays}
                    onClick={() => setShowBookingModal(true)}
                    className="w-full text-base"
                  >
                    Book This Room
                  </Button>
                </div>
              ) : currentUser ? (
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={CalendarDays}
                  onClick={() => setShowBookingModal(true)}
                  className="w-full text-base"
                >
                  Book This Room
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push(`/login?redirect=/rooms/${room.id}`)}
                  className="w-full text-base"
                >
                  Sign In to Book
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal room={room} onClose={() => setShowBookingModal(false)} />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Room Listing"
        subtitle={room.name}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Room Name</label>
            <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Description</label>
            <textarea required rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className={inputCls + " resize-none"} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Image URL</label>
            <input type="url" required value={editImage} onChange={(e) => setEditImage(e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Floor</label>
              <input type="text" required value={editFloor} onChange={(e) => setEditFloor(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Capacity</label>
              <input type="number" required min="1" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Rate ($/hr)</label>
              <input type="number" required min="0" value={editHourlyRate} onChange={(e) => setEditHourlyRate(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider block">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesOptions.map((amenity) => {
                const checked = editAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                      checked
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted border border-border hover:border-primary/45"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${checked ? "bg-primary border-primary" : "border-border"}`}>
                      {checked && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="secondary" type="button" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" isLoading={isSaving}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        maxWidth="max-w-sm"
      >
        <div className="p-6 text-center space-y-5">
          <div className="mx-auto w-fit p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Delete Room Listing?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-700 dark:text-slate-200">{room.name}</strong>? This cannot be undone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="w-full">Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm} isLoading={isDeleting} className="w-full">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
