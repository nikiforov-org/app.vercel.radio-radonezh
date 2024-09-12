import React, { useState, useEffect } from 'react';
import {
  f7ready,
  App,
  Page,
  Toolbar,
  Link,
  Tabs,
  Tab
} from 'framework7-react';

import InstallScreen from './InstallScreen';
import NavBar from './NavBar';

import Radio from '../pages/radio';
import Help from '../pages/help';
import More from '../pages/more';

const RadonezhApp = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(standalone);
    };

    checkStandalone();

    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkStandalone);
    };
  }, []);

  // Framework7 Parameters
  const appParams = {
    name: 'Радонеж', // App name
    theme: 'auto', // Automatic theme detection
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    // Register service worker (only on production build)
    serviceWorker: process.env.NODE_ENV === 'production' ? {
      path: '/service-worker.js',
    } : {},
  };

  f7ready(() => {
    // Call F7 APIs here
  });

  return (
    <App {...appParams}>
      <Page pageContent={false}>
        <NavBar />
        <Toolbar tabbar icons bottom>
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

      {!isStandalone && <InstallScreen />}
    </App>
  );
};

export default RadonezhApp;
