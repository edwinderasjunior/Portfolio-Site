import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 20px', /* Reduced top/bottom padding to pull everything up */
    maxWidth: '100%',
    margin: '0 auto',
    minHeight: '85vh',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginBottom: '15px', /* Tighter spacing above the game */
  },
  frameWrapper: {
    width: '95vw', /* Spreads the canvas almost entirely across the screen */
    maxWidth: '1400px', /* Expanded maximum desktop limit */
    aspectRatio: '16 / 9',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '4px solid #222',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#000',
  },
};

const GamePlayer = (props) => {
  const { header } = props;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{header}</h1>
      <p style={styles.subtitle}>
        Click inside the box to start the game! Controls: (Arrow keys / Spacebar).
      </p>
      <div style={styles.frameWrapper}>
        <iframe
          src="https://game.edwinjr.com"
          title="Game Framework"
          style={styles.iframe}
          allow="autoplay; keyboard-focus"
          loading="lazy"
        />
      </div>
    </div>
  );
};

GamePlayer.propTypes = {
  header: PropTypes.string.isRequired,
};

export default GamePlayer;
