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

const styles = {
  mainContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px', // Increased gap for a more balanced layout with larger elements
  },
  heroTextContainer: {
    textAlign: 'center',
  },
  socialLinkItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    color: '#ffffff',
    transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
  },
  /* 1. UPGRADED ICON SIZE: Bumped from 20px to 26px to look crisp inside the larger bubbles */
  iconVector: {
    width: '26px',
    height: '26px',
  },
};

function Home() {
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

  return (
    <>
      <div className="section-content-container" style={styles.mainContainer}>
        <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Row className="align-items-center justify-content-center w-100 m-0">
            <Col
              style={{
                ...styles.heroTextContainer,
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              xs={12}
              md={12}
              className="p-0"
            >
              <h1
                style={{
                  /* 2. UPGRADED TEXT SIZE: Increased from 3rem to 3.8rem */
                  fontSize: '3.8rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  margin: 0,
                }}
              >
                Edwin Deras Jr.
              </h1>
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
            gap: '20px', // Slightly wider spacing between larger bubbles
            overflow: 'visible',
            padding: 0,
          }}
        >
          {socialData.map((social) => {
            const IconComponent = social.icon;

            return (
              <div key={social.id} className="dock-tooltip-wrapper">
                {/* 3. UPGRADED BUBBLE SIZE: Bumped from 48x48 (radius 24) to 60x60 (radius 30) */}
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
