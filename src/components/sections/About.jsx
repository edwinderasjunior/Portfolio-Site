import React, { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import { ThemeContext } from 'styled-components';
import Header from '../ui/Header';
import endpoints from '../../constants/endpoints';
import FallbackSpinner from '../ui/FallbackSpinner';
import ScrollStack, { ScrollStackItem } from '../ui/ScrollStack';
import ShinyText from '../ui/ShinyText';

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
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!aboutData) {
    return <FallbackSpinner />;
  }

  const rawTimeline = aboutData.timeline ? [...aboutData.timeline] : [];

  const cardStyle = {
    background: isDark
      ? 'linear-gradient(135deg, rgba(61, 53, 50, 0.65), rgba(38, 34, 32, 0.85))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.15))',
    border: isDark
      ? '1px solid rgba(224, 175, 160, 0.15)'
      : '1px solid rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
  };

  let headerBg = 'transparent';
  if (isScrolled) {
    headerBg = theme?.background
      ? `${theme.background}a6`
      : 'rgba(29, 27, 26, 0.65)';
  }

  const stickyHeaderStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    paddingTop: '122px',
    paddingBottom: '16px',
    background: headerBg,
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
    transition: 'background-color 0.3s ease, '
      + 'backdrop-filter 0.3s ease, '
      + '-webkit-backdrop-filter 0.3s ease',
  };

  const scrollIndicatorStyle = {
    position: 'fixed',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 90,
    opacity: isScrolled ? 0 : 1,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
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
                itemStackDistance={0}
                blurAmount={15}
              >
                {rawTimeline.map((item, index) => {
                  const cleanTitle = item.title.replace(/\s+/g, '-').toLowerCase();
                  const uniqueKey = `scroll-card-std-${index}-${cleanTitle}`;
                  return (
                    <ScrollStackItem key={uniqueKey} style={cardStyle}>
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

        {/* Floating Scroll Indicator */}
        <div style={scrollIndicatorStyle}>
          <ShinyText
            text="Scroll to reveal more..."
            speed={2.5}
            color={isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)'}
            shineColor={isDark ? '#ffffff' : '#000000'}
            className="scroll-indicator-shiny"
          />
        </div>
      </div>
    </>
  );
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
