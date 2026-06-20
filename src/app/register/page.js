"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { User, Mail, Link as LinkIcon, Lock, UserPlus, Chrome, ArrowRight, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

function RegisterFormContent() {
  const { registerUser, loginWithGoogle, currentUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push(redirect);
    }
  }, [currentUser, router, redirect]);

  // Set browser title
  useEffect(() => {
    document.title = "StudyNook – Register";
  }, []);

  // Password validation check
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter.";
    }
    return "";
  };

  // Run validation on password change
  useEffect(() => {
    if (password) {
      setErrorMsg(validatePassword(password));
    } else {
      setErrorMsg("");
    }
  }, [password]);

  const handleRegister = (e) => {
    e.preventDefault();

    // Final password validation check
    const validationError = validatePassword(password);
    if (validationError) {
      setErrorMsg(validationError);
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      const res = registerUser(name, email, photoUrl, password);
      setIsSubmitting(false);

      if (res.success) {
        toast.success(res.message || "Registration successful! Please login.");
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      } else {
        toast.error(res.message || "Registration failed. Email might already exist.");
      }
    }, 600);
  };

  const handleGoogleSignup = () => {
    const res = loginWithGoogle();
    if (res.success) {
      toast.success(`Registered & logged in as ${res.user.name}!`);
      router.push("/");
    } else {
      toast.error("Google authentication failed.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800 p-8 space-y-6">
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <div className="mx-auto bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 p-3 rounded-2xl w-fit">
          <UserPlus className="h-6 w-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-850 dark:text-white">
          Create Account
        </h2>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Join StudyNook Network
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <User className="h-3 w-3" />
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="jane@doe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>

        {/* Photo URL Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <LinkIcon className="h-3 w-3" />
            Photo URL
          </label>
          <input
            type="url"
            required
            placeholder="https://images.unsplash.com/..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
          {/* Real-time Inline Error message */}
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium pt-1 animate-fade-in">
              <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? "Creating account..." : "Register"}
          <UserPlus className="h-4 w-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-2">
        <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
        <span className="absolute px-3 text-xs bg-white dark:bg-slate-900 text-slate-400 font-bold uppercase">
          or
        </span>
      </div>

      {/* Google OAuth signup button */}
      <button
        onClick={handleGoogleSignup}
        className="w-full py-3 px-4 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <Chrome className="h-4 w-4 text-red-500" />
        Register with Google
      </button>

      {/* Redirect Link */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-bold inline-flex items-center gap-0.5"
        >
          Login
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  );
}

export default function Register() {
  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-950/40">
      <Suspense fallback={
        <div className="text-center py-12 text-slate-550">
          Loading registration forms...
        </div>
      }>
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
