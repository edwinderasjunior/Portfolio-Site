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

  /* 🎯 Simply pull the full timeline array right from your updated JSON database */
  const rawTimeline = data && data.timeline ? [...data.timeline] : [];

  const scrollContent = rawTimeline.map((item) => ({
    title: item.title,
    description: item.description,
    content: (
      <img
        src={item.imageUrl || '/images/placeholder.jpg'}
        alt={item.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
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
