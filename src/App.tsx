import React, { useEffect, useState } from 'react';
import { f7ready, App, Page, Toolbar, Link, Tabs, Tab, View } from 'framework7-react';

import routes from './routes';

import InstallScreen from './components/InstallScreen';
import NavBar from './components/NavBar';

import Radio from './tabs/Radio';
import Help from './tabs/Help';
import More from './tabs/More';

// Определяем значение по умолчанию для темы
const defaultDarkMode: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultBitrate = '128';
// Если битрейт не установлен, устанавливаем значение по умолчанию
if (!localStorage.getItem('bitrate')) {
  localStorage.setItem('bitrate', defaultBitrate);
}

const RadonezhApp: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const storedDarkModeItem = localStorage.getItem('darkMode');
    if (storedDarkModeItem) {
      setDarkMode(!!Number(storedDarkModeItem));
    } else {
      localStorage.setItem('darkMode', defaultDarkMode ? '1' : '0');
      setDarkMode(defaultDarkMode);
    }
  }, []);

  // Пока тема не определена, ничего не рендерим
  if (darkMode === null) {
    return null;
  }

  // Параметры для Framework7
  const appParams = {
    name: 'Радонеж', // Имя приложения
    theme: 'auto', // Автоматическое определение темы
    routes: routes,
    darkMode: darkMode,
    // Регистрируем сервис-воркер (только для production)
    serviceWorker: process.env.NODE_ENV === 'production' ? { path: '/service-worker.js' } : {},
  };

  // Вызываем f7ready для инициализации Framework7 (например, для вызова API)
  f7ready(() => {
    // Можно вызывать API Framework7 здесь
  });

  // Функция для pull-to-refresh (stub)
  const getData = (): void => {
    return;
  };

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
          !(
            window.navigator.standalone ?? window.matchMedia('(display-mode: standalone)').matches
          ) && <InstallScreen />}
      </View>
    </App>
  );
};

export default RadonezhApp;
