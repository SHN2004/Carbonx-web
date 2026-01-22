'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Particles from './Particles';

type ParticlesProps = React.ComponentProps<typeof Particles>;

export type ResponsiveParticlesProps = ParticlesProps & {
  minWidth?: number;
  desktop?: Partial<ParticlesProps>;
  mobile?: Partial<ParticlesProps>;
};

export default function ResponsiveParticles({
  minWidth = 768,
  desktop,
  mobile,
  ...props
}: ResponsiveParticlesProps) {
  const query = useMemo(() => `(min-width: ${minWidth}px)`, [minWidth]);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    const media = window.matchMedia?.(query);
    return media ? media.matches : true;
  });

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;

    const update = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, [query]);

  const resolved = isDesktop ? { ...props, ...(desktop ?? {}) } : { ...props, ...(mobile ?? {}) };
  return <Particles {...resolved} />;
}
