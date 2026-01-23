'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

import AnimatedContent from './AnimatedContent';
import GlareHover from './GlareHover';

import './TrackCards.css';

export interface TrackCardData {
  title: string;
  description: string;
}

interface TrackCardsProps {
  tracks: TrackCardData[];
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function TrackCards({ tracks }: TrackCardsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [focusRect, setFocusRect] = useState<FocusRect | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const hasActive = activeIndex !== null;

  const updateFocusRect = useCallback(() => {
    const container = containerRef.current;
    if (!container || activeIndex === null) {
      setFocusRect(null);
      return;
    }

    const card = cardRefs.current[activeIndex];
    if (!card) {
      setFocusRect(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    setFocusRect({
      x: cardRect.left - containerRect.left,
      y: cardRect.top - containerRect.top,
      width: cardRect.width,
      height: cardRect.height,
    });
  }, [activeIndex]);

  const rafIdRef = useRef<number | null>(null);
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current) return;
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      updateFocusRect();
    });
  }, [updateFocusRect]);

  useEffect(() => {
    scheduleUpdate();
  }, [scheduleUpdate, activeIndex]);

  useEffect(() => {
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => scheduleUpdate());
      if (containerRef.current) ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate);
      ro?.disconnect();
      if (rafIdRef.current) window.cancelAnimationFrame(rafIdRef.current);
    };
  }, [scheduleUpdate]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current;
      const target = event.target as Node | null;
      if (!container || !target) return;
      if (!container.contains(target)) setActiveIndex(null);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, []);

  const containerClassName = useMemo(
    () => ['landing-tracks', hasActive ? 'landing-tracks--has-active' : ''].filter(Boolean).join(' '),
    [hasActive]
  );

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onMouseLeave={() => setActiveIndex(null)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget as Node | null;
        if (!nextTarget) return;
        if (!containerRef.current?.contains(nextTarget)) setActiveIndex(null);
      }}
    >
      {tracks.map((track, index) => {
        const isActive = index === activeIndex;
        const className = [
          'landing-track',
          hasActive && !isActive ? 'landing-track--unfocused' : '',
          hasActive && isActive ? 'landing-track--focused' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <AnimatedContent key={track.title} distance={24} duration={0.65} delay={0.04}>
            <div
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              tabIndex={0}
              className="landing-track-hitbox"
            >
              <GlareHover glareOpacity={0.1} glareSize={360} className={className}>
                <div>
                  <h3 className="landing-track-title">{track.title}</h3>
                  <p className="landing-track-copy">{track.description}</p>
                </div>
              </GlareHover>
            </div>
          </AnimatedContent>
        );
      })}

      <motion.div
        className="track-focus-frame"
        aria-hidden="true"
        animate={{
          x: focusRect?.x ?? 0,
          y: focusRect?.y ?? 0,
          width: focusRect?.width ?? 0,
          height: focusRect?.height ?? 0,
          opacity: focusRect ? 1 : 0,
        }}
        transition={{ duration: 0.24 }}
      >
        <span className="track-focus-corner track-focus-corner--tl" />
        <span className="track-focus-corner track-focus-corner--tr" />
        <span className="track-focus-corner track-focus-corner--bl" />
        <span className="track-focus-corner track-focus-corner--br" />
      </motion.div>
    </div>
  );
}
