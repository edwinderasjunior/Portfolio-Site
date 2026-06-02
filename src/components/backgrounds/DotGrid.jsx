import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

import './DotGrid.css';

gsap.registerPlugin(InertiaPlugin);

const throttle = (func, limit) => {
  let lastCall = 0;
  return function throttled(...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

const DotGrid = ({
  dotSize,
  gap,
  baseColor,
  activeColor,
  proximity,
  speedTrigger,
  shockRadius,
  shockStrength,
  maxSpeed,
  resistance,
  returnDuration,
  className,
  style,
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = (extraX / 2) + (dotSize / 2);
    const startY = (extraY / 2) + (dotSize / 2);

    const dots = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const cx = startX + (x * cell);
        const cy = startY + (y * cell);
        dots.push({
          cx,
          cy,
          xOffset: 0,
          yOffset: 0,
          isInertiaApplied: false,
        });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    let rafId;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;

      dotsRef.current.forEach((dot) => {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = (dx * dx) + (dy * dy);

        let dotStyle = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - (dist / proximity);
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          dotStyle = `rgb(${r},${g},${b})`;
        }

        ctx.beginPath();
        // Native rendering engine context arc completely cleans up vector artifacts
        ctx.arc(ox, oy, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = dotStyle;
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, dotSize]);

  useEffect(() => {
    buildGrid();
    let ro = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      if (wrapperRef.current) ro.observe(wrapperRef.current);
    } else {
      window.addEventListener('resize', buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvasRef.current.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      dotsRef.current.forEach((dot) => {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot.isInertiaApplied) {
          const currentDot = dot;
          currentDot.isInertiaApplied = true;
          gsap.killTweensOf(currentDot);
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
          gsap.to(currentDot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(currentDot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.75)',
              });
              currentDot.isInertiaApplied = false;
            },
          });
        }
      });
    };

    const onClick = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      dotsRef.current.forEach((dot) => {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot.isInertiaApplied) {
          const currentDot = dot;
          currentDot.isInertiaApplied = true;
          gsap.killTweensOf(currentDot);
          const falloff = Math.max(0, 1 - (dist / shockRadius));
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          gsap.to(currentDot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(currentDot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.75)',
              });
              currentDot.isInertiaApplied = false;
            },
          });
        }
      });
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener('mousemove', throttledMove, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
    };
  }, [
    maxSpeed,
    speedTrigger,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
  ]);

  return (
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
};

DotGrid.propTypes = {
  dotSize: PropTypes.number,
  gap: PropTypes.number,
  baseColor: PropTypes.string,
  activeColor: PropTypes.string,
  proximity: PropTypes.number,
  speedTrigger: PropTypes.number,
  shockRadius: PropTypes.number,
  shockStrength: PropTypes.number,
  maxSpeed: PropTypes.number,
  resistance: PropTypes.number,
  returnDuration: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
};

DotGrid.defaultProps = {
  dotSize: 16,
  gap: 32,
  baseColor: '#c0d3e034',
  activeColor: '#13d855',
  proximity: 150,
  speedTrigger: 100,
  shockRadius: 250,
  shockStrength: 5,
  maxSpeed: 5000,
  resistance: 750,
  returnDuration: 1.5,
  className: '',
  style: {},
};

export default DotGrid;
