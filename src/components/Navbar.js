"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LogOut, PlusCircle,
  Calendar, List, ChevronDown
} from "lucide-react";
import LogoIcon from "@/components/LogoIcon";

export default function Navbar() {
  const { currentUser, logoutUser } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isActive = (path) => pathname === path;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
  ];

  const privateLinks = [
    { label: "Add Room", href: "/add-room", icon: PlusCircle },
    { label: "My Listings", href: "/my-listings", icon: List },
    { label: "My Bookings", href: "/my-bookings", icon: Calendar },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 glass-effect transition-all duration-300 ${
        scrolled ? "shadow-md shadow-black/5 dark:shadow-black/30" : "shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <LogoIcon className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse border border-slate-100 dark:border-slate-950" />
            </div>
            <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-primary via-violet-600 to-indigo-600 dark:from-primary dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Study<span className="text-slate-900 dark:text-white">Nook</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-full bg-primary rounded-t-full"
                  />
                )}
              </Link>
            ))}

            {currentUser && privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-full bg-primary rounded-t-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors duration-200"
                >
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/40"
                  />
                  <span className="text-sm font-semibold text-foreground hidden lg:block max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-foreground truncate mt-0.5">{currentUser.name}</p>
                        <p className="text-[11px] text-muted truncate">{currentUser.email}</p>
                      </div>

                      <div className="py-1">
                        {privateLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors"
                          >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-border py-1">
                        <button
                          onClick={logoutUser}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="px-4 pt-3 pb-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border-l-2 ${
                      isActive(link.href)
                        ? "border-l-primary bg-primary/10 text-primary"
                        : "border-l-transparent text-muted hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {currentUser && (
                <>
                  <div className="pt-2 pb-1 px-1">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider px-3">My Account</p>
                  </div>
                  {privateLinks.map((link, i) => (
                    <motion.div key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navLinks.length + i) * 0.05 }}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border-l-2 ${
                          isActive(link.href)
                            ? "border-l-primary bg-primary/10 text-primary"
                            : "border-l-transparent text-muted hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            <div className="border-t border-border px-4 py-3 bg-slate-50/50 dark:bg-slate-950/50">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={currentUser.photoUrl} alt={currentUser.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30" />
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">{currentUser.name}</p>
                      <p className="text-[11px] text-muted truncate max-w-[180px]">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logoutUser}
                    aria-label="Sign out"
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="flex items-center justify-center px-4 py-2.5 border border-border text-sm font-semibold text-foreground rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
