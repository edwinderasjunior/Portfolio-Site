import React, { Suspense } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import useDarkMode from 'use-dark-mode';
import { SmoothCursor } from './components/magicui/SmoothCursor';
import AppContext from './AppContext';
import MainApp from './MainApp';
import GlobalStyles from './theme/GlobalStyles';
import { darkTheme } from './theme/themes';
import DotGrid from './components/DotGrid';

const LazySilk = React.lazy(() => import('./components/Silk'));

function App() {
  const darkMode = useDarkMode(true);

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
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'auto',
            }}
          >
            <Suspense fallback={<div />}>
              <LazySilk
                speed={2}
                scale={0.7}
                color="#1A365D"
                noiseIntensity={1.0}
                rotation={0.4}
              />
            </Suspense>

            <DotGrid
              dotSize={4}
              gap={24}
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
                opacity: 0.15,
              }}
            />
          </div>

          {/* Content Container Layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <BrowserRouter>
              <MainApp />
            </BrowserRouter>
          </div>

        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
