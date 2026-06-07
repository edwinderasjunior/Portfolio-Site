import React, { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import { ThemeContext } from 'styled-components';
import Header from '../ui/Header';
import endpoints from '../../constants/endpoints';
import FallbackSpinner from '../ui/FallbackSpinner';
import ScrollStack, { ScrollStackItem } from '../ui/ScrollStack';

const styles = {
  layoutSpacerBumper: {
    height: '120px',
    width: '100%',
    display: 'block',
    clear: 'both',
  },
  scrollWrapperContainer: {
    width: '100%',
    position: 'relative',
    display: 'block',
    marginTop: '2rem',
  },
};

function About(props) {
  const { header } = props;
  const [aboutData, setAboutData] = useState(null);
  const theme = useContext(ThemeContext);
  const isDark = theme?.bsPrimaryVariant === 'dark';

  useEffect(() => {
    // 1. Fetch about layout fields
    fetch(endpoints.about, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setAboutData(res))
      .catch((err) => err);
  }, []);

  if (!aboutData) {
    return <FallbackSpinner />;
  }

  const rawTimeline = aboutData.timeline ? [...aboutData.timeline] : [];

  const getCardStyle = (index, total) => {
    const t = total > 1 ? index / (total - 1) : 0;

    let r;
    let g;
    let b;
    let a;
    let borderR;
    let borderG;
    let borderB;
    let borderA;

    if (isDark && t <= 0.5) {
      // Dark Mode, First Half:
      // Dark Brown (45, 38, 36, 0.85) -> Light Brown (115, 95, 85, 0.78)
      const factor = t / 0.5;
      r = Math.round(45 + factor * (115 - 45));
      g = Math.round(38 + factor * (95 - 38));
      b = Math.round(36 + factor * (85 - 36));
      a = (0.85 + factor * (0.78 - 0.85)).toFixed(2);

      borderR = Math.round(115 + factor * (165 - 115));
      borderG = Math.round(95 + factor * (135 - 95));
      borderB = Math.round(85 + factor * (120 - 85));
      borderA = (0.2 + factor * (0.25 - 0.2)).toFixed(2);
    } else if (isDark) {
      // Dark Mode, Second Half:
      // Light Brown (115, 95, 85, 0.78) -> Orange (224, 175, 160, 0.75)
      const factor = (t - 0.5) / 0.5;
      r = Math.round(115 + factor * (224 - 115));
      g = Math.round(95 + factor * (175 - 95));
      b = Math.round(85 + factor * (160 - 85));
      a = (0.78 + factor * (0.75 - 0.78)).toFixed(2);

      borderR = Math.round(165 + factor * (224 - 165));
      borderG = Math.round(135 + factor * (175 - 135));
      borderB = Math.round(120 + factor * (160 - 120));
      borderA = (0.25 + factor * (0.4 - 0.25)).toFixed(2);
    } else if (t <= 0.5) {
      // Light Mode, First Half:
      // Darker Brown (120, 105, 95, 0.35) -> Light Brown (180, 160, 150, 0.30)
      const factor = t / 0.5;
      r = Math.round(120 + factor * (180 - 120));
      g = Math.round(105 + factor * (160 - 105));
      b = Math.round(95 + factor * (150 - 95));
      a = (0.35 + factor * (0.3 - 0.35)).toFixed(2);

      borderR = Math.round(120 + factor * (180 - 120));
      borderG = Math.round(105 + factor * (160 - 105));
      borderB = Math.round(95 + factor * (150 - 95));
      borderA = (0.2 + factor * (0.25 - 0.2)).toFixed(2);
    } else {
      // Light Mode, Second Half:
      // Light Brown (180, 160, 150, 0.30) -> Orange (224, 175, 160, 0.35)
      const factor = (t - 0.5) / 0.5;
      r = Math.round(180 + factor * (224 - 180));
      g = Math.round(160 + factor * (175 - 160));
      b = Math.round(150 + factor * (160 - 150));
      a = (0.3 + factor * (0.35 - 0.3)).toFixed(2);

      borderR = Math.round(180 + factor * (224 - 180));
      borderG = Math.round(160 + factor * (175 - 160));
      borderB = Math.round(150 + factor * (160 - 150));
      borderA = (0.25 + factor * (0.35 - 0.25)).toFixed(2);
    }

    return {
      background: `rgba(${r}, ${g}, ${b}, ${a})`,
      border: `1px solid rgba(${borderR}, ${borderG}, ${borderB}, ${borderA})`,
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
    };
  };

  const stickyHeaderStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    paddingTop: '122px',
    paddingBottom: '16px',
    background: 'transparent',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
  };

  return (
    <>
      <div className="section-content-container" id="about">
        <div style={stickyHeaderStyle}>
          <Header title={header} />
        </div>
        <div style={{ height: '90px' }} className="global-layout-header-bumper" />
        <Container fluid style={{ padding: 0 }}>
          <Fade>
            <div style={styles.scrollWrapperContainer}>
              <ScrollStack
                itemDistance={580}
                itemStackDistance={30}
                blurAmount={0}
              >
                {rawTimeline.map((item, index) => {
                  const cleanTitle = item.title.replace(/\s+/g, '-').toLowerCase();
                  const uniqueKey = `scroll-card-std-${index}-${cleanTitle}`;
                  return (
                    <ScrollStackItem
                      key={uniqueKey}
                      style={getCardStyle(index, rawTimeline.length)}
                    >
                      <div className="scroll-stack-card-content">
                        <div className="scroll-stack-card-text">
                          <h3 style={{ color: theme?.color || (isDark ? '#ffffff' : '#0f172a') }}>
                            {item.title}
                          </h3>
                          <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15, 23, 42, 0.75)' }}>
                            {item.description}
                          </p>
                        </div>
                        <div className="scroll-stack-card-image">
                          <img
                            src={item.imageUrl || '/images/placeholder.jpg'}
                            alt={item.title}
                          />
                        </div>
                      </div>
                    </ScrollStackItem>
                  );
                })}
              </ScrollStack>
            </div>
          </Fade>
        </Container>

      </div>
    </>
  );
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
