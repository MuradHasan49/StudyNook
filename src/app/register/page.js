"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button";
import { User, Mail, Link as LinkIcon, Lock, UserPlus, ArrowRight, ShieldAlert, Sparkles, Eye, EyeOff } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function PasswordStrength({ password }) {
  const checks = [
    { label: "6+ characters", pass: password.length >= 6 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Lowercase letter", pass: /[a-z]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-green-500"];
  const labels = ["", "Weak", "Fair", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${i < score ? colors[score] : "bg-slate-200 dark:bg-slate-700"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((c) => (
            <span key={c.label} className={`text-[10px] font-medium ${c.pass ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
              {c.pass ? "✓" : "·"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span className={`text-[10px] font-bold ${score === 3 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>{labels[score]}</span>}
      </div>
    </div>
  );
}

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
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (currentUser) router.push(redirect);
  }, [currentUser, router, redirect]);

  useEffect(() => {
    document.title = "StudyNook — Create Account";
  }, []);

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(pass)) return "Must contain an uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Must contain a lowercase letter.";
    return "";
  };

  useEffect(() => {
    if (password) setErrorMsg(validatePassword(password));
    else setErrorMsg("");
  }, [password]);

  const handleRegister = (e) => {
    e.preventDefault();
    const err = validatePassword(password);
    if (err) { setErrorMsg(err); toast.error(err); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      registerUser(name, email, photoUrl, password).then((res) => {
        setIsSubmitting(false);
        if (res.success) {
          toast.success("Account created! Please sign in.");
          router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        } else {
          toast.error(res.message || "Registration failed. Email may already exist.");
        }
      });
    }, 600);
  };

  const handleGoogleSignup = () => {
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
      className="w-full max-w-sm space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Create account
        </h1>
        <p className="text-muted text-sm">
          Join StudyNook and start booking your ideal study space.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="text-xs font-bold text-muted uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input id="reg-name" type="text" required placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="text-xs font-bold text-muted uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input id="reg-email" type="email" required placeholder="jane@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* Photo URL */}
        <div className="space-y-1.5">
          <label htmlFor="reg-photo" className="text-xs font-bold text-muted uppercase tracking-wider">Photo URL <span className="normal-case text-slate-400 dark:text-slate-500 font-normal">(optional)</span></label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input id="reg-photo" type="url" placeholder="https://..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="reg-password" className="text-xs font-bold text-muted uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Min 6 chars, upper & lowercase"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} pr-10 ${errorMsg ? "border-red-400 dark:border-red-650 focus:ring-red-400" : ""}`}
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
          <PasswordStrength password={password} />
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-xs text-red-500 font-medium pt-0.5"
            >
              <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
              {errorMsg}
            </motion.div>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} leftIcon={isSubmitting ? undefined : UserPlus} className="w-full mt-2">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted font-semibold uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors"
      >
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="text-primary font-bold hover:underline underline-offset-2 inline-flex items-center gap-0.5"
        >
          Sign in <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </motion.div>
  );
}

export default function Register() {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)] bg-background text-foreground">
      {/* Decorative left panel */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-indigo-50/20 to-violet-100/30 dark:from-slate-900 dark:via-[#1a1040] dark:to-slate-950 p-12 relative overflow-hidden border-r border-border">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl blob" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl blob blob-delay-4" />
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
          <div className="inline-flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
              <LogoIcon className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse border border-slate-100 dark:border-slate-950" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">StudyNook</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              Start your <span className="bg-gradient-to-r from-primary to-indigo-650 dark:from-primary dark:to-indigo-300 bg-clip-text text-transparent">study journey</span>
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              Create your free account and unlock access to premium study rooms in seconds.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {[
              "Free to join, no credit card required",
              "List your own rooms & earn credits",
              "Manage all bookings in one dashboard",
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
        <Suspense fallback={<div className="text-center text-sm text-muted animate-pulse">Loading...</div>}>
          <RegisterFormContent />
        </Suspense>
      </div>
    </div>
  );
}
