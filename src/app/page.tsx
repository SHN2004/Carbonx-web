"use client";

import { useCallback, type CSSProperties, useEffect, useState } from "react";

import PillNav from "@/components/PillNav";
import Squares from "@/components/Squares";
import { FallingDroplets } from "@/components/FallingDroplets";
import TargetCursor from "@/components/TargetCursor";

const stats = [
  { label: "Hours of building", value: "36" },
  { label: "Total prizes", value: "$10k" },
  { label: "Builders", value: "300+" },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Tracks", href: "#tracks" },
  { label: "Schedule", href: "#schedule" },
  { label: "FAQs", href: "#faqs" },
];

const EVENT_DATE = new Date("2026-02-01T15:00:00Z");

function useCountdown(targetDate: Date) {
  const calculateTimeLeft = useCallback(() => {
    const total = targetDate.getTime() - Date.now();
    const safeTotal = Math.max(total, 0);
    return {
      days: Math.floor(safeTotal / (1000 * 60 * 60 * 24)),
      hours: Math.floor((safeTotal / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((safeTotal / (1000 * 60)) % 60),
      seconds: Math.floor((safeTotal / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}

export default function Home() {
  const timeLeft = useCountdown(EVENT_DATE);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn />
      <Squares
        className="absolute inset-0 h-full w-full"
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#fff"
        hoverFillColor="#222"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/75 to-black" aria-hidden />
      <FallingDroplets className="z-10" />

      <div className="relative z-20 flex w-full justify-center cursor-target">
        <PillNav
          logo="/croppped-carbox-logo-black.svg"
          logoAlt="CarbonX logo"
          items={navItems}
          activeHref="/"
          ease="power2.easeOut"
          baseColor="#ffffff"
          pillColor="#060010"
          hoveredPillTextColor="#060010"
          pillTextColor="#ffffff"
        />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-24 text-center sm:gap-12 sm:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.6em] text-zinc-300">
          CarbonX Hackathon
        </p>
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold uppercase tracking-[0.3em] sm:text-5xl">
            Starts in
          </h1>
          <div className="grid grid-flow-col gap-6 text-center text-white/90 auto-cols-max">
            {[
              { label: "days", value: timeLeft.days },
              { label: "hours", value: timeLeft.hours },
              { label: "minutes", value: timeLeft.minutes },
              { label: "seconds", value: timeLeft.seconds },
            ].map((segment) => (
              <div key={segment.label} className="flex flex-col items-center gap-2">
                <span className="countdown font-mono text-5xl">
                  <span
                    style={
                      {
                        "--value": segment.value,
                        "--digits": segment.label === "seconds" ? 2 : undefined,
                      } as CSSProperties
                    }
                    aria-live="polite"
                    aria-label={`${segment.value} ${segment.label}`}
                  >
                    {segment.value.toString().padStart(segment.label === "seconds" ? 2 : 1, "0")}
                  </span>
                </span>
                <span className="text-sm uppercase tracking-[0.3em] text-zinc-400">{segment.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            className="cursor-target rounded-full bg-white/90 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-white"
            href="#register"
          >
            Register interest
          </a>
          <a
            className="cursor-target rounded-full border border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:text-white"
            href="#about"
          >
            View tracks
          </a>
        </div>

        <dl className="grid w-full gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="cursor-target space-y-1 rounded-xl bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.3em] text-zinc-400">{stat.label}</dt>
              <dd className="text-3xl font-semibold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
