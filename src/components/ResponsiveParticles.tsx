'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Particles from './Particles';

export type ResponsiveParticlesProps = React.ComponentProps<typeof Particles> & {
  minWidth?: number;
};

export default function ResponsiveParticles({ minWidth = 768, ...props }: ResponsiveParticlesProps) {
  const query = useMemo(() => `(min-width: ${minWidth}px)`, [minWidth]);
  const [enabled, setEnabled] = useState(() => {
    const media = window.matchMedia?.(query);
    return media ? media.matches : true;
  });

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;

    const update = (event: MediaQueryListEvent) => setEnabled(event.matches);

    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, [query]);

  if (!enabled) return null;
  return <Particles {...props} />;
}
