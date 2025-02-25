// Переопределяем методы localStorage для генерации события при изменении

const originalSetItem = localStorage.setItem.bind(localStorage);
const originalRemoveItem = localStorage.removeItem.bind(localStorage);

localStorage.setItem = function (this: Storage, key: string, value: string) {
  originalSetItem.call(this, key, value);
  const event = new CustomEvent('localStorageChange', {
    detail: { key, value, type: 'setItem' },
  });
  window.dispatchEvent(event);
};

localStorage.removeItem = function (this: Storage, key: string) {
  originalRemoveItem.call(this, key);
  const event = new CustomEvent('localStorageChange', {
    detail: { key, type: 'removeItem' },
  });
  window.dispatchEvent(event);
};

export {};
