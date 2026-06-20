"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PlusCircle, Link as LinkIcon, Users, DollarSign, Layers, CheckSquare, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function AddRoom() {
  const { currentUser, addRoom, loading } = useApp();
  const router = useRouter();

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [floor, setFloor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const amenitiesList = [
    "Whiteboard", "Projector", "Wi-Fi", 
    "Power Outlets", "Quiet Zone", "Air Conditioning"
  ];

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = "StudyNook – Add Room";
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please login to list a study room.");
      router.push("/login?redirect=/add-room");
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return <LoadingSpinner message="Checking listing authorization..." />;
  }

  // Handle Amenity Checkbox change
  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(hourlyRate) < 0) {
      toast.error("Hourly rate cannot be negative.");
      return;
    }
    if (parseInt(capacity) < 1) {
      toast.error("Seat capacity must be at least 1.");
      return;
    }

    const res = await addRoom({
      name,
      description,
      image,
      floor,
      capacity: parseInt(capacity),
      hourlyRate: parseFloat(hourlyRate),
      amenities: selectedAmenities
    });

    if (res.success) {
      toast.success("Room added successfully!");
      router.push("/my-listings");
    } else {
      toast.error(res.message || "Failed to add room listing.");
    }
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in space-y-6">
      {/* Heading */}
      <div className="text-center space-y-2">
        <div className="mx-auto bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 p-3 rounded-2xl w-fit">
          <PlusCircle className="h-6 w-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
          List a Study Room
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          List your unused research rooms, study nooks, or team lab spaces to help fellow students.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Room Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Innovation Room"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
            <textarea
              required
              placeholder="Describe the workspace environment, ideal group size, and key utilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              Room Image URL
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* Floor, Capacity, Hourly Rate Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Floor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Floor
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 3rd Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            {/* Capacity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Users className="h-3 w-3" />
                Capacity (seats)
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 4"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            {/* Hourly Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-accent-gold" />
                Hourly Rate ($)
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 8"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
          </div>

          {/* Amenities Checklist */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase block">Available Amenities</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {amenitiesList.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => handleAmenityChange(amenity)}
                    className="flex items-center space-x-2 text-sm text-slate-650 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white transition w-full text-left"
                  >
                    {checked ? (
                      <CheckSquare className="h-4.5 w-4.5 text-primary-600 dark:text-primary-400 fill-primary-50 dark:fill-primary-950/20" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded border border-slate-300 dark:border-slate-700" />
                    )}
                    <span className="font-medium text-xs sm:text-sm">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="submit"
              className="w-full py-4 px-6 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/20 hover:scale-[1.01] active:scale-[0.99] transition duration-150 cursor-pointer text-center text-sm"
            >
              List Study Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
