import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import useDarkMode from 'use-dark-mode';
import { SmoothCursor } from './components/magicui/SmoothCursor';
import AppContext from './AppContext';
import MainApp from './MainApp';
import GlobalStyles from './theme/GlobalStyles';
import { lightTheme, darkTheme } from './theme/themes';
import Aurora from './components/Aurora';

function App() {
  const darkMode = useDarkMode(true);

  const colorsDark = ['#051622', '#1A365D', '#5227FF'];
  const colorsLight = ['#7cff67', '#B497CF', '#5227FF'];

  return (
    <AppContext.Provider value={{ darkMode }}>
      <ThemeProvider theme={darkMode.value ? darkTheme : lightTheme}>
        <GlobalStyles />
        <div className="App">
          <SmoothCursor />
          <Aurora
            colorStops={darkMode.value ? colorsDark : colorsLight}
            blend={0.5}
            amplitude={1.2}
          />
          <BrowserRouter>
            <MainApp />
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
