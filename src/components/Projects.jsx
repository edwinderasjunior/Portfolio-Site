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
  const [projectData, setProjectData] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    // 1. Fetch main portfolio development projects database records
    fetch(endpoints.projects, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setProjectData(res))
      .catch((err) => err);
  }, []);

  if (!projectData) {
    return <FallbackSpinner />;
  }

  /* 🎯 Cleaned lines 59, 61, and 62 below of any invisible spaces */
  const itemsLimit = showMore && projectData.projects
    ? projectData.projects.length
    : 6;

  return (
    <>
      <Header title={header} />

      {/* 🎯 Cleaned line 83 below of trailing whitespace */}
      <div className="section-content-container">
        <Container style={styles.containerStyle}>
          <Row xs={1} sm={1} md={2} lg={3} className="g-4">
            {projectData.projects?.slice(0, itemsLimit).map((project) => (
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
                const s = e.currentTarget.style;
                s.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                s.borderColor = 'rgba(255, 255, 255, 0.3)';
                s.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const s = e.currentTarget.style;
                s.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                s.borderColor = 'rgba(255, 255, 255, 0.15)';
                s.transform = 'translateY(0px)';
              }}
            >
              show more
            </Button>
          )}
        </Container>
      </div>
    </>
  );
};

Projects.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Projects;
