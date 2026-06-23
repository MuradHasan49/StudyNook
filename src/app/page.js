"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import Card from "@/components/Card";
import { CardsGridSkeleton } from "@/components/Loader";
import {
  ArrowRight, Shield, Zap, Coffee, Sparkles, BookOpen,
  Users, Star, TrendingUp, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

// High-quality library & study room photos from Unsplash
const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=85&w=1920",
    alt: "Grand university library interior",
    caption: "World-class university libraries",
  },
  {
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=85&w=1920",
    alt: "Rows of library books",
    caption: "Quiet, focused study environments",
  },
  {
    url: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=85&w=1920",
    alt: "Modern library reading room",
    caption: "Modern collaborative spaces",
  },
  {
    url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=85&w=1920",
    alt: "Bright library study area",
    caption: "Premium study rooms available now",
  },
  {
    url: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&q=85&w=1920",
    alt: "Students in a study room",
    caption: "Boost your productivity",
  },
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = heroSlides.length;

  // Auto-advance every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, count]);

  const prev = () => setCurrent((c) => (c - 1 + count) % count);
  const next = () => setCurrent((c) => (c + 1) % count);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={heroSlides[current].url}
            alt={heroSlides[current].alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay — dark at bottom & top, semi-dark center for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
      {/* Extra purple tint for brand feel */}
      <div className="absolute inset-0 bg-primary-950/30 mix-blend-multiply" />

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              i === current
                ? "w-7 bg-white"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Caption */}
      <div className="absolute bottom-10 right-6 z-10 hidden sm:block">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold text-white/60 tracking-wider uppercase"
          >
            {heroSlides[current].caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Home() {
  const { rooms, loading } = useApp();

  useEffect(() => {
    document.title = "StudyNook — Book Your Perfect Study Room";
  }, []);

  const latestRooms = [...rooms]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const perks = [
    {
      icon: Shield,
      title: "Conflict-Free Booking",
      desc: "Our database constraints prevent double-booking. Book with total confidence that your slot is exclusively yours.",
      color: "from-primary to-violet-600",
      bg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Zap,
      title: "Real-Time Approvals",
      desc: "Skip waiting queues. Receive your instant reservation confirmation and unlock your private study room right away.",
      color: "from-violet-500 to-indigo-600",
      bg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Coffee,
      title: "Host & Earn Credit",
      desc: "Got an unused room? List your slots to help other students study and receive monetary benefits or credit points.",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/10",
      iconColor: "text-amber-550 dark:text-amber-400",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Discover Study Nooks",
      desc: "Filter spaces by capacity, floor, hourly rate, and required amenities like whiteboards or high-speed Wi-Fi.",
      color: "bg-primary shadow-primary/30",
    },
    {
      num: "02",
      title: "Reserve Your Slot",
      desc: "Pick a date and hour range. See real-time cost updates and confirm with instant conflict resolution.",
      color: "bg-indigo-600 shadow-indigo-500/30",
    },
    {
      num: "03",
      title: "Unlock & Excel",
      desc: "Access your bookings dashboard, walk in, hook up your screens, and start collaborating immediately.",
      color: "bg-violet-600 shadow-violet-500/30",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
        {/* Photo slideshow background */}
        <HeroSlideshow />

        {/* Content (above slideshow) */}
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              University Room Booking — Reimagined
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] drop-shadow-lg"
            >
              Find Your Perfect{" "}
              <span className="gradient-text-hero block sm:inline">
                Study Room
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow"
            >
              Browse and book quiet, private study rooms in your library.
              List your own space, manage bookings, and boost your productivity — all in one place.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-2xl shadow-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 text-base"
              >
                Explore All Rooms
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/add-room"
                className="inline-flex items-center gap-2.5 px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 text-base backdrop-blur-sm"
              >
                <BookOpen className="h-5 w-5" />
                List a Room
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-6 pt-4"
            >
              {[
                { icon: Users, value: rooms.length > 0 ? `${rooms.length}+` : "10+", label: "Rooms Listed" },
                { icon: Star, value: "4.9", label: "Avg. Rating" },
                { icon: TrendingUp, value: "500+", label: "Bookings Made" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-white/60">
                  <stat.icon className="h-4 w-4 text-primary" />
                  <span className="font-bold text-white text-sm">{stat.value}</span>
                  <span className="text-xs">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── LATEST ROOMS ─────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
              Fresh Listings
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Recently Listed Rooms
            </h2>
            <p className="text-muted mt-2 max-w-xl leading-relaxed">
              Discover the latest quiet workspaces freshly added to our growing inventory.
            </p>
          </motion.div>

          <Link
            href="/rooms"
            className="flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-90 transition-colors group flex-shrink-0"
          >
            View all rooms
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <CardsGridSkeleton count={6} />
        ) : latestRooms.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl">
            <BookOpen className="h-12 w-12 text-muted/50 mx-auto mb-4" />
            <p className="text-muted font-medium">
              No rooms listed yet.{" "}
              <Link href="/add-room" className="text-primary underline underline-offset-2">
                Be the first to add one!
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {latestRooms.map((room, index) => (
              <Card key={room.id || room._id} room={room} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* ─── PERKS ────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/20 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              Why StudyNook?
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Built for serious students
            </h2>
            <p className="text-muted leading-relaxed">
              We design features that streamline your learning, collaboration, and room hosting experience from end to end.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-card p-7 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${perk.bg} ${perk.iconColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <perk.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{perk.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <p className="text-xs font-bold text-primary uppercase tracking-widest">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Three steps to success
          </h2>
          <p className="text-muted leading-relaxed">
            Learn how quickly you can secure your workspace and get studying in under 2 minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-primary/20 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center space-y-4"
            >
              <div className={`h-16 w-16 rounded-full ${step.color} text-white font-black text-xl flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-950`}>
                {step.num}
              </div>
              <div className="bg-card rounded-2xl border border-border p-6 w-full shadow-sm flex-1 flex flex-col">
                <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
          >
            Ready to find your focus zone?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/80 text-lg"
          >
            Join hundreds of students booking smarter with StudyNook.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Find a Room
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/40 hover:border-white/80 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Create Free Account
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
