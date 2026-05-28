import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { Mail } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import GlassSurface from './GlassSurface';
import { Dock, DockIcon } from './Dock';
import { StaggeredMenu } from './StaggeredMenu';
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

function Home() {
  const menuItems = [
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
  ];

  const socialData = [
    {
      id: 'linkedin',
      icon: FaLinkedin,
      href: 'https://www.linkedin.com/in/edwinderasjr/',
      label: 'LinkedIn',
    },
    {
      id: 'github',
      icon: FaGithub,
      href: 'https://www.github.com/edwinderasjunior',
      label: 'GitHub',
    },
    {
      id: 'email',
      icon: Mail,
      href: 'mailto:me@edwinjr.com',
      label: 'Email',
    },
  ];

  const revealPhrases = [
    'computer science.',
    'cybersecurity.',
    'ethical hacking.',
    'technology.',
    'building computers.',
    'learning new things.',
    'solving problems.',
    'tinking with hardware.',
    'coding.',
  ];

  /* ==========================================================================
     🎨 COLOR PALETTE PRESETS (Uncomment the one you want to use)
     ========================================================================== */

  // 1. Deep Cyber (Electric Indigo, Vivid Violet, Slate White Glint, Digital Blue)
  const activeColors = ['#6366f1', '#a855f7', '#e2e8f0', '#3b82f6'];

  // 2. Monochrome Ice (Deep Slate, Metallic Silver, Pure White Shine, Liquid Aluminum)
  // const activeColors = ['#475569', '#94a3b8', '#ffffff', '#cbd5e1'];

  // 3. Aurora Glow (Neon Cyan, Matrix Emerald, Sage Mint Glow, Electric Blue)
  // const activeColors = ['#06b6d4', '#10b981', '#6ee7b7', '#3b82f6'];

  // 4. Sunset Gold (Vibrant Crimson, Bright Pink, Liquid Amber Gold, Deep Neon Rose)
  // const activeColors = ['#f43f5e', '#ec4899', '#f59e0b', '#ff007f'];

  return (
    <>
      <StaggeredMenu
        isFixed
        position="right"
        items={menuItems}
        socialItems={[]}
        displaySocials={false}
        displayItemNumbering
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen
        colors={['rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.01)']}
        accentColor="#fff"
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
                Edwin Deras Jr.
              </h1>

              <div style={styles.subtitleRow}>
                <span style={styles.staticPrefix} className="hero-static-prefix">
                  I love
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
            const IconComponent = social.icon;

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
                    style={{ background: 'transparent', backgroundColor: 'transparent' }}
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
