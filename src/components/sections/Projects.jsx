import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import Header from '../ui/Header';
import endpoints from '../../constants/endpoints';
import ProjectCard from '../projects/ProjectCard';
import FallbackSpinner from '../ui/FallbackSpinner';
import AppContext from '../../AppContext';

const styles = {
  containerStyle: {
    marginBottom: 25,
  },
  showMoreStyle: {
    margin: 25,
  },
};

const Projects = (props) => {
  const { header } = props;
  const [projectData, setProjectData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const { darkMode } = useContext(AppContext);

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

  const isDark = darkMode?.value;

  const customButtonStyle = {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    color: isDark ? '#ffffff' : '#000000',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.12)',
    padding: '10px 24px',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  };

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
              style={{ ...styles.showMoreStyle, ...customButtonStyle }}
              onClick={() => setShowMore(true)}
              onMouseEnter={(e) => {
                const s = e.currentTarget.style;
                s.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
                s.borderColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';
                s.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const s = e.currentTarget.style;
                s.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
                s.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
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
