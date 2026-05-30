import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Mail } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import GlassSurface from './GlassSurface';
import { Dock, DockIcon } from './Dock';
import StaggeredMenu from './StaggeredMenu';
import { DiaTextReveal } from './DiaTextReveal';

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

  useEffect(() => {
    fetch(endpoints.home, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  if (!data) {
    return <FallbackSpinner />;
  }

  const menuItems = data.menuItems || [];
  const revealPhrases = data.phrases || [];
  const socialData = data.socials || [];

  const activeColors = ['#6366f1', '#a855f7', '#e2e8f0', '#3b82f6'];

  return (
    <>
      <StaggeredMenu
        isFixed
        position="left"
        items={menuItems}
        socialItems={[]}
        displaySocials={false}
        displayItemNumbering
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)']}
        accentColor="#ffffff"
      />

      <div className="section-content-container" style={styles.mainContainer}>
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
              <h1
                style={{
                  fontSize: '3.8rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  letterSpacing: '-1px',
                  margin: 0,
                }}
              >
                {data.name}
              </h1>

              <div style={styles.subtitleRow}>
                <span style={styles.staticPrefix} className="hero-static-prefix">
                  {data.prefix}
                </span>
                <DiaTextReveal
                  repeat
                  fixedWidth={false}
                  duration={1.8}
                  repeatDelay={1.4}
                  text={revealPhrases}
                  colors={activeColors}
                  textColor="rgba(255, 255, 255, 0.7)"
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
            gap: '20px',
            overflow: 'visible',
            padding: 0,
          }}
        >
          {socialData.map((social) => {
            /* 🎯 Pull matching vector fallback component from vector map */
            const IconComponent = iconLookupTable[social.id] || Mail;

            return (
              <div key={social.id} className="dock-tooltip-wrapper">
                <GlassSurface
                  width={60}
                  height={60}
                  borderRadius={30}
                  borderWidth={0.12}
                  brightness={65}
                  opacity={0.88}
                  blur={12}
                  backgroundOpacity={0.02}
                  style={{
                    overflow: 'visible',
                    boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <DockIcon
                    style={{
                      background: 'transparent',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.socialLinkItem}
                      aria-label={social.label}
                      onMouseEnter={(e) => {
                        const s = e.currentTarget.style;
                        s.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                        s.border = '1px solid rgba(255, 255, 255, 0.25)';
                        s.backdropFilter = 'blur(8px)';
                      }}
                      onMouseLeave={(e) => {
                        const s = e.currentTarget.style;
                        s.backgroundColor = 'transparent';
                        s.border = '1px solid transparent';
                        s.backdropFilter = 'none';
                      }}
                    >
                      <IconComponent style={styles.iconVector} />
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
