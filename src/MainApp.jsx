/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, Suspense } from 'react';
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
      <div
        className="modern-player-wrapper"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <AudioPlayer
          playList={playList}
          activeUI={{
            all: true,
            playList: false,
            playbackRate: false,
            repeatType: false,
            artwork: true,
          }}
          placement={{
            player: 'bottom-right',
            interface: {
              templateArea: {
                artwork: 'row1-1',
                trackInfo: 'row1-2',
                playButton: 'row1-3',
                volume: 'row1-4',
                progress: 'row2-2',
                trackTimeCurrent: 'row3-1',
                trackTimeDuration: 'row3-4',
                repeatType: 'row1-3',
                playList: 'row1-3',
                playbackRate: 'row1-3',
              },
            },
          }}
          colorScheme="dark"
        />
      </div>
    </div>
  );
}

export default MainApp;
