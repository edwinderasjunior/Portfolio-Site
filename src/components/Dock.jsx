/* eslint-disable object-curly-newline */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

export function DockIcon({ children, mouseX, isHovered, onMouseEnter, onMouseLeave }) {
  const boundsRef = useRef(null);

  let scaleFactor = 1;
  if (mouseX !== null && boundsRef.current) {
    const rect = boundsRef.current.getBoundingClientRect();
    const iconCenter = rect.left + (rect.width / 2);
    const distance = Math.abs(mouseX - iconCenter);

    if (distance < 150) {
      scaleFactor = 1 + (((150 - distance) / 150) * 0.35);
    }
  }

  const baseStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: mouseX === null ? 'transform 0.2s ease, width 0.2s ease, height 0.2s ease' : 'none',
    transform: `scale(${scaleFactor}) ${isHovered ? 'translateY(-4px)' : 'translateY(0)'}`,
    cursor: 'pointer',
  };

  return (
    <div
      ref={boundsRef}
      style={baseStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

DockIcon.propTypes = {
  children: PropTypes.node.isRequired,
  mouseX: PropTypes.number,
  isHovered: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};

DockIcon.defaultProps = {
  mouseX: null,
  isHovered: false,
};

export function Dock({ children }) {
  const [mouseX, setMouseX] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const trackStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '9999px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.24)',
    height: '64px',
    boxSizing: 'border-box',
  };

  const handleMouseMove = (e) => {
    setMouseX(e.clientX);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
    setHoveredIndex(null);
  };

  return (
    <div
      style={trackStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="toolbar"
      aria-label="Application Dock"
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === DockIcon) {
          return React.cloneElement(child, {
            mouseX,
            isHovered: hoveredIndex === index,
            onMouseEnter: () => setHoveredIndex(index),
            onMouseLeave: () => setHoveredIndex(null),
          });
        }
        return child;
      })}
    </div>
  );
}

Dock.propTypes = {
  children: PropTypes.node.isRequired,
};
