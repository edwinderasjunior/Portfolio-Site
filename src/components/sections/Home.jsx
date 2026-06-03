import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Mail } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import endpoints from '../../constants/endpoints';
import FallbackSpinner from '../ui/FallbackSpinner';
import GlassSurface from '../ui/GlassSurface';
import { Dock, DockIcon } from '../ui/Dock';
import { DiaTextReveal } from '../ui/DiaTextReveal';
import AppContext from '../../AppContext';

const styles = {
  mainContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
  },
  heroTextContainer: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
  },
  subtitleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    width: '100%',
  },
  staticPrefix: {
    fontSize: '1.8rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    color: 'rgba(255, 255, 255, 0.65)',
    margin: 0,
    lineHeight: '100%',
  },
  socialLinkItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    color: '#ffffff',
    transition: 'background-color 0.2s ease, '
      + 'border-color 0.2s ease, '
      + 'transform 0.2s ease',
  },
  iconVector: {
    width: '26px',
    height: '26px',
  },
};

/* 🎯 Dictionary lookup map matching strings from JSON to true graphic vectors */
const iconLookupTable = {
  linkedin: FaLinkedin,
  github: FaGithub,
  email: Mail,
};

function Home() {
  const [data, setData] = useState(null);
  const { darkMode } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch(endpoints.home, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data) {
    return <FallbackSpinner />;
  }

  const isDark = darkMode?.value;
  const revealPhrases = data.phrases || [];
  const socialData = data.socials || [];

  const activeColors = isDark
    ? ['#e0afa0', '#bcb8b1', '#f4f3ee', '#8a817c'] // light warm gray & peach tones for dark bg
    : ['#463f3a', '#8a817c', '#e0afa0', '#2d2725']; // dark warm gray & peach tones for light bg

  return (
    <>
      <div className="section-content-container" id="home" style={styles.mainContainer}>
        <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Row className="align-items-center justify-content-center w-100 m-0">
            <Col
              style={{
                ...styles.heroTextContainer,
                maxWidth: '100%',
              }}
              xs={12}
              md={12}
              className="p-0"
            >
              <div className="hero-avatar-wrapper">
                <div className="avatar-ripple ripple-1" />
                <div className="avatar-ripple ripple-2" />
                <div className="avatar-ripple ripple-3" />
                <Link
                  to="/about"
                  style={{
                    display: 'inline-flex',
                    textDecoration: 'none',
                    borderRadius: '50%',
                  }}
                >
                  <div className="hero-avatar-container">
                    <img
                      src="/images/avatar.webp"
                      alt={data.name || 'Edwin Deras'}
                      className="hero-avatar"
                    />
                  </div>
                </Link>
              </div>
              <h1
                className="hero-title"
                style={{
                  color: isDark ? '#ffffff' : '#121212',
                }}
              >
                {data.name}
              </h1>

              <div style={styles.subtitleRow}>
                <span
                  style={{
                    ...styles.staticPrefix,
                    color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
                  }}
                  className="hero-static-prefix"
                >
                  {data.prefix}
                </span>
                <DiaTextReveal
                  repeat
                  fixedWidth={false}
                  duration={1.8}
                  repeatDelay={1.4}
                  text={revealPhrases}
                  colors={activeColors}
                  textColor={isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
                  className="hero-dia-subtitle"
                />
              </div>
            </Col>
          </Row>
        </Container>

        <Dock
          className="bg-transparent"
          style={{
            background: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '12px' : '20px',
            overflow: 'visible',
            padding: 0,
          }}
        >
          {socialData.map((social, index) => {
            /* 🎯 Pull matching vector fallback component from vector map */
            const IconComponent = iconLookupTable[social.id] || Mail;
            const sizeVal = isMobile ? 50 : 60;

            return (
              <div
                key={social.id}
                className={`dock-tooltip-wrapper social-float-button-${index % 3}`}
                style={{ animationDelay: `${index * 0.4}s` }}
              >
                <GlassSurface
                  width={sizeVal}
                  height={sizeVal}
                  borderRadius={sizeVal / 2}
                  borderWidth={0.12}
                  brightness={isDark ? 65 : 88}
                  opacity={0.88}
                  blur={12}
                  backgroundOpacity={0.02}
                  style={{
                    overflow: 'visible',
                    border: isDark
                      ? '1px solid rgba(255, 255, 255, 0.12)'
                      : '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: isDark
                      ? '0 8px 24px 0 rgba(0, 0, 0, 0.25)'
                      : '0 8px 24px 0 rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <DockIcon
                    style={{
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      width: isMobile ? '38px' : '48px',
                      height: isMobile ? '38px' : '48px',
                    }}
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...styles.socialLinkItem,
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                      aria-label={social.label}
                      onMouseEnter={(e) => {
                        const s = e.currentTarget.style;
                        s.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)';
                        s.border = isDark ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(0, 0, 0, 0.12)';
                        s.backdropFilter = 'blur(8px)';
                      }}
                      onMouseLeave={(e) => {
                        const s = e.currentTarget.style;
                        s.backgroundColor = 'transparent';
                        s.border = '1px solid transparent';
                        s.backdropFilter = 'none';
                      }}
                    >
                      <IconComponent
                        style={{
                          ...styles.iconVector,
                          width: isMobile ? '20px' : '26px',
                          height: isMobile ? '20px' : '26px',
                        }}
                      />
                    </a>
                  </DockIcon>
                </GlassSurface>
                <div className="dock-tooltip-content">{social.label}</div>
              </div>
            );
          })}
        </Dock>
      </div>
    </>
  );
}

export default Home;
