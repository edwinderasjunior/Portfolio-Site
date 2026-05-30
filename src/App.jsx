import React, { Suspense } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import useDarkMode from 'use-dark-mode';
import { SmoothCursor } from './components/magicui/SmoothCursor';
import AppContext from './AppContext';
import MainApp from './MainApp';
import GlobalStyles from './theme/GlobalStyles';
import { darkTheme } from './theme/themes';
import DotGrid from './components/DotGrid';
import PdfViewerPage from './components/PdfViewerPage';
import ExploreGame from './components/ExploreGame';

const LazySilk = React.lazy(() => import('./components/Silk'));

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
  const darkMode = useDarkMode(true);
  const isExploreGame = window.location.pathname === '/exploregame';

  return (
    <AppContext.Provider value={{ darkMode }}>
      <ThemeProvider theme={darkTheme}>
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
                  speed={3}
                  scale={0.8}
                  color="#24355c" /* Premium Midnight Slate */
                  noiseIntensity={1.0}
                  rotation={0.6}
                />
              </Suspense>

              <DotGrid
                dotSize={3.5}
                gap={20}
                baseColor="#ffffff"
                activeColor="#ffffff"
                proximity={120}
                shockRadius={200}
                shockStrength={4}
                resistance={750}
                returnDuration={1.2}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.10,
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
