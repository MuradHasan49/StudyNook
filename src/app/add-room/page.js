"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { PlusCircle, Link as LinkIcon, Users, DollarSign, Layers, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const amenitiesList = [
  "Whiteboard", "Projector", "Wi-Fi",
  "Power Outlets", "Quiet Zone", "Air Conditioning"
];

const amenityIcons = {
  "Whiteboard": "🖊️",
  "Projector": "📽️",
  "Wi-Fi": "📶",
  "Power Outlets": "🔌",
  "Quiet Zone": "🔇",
  "Air Conditioning": "❄️",
};

export default function AddRoom() {
  const { currentUser, addRoom, loading } = useApp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [floor, setFloor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { document.title = "StudyNook — Add Room"; }, []);

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please login to list a study room.");
      router.push("/login?redirect=/add-room");
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) return <Loader message="Checking listing authorization..." />;

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(hourlyRate) < 0) { toast.error("Hourly rate cannot be negative."); return; }
    if (parseInt(capacity) < 1) { toast.error("Seat capacity must be at least 1."); return; }

    setIsSubmitting(true);
    const res = await addRoom({
      name, description, image, floor,
      capacity: parseInt(capacity),
      hourlyRate: parseFloat(hourlyRate),
      amenities: selectedAmenities
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Room listed successfully!");
      router.push("/my-listings");
    } else {
      toast.error(res.message || "Failed to add room listing.");
    }
  };

  const inputCls = "w-full px-3 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10 space-y-3"
      >
        <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 text-primary rounded-2xl">
          <PlusCircle className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          List a Study Room
        </h1>
        <p className="text-muted text-sm max-w-md mx-auto">
          Share your unused research rooms, study nooks, or team lab spaces with fellow students.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          {/* Section: Basic Info */}
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">Basic Info</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Room Name *</label>
              <input type="text" required placeholder="e.g. Apex Innovation Room" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe the workspace environment, ideal group size, and key features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputCls + " resize-none"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <LinkIcon className="h-3 w-3" /> Room Image URL *
              </label>
              <input type="url" required placeholder="https://images.unsplash.com/..." value={image} onChange={(e) => setImage(e.target.value)} className={inputCls} />
              {image && (
                <div className="mt-2 rounded-xl overflow-hidden border border-border h-32">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = "none"} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border px-6 sm:px-8 py-6 space-y-5 bg-slate-50/20 dark:bg-slate-800/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">Room Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                  <Layers className="h-3 w-3" /> Floor *
                </label>
                <input type="text" required placeholder="e.g. 3rd Floor" value={floor} onChange={(e) => setFloor(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                  <Users className="h-3 w-3" /> Capacity *
                </label>
                <input type="number" required min="1" placeholder="e.g. 4" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-amber-500" /> Rate ($/hr) *
                </label>
                <input type="number" required min="0" step="0.5" placeholder="e.g. 8" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Section: Amenities */}
          <div className="border-t border-border px-6 sm:px-8 py-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">Amenities</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {amenitiesList.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border text-left ${
                      checked
                        ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                        : "border-border text-muted hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-base">{amenityIcons[amenity]}</span>
                    <span className="text-xs sm:text-sm">{amenity}</span>
                    {checked && (
                      <div className="ml-auto h-4 w-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedAmenities.length > 0 && (
              <p className="text-xs text-muted">
                {selectedAmenities.length} amenit{selectedAmenities.length === 1 ? "y" : "ies"} selected
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="border-t border-border px-6 sm:px-8 py-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={isSubmitting ? undefined : ArrowRight}
              className="w-full"
            >
              {isSubmitting ? "Listing room..." : "List Study Room"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
