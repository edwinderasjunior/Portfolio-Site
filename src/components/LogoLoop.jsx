import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
    display: 'flex',
    padding: '15px 0',
  },
  fadeMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 2,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 15%, '
      + 'rgba(255,255,255,0) 85%, transparent 100%)',
  },
};

export function LogoLoop({
  children,
  speed,
  direction,
  gap,
  hoverSpeed,
  fadeOut,
}) {
  const childrenArray = React.Children.toArray(children);

  // If a row has very few items, duplicate them internally to pad out the width
  const renderItems = () => {
    if (childrenArray.length < 5) {
      return (
        <>
          {childrenArray}
          {childrenArray}
          {childrenArray}
        </>
      );
    }
    return childrenArray;
  };

  const baseDuration = 15;
  // Calculate duration using the actual layout length so speed stays consistent
  const totalLength = childrenArray.length < 5 ? childrenArray.length * 3 : childrenArray.length;
  const duration = `${(totalLength * baseDuration) / (speed / 10)}s`;
  const animationDirection = direction === 'right' ? 'reverse' : 'normal';

  return (
    <div style={styles.container}>
      {fadeOut && <div style={styles.fadeMask} />}

      <style>
        {`
          @keyframes marqueeInfiniteLoop {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .marquee-wrapper {
            display: flex;
            width: max-content;
            animation: marqueeInfiniteLoop ${duration} linear infinite;
            animation-direction: ${animationDirection};
          }
          .marquee-group {
            display: flex;
            gap: ${gap}px;
            padding-right: ${gap}px;
            flex-shrink: 0;
          }
          .marquee-wrapper:hover {
            animation-play-state: ${hoverSpeed === 0 ? 'paused' : 'running'};
          }
        `}
      </style>

      <div className="marquee-wrapper">
        <div className="marquee-group">
          {renderItems()}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {renderItems()}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {renderItems()}
        </div>
      </div>
    </div>
  );
}

LogoLoop.propTypes = {
  children: PropTypes.node.isRequired,
  speed: PropTypes.number,
  direction: PropTypes.string,
  gap: PropTypes.number,
  hoverSpeed: PropTypes.number,
  fadeOut: PropTypes.bool,
};

LogoLoop.defaultProps = {
  speed: 50,
  direction: 'left',
  gap: 40,
  hoverSpeed: 0,
  fadeOut: false,
};

export default LogoLoop;
