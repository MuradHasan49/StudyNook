"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-md" }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto w-full ${maxWidth} bg-card rounded-2xl shadow-2xl border border-border overflow-hidden`}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              {(title || subtitle) && (
                <div className="flex items-start justify-between px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-950/50">
                  <div>
                    {title && (
                      <h2 className="font-bold text-lg text-foreground">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-xs text-muted mt-0.5 truncate max-w-[280px]">
                        {subtitle}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-4 flex-shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
