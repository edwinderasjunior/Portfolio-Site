import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const ProjectCard = (props) => {
  const theme = useContext(ThemeContext);
  const isDark = theme.bsPrimaryVariant === 'dark';
  const parseBodyText = (text) => <ReactMarkdown children={text} />;
  const { project } = props;

  const dynamicStyles = {
    glassCardContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      borderRadius: '12px',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(28px) saturate(130%)',
      WebkitBackdropFilter: 'blur(28px) saturate(130%)',
      boxShadow: isDark
        ? [
          'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
          '0 10px 30px rgba(0, 0, 0, 0.4)',
        ].join(', ')
        : [
          'inset 0 1px 1px rgba(255, 255, 255, 0.5)',
          '0 10px 30px rgba(0, 0, 0, 0.06)',
        ].join(', '),
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    imageFrameStyle: {
      width: '100%',
      height: '300px',
      objectFit: 'cover',
      objectPosition: 'top',
      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
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
    linkButtonStyle: {
      marginRight: '8px',
      marginTop: '12px',
      color: isDark ? '#ffffff' : '#000000',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)',
      borderWidth: '1px',
      borderStyle: 'solid',
      backgroundColor: 'transparent',
      transition: 'all 0.2s ease',
      display: 'inline-block',
      textDecoration: 'none',
    },
  };

  return (
    <Col style={{ display: 'flex', paddingBottom: '25px' }}>
      <div
        style={dynamicStyles.glassCardContainer}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        }}
      >
        {project?.image && (
          <img
            src={project.image}
            alt={project.title}
            style={dynamicStyles.imageFrameStyle}
          />
        )}
        <div className="card-project-body" style={dynamicStyles.bodyContainerStyle}>
          <h3 style={{ ...dynamicStyles.cardTitleStyle, color: theme.color }}>
            {project.title}
          </h3>
          <div style={{ ...dynamicStyles.cardTextStyle, color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
            {parseBodyText(project.bodyText)}
          </div>
          {project.links && (
            <div
              className="card-project-links"
              style={{
                marginTop: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {project.links.map((link) => {
                const hrefStr = link.href ? String(link.href).toLowerCase() : '';
                const textStr = link.text ? String(link.text).toLowerCase() : '';

                const isPdf = hrefStr.includes('.pdf') || textStr.includes('pdf');

                if (isPdf) {
                  const targetUrl = `/view-pdf?file=${encodeURIComponent(link.href)}`;
                  return (
                    <Link
                      key={link.href}
                      to={targetUrl}
                      target="_blank"
                      className="btn"
                      style={dynamicStyles.linkButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? '#ffffff' : '#000000';
                        e.currentTarget.style.color = isDark ? '#0f172a' : '#ffffff';
                        e.currentTarget.style.borderColor = isDark ? '#ffffff' : '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = isDark ? '#ffffff' : '#000000';
                        e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)';
                      }}
                    >
                      {link.text}
                    </Link>
                  );
                }

                const isInternal = link.href && link.href.startsWith('/') && !link.href.includes('.');

                if (isInternal) {
                  const targetVal = textStr.includes('explore') ? '_blank' : (link.target || '_self');
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      target={targetVal === '_self' ? undefined : targetVal}
                      className="btn"
                      style={dynamicStyles.linkButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? '#ffffff' : '#000000';
                        e.currentTarget.style.color = isDark ? '#0f172a' : '#ffffff';
                        e.currentTarget.style.borderColor = isDark ? '#ffffff' : '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = isDark ? '#ffffff' : '#000000';
                        e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)';
                      }}
                    >
                      {link.text}
                    </Link>
                  );
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={dynamicStyles.linkButtonStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#ffffff' : '#000000';
                      e.currentTarget.style.color = isDark ? '#0f172a' : '#ffffff';
                      e.currentTarget.style.borderColor = isDark ? '#ffffff' : '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = isDark ? '#ffffff' : '#000000';
                      e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)';
                    }}
                  >
                    {link.text}
                  </a>
                );
              })}
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
