import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const styles = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '4rem',
    borderRadius: '12px',
    padding: '2rem 1.5rem',
    width: '100%',
    maxHeight: '650px', /* 🎯 Restored your layout fix */
    maxWidth: '1400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '2rem',
    backgroundColor: 'transparent',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    boxShadow: 'none',
    flexWrap: 'wrap',
  },
  leftTrack: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    minWidth: '320px',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
  },
  textContainer: {
    width: '100%',
    maxWidth: '650px',
    marginLeft: 'auto',
  },
  cardBlock: {
    paddingTop: '1rem',
    paddingBottom: '19rem',
    textAlign: 'left',
    transition: 'opacity 0.3s ease',
  },
  cardTitle: {
    fontSize: '1.7rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '1rem',
  },
  cardDesc: {
    fontSize: '1.1rem',
    color: '#ffffff',
    lineHeight: '1.65',
  },
  rightWrapper: {
    width: '40%',
    minWidth: '300px',
    position: 'relative',
  },
  rightPane: {
    position: 'sticky',
    top: '30%',
    height: '18rem',
    width: '100%',
    maxWidth: '22rem',
    overflow: 'hidden',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
    transition: 'background 0.5s ease',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

function StickyScroll({
  content,
  contentClassName,
}) {
  const [activeCard, setActiveCard] = useState(0);
  const wrapperRef = useRef(null);

  const { cardBlock, cardTitle, cardDesc } = styles;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -40% 0px',
      threshold: [
        0, 0.1, 0.2, 0.3, 0.4, 0.5,
        0.6, 0.7, 0.8, 0.9, 1.0,
      ],
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const { target, intersectionRatio } = entry;
        const indexAttr = target.getAttribute('data-card-index');
        const idx = parseInt(indexAttr, 10);
        if (!Number.isNaN(idx)) {
          target.jsIntersectionRatio = intersectionRatio;
        }
      });

      const allBlocks = wrapper.querySelectorAll('.sticky-scroll-card-block');
      let highestRatio = -1;
      let mostVisibleIndex = 0;

      allBlocks.forEach((block) => {
        const ratio = block.jsIntersectionRatio || 0;
        if (ratio > highestRatio) {
          highestRatio = ratio;
          const indexAttr = block.getAttribute('data-card-index');
          mostVisibleIndex = parseInt(indexAttr, 10);
        }
      });

      if (!Number.isNaN(mostVisibleIndex) && highestRatio > 0) {
        setActiveCard(mostVisibleIndex);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const targets = wrapper.querySelectorAll('.sticky-scroll-card-block');
    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, [content]);

  if (!content || content.length === 0) return null;

  const linearGradients = [
    'linear-gradient(to bottom right, #475569, #1e293b)',
    'linear-gradient(to bottom right, #6366f1, #312e81)',
    'linear-gradient(to bottom right, #0f766e, #111827)',
  ];

  const safeIndex = activeCard >= 0 && activeCard < content.length ? activeCard : 0;
  const backgroundGradient = linearGradients[safeIndex % linearGradients.length];

  return (
    <div ref={wrapperRef} style={styles.wrapper} className="sticky-scroll-wrapper-container">
      {/* SCROLLING CENTRAL TEXT CONTAINER */}
      <div style={styles.leftTrack}>
        <div style={styles.textContainer}>
          {content.map((item, index) => {
            const cleanTitle = item.title.replace(/\s+/g, '-').toLowerCase();
            const uniqueKey = `scroll-card-std-${index}-${cleanTitle}`;
            const isCurrent = safeIndex === index;
            const isLast = index === content.length - 1;

            const topPadding = index === 0 ? '4rem' : cardBlock.paddingTop;
            const bottomPadding = isLast ? '32rem' : cardBlock.paddingBottom;

            return (
              <div
                key={uniqueKey}
                data-card-index={index}
                className="sticky-scroll-card-block"
                style={{
                  ...cardBlock,
                  paddingTop: topPadding,
                  paddingBottom: bottomPadding,
                  opacity: isCurrent ? 1 : 0.15,
                }}
              >
                <h2 style={cardTitle}>
                  {item.title}
                </h2>
                <p style={cardDesc}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FIXED VISUAL SHOWCASE MODULE */}
      <div style={styles.rightWrapper}>
        <div
          style={{
            ...styles.rightPane,
            background: backgroundGradient,
          }}
          className={contentClassName}
        >
          {content[safeIndex].content ?? null}
        </div>
      </div>
    </div>
  );
}

StickyScroll.propTypes = {
  content: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      content: PropTypes.node,
    }),
  ),
  contentClassName: PropTypes.string,
};

StickyScroll.defaultProps = {
  content: [],
  contentClassName: '',
};

export default StickyScroll;
