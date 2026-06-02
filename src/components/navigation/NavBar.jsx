/* eslint-disable object-curly-newline */
import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { withRouter } from 'react-router';
import {
  HomeIcon,
  UserIcon,
  CodeIcon,
  BookOpenIcon,
  BriefcaseIcon,
  FolderGit2Icon,
  FileTextIcon,
  SunIcon,
  MoonIcon,
} from 'lucide-react';
import endpoints from '../../constants/endpoints';
import AppContext from '../../AppContext';
import { Dock, DockIcon } from '../ui/Dock';
import GlassSurface from '../ui/GlassSurface';
import './NavBar.css';

const styles = {
  dockFixedWrapper: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
  },
  innerItemLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
  },
  iconVector: {
    width: '20px',
    height: '20px',
    transition: 'stroke 0.2s ease',
  },
  verticalDividerStyle: {
    alignSelf: 'center',
    height: '24px',
    width: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: '4px',
    marginRight: '4px',
    display: 'inline-block',
  },
};

const NavBar = () => {
  const location = useLocation();
  const { darkMode } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch(endpoints.navbar, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = data?.sections || [];

  const activeColor = darkMode?.value ? '#ffffff' : '#000000';
  const inactiveColor = darkMode?.value ? '#ffffff' : '#121214';
  const dividerColor = darkMode?.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)';

  const getIconConfig = (title) => {
    const cleanTitle = title.toLowerCase();

    if (cleanTitle.includes('home')) return { component: HomeIcon, color: inactiveColor };
    if (cleanTitle.includes('about')) return { component: UserIcon, color: inactiveColor };
    if (cleanTitle.includes('skill')) return { component: CodeIcon, color: inactiveColor };
    if (cleanTitle.includes('education')) return { component: BookOpenIcon, color: inactiveColor };
    if (cleanTitle.includes('experience')) return { component: BriefcaseIcon, color: inactiveColor };
    if (cleanTitle.includes('project')) return { component: FolderGit2Icon, color: inactiveColor };
    if (cleanTitle.includes('resume')) return { component: FileTextIcon, color: inactiveColor };

    return { component: HomeIcon, color: inactiveColor };
  };

  const hasResume = navigationItems.some((item) => item.title.toLowerCase().includes('resume'));

  // Calculate width dynamically; scale down on mobile screens to prevent overflow
  const calculatedWidth = isMobile
    ? Math.min(
      (navigationItems.length + 1) * 44 + 20 + (hasResume ? 10 : 0) + 12,
      window.innerWidth - 24,
    )
    : (navigationItems.length + 1) * 60 + 32 + (hasResume ? 24 : 0) + 16;

  return (
    <div style={styles.dockFixedWrapper}>
      {navigationItems.length > 0 && (
        <GlassSurface
          width={calculatedWidth}
          height={isMobile ? 52 : 64}
          borderRadius={isMobile ? 18 : 24}
          borderWidth={0.08}
          brightness={darkMode?.value ? 60 : 98}
          opacity={0.9}
          blur={8}
          backgroundOpacity={0.03}
          style={{
            border: darkMode?.value
              ? '1px solid rgba(255, 255, 255, 0.15)'
              : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: darkMode?.value
              ? '0 12px 40px 0 rgba(0, 0, 0, 0.4)'
              : '0 12px 40px 0 rgba(0, 0, 0, 0.08)',
          }}
        >
          <Dock
            className="bg-transparent"
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              width: '100%',
              height: '100%',
              padding: isMobile ? '2px 8px' : '4px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '6px' : '12px',
            }}
          >
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const {
                component: IconComponent,
                color: defaultColor,
              } = getIconConfig(item.title);
              const isResume = item.title.toLowerCase().includes('resume');
              const isDark = darkMode?.value;
              const activeBg = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)';
              const activeBorder = isDark
                ? '1px solid rgba(255, 255, 255, 0.25)'
                : '1px solid rgba(0, 0, 0, 0.12)';

              return (
                <React.Fragment key={item.href}>
                  {isResume && (
                    <span
                      style={{
                        ...styles.verticalDividerStyle,
                        backgroundColor: dividerColor,
                        height: isMobile ? '16px' : '24px',
                        marginLeft: isMobile ? '2px' : '4px',
                        marginRight: isMobile ? '2px' : '4px',
                      }}
                    />
                  )}

                  <div className="dock-tooltip-wrapper">
                    <DockIcon
                      style={{
                        background: 'transparent',
                        backgroundColor: 'transparent',
                        width: isMobile ? '36px' : '48px',
                        height: isMobile ? '36px' : '48px',
                      }}
                    >
                      <Link
                        to={item.href}
                        style={{
                          ...styles.innerItemLink,
                          backgroundColor: isActive ? activeBg : 'transparent',
                          border: isActive ? activeBorder : '1px solid transparent',
                          backdropFilter: isActive ? 'blur(8px)' : 'none',
                          /* 🎯 Split onto multiple lines to pass strict max-len constraints */
                          WebkitBackdropFilter: isActive
                            ? 'blur(8px)'
                            : 'none',
                        }}
                        aria-label={item.title}
                      >
                        <IconComponent
                          style={{
                            ...styles.iconVector,
                            width: isMobile ? '16px' : '20px',
                            height: isMobile ? '16px' : '20px',
                          }}
                          stroke={isActive ? activeColor : defaultColor}
                        />
                      </Link>
                    </DockIcon>
                    <div className="dock-tooltip-content">{item.title}</div>
                  </div>
                </React.Fragment>
              );
            })}

            <span
              style={{
                ...styles.verticalDividerStyle,
                backgroundColor: dividerColor,
                height: isMobile ? '16px' : '24px',
                marginLeft: isMobile ? '2px' : '4px',
                marginRight: isMobile ? '2px' : '4px',
              }}
            />

            <div className="dock-tooltip-wrapper">
              <DockIcon
                style={{
                  background: 'transparent',
                  backgroundColor: 'transparent',
                  width: isMobile ? '36px' : '48px',
                  height: isMobile ? '36px' : '48px',
                }}
              >
                <button
                  type="button"
                  onClick={darkMode?.toggle}
                  style={{
                    ...styles.innerItemLink,
                    backgroundColor: 'transparent',
                    border: '1px solid transparent',
                    cursor: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                  aria-label="Toggle light/dark theme"
                >
                  {darkMode?.value ? (
                    <SunIcon
                      style={{
                        ...styles.iconVector,
                        width: isMobile ? '16px' : '20px',
                        height: isMobile ? '16px' : '20px',
                      }}
                      stroke={inactiveColor}
                    />
                  ) : (
                    <MoonIcon
                      style={{
                        ...styles.iconVector,
                        width: isMobile ? '16px' : '20px',
                        height: isMobile ? '16px' : '20px',
                      }}
                      stroke={inactiveColor}
                    />
                  )}
                </button>
              </DockIcon>
              <div className="dock-tooltip-content">
                {darkMode?.value ? 'Light Mode' : 'Dark Mode'}
              </div>
            </div>
          </Dock>
        </GlassSurface>
      )}
    </div>
  );
};

const NavBarWithRouter = withRouter(NavBar);
export default NavBarWithRouter;
