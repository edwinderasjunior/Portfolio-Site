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
import ThemeToggler from './ThemeToggler';
import { Dock, DockIcon } from './Dock';
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
  },
  innerItemLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  },
  iconVector: {
    width: '20px',
    height: '20px',
  },
  dividerLine: {
    width: '1px',
    height: '28px',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignSelf: 'center',
    margin: '0 4px',
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

  return (
    <div style={styles.dockFixedWrapper}>
      {navigationItems.length > 0 && (
        <Dock>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const { component: IconComponent, color: defaultColor } = getIconConfig(item.title);

            return (
              <div key={item.href} className="dock-tooltip-wrapper">
                <DockIcon>
                  <Link
                    to={item.href}
                    style={{
                      ...styles.innerItemLink,
                      backgroundColor: isActive ? 'rgba(0, 0, 0, 0.52)' : 'transparent',
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

          <div style={styles.dividerLine} aria-hidden="true" />

          <div className="dock-tooltip-wrapper">
            <DockIcon>
              <div style={styles.innerItemLink}>
                <ThemeToggler
                  toggleTheme={darkMode?.toggle}
                  iconColor={inactiveColor}
                />
              </div>
            </DockIcon>
            <div className="dock-tooltip-content">Toggle Theme</div>
          </div>
        </Dock>
      )}
    </div>
  );
};

const NavBarWithRouter = withRouter(NavBar);
export default NavBarWithRouter;
