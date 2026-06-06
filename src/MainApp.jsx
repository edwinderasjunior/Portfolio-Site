/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useState,
  useEffect,
  Suspense,
  useContext,
} from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBarWithRouter from './components/navigation/NavBar';
import Home from './components/sections/Home';
import endpoints from './constants/endpoints';
import AssetViewer from './components/pages/AssetViewer';
import StaggeredMenu from './components/navigation/StaggeredMenu';
import AppContext from './AppContext';

const sectionComponents = {
  About: React.lazy(() => import('./components/sections/About')),
  Skills: React.lazy(() => import('./components/sections/Skills')),
  Education: React.lazy(() => import('./components/sections/Education')),
  Experience: React.lazy(() => import('./components/sections/Experience')),
  Projects: React.lazy(() => import('./components/sections/Projects')),
  GamePlayer: React.lazy(() => import('./components/sections/GamePlayer')),
};

function MainApp() {
  const [data, setData] = useState(null);
  const { darkMode, setMenuOpen } = useContext(AppContext);

  useEffect(() => {
    fetch(endpoints.routes, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <div
      className="MainApp"
      style={{
        pointerEvents: 'auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StaggeredMenu
        isFixed
        position="right"
        logoUrl={darkMode?.value ? 'images/logo/LogoWhite.webp' : 'images/logo/LogoBlack.webp'}
        items={[]}
        socialItems={[]}
        displaySocials={false}
        displayItemNumbering
        menuButtonColor={darkMode?.value ? '#fff' : '#000'}
        openMenuButtonColor={darkMode?.value ? '#fff' : '#000'}
        changeMenuColorOnOpen
        colors={darkMode?.value ? ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'] : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)']}
        accentColor={darkMode?.value ? '#ffffff' : '#000000'}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
      />
      <NavBarWithRouter />
      <main
        className="main"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Switch>
          <Suspense fallback={<div />}>
            <Route exact path="/" component={Home} />
            {data
              && data.sections.map((route) => {
                const SectionComponent = sectionComponents[route.component];
                if (!SectionComponent) return null;
                return (
                  <Route
                    key={route.headerTitle}
                    path={route.path}
                    render={() => (
                      <SectionComponent header={route.headerTitle} />
                    )}
                  />
                );
              })}
            <Route path="/viewer" component={AssetViewer} />
          </Suspense>
        </Switch>
      </main>
    </div>
  );
}

export default MainApp;
