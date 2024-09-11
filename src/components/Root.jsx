import React from 'react';

import {
  f7ready,
  App,
  Views,
  View,
  Toolbar,
  Link,
} from 'framework7-react';


import routes from '../js/routes';
import store from '../js/store';
import InstallScreen from './InstallScreen';

const RadonezhApp = () => {
  // Framework7 Parameters
  const appParams = {
    name: 'Радонеж', // App name
    theme: 'auto', // Automatic theme detection

    //darkMode: true,

    // App store
    store: store,
    // App routes
    routes: routes,

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

      <Views tabs className="safe-areas">
        <Toolbar tabbar icons bottom>
          <Link tabLink="#view-radio" tabLinkActive iconF7="music_note_2" text="Радио" />
          <Link tabLink="#view-help" iconF7="money_rubl" text="Помощь" />
          <Link tabLink="#view-more" iconF7="ellipsis" text="Ещё" />
        </Toolbar>

        <View id="view-radio" main tab tabActive url="/" />
        <View id="view-help" name="help" tab url="/help/" />
        <View id="view-more" name="more" tab url="/more/" />

      </Views>

      {window.matchMedia('(display-mode: browser)').matches && <InstallScreen />}

    </App>
  )
}
export default RadonezhApp;