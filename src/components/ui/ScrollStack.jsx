/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useLayoutEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Lenis from 'lenis';
import './ScrollStack.css';

const LenisConstructor = typeof Lenis === 'function' ? Lenis : Lenis.default;

export function ScrollStackItem({ children, itemClassName, ...rest }) {
  return (
    <div className={`scroll-stack-card ${itemClassName}`.trim()} {...rest}>
      {children}
    </div>
  );
}

ScrollStackItem.propTypes = {
  children: PropTypes.node.isRequired,
  itemClassName: PropTypes.string,
};

ScrollStackItem.defaultProps = {
  itemClassName: '',
};

function ScrollStack({
  children,
  className,
  itemDistance,
  itemStackDistance,
  blurAmount,
  useWindowScroll,
  onStackComplete,
}) {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const getScrollContainer = useCallback(() => {
    let parent = scrollerRef.current?.parentElement;
    while (parent) {
      const overflow = window.getComputedStyle(parent).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window;
  }, []);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const getScrollData = useCallback(() => {
    const container = getScrollContainer();
    if (useWindowScroll || container === window || container === document.documentElement) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement,
      };
    }
    return {
      scrollTop: container.scrollTop,
      containerHeight: container.clientHeight,
      scrollContainer: container,
    };
  }, [useWindowScroll, getScrollContainer]);

  const getElementOffset = useCallback(
    (element) => {
      const container = getScrollContainer();
      let offset = 0;
      let current = element;

      const isWindow = useWindowScroll
        || container === window
        || container === document.documentElement;

      const limit = isWindow ? null : container;

      while (current && current !== limit && current !== document.body) {
        offset += current.offsetTop;
        current = current.offsetParent;
      }
      return offset;
    },
    [useWindowScroll, getScrollContainer],
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const card0 = cardsRef.current[0];
    const pinPositionPx = card0 ? getElementOffset(card0) : 0;

    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const pinStart = cardTop - pinPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      let blur = 0;
      if (blurAmount) {
        let depth = 0;
        for (let j = i + 1; j < cardsRef.current.length; j += 1) {
          const jCard = cardsRef.current[j];
          if (jCard) {
            const jCardTop = getElementOffset(jCard);
            const jTriggerEnd = jCardTop - pinPositionPx - itemStackDistance * j;
            const jTriggerStart = jTriggerEnd - 150;
            const jProgress = calculateProgress(scrollTop, jTriggerStart, jTriggerEnd);
            depth += jProgress;
          }
        }
        blur = depth * blurAmount;
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + pinPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + pinPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: 1,
        rotation: 0,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged = !lastTransform
        || Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1
        || Math.abs(lastTransform.scale - newTransform.scale) > 0.001
        || Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1
        || Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) `
          + `scale(${newTransform.scale}) `
          + `rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemStackDistance,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    getScrollData,
    getElementOffset,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    const { portfolioScrollLenis: globalLenis } = window;
    if (globalLenis) {
      globalLenis.on('scroll', handleScroll);
      lenisRef.current = globalLenis;
      return globalLenis;
    }

    const container = getScrollContainer();
    if (useWindowScroll || container === window || container === document.documentElement) {
      const lenis = new LenisConstructor({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - (2 ** (-10 * t))),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenis.on('scroll', handleScroll);

      const raf = (time) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }

    const lenis = new LenisConstructor({
      wrapper: container,
      content: container.querySelector('.scroll-stack-inner') || container,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - (2 ** (-10 * t))),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientationHandler: true,
      normalizeWheel: true,
      wheelMultiplier: 1,
      touchInertiaMultiplier: 35,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertia: 0.6,
    });

    lenis.on('scroll', handleScroll);

    const raf = (time) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    lenisRef.current = lenis;
    return lenis;
  }, [handleScroll, useWindowScroll, getScrollContainer]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card'),
    );

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    setupLenis();

    updateCardTransforms();

    const container = getScrollContainer();
    const handleRawScroll = () => {
      updateCardTransforms();
    };
    if (container && container !== window) {
      container.addEventListener('scroll', handleRawScroll);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        if (window.portfolioScrollLenis && lenisRef.current === window.portfolioScrollLenis) {
          lenisRef.current.off('scroll', handleScroll);
        } else {
          lenisRef.current.destroy();
        }
      }
      if (container && container !== window) {
        container.removeEventListener('scroll', handleRawScroll);
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemStackDistance,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    getScrollContainer,
  ]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}

ScrollStack.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  itemDistance: PropTypes.number,
  itemStackDistance: PropTypes.number,
  blurAmount: PropTypes.number,
  useWindowScroll: PropTypes.bool,
  onStackComplete: PropTypes.func,
};

ScrollStack.defaultProps = {
  className: '',
  itemDistance: 100,
  itemStackDistance: 30,
  blurAmount: 0,
  useWindowScroll: false,
  onStackComplete: undefined,
};

export default ScrollStack;
