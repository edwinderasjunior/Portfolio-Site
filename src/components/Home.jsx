import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import Typewriter from 'typewriter-effect';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import TiltedCard from './projects/TiltedCard';

const styles = {
  mainContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextContainer: {
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    display: 'flex',
    textAlign: 'left',
  },
  heroImageContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    minHeight: '420px',
  },
  inlineContainer: {
    position: 'relative',
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: 600,
    height: '2.5rem',
    width: '100%',
  },
  staticPrefix: {
    position: 'absolute',
    left: 0,
    top: 0,
    whiteSpace: 'nowrap',
  },
  typewriterWrapper: {
    color: '#0052CC',
    position: 'absolute',
    left: '70px',
    top: 0,
    whiteSpace: 'nowrap',
  },
};

function Home(props) {
  const { header } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.home, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <>
      <div className="section-content-container" style={styles.mainContainer}>
        <Container>
          {data
            ? (
              <Fade>
                <Row className="align-items-center justify-content-center w-100">
                  <Col style={styles.heroTextContainer} xs={12} md={10} className="offset-md-1">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '15px' }}>
                      {header}
                    </h1>
                    <div style={styles.inlineContainer}>
                      <span style={styles.staticPrefix}>
                        I&apos;m a&nbsp;
                      </span>
                      <span style={styles.typewriterWrapper}>
                        <Typewriter
                          options={{
                            strings: data.roles || [
                              'Developer',
                              'Cybersecurity Analyst',
                              'SOC Analyst',
                              'IT Security Specialist',
                            ],
                            autoStart: true,
                            loop: true,
                            deleteSpeed: 40,
                            delay: 60,
                            wrapperClassName: 'd-inline',
                            cursorClassName: 'd-inline',
                          }}
                        />
                      </span>
                    </div>
                  </Col>
                  <Col style={styles.heroImageContainer} xs={12} md={-3} className="offset-md-1">
                    <TiltedCard
                      imageSrc="/images/avatar.jpg"
                      altText="Edwin E. Deras Jr. Front Profile Pic"
                      captionText="Edwin E. Deras Jr."
                      containerHeight="400px"
                      containerWidth="100%"
                      imageHeight="350px"
                      imageWidth="350px"
                      rotateAmplitude={12}
                      scaleOnHover={1.05}
                      showMobileWarning={false}
                      showTooltip
                      displayOverlayContent={false}
                    />
                  </Col>
                </Row>
              </Fade>
            )
            : <FallbackSpinner />}
        </Container>
      </div>
    </>
  );
}

Home.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Home;
