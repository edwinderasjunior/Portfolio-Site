import React, { useEffect, useState, useContext } from 'react';
import { Chrono } from 'react-chrono';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import { ThemeContext } from 'styled-components';
import endpoints from '../constants/endpoints';
import Header from './Header';
import FallbackSpinner from './FallbackSpinner';
import '../css/education.css';

function getLayoutConfig(windowWidth) {
  if (windowWidth < 576) {
    return { width: '90vw', mode: 'VERTICAL' };
  }
  if (windowWidth < 768) {
    return { width: '90vw', mode: 'VERTICAL_ALTERNATING' };
  }
  if (windowWidth < 1024) {
    return { width: '75vw', mode: 'VERTICAL_ALTERNATING' };
  }
  return { width: '50vw', mode: 'VERTICAL_ALTERNATING' };
}

function Education({ header }) {
  const theme = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState(
    getLayoutConfig(window?.innerWidth ?? 1024),
  );

  useEffect(() => {
    fetch(endpoints.education, { method: 'GET' })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);

    setLayoutConfig(getLayoutConfig(window?.innerWidth ?? 1024));
  }, []);

  return (
    <>
      <Header title={header} />
      {data ? (
        <Fade>
          <div style={{ width: layoutConfig.width }} className="section-content-container">
            <Container>
              <Chrono
                hideControls
                allowDynamicUpdate
                useReadMore={false}
                items={data.education}
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
                  {data.education.map((education) => (
                    education.icon ? (
                      <img
                        key={education.icon.src}
                        src={education.icon.src}
                        alt={education.icon.alt}
                      />
                    ) : null
                  ))}
                </div>
              </Chrono>
            </Container>
          </div>
        </Fade>
      ) : (
        <FallbackSpinner />
      )}
    </>
  );
}

Education.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Education;
