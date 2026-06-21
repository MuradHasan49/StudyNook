"use client";

import React from "react";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30",
  secondary: "bg-card border border-border text-foreground hover:bg-slate-100/60 dark:hover:bg-slate-800/60",
  ghost: "text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20",
  outline: "border-2 border-primary text-primary hover:bg-primary/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
  xl: "px-8 py-4 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  disabled,
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 cursor-pointer
        active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon className="h-4 w-4 flex-shrink-0" />
      ) : null}
      {children}
      {!isLoading && RightIcon && (
        <RightIcon className="h-4 w-4 flex-shrink-0" />
      )}
    </button>
  );
}
