/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import AudioPlayer from 'react-modern-audio-player';
import NavBarWithRouter from './components/NavBar';
import Home from './components/Home';
import endpoints from './constants/endpoints';
import AssetViewer from './components/AssetViewer';
import './components/ModernAudioPlayer.css';

const playList = [
  {
    id: 1,
    name: 'Araw Gabi',
    writer: 'Edwin Deras Jr.',
    src: '/Araw_Gabi.mp3',
    img: '/images/logo.png',
  },
];

function MainApp() {
  const [data, setData] = useState(null);
  const playerRef = useRef(null);

  const handleDragStart = (e, isTouch = false) => {
    // 1. Don't start a drag if clicking interactive items
    const isInteractive = e.target.closest(
      'button, input, [role="slider"], [role="button"], .rmap-bar-progress-wrapper',
    );
    if (isInteractive) return;

    e.stopPropagation();

    const player = playerRef.current;
    if (!player) return;

    const rect = player.getBoundingClientRect();
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    const handleDragMove = (moveEvent) => {
      const currentX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

      let x = currentX - offsetX;
      let y = currentY - offsetY;

      // Bound it inside the window viewport with screen padding
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      x = Math.max(10, Math.min(x, maxX - 10));
      y = Math.max(10, Math.min(y, maxY - 10));

      player.style.left = `${x}px`;
      player.style.top = `${y}px`;
      player.style.right = 'auto';
      player.style.bottom = 'auto';
    };

    const handleDragEnd = () => {
      if (isTouch) {
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      } else {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      }
    };

    if (isTouch) {
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
  };

  useEffect(() => {
    fetch(endpoints.routes, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  // 🎯 Listen for the first user interaction to lift browser autoplay blocks and start audio
  useEffect(() => {
    let activated = false;
    const handleFirstInteraction = () => {
      if (activated) return;
      activated = true;

      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);

      setTimeout(() => {
        const audio = document.getElementById('rm-audio-player-audio');
        if (audio && audio.paused) {
          const playBtn = document.querySelector('.rmap-play-btn');
          if (playBtn) {
            playBtn.click();
          }
        }
      }, 50);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
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
      <NavBarWithRouter />
      <main
        className="main"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Switch>
          <Suspense fallback={<div />}>
            <Route exact path="/" component={Home} />
            {data
              && data.sections.map((route) => {
                const SectionComponent = React.lazy(() => import(`./components/${route.component}`));
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
      {data && (
        <div
          ref={playerRef}
          className="modern-player-wrapper"
          onMouseDown={(e) => handleDragStart(e, false)}
          onTouchStart={(e) => handleDragStart(e, true)}
        >
          <AudioPlayer
            playList={playList}
            audioInitialState={{
              isPlaying: true,
              volume: 0.4,
            }}
            activeUI={{
              all: true,
              playList: false,
              playbackRate: false,
              repeatType: false,
              artwork: false,
            }}
            placement={{
              player: 'bottom-right',
              interface: {
                templateArea: {
                  trackInfo: 'row1-1',
                  playButton: 'row1-2',
                  volume: 'row1-3',
                  progress: 'row2-1',
                  trackTimeCurrent: 'row3-1',
                  trackTimeDuration: 'row3-3',
                  repeatType: 'row1-2',
                  playList: 'row1-2',
                  playbackRate: 'row1-2',
                },
              },
            }}
            colorScheme="dark"
          />
        </div>
      )}
    </div>
  );
}

export default MainApp;
