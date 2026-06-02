import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Button,
  Container,
} from 'react-bootstrap';

const styles = {
  fallbackContainer: {
    paddingTop: '50px',
    paddingBottom: '50px',
  },
  mainContainer: {
    paddingTop: '20px',
    paddingBottom: '20px',
    minHeight: '100vh',
  },
  headerDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  frameWrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  videoElement: {
    width: '100%',
    display: 'block',
    maxHeight: '80vh',
  },
  iframeElement: {
    border: 'none',
    display: 'block',
  },
};

const AssetViewer = () => {
  const location = useLocation();
  const history = useHistory();

  const {
    assetPath,
    assetType,
    projectTitle,
  } = location.state || {};

  if (!assetPath) {
    return (
      <Container className="text-center" style={styles.fallbackContainer}>
        <h3>No asset selected.</h3>
        <Button
          variant="primary"
          onClick={() => {
            history.push('/');
          }}
        >
          Return Home
        </Button>
      </Container>
    );
  }

  return (
    <Container style={styles.mainContainer}>
      <div style={styles.headerDiv}>
        <h2>{projectTitle || 'Asset Viewer'}</h2>
        <Button
          variant="outline-secondary"
          onClick={() => {
            history.goBack();
          }}
        >
          ← Back to Portfolio
        </Button>
      </div>

      <div style={styles.frameWrapper}>
        {assetType === 'video' ? (
          <video
            src={assetPath}
            controls
            autoPlay
            style={styles.videoElement}
          >
            <track kind="captions" />
          </video>
        ) : (
          <iframe
            src={`${assetPath}#toolbar=1&navpanes=0`}
            title="Document Frame Viewer"
            width="100%"
            height="750px"
            style={styles.iframeElement}
          />
        )}
      </div>
    </Container>
  );
};

export default AssetViewer;
