import React, { useCallback, useContext, useRef } from 'react';
import { ThemeContext } from 'styled-components';
import { SunIcon, MoonIcon } from 'lucide-react';
import { flushSync } from 'react-dom';
import PropTypes from 'prop-types';

function polygonCollapsed(cx, cy, vertexCount) {
  const pairs = Array.from(
    { length: vertexCount },
    () => `${cx}px ${cy}px`,
  ).join(', ');
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant,
  cx,
  cy,
  maxRadius,
  viewportWidth,
  viewportHeight,
) {
  switch (variant) {
    case 'circle':
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
    case 'square': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'triangle': {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        `${cx}px ${cy - scale}px`,
        `${cx + dx}px ${cy + 0.5 * scale}px`,
        `${cx - dx}px ${cy + 0.5 * scale}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
    }
    case 'diamond': {
      const R = maxRadius * Math.SQRT2;
      const end = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'hexagon': {
      const R = maxRadius * Math.SQRT2;
      const verts = [];
      for (let i = 0; i < 6; i += 1) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(', ')})`];
    }
    case 'rectangle': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        `${cx - halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy + halfH}px`,
        `${cx - halfW}px ${cy + halfH}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'star': {
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius) => {
        const verts = [];
        for (let i = 0; i < 5; i += 1) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            `${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`,
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`,
          );
        }
        return `polygon(${verts.join(', ')})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
  }
}

function ThemeToggler({
  toggleTheme,
  iconColor,
  isMobile,
  inactiveColor,
  variant,
  duration,
}) {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.id === 'dark' || themeContext?.name === 'dark' || themeContext?.isDark;

  const shape = variant || 'circle';
  const buttonRef = useRef(null);

  const toggleThemeWithTransition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    const {
      top,
      left,
      width,
      height,
    } = button.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;

    const maxRadius = Math.hypot(
      Math.max(cx, viewportWidth - cx),
      Math.max(cy, viewportHeight - cy),
    );

    const applyTheme = () => {
      toggleTheme();
    };

    if (typeof document.startViewTransition !== 'function') {
      applyTheme();
      return;
    }

    const clipPath = getThemeTransitionClipPaths(
      shape,
      cx,
      cy,
      maxRadius,
      viewportWidth,
      viewportHeight,
    );

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = 'active';
    root.style.setProperty(
      '--magicui-theme-toggle-vt-duration',
      `${duration}ms`,
    );
    root.style.setProperty('--magicui-theme-vt-clip-from', clipPath[0]);

    const cleanup = () => {
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty('--magicui-theme-toggle-vt-duration');
      root.style.removeProperty('--magicui-theme-vt-clip-from');
    };

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });

    if (transition && transition.finished && typeof transition.finished.finally === 'function') {
      transition.finished.finally(cleanup);
    } else {
      cleanup();
    }

    const ready = transition?.ready;
    if (ready && typeof ready.then === 'function') {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration,
            easing: shape === 'star' ? 'linear' : 'ease-in-out',
            fill: 'forwards',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      });
    }
  }, [shape, duration, toggleTheme]);

  const buttonStyle = {
    background: 'transparent',
    border: '1px solid transparent',
    padding: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'none',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
    borderRadius: '50%',
  };

  const iconStyle = {
    width: isMobile ? '12px' : '20px',
    height: isMobile ? '12px' : '20px',
    transition: 'stroke 0.2s ease',
  };

  const strokeColor = inactiveColor || iconColor || themeContext?.navbarTheme?.linkColor || '#ffffff';

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleThemeWithTransition}
      style={buttonStyle}
      aria-label="Toggle light/dark theme"
    >
      {isDark ? (
        <SunIcon style={iconStyle} stroke={strokeColor} />
      ) : (
        <MoonIcon style={iconStyle} stroke={strokeColor} />
      )}
    </button>
  );
}

ThemeToggler.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
  iconColor: PropTypes.string,
  isMobile: PropTypes.bool,
  inactiveColor: PropTypes.string,
  variant: PropTypes.oneOf([
    'circle',
    'square',
    'triangle',
    'diamond',
    'hexagon',
    'rectangle',
    'star',
  ]),
  duration: PropTypes.number,
};

ThemeToggler.defaultProps = {
  iconColor: undefined,
  isMobile: false,
  inactiveColor: undefined,
  variant: 'circle',
  duration: 400,
};

export default ThemeToggler;
