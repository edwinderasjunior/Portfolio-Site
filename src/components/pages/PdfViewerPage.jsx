import React from 'react';
import { Container } from 'react-bootstrap';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { EmbedPDF } from '@simplepdf/react-embed-pdf';

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '20px',
    paddingBottom: '20px',
    pointerEvents: 'auto',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '20px',
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
    textDecoration: 'none',
    display: 'inline-block',
  },
  pdfContainer: {
    width: '100%',
    maxWidth: '1000px',
    height: '80vh',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
};

const PdfViewerPage = () => {
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const fileUrl = queryParams.get('file');

  // 🎯 Smart Navigation: Checks if a history state exists; if not, forcefully pushes to home
  const handleBackClick = (e) => {
    if (history.length > 1) {
      e.preventDefault();
      history.goBack();
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={styles.buttonContainer}>
          {/* 🚀 Changed to a smart Link component targeting the home route */}
          <Link
            to="/"
            style={styles.customButtonStyle}
            onClick={handleBackClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            ← Back to Portfolio
          </Link>
        </div>

        <div style={styles.pdfContainer}>
          {fileUrl ? (
            <EmbedPDF
              companyIdentifier="react-viewer"
              mode="inline"
              style={{ width: '100%', height: '100%' }}
              documentURL={window.location.origin + fileUrl}
            />
          ) : (
            <div style={{ color: '#fff', padding: '20px' }}>
              No PDF file specified.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PdfViewerPage;
