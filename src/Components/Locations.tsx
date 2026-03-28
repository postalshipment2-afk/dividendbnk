"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const locations = [
  "London",
  "Zurich",
  "Singapore",
  "New York",
  "Turkey",
  "Hong Kong",
  "Mexico",
  "Dubai",
  "Frankfurt",
];

export default function GlobalTicker() {
  // We double the array to ensure the loop is seamless (no empty space)
  const tickerItems = [...locations, ...locations];

  return (
    <div className="relative w-full py-10 overflow-hidden bg-white border-t border-slate-100">
      {/* Fade Gradients: This creates the "fade-in/fade-out" look on the edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10" />

      <motion.div
        className="flex whitespace-nowrap gap-x-16"
        animate={{
          x: ["0%", "-50%"], // Move half the width (the first set of locations)
        }}
        transition={{
          duration: 30, // Adjust speed here (higher = slower)
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {tickerItems.map((city, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 group cursor-default"
          >
            <Globe className="w-4 h-4 text-blue-600/40 group-hover:text-blue-600 transition-colors" />
            <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-950 uppercase tracking-[0.4em] transition-colors">
              {city}
            </span>
            {/* Elegant Separator Dot */}
            <div className="ml-16 w-1 h-1 bg-slate-200 rounded-full" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
