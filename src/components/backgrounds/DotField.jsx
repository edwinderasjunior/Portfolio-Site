import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const TWO_PI = Math.PI * 2;

const DotField = ({
  dotRadius,
  dotSpacing,
  cursorRadius,
  cursorForce,
  bulgeOnly,
  bulgeStrength,
  glowRadius,
  glowColor,
  sparkle,
  waveAmplitude,
  gradientFrom,
  gradientTo,
  style,
  className,
  paused,
}) => {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const circleRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    vx: 0,
    vy: 0,
    prevX: -9999,
    prevY: -9999,
    speed: 0,
  });
  const requestRef = useRef(null);
  const boundsRef = useRef({
    w: 0,
    h: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const glowOpacityRef = useRef(0);
  const targetGlowOpacityRef = useRef(0);
  const propsRef = useRef({});
  const resizeTriggerRef = useRef(null);

  // Keep props updated in ref to avoid re-triggering the main useEffect on every prop change
  propsRef.current = {
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    glowRadius,
    glowColor,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
    paused,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const circle = circleRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let resizeTimeout;

    function initDots(w, h) {
      const currentProps = propsRef.current;
      const spacing = currentProps.dotRadius + currentProps.dotSpacing;
      const cols = Math.floor(w / spacing);
      const rows = Math.floor(h / spacing);
      const startX = (w % spacing) / 2;
      const startY = (h % spacing) / 2;
      const count = rows * cols;
      const dots = new Array(count);

      let index = 0;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = startX + c * spacing + spacing / 2;
          const y = startY + r * spacing + spacing / 2;
          dots[index] = {
            ax: x, // anchor x
            ay: y, // anchor y
            sx: x, // current x
            sy: y, // current y
            vx: 0, // velocity x
            vy: 0, // velocity y
            x,
            y,
          };
          index += 1;
        }
      }
      dotsRef.current = dots;
    }

    function resize() {
      const parentRect = canvas.parentElement.getBoundingClientRect();
      const w = parentRect.width;
      const h = parentRect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      boundsRef.current = {
        w,
        h,
        offsetX: parentRect.left + window.scrollX,
        offsetY: parentRect.top + window.scrollY,
      };
      initDots(w, h);
    }

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    }

    function handleMouseMove(e) {
      if (e.target.closest('.ln-navbar')) return;
      const bounds = boundsRef.current;
      const targetX = e.pageX - bounds.offsetX;
      const targetY = e.pageY - bounds.offsetY;
      mouseRef.current.targetX = targetX;
      mouseRef.current.targetY = targetY;

      if (mouseRef.current.x < -9000) {
        mouseRef.current.x = targetX;
        mouseRef.current.y = targetY;
        mouseRef.current.prevX = targetX;
        mouseRef.current.prevY = targetY;
      }
    }

    function updateMouseSpeed() {
      const mouse = mouseRef.current;
      const dx = mouse.prevX - mouse.x;
      const dy = mouse.prevY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouse.speed += (dist - mouse.speed) * 0.5;
      if (mouse.speed < 0.001) mouse.speed = 0;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    }

    const mouseSpeedInterval = setInterval(updateMouseSpeed, 20);
    let frameCount = 0;

    function renderLoop() {
      if (propsRef.current.paused) {
        requestRef.current = requestAnimationFrame(renderLoop);
        return;
      }
      frameCount += 1;
      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      const { w, h } = boundsRef.current;
      const currentProps = propsRef.current;
      const count = dots.length;

      if (mouse.targetX > -9000) {
        const stiffness = 400;
        const damping = 45;
        const mass = 1;
        const dt = 0.016;

        const ax = (stiffness * (mouse.targetX - mouse.x) - damping * mouse.vx) / mass;
        const ay = (stiffness * (mouse.targetY - mouse.y) - damping * mouse.vy) / mass;

        mouse.vx += ax * dt;
        mouse.vy += ay * dt;
        mouse.x += mouse.vx * dt;
        mouse.y += mouse.vy * dt;
      }

      const timeScale = frameCount * 0.02;
      const normalizedSpeed = Math.min(mouse.speed / 5, 1);

      targetGlowOpacityRef.current += (normalizedSpeed - targetGlowOpacityRef.current) * 0.06;
      if (targetGlowOpacityRef.current < 0.001) targetGlowOpacityRef.current = 0;

      const targetOpacity = targetGlowOpacityRef.current;
      glowOpacityRef.current += (targetOpacity - glowOpacityRef.current) * 0.08;

      if (circle) {
        circle.setAttribute('cx', mouse.x);
        circle.setAttribute('cy', mouse.y);
        circle.style.opacity = glowOpacityRef.current;
      }

      ctx.clearRect(0, 0, w, h);

      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, currentProps.gradientFrom);
      gradient.addColorStop(1, currentProps.gradientTo);
      ctx.fillStyle = gradient;

      const cursorRadiusSq = currentProps.cursorRadius * currentProps.cursorRadius;
      const halfRadius = currentProps.dotRadius / 2;
      const isBulgeOnly = currentProps.bulgeOnly;

      ctx.beginPath();

      for (let i = 0; i < count; i += 1) {
        const dot = dots[i];
        if (dot) {
          const dx = mouse.x - dot.ax;
          const dy = mouse.y - dot.ay;
          const distSq = dx * dx + dy * dy;

          if (distSq < cursorRadiusSq && targetOpacity > 0.01) {
            const dist = Math.sqrt(distSq);
            if (isBulgeOnly) {
              const force = 1 - dist / currentProps.cursorRadius;
              const strength = force * force * currentProps.bulgeStrength * targetOpacity;
              const angle = Math.atan2(dy, dx);
              dot.sx += (dot.ax - Math.cos(angle) * strength - dot.sx) * 0.15;
              dot.sy += (dot.ay - Math.sin(angle) * strength - dot.sy) * 0.15;
            } else {
              const angle = Math.atan2(dy, dx);
              const force = (500 / dist) * (mouse.speed * currentProps.cursorForce);
              dot.vx += Math.cos(angle) * -force;
              dot.vy += Math.sin(angle) * -force;
            }
          } else if (isBulgeOnly) {
            dot.sx += (dot.ax - dot.sx) * 0.1;
            dot.sy += (dot.ay - dot.sy) * 0.1;
          }

          if (!isBulgeOnly) {
            dot.vx *= 0.9;
            dot.vy *= 0.9;
            dot.x = dot.ax + dot.vx;
            dot.y = dot.ay + dot.vy;
            dot.sx += (dot.x - dot.sx) * 0.1;
            dot.sy += (dot.y - dot.sy) * 0.1;
          }

          let drawX = dot.sx;
          let drawY = dot.sy;

          if (currentProps.waveAmplitude > 0) {
            drawY += Math.sin(dot.ax * 0.03 + timeScale) * currentProps.waveAmplitude;
            drawX += Math.cos(dot.ay * 0.03 + timeScale * 0.7) * currentProps.waveAmplitude * 0.5;
          }

          // Sparkle rendering
          /* eslint-disable-next-line no-bitwise */
          if (currentProps.sparkle && (((i * 2654435761) ^ (frameCount >> 3)) >>> 0) % 100 < 3) {
            ctx.moveTo(drawX + halfRadius * 1.8, drawY);
            ctx.arc(drawX, drawY, halfRadius * 1.8, 0, TWO_PI);
          } else {
            ctx.moveTo(drawX + halfRadius, drawY);
            ctx.arc(drawX, drawY, halfRadius, 0, TWO_PI);
          }
        }
      }

      ctx.fill();
      requestRef.current = requestAnimationFrame(renderLoop);
    }

    resize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    requestRef.current = requestAnimationFrame(renderLoop);

    resizeTriggerRef.current = () => {
      const { w, h } = boundsRef.current;
      if (w > 0 && h > 0) {
        initDots(w, h);
      }
    };

    return () => {
      cancelAnimationFrame(requestRef.current);
      clearInterval(mouseSpeedInterval);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (resizeTriggerRef.current) {
      resizeTriggerRef.current();
    }
  }, [dotRadius, dotSpacing]);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <radialGradient id="dot-field-glow">
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle
          ref={circleRef}
          cx="-9999"
          cy="-9999"
          r={glowRadius}
          fill="url(#dot-field-glow)"
          style={{
            opacity: 0,
            willChange: 'opacity',
          }}
        />
      </svg>
    </div>
  );
};

DotField.propTypes = {
  dotRadius: PropTypes.number,
  dotSpacing: PropTypes.number,
  cursorRadius: PropTypes.number,
  cursorForce: PropTypes.number,
  bulgeOnly: PropTypes.bool,
  bulgeStrength: PropTypes.number,
  glowRadius: PropTypes.number,
  glowColor: PropTypes.string,
  sparkle: PropTypes.bool,
  waveAmplitude: PropTypes.number,
  gradientFrom: PropTypes.string,
  gradientTo: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  className: PropTypes.string,
  paused: PropTypes.bool,
};

DotField.defaultProps = {
  dotRadius: 1.5,
  dotSpacing: 14,
  cursorRadius: 500,
  cursorForce: 0.1,
  bulgeOnly: true,
  bulgeStrength: 67,
  glowRadius: 160,
  glowColor: '#120F17',
  sparkle: false,
  waveAmplitude: 0,
  gradientFrom: 'rgba(168, 85, 247, 0.35)',
  gradientTo: 'rgba(180, 151, 207, 0.25)',
  style: {},
  className: '',
  paused: false,
};

export default DotField;
