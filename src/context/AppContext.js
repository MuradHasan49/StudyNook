"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const AppContext = createContext();

const API_BASE = "http://localhost:5000/api";

export const AppContextProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  const getAuthToken = async () => {
    try {
      const res = await authClient.token();
      console.log(res)
      if (res && res.data) {
        return res.data.token;
      }
    } catch (e) {
      console.error("Error getting auth token:", e);
    }
    return null;
  };

  const authenticatedFetch = async (url, options = {}) => {
    const token = await getAuthToken();
    const headers = {
      ...options.headers,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(url, {
      ...options,
      headers,
    });
  };

  const mapRoomId = (r) => {
    if (!r) return r;
    const id = r.id || r._id || (r._id ? r._id.toString() : null);
    const ownerId = typeof r.owner === "object" && r.owner
      ? (r.owner.id || r.owner._id || (r.owner._id ? r.owner._id.toString() : null))
      : r.owner;
    return {
      ...r,
      id,
      ownerId
    };
  };

  const mapBookingId = (b) => {
    if (!b) return b;
    const id = b.id || b._id || (b._id ? b._id.toString() : null);
    const roomId = typeof b.roomId === "object" && b.roomId
      ? (b.roomId.id || b.roomId._id || (b.roomId._id ? b.roomId._id.toString() : null))
      : b.roomId;
    return {
      ...b,
      id,
      roomId,
      specialNote: b.specialNote || b.note
    };
  };

  // Fetch Rooms from server
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE}/rooms`);
      const data = await response.json();
      if (data.success) {
        setRooms(data.data.map(mapRoomId));
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  // Fetch Bookings for logged in user from server
  const fetchMyBookings = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/bookings/my`, {
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data.map(mapBookingId));
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Check user session from cookie on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await authClient.getSession();
        if (res && res.data && res.data.user) {
          const sessionUser = res.data.user;
          setCurrentUser({
            id: sessionUser.id,
            name: sessionUser.name,
            email: sessionUser.email,
            photoUrl: sessionUser.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
          });
          // Also fetch their bookings since they are logged in
          const bookingsResponse = await authenticatedFetch(`${API_BASE}/bookings/my`, {
            credentials: "include"
          });
          const bookingsData = await bookingsResponse.json();
          if (bookingsData.success) {
            setBookings(bookingsData.data.map(mapBookingId));
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn("Session check failed (e.g. no active token or server offline)", err);
        setCurrentUser(null);
      } finally {
        // Fetch public rooms list
        await fetchRooms();

        // Setup Theme settings
        const storedTheme = localStorage.getItem("study_nook_theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const activeTheme = storedTheme || systemTheme;
        setTheme(activeTheme);
        if (activeTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auth Operations
  const registerUser = async (name, email, photoUrl, password) => {
    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl
      });
      if (res && res.error) {
        return { success: false, message: res.error.message || "Registration failed." };
      }
      return { success: true, message: "Registration successful! Please login." };
    } catch (err) {
      return { success: false, message: "Could not connect to the auth server." };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await authClient.signIn.email({
        email,
        password
      });
      if (res && res.error) {
        return { success: false, message: res.error.message || "Invalid email or password" };
      }
      if (res && res.data && res.data.user) {
        const loggedUser = {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          photoUrl: res.data.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
        };
        setCurrentUser(loggedUser);

        // Fetch their bookings
        await fetchMyBookings();
        return { success: true, user: loggedUser };
      }
      return { success: false, message: "Authentication failed" };
    } catch (err) {
      return { success: false, message: "Could not connect to the auth server." };
    }
  };

  // Google Login bridge to backend DB
  const loginWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: "Google sign-in error." };
    }
  };

  const logoutUser = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Logout backend call failed:", err);
    } finally {
      setCurrentUser(null);
      setBookings([]);
      toast.success("Logged out successfully");
    }
  };

  // Room CRUD Operations
  const addRoom = async (roomData) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: roomData.name,
          description: roomData.description,
          image: roomData.image,
          floor: roomData.floor,
          capacity: roomData.capacity,
          hourlyRate: roomData.hourlyRate,
          amenities: roomData.amenities
        }),
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchRooms();
        return { success: true, room: data.data };
      } else {
        return { success: false, message: data.message || "Failed to add room." };
      }
    } catch (err) {
      return { success: false, message: "Server connection failed." };
    }
  };

  const updateRoom = async (roomId, roomData) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(roomData),
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchRooms();
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to update room." };
      }
    } catch (err) {
      return { success: false, message: "Server connection failed." };
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/rooms/${roomId}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchRooms();
        // Refresh bookings as well because deleting the room cancels/removes its bookings
        if (currentUser) {
          await fetchMyBookings();
        }
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to delete room." };
      }
    } catch (err) {
      return { success: false, message: "Server connection failed." };
    }
  };

  // Booking Operations
  const bookRoom = async (bookingData) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          roomId: bookingData.roomId,
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          note: bookingData.specialNote
        }),
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchRooms(); // Update booking count on room
        await fetchMyBookings(); // Add new booking to bookings state
        return { success: true, booking: data.data };
      } else {
        return { success: false, message: data.message || "Overlapping slot found." };
      }
    } catch (err) {
      return { success: false, message: "Server connection failed." };
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchRooms(); // Decrement booking count on room
        await fetchMyBookings(); // Refresh bookings list
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to cancel booking." };
      }
    } catch (err) {
      return { success: false, message: "Server connection failed." };
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("study_nook_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        bookings,
        currentUser,
        loading,
        theme,
        toggleTheme,
        registerUser,
        loginUser,
        loginWithGoogle,
        logoutUser,
        addRoom,
        updateRoom,
        deleteRoom,
        bookRoom,
        cancelBooking
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppContextProvider");
  }
  return context;
};
