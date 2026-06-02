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

const LazySilk = React.lazy(() => import('./components/backgrounds/Silk'));

const contentContainerStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  overflowY: 'auto',
  scrollBehavior: 'smooth',
};

function App() {
  const darkMode = useDarkMode(false);
  const isExploreGame = window.location.pathname === '/exploregame';

  React.useEffect(() => {
    if (localStorage.getItem('darkMode') === null) {
      darkMode.disable();
    }
  }, [darkMode]);

  return (
    <AppContext.Provider value={{ darkMode }}>
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
                  color={darkMode.value ? '#1a2f5e' : '#12107cff'}
                  noiseIntensity={darkMode.value ? 1.0 : 2.5}
                  rotation={0.6}
                  opacity={darkMode.value ? 0.20 : 0.35}
                />
              </Suspense>

              <DotField
                dotRadius={3.5}
                dotSpacing={17}
                cursorRadius={500}
                cursorForce={0.1}
                bulgeOnly
                bulgeStrength={52}
                glowRadius={160}
                sparkle
                waveAmplitude={0}
                gradientFrom={darkMode.value ? '#ffffff' : '#121212'}
                gradientTo={darkMode.value ? 'rgba(180, 151, 207, 0.25)' : 'rgba(180, 151, 207, 0.08)'}
                glowColor={darkMode.value ? '#120F17' : '#f5f8ff'}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: darkMode.value ? 0.15 : 0.35,
                }}
              />
            </div>
          )}

          {/* Content Container Layer */}
          <div style={contentContainerStyle}>
            <BrowserRouter>
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
