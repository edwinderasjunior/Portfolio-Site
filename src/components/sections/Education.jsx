import React, { useEffect, useState, useContext } from 'react';
import { Chrono } from 'react-chrono';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import { ThemeContext } from 'styled-components';
import endpoints from '../../constants/endpoints';
import Header from '../ui/Header';
import FallbackSpinner from '../ui/FallbackSpinner';
import '../../css/education.css';

function getLayoutConfig(windowWidth) {
  if (windowWidth < 768) {
    return { width: '90vw', mode: 'VERTICAL' };
  }
  if (windowWidth < 1024) {
    return { width: '75vw', mode: 'VERTICAL_ALTERNATING' };
  }
  return { width: '50vw', mode: 'VERTICAL_ALTERNATING' };
}

function Education({ header }) {
  const theme = useContext(ThemeContext);
  const [educationData, setEducationData] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState(
    getLayoutConfig(window?.innerWidth ?? 1024),
  );

  useEffect(() => {
    // 1. Fetch education path entries
    fetch(endpoints.education, { method: 'GET' })
      .then((res) => res.json())
      .then((res) => setEducationData(res))
      .catch((err) => err);

    const handleResize = () => {
      setLayoutConfig(getLayoutConfig(window?.innerWidth ?? 1024));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!educationData) {
    return <FallbackSpinner />;
  }

  return (
    <>
      <Fade>
        <div style={{ width: layoutConfig.width }} className="section-content-container">
          <Header title={header} />
          <Container>
            <Chrono
              key={layoutConfig.mode}
              hideControls
              allowDynamicUpdate
              useReadMore={false}
              items={educationData.education}
              cardHeight={250}
              mode={layoutConfig.mode}
              theme={{
                primary: theme.accentColor,
                secondary: theme.accentColor,
                cardBgColor: theme.chronoTheme.cardBgColor,
                cardForeColor: theme.chronoTheme.cardForeColor,
                titleColor: theme.chronoTheme.titleColor,
              }}
            >
              <div className="chrono-icons">
                {/* 🎯 Linter-Fix: Renamed block parameter to 'edu' to maintain clean scopes */}
                {educationData.education.map((edu) => (
                  edu.icon ? (
                    <img
                      key={edu.icon.src}
                      src={edu.icon.src}
                      alt={edu.icon.alt}
                    />
                  ) : null
                ))}
              </div>
            </Chrono>
          </Container>
        </div>
      </Fade>
    </>
  );
}

Education.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Education;
