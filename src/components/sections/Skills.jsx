import React, { useEffect, useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import { Container } from 'react-bootstrap';
import { ThemeContext } from 'styled-components';
import {
  SiJavascript,
  SiPython,
  SiMysql,
  SiCplusplus,
  SiAndroid,
  SiReact,
  SiNodedotjs,
  SiAndroidstudio,
  SiGit,
  SiDocker,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import Header from '../ui/Header';
import endpoints from '../../constants/endpoints';
import FallbackSpinner from '../ui/FallbackSpinner';
import { LogoLoop } from '../ui/LogoLoop';

const iconMap = {
  java: FaJava,
  javascript: SiJavascript,
  js: SiJavascript,
  python: SiPython,
  mysql: SiMysql,
  'c++': SiCplusplus,
  android: SiAndroid,
  react: SiReact,
  nodejs: SiNodedotjs,
  'node.js': SiNodedotjs,
  'android studio': SiAndroidstudio,
  git: SiGit,
  docker: SiDocker,
};

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
  const theme = useContext(ThemeContext);

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
  }, []);

  if (!skillsData) {
    return <FallbackSpinner />;
  }

  const isDark = theme?.bsPrimaryVariant === 'dark';
  const iconColor = isDark ? '#ffffff' : '#000000';

  return (
    <>
      <Fade>
        <div
          className="section-content-container"
          style={{ background: 'transparent', backgroundColor: 'transparent' }}
        >
          <Header title={header} />
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
                    {category.items.map((item) => {
                      const IconComponent = iconMap[item.title.toLowerCase()];
                      return (
                        <div key={item.title} style={styles.skillItemWrapper}>
                          {IconComponent ? (
                            <IconComponent
                              size={75}
                              color={iconColor}
                              style={{
                                transition: 'color 0.3s ease',
                              }}
                            />
                          ) : (
                            <img
                              src={item.icon}
                              alt={item.title}
                              style={{
                                height: '75px',
                                width: '75px',
                                objectFit: 'contain',
                              }}
                            />
                          )}
                          <p
                            style={{
                              ...styles.skillTextLabel,
                              color: theme?.color || '#ffffff',
                            }}
                          >
                            {item.title}
                          </p>
                        </div>
                      );
                    })}
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
