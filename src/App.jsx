import React, { Suspense } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import useDarkMode from 'use-dark-mode';
import { SmoothCursor } from './components/ui/magicui/SmoothCursor';
import AppContext from './AppContext';
import MainApp from './MainApp';
import GlobalStyles from './theme/GlobalStyles';
import { darkTheme, lightTheme } from './theme/themes';
import DotField from './components/backgrounds/DotField';
import PdfViewerPage from './components/pages/PdfViewerPage';
import ExploreGame from './components/pages/ExploreGame';
import GlobalLenis from './components/ui/GlobalLenis';

const LazySilk = React.lazy(() => import('./components/backgrounds/Silk'));

const contentContainerStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  pointerEvents: 'auto',
  overflowY: 'auto',
  scrollBehavior: 'smooth',
};

function App() {
  const darkMode = useDarkMode(false);
  const isExploreGame = window.location.pathname === '/exploregame';
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('darkMode') === null) {
      darkMode.disable();
    }
  }, [darkMode]);

  return (
    <AppContext.Provider value={{ darkMode, menuOpen, setMenuOpen }}>
      <ThemeProvider theme={darkMode.value ? darkTheme : lightTheme}>
        <GlobalStyles />
        <div
          className="App"
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <SmoothCursor />

          {/* Background Canvas Layer */}
          {!isExploreGame && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'auto',
              }}
            >
              <Suspense fallback={<div />}>
                {/* 🎯 Toggle your global background theme vibes here: */}
                <LazySilk
                  speed={6}
                  scale={darkMode.value ? 1.0 : 1.0}
                  color={darkMode.value ? '#463f3a' : '#bcb8b1'}
                  color2={darkMode.value ? '#8b8c89' : '#f4f3ee'}
                  noiseIntensity={darkMode.value ? 2.0 : 2.5}
                  rotation={1.6}
                  opacity={darkMode.value ? 0.30 : 0.80}
                  paused={menuOpen}
                  isDark={darkMode.value}
                />
              </Suspense>

              <DotField
                dotRadius={3.5}
                dotSpacing={26}
                cursorRadius={500}
                cursorForce={0.1}
                bulgeOnly
                bulgeStrength={52}
                glowRadius={160}
                sparkle
                waveAmplitude={0}
                gradientFrom={darkMode.value ? '#bcb8b1' : '#121212'}
                gradientTo={darkMode.value ? 'rgba(224, 175, 160, 0.40)' : 'rgba(138, 129, 124, 0.30)'}
                glowColor={darkMode.value ? '#262220' : '#f4f3ee'}
                paused={menuOpen}
                isDark={darkMode.value}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: darkMode.value ? 0.45 : 0.65,
                }}
              />
            </div>
          )}

          {/* Content Container Layer */}
          <div style={contentContainerStyle}>
            <BrowserRouter>
              <GlobalLenis />
              <Switch>
                <Route path="/view-pdf" component={PdfViewerPage} />
                <Route path="/exploregame" component={ExploreGame} />
                <Route path="*" component={MainApp} />
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
