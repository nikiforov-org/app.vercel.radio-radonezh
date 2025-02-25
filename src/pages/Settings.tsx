import { useState } from 'react';
import { Page, Navbar, BlockTitle, List, ListItem, f7 } from 'framework7-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState<boolean>(!!Number(localStorage.getItem('darkMode')));
  const [bitrate, setBitrate] = useState<string | null>(localStorage.getItem('bitrate'));

  const handleThemeChange = (value: number): void => {
    setDarkMode(!!value);
    localStorage.setItem('darkMode', value.toString());
    f7.setDarkMode(!!value);
  };

  const handleBitrate = (value: string): void => {
    setBitrate(value);
    localStorage.setItem('bitrate', value);
  };

  return (
    <Page>
      <Navbar title="Настройки" backLink />
      <BlockTitle>Битрейт</BlockTitle>
      <List strong inset>
        <ListItem
          radio
          radioIcon="start"
          title="128 кбит/с"
          checked={bitrate === '128'}
          onChange={() => {
            handleBitrate('128');
          }}
        />
        <ListItem
          radio
          radioIcon="start"
          title="32 кбит/с"
          checked={bitrate === '32'}
          onChange={() => {
            handleBitrate('32');
          }}
        />
      </List>
      <BlockTitle>Тема</BlockTitle>
      <List strong inset>
        <ListItem
          radio
          radioIcon="start"
          title="Светлая"
          checked={!darkMode}
          onChange={() => {
            handleThemeChange(0);
          }}
        />
        <ListItem
          radio
          radioIcon="start"
          title="Тёмная"
          checked={darkMode}
          onChange={() => {
            handleThemeChange(1);
          }}
        />
      </List>
    </Page>
  );
};

export default Settings;
