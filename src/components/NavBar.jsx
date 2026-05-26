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
} from 'lucide-react';
import endpoints from '../constants/endpoints';
import AppContext from '../AppContext';
import { Dock, DockIcon } from './Dock';
import GlassSurface from './GlassSurface';
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
};

const NavBar = () => {
  const location = useLocation();
  const { darkMode } = useContext(AppContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.navbar, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const navigationItems = data?.sections || [];

  const activeColor = darkMode?.value ? '#ffffff' : '#000000';
  const inactiveColor = darkMode?.value ? '#ffffff' : '#121214';

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

  // Calculate clean layout width bounding metrics based on navigation list sizes
  const calculatedWidth = navigationItems.length * 60 + 32;

  return (
    <div style={styles.dockFixedWrapper}>
      {navigationItems.length > 0 && (
        <GlassSurface
          width={calculatedWidth}
          height={64}
          borderRadius={24}
          borderWidth={0.08}
          brightness={60}
          opacity={0.9}
          blur={8}
          backgroundOpacity={0.03}
          style={{
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
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
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const { component: IconComponent, color: defaultColor } = getIconConfig(item.title);

              return (
                <div key={item.href} className="dock-tooltip-wrapper">
                  <DockIcon
                    style={{ background: 'transparent', backgroundColor: 'transparent' }}
                  >
                    <Link
                      to={item.href}
                      style={{
                        ...styles.innerItemLink,
                        backgroundColor: isActive
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'transparent',
                        border: isActive
                          ? '1px solid rgba(255, 255, 255, 0.25)'
                          : '1px solid transparent',
                        backdropFilter: isActive ? 'blur(8px)' : 'none',
                        WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
                      }}
                      aria-label={item.title}
                    >
                      <IconComponent
                        style={styles.iconVector}
                        stroke={isActive ? activeColor : defaultColor}
                      />
                    </Link>
                  </DockIcon>
                  <div className="dock-tooltip-content">{item.title}</div>
                </div>
              );
            })}
          </Dock>
        </GlassSurface>
      )}
    </div>
  );
};

const NavBarWithRouter = withRouter(NavBar);
export default NavBarWithRouter;
