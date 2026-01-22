'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import './DecryptedText.css';

export type DecryptedTextProps = {
  text: string;
  className?: string;
  speedMs?: number;
  durationMs?: number;
  chars?: string;
  animateOnView?: boolean;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

const defaultChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+?@';

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
};

const isFixedChar = (char: string) => /\s/.test(char);

const randomChar = (chars: string) => chars[Math.floor(Math.random() * chars.length)] ?? '';

export default function DecryptedText({
  text,
  className,
  speedMs = 24,
  durationMs,
  chars = defaultChars,
  animateOnView = true,
  threshold = 0.5,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: DecryptedTextProps) {
  const reducedMotion = prefersReducedMotion();
  const [observedInView, setObservedInView] = useState(false);
  const isActive = reducedMotion || !animateOnView || observedInView;
  const [output, setOutput] = useState(text);
  const hasPlayedRef = useRef(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  const letters = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    if (!animateOnView) return;
    if (reducedMotion) return;
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        if (once && hasPlayedRef.current) return;
        setObservedInView(true);
        if (once) {
          hasPlayedRef.current = true;
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOnView, once, reducedMotion, rootMargin, threshold]);

  useEffect(() => {
    if (!isActive) return;
    if (reducedMotion) return;

    const start = performance.now();
    const duration = durationMs ?? Math.max(900, letters.length * 55);
    let raf: number;
    let lastTick = 0;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);

      if (now - lastTick < speedMs) return;
      lastTick = now;

      const t = Math.min(1, (now - start) / duration);
      const revealedCount = Math.floor(t * letters.length);

      setOutput(
        letters
          .map((char, idx) => {
            if (isFixedChar(char)) return char;
            if (idx <= revealedCount) return char;
            if (/[.,:;+\-–—/₹]/.test(char)) return char;
            return randomChar(chars);
          })
          .join('')
      );

      if (t >= 1) {
        cancelAnimationFrame(raf);
        setOutput(text);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [chars, durationMs, isActive, letters, reducedMotion, speedMs, text]);

  const isGhosting = isActive && output !== text;

  return (
    <span
      ref={rootRef}
      className={['decrypted-text', isGhosting && 'decrypted-text__ghost', className]
        .filter(Boolean)
        .join(' ')}
      aria-label={text}
    >
      {output}
    </span>
  );
}
