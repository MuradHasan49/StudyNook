"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  BookOpen, Sun, Moon, Menu, X, LogOut, PlusCircle, 
  Calendar, List, User, ChevronDown 
} from "lucide-react";

export default function Navbar() {
  const { currentUser, logoutUser, theme, toggleTheme } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <nav className="sticky top-0 z-50 glass-effect shadow-sm transition-colors duration-200 dark:shadow-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-md shadow-primary-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
              StudyNook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all-300 ${
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {currentUser && privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all-300 flex items-center gap-1.5 ${
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Controls (Auth, Theme Toggle) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-accent-amber" /> : <Moon className="h-5 w-5" />}
            </button>

            {currentUser ? (
              /* User Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover border border-primary-500"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:inline-block">
                    {currentUser.name}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400">LOGGED IN AS</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      href="/my-listings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-55 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400 transition-colors"
                    >
                      <List className="h-4 w-4" />
                      <span>My Listings</span>
                    </Link>

                    <Link
                      href="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-55 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logoutUser();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public Login/Register */
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-accent-amber" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-slide-up duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {currentUser && (
              <>
                <div className="border-t border-slate-200 dark:border-slate-850 my-2 pt-2"></div>
                <p className="px-3 text-xs font-semibold text-slate-400 tracking-wider uppercase">Member Zone</p>
                {privateLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.href)
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </>
            )}

            <div className="border-t border-slate-200 dark:border-slate-850 my-2 pt-2"></div>

            {currentUser ? (
              <div className="px-3 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full object-cover border border-primary-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3 py-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
