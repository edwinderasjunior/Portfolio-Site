import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import StickyScroll from './StickyScrollReveal';
import StaggeredMenu from './StaggeredMenu';

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
  const [aboutData, setAboutData] = useState(null);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    // 1. Fetch about layout fields
    fetch(endpoints.about, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setAboutData(res))
      .catch((err) => err);

    // 2. Fetch shared home navigation assets for the menu items
    fetch(endpoints.home, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setHomeData(res))
      .catch((err) => err);
  }, []);

  if (!aboutData || !homeData) {
    return <FallbackSpinner />;
  }

  const menuItems = homeData.menuItems || [];
  const rawTimeline = aboutData.timeline ? [...aboutData.timeline] : [];

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
    <>
      {/* 🎯 The menu renders right at the top of the About container */}
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

      <div className="section-content-container" id="about">
        <Header title={header} />
        <div style={styles.layoutSpacerBumper} className="global-layout-header-bumper" />
        <Container fluid style={{ padding: 0 }}>
          <Fade>
            <div style={styles.scrollWrapperContainer}>
              <StickyScroll content={scrollContent} />
            </div>
          </Fade>
        </Container>
      </div>
    </>
  );
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
