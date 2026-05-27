import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import ReactMarkdown from 'react-markdown';

const styles = {
  glassCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(28px) saturate(130%)',
    WebkitBackdropFilter: 'blur(28px) saturate(130%)',
    boxShadow: [
      'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
      '0 10px 30px rgba(0, 0, 0, 0.4)',
    ].join(', '),
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  imageFrameStyle: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    objectPosition: 'top',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
  },
  cardTitleStyle: {
    fontSize: 24,
    fontWeight: 700,
    marginTop: '0.5rem',
  },
  cardTextStyle: {
    textAlign: 'left',
  },
  bodyContainerStyle: {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  // 🎯 Custom style rules for pristine white link badges
  linkButtonStyle: {
    marginRight: '8px',
    marginTop: '12px',
    color: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease',
  },
};

const ProjectCard = (props) => {
  const theme = useContext(ThemeContext);
  const parseBodyText = (text) => <ReactMarkdown children={text} />;
  const { project } = props;

  return (
    <Col style={{ display: 'flex', paddingBottom: '25px' }}>
      <div
        style={styles.glassCardContainer}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        }}
      >
        {project?.image && (
          <img
            src={project.image}
            alt={project.title}
            style={styles.imageFrameStyle}
          />
        )}
        <div className="card-project-body" style={styles.bodyContainerStyle}>
          <h3 style={{ ...styles.cardTitleStyle, color: theme.color }}>
            {project.title}
          </h3>
          <div style={{ ...styles.cardTextStyle, color: theme.bsSecondaryVariant }}>
            {parseBodyText(project.bodyText)}
          </div>
          {project.links && (
            <div className="card-project-links" style={{ marginTop: 'auto' }}>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={styles.linkButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#0f172a';
                    e.currentTarget.style.borderColor = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  }}
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
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
