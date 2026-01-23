'use client';

import React, { useEffect, useMemo, useState } from 'react';

import BlurText from './BlurText';
import DecryptedText from './DecryptedText';

const useIsDesktop = (minWidth = 768) => {
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

  return isDesktop;
};

export default function HeroIntro() {
  const isDesktop = useIsDesktop(768);

  return (
    <>
      {isDesktop ? (
        <BlurText
          text="Innovation beyond boundaries"
          className="landing-kicker"
          animateBy="words"
          delay={90}
          direction="bottom"
          threshold={0.4}
        />
      ) : (
        <span className="landing-kicker">Innovation beyond boundaries</span>
      )}

      <h1 className="landing-title">
        {isDesktop ? (
          <BlurText
            text="CARBONX"
            className="landing-title-carbonx"
            animateBy="characters"
            delay={30}
            direction="bottom"
            threshold={0.6}
          />
        ) : (
          <span className="landing-title-carbonx" aria-label="CarbonX">
            CARBONX
          </span>
        )}{' '}
        <span className="landing-title-year">
          {isDesktop ? (
            <BlurText
              text="2026"
              animateBy="characters"
              delay={45}
              direction="bottom"
              threshold={0.6}
            />
          ) : (
            <span aria-label="2026">2026</span>
          )}
        </span>
      </h1>

      <div className="landing-prize" aria-label="Prize pool">
        <DecryptedText
          text="₹1,00,000"
          className="landing-prize-value"
          durationMs={1200}
          speedMs={30}
          chars="0123456789"
          ghostOpacity={1}
          animateOnView
          threshold={0.75}
        />
        <span className="landing-prize-label">Prize pool</span>
      </div>
    </>
  );
}
