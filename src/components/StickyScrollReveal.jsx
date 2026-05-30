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
    maxHeight: '550px',
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
    /* 🎯 Frosted Glass Effect: Gives the container its premium lens properties */
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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

  /* 🎯 Translucent Glass Gradients: Allows your portfolio background noise to shine through */
  const glassGradients = [
    'linear-gradient(135deg, rgba(71, 85, 105, 0.2), rgba(30, 41, 59, 0.4))',
    'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(49, 46, 129, 0.45))',
    'linear-gradient(135deg, rgba(15, 118, 110, 0.15), rgba(17, 24, 39, 0.5))',
  ];

  const safeIndex = activeCard >= 0 && activeCard < content.length ? activeCard : 0;
  const backgroundGradient = glassGradients[safeIndex % glassGradients.length];

  return (
    <div ref={wrapperRef} style={styles.wrapper} className="sticky-scroll-wrapper-container">
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
