import React from "react";

export default function LogoIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" /> {/* violet-500 */}
          <stop offset="100%" stopColor="#6366f1" /> {/* indigo-500 */}
        </linearGradient>
      </defs>
      
      {/* Outer House-Book Frame */}
      <path
        d="M 22,72 Q 36,65 50,75 Q 64,65 78,72 L 78,45 L 50,20 L 22,45 Z"
        stroke="url(#logo-gradient)"
        strokeWidth="7.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Left Page Layer (Page turn effect) */}
      <path
        d="M 22,72 Q 36,65 50,75 Q 36,76 22,72 Z"
        fill="url(#logo-gradient)"
        opacity="0.35"
      />
      
      {/* Right Page Layer (Page turn effect) */}
      <path
        d="M 50,75 Q 64,65 78,72 Q 64,76 50,75 Z"
        fill="url(#logo-gradient)"
        opacity="0.35"
      />

      {/* 2x2 Grid Window (Room / Nook) */}
      <rect x="40" y="38" width="8.5" height="8.5" rx="1.8" fill="url(#logo-gradient)" />
      <rect x="51.5" y="38" width="8.5" height="8.5" rx="1.8" fill="url(#logo-gradient)" />
      <rect x="40" y="49.5" width="8.5" height="8.5" rx="1.8" fill="url(#logo-gradient)" />
      <rect x="51.5" y="49.5" width="8.5" height="8.5" rx="1.8" fill="url(#logo-gradient)" />
    </svg>
  );
}
