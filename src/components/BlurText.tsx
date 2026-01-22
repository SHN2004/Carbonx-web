'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, type Transition, type Target } from 'framer-motion';

type BlurTextDirection = 'top' | 'bottom' | 'left' | 'right';
type BlurTextAnimateBy = 'words' | 'characters';

export type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: BlurTextAnimateBy;
  direction?: BlurTextDirection;
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
  animationFrom?: Target;
  animationTo?: Target | Target[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
};

const defaultFrom: Target = {
  opacity: 0,
  filter: 'blur(18px)',
  y: 14,
};

const defaultTo: Target = {
  opacity: 1,
  filter: 'blur(0px)',
  y: 0,
};

const directionOffset = (direction: BlurTextDirection) => {
  switch (direction) {
    case 'top':
      return { x: 0, y: -14 };
    case 'bottom':
      return { x: 0, y: 14 };
    case 'left':
      return { x: -10, y: 0 };
    case 'right':
      return { x: 10, y: 0 };
  }
};

const toKeyframes = (from: Target, to: Target | Target[]) => {
  const stages = Array.isArray(to) ? [from, ...to] : [from, to];
  const keys = new Set<string>();
  for (const stage of stages) {
    Object.keys(stage).forEach((k) => keys.add(k));
  }
  const result: Record<string, unknown[]> = {};
  keys.forEach((key) => {
    result[key] = stages.map((s) => (s as Record<string, unknown>)[key]);
  });
  return result;
};

export default function BlurText({
  text,
  className,
  delay = 120,
  animateBy = 'words',
  direction = 'bottom',
  threshold = 0.25,
  rootMargin = '0px 0px -80px 0px',
  stepDuration = 0.5,
  animationFrom,
  animationTo,
  easing,
  onAnimationComplete,
}: BlurTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [observedInView, setObservedInView] = useState(false);
  const isInView = prefersReducedMotion || observedInView;
  const hasAnimatedRef = useRef(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setObservedInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion, rootMargin, threshold]);

  const tokens = useMemo(() => {
    if (animateBy === 'characters') return Array.from(text);
    return text.split(/(\s+)/);
  }, [animateBy, text]);

  const from = useMemo(() => {
    const base = { ...defaultFrom, ...directionOffset(direction), ...(animationFrom ?? {}) };
    return base;
  }, [animationFrom, direction]);

  const to = useMemo(() => {
    const resolved = animationTo ?? defaultTo;
    return resolved;
  }, [animationTo]);

  const animateTarget: Target = useMemo(() => {
    if (prefersReducedMotion) return defaultTo;
    if (Array.isArray(to)) {
      return toKeyframes(from, to) as unknown as Target;
    }
    return to;
  }, [from, prefersReducedMotion, to]);

  const transition: Transition = useMemo(() => {
    const base: Transition = {
      duration: stepDuration,
      ease: easing ?? 'easeOut',
    };
    if (Array.isArray(to)) {
      base.times = to.map((_, idx) => idx / (to.length - 1));
    }
    return base;
  }, [easing, stepDuration, to]);

  return (
    <span
      ref={rootRef}
      className={className}
      style={{ display: 'inline-block' }}
      aria-label={text}
    >
      {tokens.map((token, idx) => {
        const isSpace = token.trim().length === 0;
        const tokenDelay = (delay / 1000) * idx;
        return (
          <motion.span
            key={`${token}-${idx}`}
            aria-hidden
            initial={from}
            animate={isInView ? animateTarget : from}
            transition={{ ...transition, delay: tokenDelay }}
            onAnimationComplete={() => {
              if (idx !== tokens.length - 1) return;
              if (hasAnimatedRef.current) return;
              hasAnimatedRef.current = true;
              onAnimationComplete?.();
            }}
            style={{
              display: isSpace ? 'inline' : 'inline-block',
              whiteSpace: isSpace ? 'pre' : 'normal',
            }}
          >
            {token}
          </motion.span>
        );
      })}
    </span>
  );
}
