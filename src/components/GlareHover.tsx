'use client';

import React, { useMemo, useRef } from 'react';

import './GlareHover.css';

export interface GlareHoverProps {
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const toRgba = (hexColor: string, alpha: number) => {
  const hex = hexColor.replace('#', '').trim();
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hexColor;
};

const isTouchDevice = () => {
  if (typeof window === 'undefined') return true;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export default function GlareHover({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.12,
  glareAngle = -45,
  glareSize = 260,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style,
  disabled = false,
}: GlareHoverProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const isDisabled = disabled || reducedMotion || isTouchDevice();

  const cssVars = useMemo(
    () =>
      ({
        ['--gh-angle' as string]: `${glareAngle}deg`,
        ['--gh-size' as string]: `${glareSize}%`,
        ['--gh-glare' as string]: toRgba(glareColor, glareOpacity),
      }) as React.CSSProperties,
    [glareAngle, glareColor, glareOpacity, glareSize]
  );

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.backgroundPosition = '-100% -100%, 0 0';
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '100% 100%, 0 0';
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    if (playOnce) {
      el.style.transition = 'none';
      el.style.backgroundPosition = '-100% -100%, 0 0';
      return;
    }
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '-100% -100%, 0 0';
  };

  return (
    <div
      className={['glare-hover', className].filter(Boolean).join(' ')}
      style={{ ...cssVars, ...style }}
      onMouseEnter={isDisabled ? undefined : animateIn}
      onMouseLeave={isDisabled ? undefined : animateOut}
      onFocus={isDisabled ? undefined : animateIn}
      onBlur={isDisabled ? undefined : animateOut}
    >
      <div ref={overlayRef} className="glare-hover__overlay" aria-hidden="true" />
      {children}
    </div>
  );
}

