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
  { initialX: 80, duration: 6.5, repeatDelay: 5 },
  { initialX: 220, duration: 7.2, delay: 0.2, repeatDelay: 6.5, className: "h-14" },
  { initialX: 360, duration: 6.8, delay: 0.35, repeatDelay: 5.5 },
  { initialX: 520, duration: 7.6, delay: 0.5, repeatDelay: 6.5, className: "h-16" },
  { initialX: 680, duration: 7.1, delay: 0.15, repeatDelay: 5.2 },
  { initialX: 820, duration: 7.8, delay: 0.4, repeatDelay: 6 },
  { initialX: 980, duration: 6.6, delay: 0.05, repeatDelay: 5.3, className: "h-12" },
];

export function FallingDroplets({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
      style={{
        WebkitMaskImage:
          "radial-gradient(circle at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 70%)",
        maskImage:
          "radial-gradient(circle at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 70%)",
      }}
    >
      {DROPLETS.map((droplet, idx) => (
        <motion.span
          key={`droplet-${idx}`}
          className={cn(
            "absolute top-0 h-24 w-[2px] rounded-full bg-gradient-to-b from-white/90 via-white/60 to-transparent opacity-70",
            droplet.className
          )}
          initial={{ translateY: "-500px", translateX: droplet.initialX }}
          animate={{ translateY: "900px", translateX: droplet.initialX }}
          transition={{
            duration: droplet.duration ?? 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: droplet.delay ?? 0,
            repeatDelay: droplet.repeatDelay ?? 3,
          }}
        />
      ))}
    </div>
  );
}
