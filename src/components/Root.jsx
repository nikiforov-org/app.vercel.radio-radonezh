import React, {useEffect, useState} from 'react';
import {
  f7ready,
  App,
  Page,
  Toolbar,
  Link,
  Tabs,
  Tab,
  View
} from 'framework7-react';

import routes from '../js/routes';

import InstallScreen from './InstallScreen';
import NavBar from './NavBar';

import Radio from '../pages/radio';
import Help from '../pages/help';
import More from '../pages/more'

const defaultDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultBitrate = '128';
// Set default bitrate
if (localStorage.getItem('bitrate') === null) localStorage.setItem('bitrate', defaultBitrate)

const RadonezhApp = () => {
  const [darkMode, setDarkMode] = useState(null);

  useEffect(() => {
    const storedDarkModeItem = localStorage.getItem('darkMode');
    const storedDarkModeValue = storedDarkModeItem !== null
        ? !!Number(storedDarkModeItem)
        : () => {
          localStorage.setItem('darkMode', defaultDarkMode ? '1' : '0');
          return defaultDarkMode;
        };
    setDarkMode(storedDarkModeValue);
  }, []);

  if (darkMode === null) {
    return null;
  }

  // Framework7 Parameters
  const appParams = {
    name: 'Радонеж', // App name
    theme: 'auto', // Automatic theme detection
    routes: routes,
    darkMode: darkMode,
    // Register service worker (only on production build)
    serviceWorker: process.env.NODE_ENV === 'production' ? {
      path: '/service-worker.js',
    } : {},
  };

  f7ready(() => {
    // Call F7 APIs here
  });

  const getData = () => {
    return;
  }

  return (
    <App {...appParams}>
      <View main>
        <Page pageContent={false} ptr ptrMousewheel={true} onPtrRefresh={getData}>
          <NavBar />
          <Toolbar bottom tabbar icons>
            <Link tabLink="#radio" iconF7="music_note_2" text="Радио" tabLinkActive />
            <Link tabLink="#help" iconF7="money_rubl" text="Помощь" />
            <Link tabLink="#more" iconF7="ellipsis" text="Ещё" />
          </Toolbar>

          <Tabs swipeable>
            <Tab id="radio" className="page-content" tabActive>
              <Radio />
            </Tab>
            <Tab id="help" className="page-content">
              <Help />
            </Tab>
            <Tab id="more" className="page-content">
              <More />
            </Tab>
          </Tabs>
        </Page>

        {process.env.NODE_ENV === 'production' &&
          !(window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) && <InstallScreen />
        }

      </View>
    </App>
  );
};

export default RadonezhApp;
