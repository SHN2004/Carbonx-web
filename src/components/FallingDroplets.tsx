"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type DropletConfig = {
  initialX: number;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
  className?: string;
};

const DROPLETS: DropletConfig[] = [
  { initialX: 40, duration: 6 },
  { initialX: 160, duration: 4, delay: 1.2, className: "h-12" },
  { initialX: 280, duration: 7.5, delay: 0.4 },
  { initialX: 420, duration: 5.5, delay: 0.8, repeatDelay: 2.5, className: "h-16" },
  { initialX: 560, duration: 6.5, delay: 1.6 },
  { initialX: 700, duration: 5.8, delay: 0.2 },
  { initialX: 860, duration: 7.2, delay: 1.1, className: "h-10" },
  { initialX: 1020, duration: 6.1, delay: 0.6 },
  { initialX: 1180, duration: 4.5, delay: 1.8, className: "h-14" },
];

export function FallingDroplets({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {DROPLETS.map((droplet, idx) => (
        <motion.span
          key={`droplet-${idx}`}
          className={cn(
            "absolute top-0 h-20 w-[2px] rounded-full bg-gradient-to-b from-white via-white/70 to-transparent opacity-60",
            droplet.className
          )}
          initial={{ translateY: "-200px", translateX: droplet.initialX }}
          animate={{ translateY: "1400px", translateX: droplet.initialX }}
          transition={{
            duration: droplet.duration ?? 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: droplet.delay ?? 0,
            repeatDelay: droplet.repeatDelay ?? 0,
          }}
        />
      ))}
    </div>
  );
}
