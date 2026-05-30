import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import { Container } from 'react-bootstrap';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import { LogoLoop } from './LogoLoop';
import StaggeredMenu from './StaggeredMenu';

const styles = {
  introTextContainer: {
    whiteSpace: 'pre-wrap',
    marginBottom: '2rem',
  },
  skillRowTitle: {
    fontWeight: 600,
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  loopContainerWrapper: {
    maxWidth: '600px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    overflow: 'hidden',
  },
  skillItemWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 10px',
  },
  skillTextLabel: {
    marginTop: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#ffffff',
  },
};

function Skills(props) {
  const { header } = props;
  const [skillsData, setSkillsData] = useState(null);
  const [homeData, setHomeData] = useState(null);

  const renderSkillsIntro = (intro) => (
    <h4 style={styles.introTextContainer}>
      <ReactMarkdown children={intro} />
    </h4>
  );

  useEffect(() => {
    // 1. Fetch skills profile data payload
    fetch(endpoints.skills, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setSkillsData(res))
      .catch((err) => err);

    // 2. Fetch shared home layout configuration to populate the menu
    fetch(endpoints.home, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setHomeData(res))
      .catch((err) => err);
  }, []);

  if (!skillsData || !homeData) {
    return <FallbackSpinner />;
  }

  const menuItems = homeData.menuItems || [];

  return (
    <>
      {/* 🎯 Draw the unified navigation panel right at the head of the file layout */}
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

      <Header title={header} />
      <Fade>
        <div
          className="section-content-container"
          style={{ background: 'transparent', backgroundColor: 'transparent' }}
        >
          <Container style={{ background: 'transparent', backgroundColor: 'transparent' }}>
            {renderSkillsIntro(skillsData.intro)}

            {skillsData.skills?.map((category, index) => (
              <div key={category.title}>
                <h3 style={styles.skillRowTitle}>{category.title}</h3>

                <div style={styles.loopContainerWrapper}>
                  <LogoLoop
                    speed={50}
                    direction={index % 2 === 0 ? 'left' : 'right'}
                    logoHeight={75}
                    gap={50}
                    hoverSpeed={0}
                    fadeOut
                  >
                    {category.items.map((item) => (
                      <div key={item.title} style={styles.skillItemWrapper}>
                        <img
                          src={item.icon}
                          alt={item.title}
                          style={{
                            height: '75px',
                            width: '75px',
                            objectFit: 'contain',
                          }}
                        />
                        <p style={styles.skillTextLabel}>{item.title}</p>
                      </div>
                    ))}
                  </LogoLoop>
                </div>
              </div>
            ))}
          </Container>
        </div>
      </Fade>
    </>
  );
}

Skills.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Skills;
