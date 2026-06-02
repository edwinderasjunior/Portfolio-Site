import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { SunIcon, MoonIcon } from 'lucide-react';
import PropTypes from 'prop-types';

function ThemeToggler({ toggleTheme, iconColor }) {
  const theme = useContext(ThemeContext);

  const isDark = theme?.id === 'dark' || theme?.name === 'dark' || theme?.isDark;

  const buttonStyle = {
    background: 'transparent',
    border: 'none',
    padding: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: iconColor || theme?.navbarTheme?.linkColor || '#ffffff',
    transition: 'color 0.2s ease',
  };

  const iconStyle = {
    width: '20px',
    height: '20px',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={buttonStyle}
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <SunIcon style={iconStyle} stroke={iconColor || '#ffffff'} />
      ) : (
        <MoonIcon style={iconStyle} stroke={iconColor || '#ffffff'} />
      )}
    </button>
  );
}

ThemeToggler.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
  iconColor: PropTypes.string,
};

ThemeToggler.defaultProps = {
  iconColor: undefined,
};

export default ThemeToggler;
