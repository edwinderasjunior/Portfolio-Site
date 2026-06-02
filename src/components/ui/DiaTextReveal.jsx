import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';

const DEFAULT_COLORS = ['#c679c4', '#fa3d1d', '#ffb005', '#e1e1fe', '#0358f7'];
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;

function buildGradient(pos, colors, textColor) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }
  const n = colors.length;
  const parts = [];

  if (bandStart > 0) {
    parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);
  }

  colors.forEach((c, i) => {
    const pct = n === 1 ? pos : bandStart + (i / (n - 1)) * BAND_HALF * 2;
    parts.push(`${c} ${pct.toFixed(2)}%`);
  });

  if (bandEnd < 100) {
    /* 🎯 Fixed Line 35: Standardized on strict single quotes across fallback tokens */
    parts.push(`transparent ${bandEnd.toFixed(2)}%`, 'transparent 100%');
  }

  return `linear-gradient(90deg, ${parts.join(', ')})`;
}

function measureWidths(el, texts) {
  const ghost = el.cloneNode();
  Object.assign(ghost.style, {
    position: 'absolute',
    visibility: 'hidden',
    pointerEvents: 'none',
    width: 'auto',
    whiteSpace: 'nowrap',
  });
  el.parentElement.appendChild(ghost);
  const widths = texts.map((t) => {
    ghost.textContent = t;
    return ghost.getBoundingClientRect().width;
  });
  ghost.remove();
  return widths;
}

export const DiaTextReveal = ({
  text = '',
  colors = DEFAULT_COLORS,
  textColor = 'rgba(255, 255, 255, 0.65)',
  duration = 1.5,
  delay = 0,
  repeat = false,
  repeatDelay = 0.5,
  className = '',
  fixedWidth = false,
}) => {
  const texts = Array.isArray(text) ? text : [text];
  const isMulti = texts.length > 1;

  const spanRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState([]);
  const [gradientStr, setGradientStr] = useState('');

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const animObjRef = useRef({ pos: SWEEP_START });
  const timerRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || !isMulti) return;
    setMeasuredWidths(measureWidths(el, texts));
  }, [text, isMulti, texts]);

  const playSweep = useCallback(() => {
    if (tweenRef.current) tweenRef.current.kill();
    animObjRef.current.pos = SWEEP_START;

    tweenRef.current = gsap.to(animObjRef.current, {
      pos: SWEEP_END,
      duration,
      delay,
      ease: 'power2.inOut',
      onUpdate: () => {
        setGradientStr(buildGradient(animObjRef.current.pos, colors, textColor));
      },
      onComplete: () => {
        if (!repeat) return;
        timerRef.current = setTimeout(() => {
          const next = (activeIndexRef.current + 1) % texts.length;
          setActiveIndex(next);
          playSweep();
        }, repeatDelay * 1000);
      },
    });
  }, [colors, textColor, duration, delay, repeat, repeatDelay, texts.length]);

  useEffect(() => {
    playSweep();
    return () => {
      if (tweenRef.current) tweenRef.current.kill();
      clearTimeout(timerRef.current);
    };
  }, [playSweep]);

  const fixedW = isMulti && fixedWidth && measuredWidths.length > 0
    ? Math.max(...measuredWidths)
    : undefined;

  const animatedW = isMulti && !fixedWidth && measuredWidths[activeIndex] != null
    ? measuredWidths[activeIndex]
    : undefined;

  const currentWidth = fixedW ?? animatedW;

  return (
    <span
      ref={spanRef}
      className={`dia-text-reveal-span ${className}`}
      style={{
        display: isMulti ? 'inline-block' : 'inline',
        overflow: isMulti ? 'hidden' : 'visible',
        whiteSpace: isMulti ? 'nowrap' : 'normal',
        backgroundImage: gradientStr || buildGradient(SWEEP_START, colors, textColor),
        ...(currentWidth !== undefined && { width: currentWidth }),
      }}
    >
      {texts[activeIndex]}
    </span>
  );
};

DiaTextReveal.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
  textColor: PropTypes.string,
  duration: PropTypes.number,
  delay: PropTypes.number,
  repeat: PropTypes.bool,
  repeatDelay: PropTypes.number,
  className: PropTypes.string,
  fixedWidth: PropTypes.bool,
};

DiaTextReveal.defaultProps = {
  colors: DEFAULT_COLORS,
  textColor: 'rgba(255, 255, 255, 0.65)',
  duration: 1.5,
  delay: 0,
  repeat: false,
  repeatDelay: 0.5,
  className: '',
  fixedWidth: false,
};

export default DiaTextReveal;
