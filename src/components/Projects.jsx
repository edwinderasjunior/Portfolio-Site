import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import Header from './Header';
import endpoints from '../constants/endpoints';
import ProjectCard from './projects/ProjectCard';
import FallbackSpinner from './FallbackSpinner';

const styles = {
  containerStyle: {
    marginBottom: 25,
  },
  showMoreStyle: {
    margin: 25,
  },
  customButtonStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '10px 24px',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
};

const Projects = (props) => {
  const { header } = props;
  const [data, setData] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetch(endpoints.projects, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const numberOfItems = showMore && data ? data.length : 6;

  return (
    <>
      <Header title={header} />
      {data ? (
        <div className="section-content-container">
          <Container style={styles.containerStyle}>
            <Row xs={1} sm={1} md={2} lg={3} className="g-4">
              {data.projects?.slice(0, numberOfItems).map((project) => (
                <Fade key={project.title}>
                  <ProjectCard project={project} />
                </Fade>
              ))}
            </Row>

            {!showMore && (
              <Button
                style={{ ...styles.showMoreStyle, ...styles.customButtonStyle }}
                onClick={() => setShowMore(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0px)';
                }}
              >
                show more
              </Button>
            )}
          </Container>
        </div>
      ) : (
        <FallbackSpinner />
      )}
    </>
  );
};

Projects.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Projects;
