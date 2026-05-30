import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

const MENU_ITEMS = [
  {
    label: 'Test',
    ariaLabel: 'Go to homepage',
    link: '/',
  },
  {
    label: 'About',
    ariaLabel: 'Learn about me',
    link: '/about',
  },
  {
    label: 'Skills',
    ariaLabel: 'View my technical stack',
    link: '/skills',
  },
  {
    label: 'Education',
    ariaLabel: 'See academic timeline',
    link: '/education',
  },
  {
    label: 'Experience',
    ariaLabel: 'See professional history',
    link: '/experience',
  },
  {
    label: 'Projects',
    ariaLabel: 'Browse development projects',
    link: '/projects',
  },
];

function StaggeredMenu({
  position,
  colors,
  socialItems,
  displaySocials,
  displayItemNumbering,
  className,
  logoUrl,
  menuButtonColor,
  openMenuButtonColor,
  accentColor,
  changeMenuColorOnOpen,
  isFixed,
  closeOnClickAway,
  onMenuOpen,
  onMenuClose,
}) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  const items = MENU_ITEMS;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const listSelector = '.sm-panel-list[data-numbering] .sm-panel-item';
    const numberEls = Array.from(panel.querySelectorAll(listSelector));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
    const footerCredit = panel.querySelector('.sm-panel-footer-credit');

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map((el) => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
    if (footerCredit) gsap.set(footerCredit, { opacity: 0, y: 15 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        {
          xPercent: 0,
          duration: 0.5,
          ease: 'power4.out',
        },
        i * 0.07,
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      {
        xPercent: 0,
        duration: panelDuration,
        ease: 'power4.out',
      },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' },
        },
        itemsStart,
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' },
          },
          itemsStart + 0.1,
        );
      }
    }

    const socialsStart = panelInsertTime + panelDuration * 0.4;
    if (socialTitle || socialLinks.length) {
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          socialsStart,
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            },
          },
          socialsStart + 0.04,
        );
      }
    }

    if (footerCredit) {
      /* 🎯 Fixed Line 188: Expanded to multiple lines to satisfy object-curly-newline */
      tl.to(
        footerCredit,
        {
          opacity: 0.4,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        socialsStart + 0.15,
      );
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const listSelector = '.sm-panel-list[data-numbering] .sm-panel-item';
        const numberEls = Array.from(panel.querySelectorAll(listSelector));
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });

        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        const footerCredit = panel.querySelector('.sm-panel-footer-credit');
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        if (footerCredit) gsap.set(footerCredit, { opacity: 0, y: 15 });
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, {
        rotate: 225,
        duration: 0.8,
        ease: 'power4.out',
        overwrite: 'auto',
      });
    } else {
      spinTweenRef.current = gsap.to(icon, {
        rotate: 0,
        duration: 0.35,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [
      openMenuButtonColor,
      menuButtonColor,
      changeMenuColorOnOpen,
    ],
  );

  useEffect(() => {
    if (toggleBtnRef.current) {
      const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
      gsap.set(toggleBtnRef.current, {
        color: changeMenuColorOnOpen ? targetColor : menuButtonColor,
      });
    }
  }, [
    changeMenuColorOnOpen,
    menuButtonColor,
    openMenuButtonColor,
  ]);

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;

    for (let i = 0; i < cycles; i += 1) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out',
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  useEffect(() => {
    if (!closeOnClickAway || !open) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (
        panelRef.current
        && !panelRef.current.contains(event.target)
        && toggleBtnRef.current
        && !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  const wrapperClass = `${className ? `${className} ` : ''}staggered-menu-wrapper${
    isFixed ? ' fixed-wrapper' : ''
  }`;

  const customAccentStyle = accentColor ? { '--sm-accent': accentColor } : undefined;

  return (
    <div
      className={wrapperClass}
      style={customAccentStyle}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const fallbackColors = ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)'];
          const raw = colors && colors.length ? colors.slice(0, 4) : fallbackColors;
          const arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c) => (
            <div key={`layer-${c}`} className="sm-prelayer" style={{ background: c }} />
          ));
        })()}
      </div>
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <div className="sm-logo" aria-label="Logo">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="sm-logo-img"
              draggable={false}
              width={110}
              height={24}
            />
          )}
        </div>
        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((l, idx) => (
                <span className="sm-toggle-line" key={`line-${l}-${idx + 1}`}>
                  {l}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div
          className="sm-panel-inner"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
            {items && items.length ? (
              items.map((it, idx) => {
                const uniqueKey = `item-${it.label}-${idx}`;
                return (
                  <li className="sm-panel-itemWrap" key={uniqueKey}>
                    <Link
                      className="sm-panel-item"
                      to={it.link}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}
                      onClick={closeMenu}
                    >
                      <span className="sm-panel-itemLabel">{it.label}</span>
                    </Link>
                  </li>
                );
              })
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list">
                {socialItems.map((s, index) => {
                  const itemKey = `social-${s.label}-${index}`;
                  return (
                    <li key={itemKey} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link"
                      >
                        {s.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div
            className="sm-panel-footer-credit"
            style={{
              marginTop: 'auto',
              paddingTop: '2rem',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              color: '#ffffff',
            }}
          >
            Website built with ❤️ by Edwin! ©
            {' '}
            {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </div>
  );
}

StaggeredMenu.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  colors: PropTypes.arrayOf(PropTypes.string),
  socialItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ),
  displaySocials: PropTypes.bool,
  displayItemNumbering: PropTypes.bool,
  className: PropTypes.string,
  logoUrl: PropTypes.string,
  menuButtonColor: PropTypes.string,
  openMenuButtonColor: PropTypes.string,
  accentColor: PropTypes.string,
  changeMenuColorOnOpen: PropTypes.bool,
  isFixed: PropTypes.bool,
  closeOnClickAway: PropTypes.bool,
  onMenuOpen: PropTypes.func,
  onMenuClose: PropTypes.func,
};

StaggeredMenu.defaultProps = {
  position: 'right',
  colors: [
    'rgba(255, 255, 255, 0.05)',
    'rgba(255, 255, 255, 0.02)',
  ],
  socialItems: [],
  displaySocials: true,
  displayItemNumbering: true,
  className: '',
  logoUrl: '',
  menuButtonColor: '#fff',
  openMenuButtonColor: '#fff',
  accentColor: 'rgba(255, 255, 255, 0.5)',
  changeMenuColorOnOpen: true,
  isFixed: false,
  closeOnClickAway: true,
  onMenuOpen: undefined,
  onMenuClose: undefined,
};

export default StaggeredMenu;
