/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useState,
  useEffect,
  Suspense,
  useContext,
} from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import NavBarWithRouter from './components/navigation/NavBar';
import Home from './components/sections/Home';
import endpoints from './constants/endpoints';
import AssetViewer from './components/pages/AssetViewer';
import StaggeredMenu from './components/navigation/StaggeredMenu';
import AppContext from './AppContext';
import ShinyText from './components/ui/ShinyText';

const sectionComponents = {
  About: React.lazy(() => import('./components/sections/About')),
  Skills: React.lazy(() => import('./components/sections/Skills')),
  Education: React.lazy(() => import('./components/sections/Education')),
  Experience: React.lazy(() => import('./components/sections/Experience')),
  Projects: React.lazy(() => import('./components/sections/Projects')),
  GamePlayer: React.lazy(() => import('./components/sections/GamePlayer')),
};

const scrollIndicatorStyle = {
  position: 'fixed',
  bottom: '40px',
  left: '50%',
  zIndex: 90,
  transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  pointerEvents: 'none',
};

function MainApp() {
  const [data, setData] = useState(null);
  const { darkMode, menuOpen, setMenuOpen } = useContext(AppContext);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    fetch(endpoints.routes, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.app-scroll-container');
    if (!container) return undefined;

    // Immediately reset scroll position on page transition
    container.scrollTop = 0;
    if (window.portfolioScrollLenis) {
      window.portfolioScrollLenis.scrollTo(0, { immediate: true });
    }

    const checkScrollability = () => {
      const isScrolledDown = container.scrollTop > 20;
      const isIgnoredPage = pathname === '/viewer'
        || pathname === '/exploregame';
      if (menuOpen || isIgnoredPage || isScrolledDown) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    // Initialize state immediately
    checkScrollability();

    const handleScroll = () => {
      if (menuOpen || container.scrollTop > 20) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, menuOpen]);

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

      {/* Floating Scroll Indicator */}
      <div
        style={{
          ...scrollIndicatorStyle,
          opacity: showScrollIndicator ? 1 : 0,
          transform: showScrollIndicator
            ? 'translate(-50%, 0) scale(1)'
            : 'translate(-50%, 20px) scale(0.9)',
        }}
      >
        {pathname === '/about' ? (
          <ShinyText
            text="Scroll to reveal more..."
            speed={2.5}
            color={darkMode?.value ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)'}
            shineColor={darkMode?.value ? '#ffffff' : '#000000'}
            className="scroll-indicator-shiny"
          />
        ) : (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={darkMode?.value ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.6)'}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        )}
      </div>
    </div>
  );
}

export default MainApp;
