import React, { useEffect, useState, useContext } from 'react';
import { Timeline, TimelineItem } from 'vertical-timeline-component-for-react';
import { Container } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import Fade from 'react-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import StaggeredMenu from './StaggeredMenu';
import '../css/experience.css';

const styles = {
  ulStyle: {
    listStylePosition: 'outside',
    paddingLeft: 20,
  },
  subtitleContainerStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  subtitleStyle: {
    display: 'inline-block',
  },
  inlineChild: {
    display: 'inline-block',
  },
  itemStyle: {
    marginBottom: 10,
  },
};

function Experience(props) {
  const theme = useContext(ThemeContext);
  const { header } = props;
  const [experienceData, setExperienceData] = useState(null);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    // 1. Fetch live professional experience history records
    fetch(endpoints.experiences, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setExperienceData(res.experiences))
      .catch((err) => err);

    // 2. Fetch shared landing assets to populate the side navigation elements
    fetch(endpoints.home, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setHomeData(res))
      .catch((err) => err);
  }, []);

  if (!experienceData || !homeData) {
    return <FallbackSpinner />;
  }

  const menuItems = homeData.menuItems || [];

  return (
    <>
      {/* 🎯 Anchors the side navigation drawer at the absolute top of the page */}
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

      <div className="section-content-container">
        <Container>
          <Timeline lineColor={theme.timelineLineColor}>
            {experienceData.map((item) => (
              <Fade key={item.title + item.dateText}>
                <TimelineItem
                  dateText={item.dateText}
                  dateInnerStyle={{ background: theme.accentColor }}
                  style={styles.itemStyle}
                  bodyContainerStyle={{ color: theme.color }}
                >
                  <h2 className="item-title">{item.title}</h2>
                  <div style={styles.subtitleContainerStyle}>
                    <h4
                      style={{
                        ...styles.subtitleStyle,
                        color: theme.accentColor,
                      }}
                    >
                      {item.subtitle}
                    </h4>
                    {item.workType && (
                      <h5 style={styles.inlineChild}>
                        &nbsp;·
                        {' '}
                        {item.workType}
                      </h5>
                    )}
                  </div>
                  <ul style={styles.ulStyle}>
                    {item.workDescription.map((point) => (
                      <div key={point}>
                        <li>
                          <ReactMarkdown
                            children={point}
                            components={{
                              p: 'span',
                            }}
                          />
                        </li>
                        <br />
                      </div>
                    ))}
                  </ul>
                </TimelineItem>
              </Fade>
            ))}
          </Timeline>
        </Container>
      </div>
    </>
  );
}

Experience.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Experience;
