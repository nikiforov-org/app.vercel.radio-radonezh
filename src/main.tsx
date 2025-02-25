import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Import Framework7
import Framework7 from 'framework7/lite-bundle';
// Import Framework7-React Plugin
import Framework7React from 'framework7-react';
// Import Framework7 Styles
import './assets/framework7.less';
import './assets/icons.scss';
import './assets/customStyles.scss';
import App from './App.tsx';

// Импортируем переопределение localStorage, чтобы оно сработало до использования хука/компонентов
import './utils/localStorageOverride.ts';

// Отключаем правило ESLint, так как Framework7.use не является React-хуком
// eslint-disable-next-line react-hooks/rules-of-hooks
Framework7.use(Framework7React);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Не удалось найти корневой элемент');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
