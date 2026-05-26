import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BorderGlow.css';

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const parsed = parseHSL(glowColor);
  const base = `${parsed.h}deg ${parsed.s}% ${parsed.l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i += 1) {
    const val = Math.min(opacities[i] * intensity, 100);
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${val}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = [
  '80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%',
];
const GRADIENT_KEYS = [
  '--gradient-one', '--gradient-two', '--gradient-three',
  '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven',
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i += 1) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) { return 1 - ((1 - x) ** 3); }
function easeInCubic(x) { return x * x * x; }

function animateValue({
  start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd,
}) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const BorderGlow = ({
  children,
  className,
  edgeSensitivity,
  glowColor,
  backgroundColor,
  borderRadius,
  glowRadius,
  glowIntensity,
  coneSpread,
  animated,
  colors,
  fillOpacity,
}) => {
  const cardRef = useRef(null);

  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edge = getEdgeProximity(card, x, y);
    const angle = getCursorAngle(card, x, y);

    // 🚀 FIX: This ensures your calculations map correctly to the element environment variables
    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, [getEdgeProximity, getCursorAngle]);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    animateValue({ duration: 500, onUpdate: (v) => card.style.setProperty('--edge-proximity', v) });
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        const delta = (angleEnd - angleStart) * (v / 100) + angleStart;
        card.style.setProperty('--cursor-angle', `${delta}deg`);
      },
    });
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        const delta = (angleEnd - angleStart) * (v / 100) + angleStart;
        card.style.setProperty('--cursor-angle', `${delta}deg`);
      },
    });
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => card.style.setProperty('--edge-proximity', v),
      onEnd: () => card.classList.remove('sweep-active'),
    });
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);
  const gradientVars = buildGradientVars(colors);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...gradientVars,
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  );
};

BorderGlow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  edgeSensitivity: PropTypes.number,
  glowColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
  glowRadius: PropTypes.number,
  glowIntensity: PropTypes.number,
  coneSpread: PropTypes.number,
  animated: PropTypes.bool,
  colors: PropTypes.arrayOf(PropTypes.string),
  fillOpacity: PropTypes.number,
};

BorderGlow.defaultProps = {
  className: '',
  edgeSensitivity: 30,
  glowColor: '40 80 80',
  backgroundColor: '#120F17',
  borderRadius: 28,
  glowRadius: 40,
  glowIntensity: 1.0,
  coneSpread: 25,
  animated: false,
  colors: ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity: 0.5,
};

export default BorderGlow;
