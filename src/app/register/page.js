"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { User, Mail, Link as LinkIcon, Lock, UserPlus, ArrowRight, ShieldAlert } from "lucide-react";
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
      registerUser(name, email, photoUrl, password).then((res) => {
        setIsSubmitting(false);

        if (res.success) {
          toast.success(res.message || "Registration successful! Please login.");
          router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        } else {
          toast.error(res.message || "Registration failed. Email might already exist.");
        }
      });
    }, 600);
  };

  const handleGoogleSignup = () => {
    loginWithGoogle().then((res) => {
      if (res.success) {
        toast.success(`Registered & logged in as ${res.user.name}!`);
        router.push("/");
      } else {
        toast.error("Google authentication failed.");
      }
    });
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
        <svg className="h-4.5 w-4.5 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
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
