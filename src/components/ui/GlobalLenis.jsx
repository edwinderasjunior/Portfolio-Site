/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

const LenisConstructor = typeof Lenis === 'function' ? Lenis : Lenis.default;

export default function GlobalLenis() {
  const location = useLocation();
  const elementRef = useRef(null);

  useEffect(() => {
    // Climb up to find the scrollable container (the contentContainerStyle div)
    let container = elementRef.current?.parentElement;
    while (container) {
      const overflow = window.getComputedStyle(container).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') {
        break;
      }
      container = container.parentElement;
    }

    if (!container) return undefined;

    const isExcludedRoute = location.pathname === '/exploregame'
      || location.pathname === '/view-pdf';

    if (isExcludedRoute) {
      if (window.portfolioScrollLenis) {
        window.portfolioScrollLenis.destroy();
        window.portfolioScrollLenis = null;
      }
      return undefined;
    }

    const { portfolioScrollLenis } = window;
    let activeLenis = portfolioScrollLenis;
    let rafId;

    if (!activeLenis) {
      activeLenis = new LenisConstructor({
        wrapper: container,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - (2 ** (-10 * t))),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      window.portfolioScrollLenis = activeLenis;

      const raf = (time) => {
        activeLenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    return () => {
      const nextPath = window.location.pathname;
      const nextIsExcluded = nextPath === '/exploregame'
        || nextPath === '/view-pdf';

      if (nextIsExcluded || !document.contains(elementRef.current)) {
        if (window.portfolioScrollLenis) {
          window.portfolioScrollLenis.destroy();
          window.portfolioScrollLenis = null;
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      }
    };
  }, [location.pathname]);

  return <div ref={elementRef} style={{ display: 'none' }} />;
}
