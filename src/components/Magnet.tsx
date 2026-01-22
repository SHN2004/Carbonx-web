'use client';

import React, { useMemo, useRef } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

export type MagnetProps = {
  children: React.ReactNode;
  className?: string;
  magnitude?: number;
  maxDistance?: number;
  damping?: number;
  stiffness?: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const isTouchDevice = () => {
  if (typeof window === 'undefined') return true;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export default function Magnet({
  children,
  className,
  magnitude = 0.25,
  maxDistance = 140,
  damping = 20,
  stiffness = 150,
}: MagnetProps) {
  const prefersReducedMotion = useReducedMotion();
  const disabled = prefersReducedMotion || isTouchDevice();

  const xSpring = useSpring(0, { damping, stiffness, mass: 0.3 });
  const ySpring = useSpring(0, { damping, stiffness, mass: 0.3 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointerInsideRef = useRef(false);

  const maxDistanceSq = useMemo(() => maxDistance * maxDistance, [maxDistance]);

  const update = (clientX: number, clientY: number) => {
    const node = wrapperRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq > maxDistanceSq) {
      xSpring.set(0);
      ySpring.set(0);
      return;
    }

    const distance = Math.sqrt(distanceSq);
    const falloff = 1 - clamp(distance / maxDistance, 0, 1);
    const strength = magnitude * falloff;

    xSpring.set(dx * strength);
    ySpring.set(dy * strength);
  };

  return (
    <motion.div
      ref={wrapperRef}
      className={className}
      style={{
        display: 'inline-flex',
        willChange: 'transform',
        x: disabled ? 0 : xSpring,
        y: disabled ? 0 : ySpring,
      }}
      onPointerEnter={(e) => {
        if (disabled) return;
        pointerInsideRef.current = true;
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (disabled) return;
        if (!pointerInsideRef.current) return;
        update(e.clientX, e.clientY);
      }}
      onPointerLeave={() => {
        pointerInsideRef.current = false;
        xSpring.set(0);
        ySpring.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
