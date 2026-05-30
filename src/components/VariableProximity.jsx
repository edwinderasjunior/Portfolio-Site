import React, {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './VariableProximity.css';

function useAnimationFrame(callback) {
  useEffect(() => {
    let frameId;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x, y) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius,
    falloff,
    className,
    onClick,
    style,
  } = props;

  const letterRefs = useRef([]);
  const letterCoordsRef = useRef([]);
  const interpolatedSettingsRef = useRef([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef({ x: null, y: null });

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr) => new Map(
      settingsStr
        .split(',')
        .map((s) => s.trim())
        .map((s) => {
          const [name, value] = s.split(' ');
          return [name.replace(/['"]/g, ''), parseFloat(value)];
        }),
    );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  /* 🎯 Fixed: Math calculation statement split cleanly onto multiple lines to pass max-len rule */
  const calculateDistance = (x1, y1, x2, y2) => {
    const deltaX = (x2 - x1) ** 2;
    const deltaY = (y2 - y1) ** 2;
    return Math.sqrt(deltaX + deltaY);
  };

  const calculateFalloff = (distance) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      letterCoordsRef.current = [];
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }
    lastPositionRef.current = { x, y };

    let containerRect = null;

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      // Lazy cache coordinates on first mouse-move or on window resize
      if (!letterCoordsRef.current[index]) {
        if (!containerRect) {
          containerRect = containerRef.current.getBoundingClientRect();
        }
        const rect = letterRef.getBoundingClientRect();
        letterCoordsRef.current[index] = {
          centerX: rect.left + rect.width / 2 - containerRect.left,
          centerY: rect.top + rect.height / 2 - containerRect.top,
        };
      }

      const coords = letterCoordsRef.current[index];
      const distance = calculateDistance(
        x,
        y,
        coords.centerX,
        coords.centerY,
      );

      const el = letterRef;

      if (distance >= radius) {
        el.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      interpolatedSettingsRef.current[index] = newSettings;
      el.style.fontVariationSettings = newSettings;
    });
  });

  const words = label.split(' ');
  let letterCounter = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      role="button"
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      {words.map((word, wordIndex) => {
        const wordKey = `${word}-${wordIndex}`;
        return (
          <span key={wordKey} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word.split('').map((letter) => {
              const currentLetterIndex = letterCounter;
              letterCounter += 1;
              return (
                <motion.span
                  key={currentLetterIndex}
                  ref={(el) => {
                    letterRefs.current[currentLetterIndex] = el;
                  }}
                  style={{
                    display: 'inline-block',
                    fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex],
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
          </span>
        );
      })}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.propTypes = {
  label: PropTypes.string.isRequired,
  fromFontVariationSettings: PropTypes.string.isRequired,
  toFontVariationSettings: PropTypes.string.isRequired,
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  radius: PropTypes.number,
  falloff: PropTypes.oneOf(['linear', 'exponential', 'gaussian']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.shape({}),
};

VariableProximity.defaultProps = {
  radius: 50,
  falloff: 'linear',
  className: '',
  onClick: undefined,
  style: {},
};

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
