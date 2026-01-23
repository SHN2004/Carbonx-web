'use client';

import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';

type NavItem = { href: string; label: string };

export default function LandingNav() {
  const menuId = useId();
  const [open, setOpen] = useState(false);

  const items: NavItem[] = useMemo(
    () => [
      { href: '#about', label: 'About' },
      { href: '#experience', label: 'Experience' },
      { href: '#tracks', label: 'Tracks' },
      { href: '#faq', label: 'FAQ' },
    ],
    []
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      close();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia?.('(min-width: 768px)');
    if (!media) return;

    const onChange = () => {
      if (media.matches) close();
    };

    onChange();
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, [close]);

  return (
    <>
      <nav className="landing-nav" aria-label="Primary">
        <div className="landing-nav-desktop">
          {items.map((item) => (
            <a key={item.href} className="landing-nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
          <a className="landing-nav-cta" href="#register">
            Register now
          </a>
        </div>

        <div className="landing-nav-mobile">
          <a className="landing-nav-cta" href="#register" onClick={() => close()}>
            Register now
          </a>
          <button
            type="button"
            className="landing-nav-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="landing-nav-toggle-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      <div
        id={menuId}
        className={['landing-mobile-menu', open && 'landing-mobile-menu--open']
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!open}
        onClick={() => close()}
      >
        <div
          className="landing-mobile-menu-panel"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="landing-mobile-menu-top">
            <p className="landing-mobile-menu-title">Navigate</p>
            <button
              type="button"
              className="landing-mobile-menu-close"
              onClick={() => close()}
            >
              <span className="sr-only">Close menu</span>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.3-6.3z"
                />
              </svg>
            </button>
          </div>

          <div className="landing-mobile-menu-links">
            {items.map((item) => (
              <a
                key={item.href}
                className="landing-mobile-menu-link"
                href={item.href}
                onClick={() => close()}
              >
                {item.label}
              </a>
            ))}
            <a className="landing-mobile-menu-link landing-mobile-menu-link-cta" href="#register" onClick={() => close()}>
              Register now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
