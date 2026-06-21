import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border transition-colors duration-300">
      {/* Top gradient accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-violet-500 to-indigo-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-sm flex items-center justify-center">
                <LogoIcon className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                StudyNook
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Find, book, and list premium study rooms in university and public libraries. Facilitating collaborative knowledge exchange in quiet, productive environments.
            </p>
            {/* Mini CTA */}
            <Link
              href="/rooms"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
            >
              Browse Rooms
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Browse Rooms", href: "/rooms" },
                { label: "Add a Room", href: "/add-room" },
                { label: "My Listings", href: "/my-listings" },
                { label: "My Bookings", href: "/my-bookings" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <div className="p-1.5 bg-primary-50 dark:bg-primary-950/30 rounded-lg">
                  <Mail className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                </div>
                <span>support@studynook.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <div className="p-1.5 bg-primary-50 dark:bg-primary-950/30 rounded-lg">
                  <Phone className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                </div>
                <span>+88012-34567890</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <div className="p-1.5 bg-primary-50 dark:bg-primary-950/30 rounded-lg flex-shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                </div>
                <span>University Central Library, Floor 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {year} <span className="font-semibold text-slate-500 dark:text-slate-400">StudyNook</span>. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {[
              {
                label: "Facebook",
                href: "https://facebook.com",
                path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
              },
              {
                label: "X (Twitter)",
                href: "https://x.com",
                path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
              },
              {
                label: "LinkedIn",
                href: "https://linkedin.com",
                path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
