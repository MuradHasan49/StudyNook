"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button";
import { Mail, Lock, LogIn, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function LoginFormContent() {
  const { loginUser, loginWithGoogle, currentUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (currentUser) router.push(redirect);
  }, [currentUser, router, redirect]);

  useEffect(() => {
    document.title = "StudyNook — Sign In";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(async () => {
      const res = await loginUser(email, password);
      setIsSubmitting(false);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        router.push(redirect);
      } else {
        toast.error(res.message || "Invalid email or password");
      }
    }, 600);
  };

  const handleGoogleLogin = () => {
    loginWithGoogle().then((res) => {
      if (!res.success) toast.error("Google authentication failed.");
    });
  };

  const inputCls = "w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm space-y-7"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-muted text-sm">
          Sign in to access your study room bookings.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-xs font-bold text-muted uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="login-email"
              type="email"
              required
              placeholder="jane@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="text-xs font-bold text-muted uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          leftIcon={isSubmitting ? undefined : LogIn}
          className="w-full mt-2"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted font-semibold uppercase tracking-wider">or continue with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors duration-200"
      >
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      {/* Footer link */}
      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register?redirect=${encodeURIComponent(redirect)}`}
          className="text-primary font-bold hover:underline underline-offset-2 inline-flex items-center gap-0.5"
        >
          Create one <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </motion.div>
  );
}

export default function Login() {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)] bg-background text-foreground">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-indigo-50/20 to-violet-100/30 dark:from-slate-900 dark:via-[#1a1040] dark:to-slate-950 p-12 relative overflow-hidden border-r border-border">
        {/* Blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl blob" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl blob blob-delay-2" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center space-y-8 max-w-sm"
        >
          {/* Logo */}
          <div className="inline-flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
              <LogoIcon className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse border border-slate-100 dark:border-slate-950" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">StudyNook</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              Your <span className="bg-gradient-to-r from-primary to-indigo-650 dark:from-primary dark:to-indigo-300 bg-clip-text text-transparent">perfect study spot</span> awaits
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              Join thousands of students booking quiet, premium study rooms across campus libraries.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3 text-left">
            {[
              "Instant conflict-free booking",
              "Real-time availability updates",
              "Browse by floor, capacity & amenities",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <div className="h-5 w-5 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                {feat}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-16 bg-background">
        <Suspense fallback={
          <div className="text-center text-sm text-muted animate-pulse">Loading...</div>
        }>
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
