import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import StickyScroll from './StickyScrollReveal';

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
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.about, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  /* 🎯 Grab your actual live database records first */
  const rawTimeline = data && data.timeline ? [...data.timeline] : [];

  /* 🎯 Force-inject 5 additional structural blocks right after your live text */
  if (data) {
    rawTimeline.push(
      {
        title: 'Future Milestone 01',
        description: 'Placeholder paragraph track. This container block is ready to be swapped out with your next portfolio update later.',
        label: 'Placeholder A',
      },
      {
        title: 'Future Milestone 02',
        description: 'Placeholder paragraph track. This container block is ready to be swapped out with your next portfolio update later.',
        label: 'Placeholder B',
      },
      {
        title: 'Future Milestone 03',
        description: 'Placeholder paragraph track. This container block is ready to be swapped out with your next portfolio update later.',
        label: 'Placeholder C',
      },
      {
        title: 'Future Milestone 04',
        description: 'Placeholder paragraph track. This container block is ready to be swapped out with your next portfolio update later.',
        label: 'Placeholder D',
      },
      {
        title: 'Future Milestone 05',
        description: 'Placeholder paragraph track. This container block is ready to be swapped out with your next portfolio update later.',
        label: 'Placeholder E',
      },
    );
  }

  const scrollContent = rawTimeline.map((item) => ({
    title: item.title,
    description: item.description,
    content: (
      <div className="sticky-pane-inner">
        {item.label}
      </div>
    ),
  }));

  return (
    <div className="section-content-container" id="about">
      <Header title={header} />
      <div style={styles.layoutSpacerBumper} className="global-layout-header-bumper" />
      <Container fluid style={{ padding: 0 }}>
        {data ? (
          <Fade>
            <div style={styles.scrollWrapperContainer}>
              <StickyScroll content={scrollContent} />
            </div>
          </Fade>
        ) : (
          <FallbackSpinner />
        )}
      </Container>
    </div>
  );
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
