import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import BorderGlow from './BorderGlow';

const styles = {
  cardTitleStyle: {
    fontSize: 24,
    fontWeight: 700,
    marginTop: '0.5rem',
  },
  cardTextStyle: {
    textAlign: 'left',
  },
};

const ProjectCard = (props) => {
  const theme = useContext(ThemeContext);
  const parseBodyText = (text) => <ReactMarkdown children={text} />;
  const { project } = props;

  return (
    <Col style={{ paddingBottom: '25px' }}>
      <BorderGlow
        edgeSensitivity={44}
        glowColor="220 90% 50%"
        backgroundColor={theme.cardBackground}
        borderRadius={12}
        glowRadius={54}
        glowIntensity={2.6}
        coneSpread={35}
        animated={false}
        colors={['#0A192F', '#1B365D', '#0052CC']}
      >
        {project?.image && (
          <img
            src={project.image}
            alt={project.title}
            className="card-project-img"
          />
        )}
        <div className="card-project-body">
          <h3 style={{ ...styles.cardTitleStyle, color: theme.color }}>
            {project.title}
          </h3>
          <div style={{ ...styles.cardTextStyle, color: theme.bsSecondaryVariant }}>
            {parseBodyText(project.bodyText)}
          </div>
          {project.links && (
            <div className="card-project-links">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary"
                  style={{ marginRight: '8px', marginTop: '12px' }}
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </BorderGlow>
    </Col>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    bodyText: PropTypes.string.isRequired,
    image: PropTypes.string,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};

export default ProjectCard;
