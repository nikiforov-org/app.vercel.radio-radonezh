import React from 'react';
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

import InstallScreen from './InstallScreen';
import NavBar from './NavBar';

import Radio from '../pages/radio';
import Help from '../pages/help';
import More from '../pages/more';

const RadonezhApp = () => {
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
