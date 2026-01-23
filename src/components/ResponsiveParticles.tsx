'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Particles from './Particles';

type ParticlesProps = React.ComponentProps<typeof Particles>;

export type ResponsiveParticlesProps = ParticlesProps & {
  minWidth?: number;
  desktop?: Partial<ParticlesProps>;
};

export default function ResponsiveParticles({
  minWidth = 768,
  desktop,
  ...props
}: ResponsiveParticlesProps) {
  const query = useMemo(() => `(min-width: ${minWidth}px)`, [minWidth]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;

    const initialTimer = window.setTimeout(() => setIsDesktop(media.matches), 0);
    const update = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    media.addEventListener?.('change', update);
    return () => {
      window.clearTimeout(initialTimer);
      media.removeEventListener?.('change', update);
    };
  }, [query]);

  if (!isDesktop) return null;
  const resolved = { ...props, ...(desktop ?? {}) };
  return <Particles {...resolved} />;
}
