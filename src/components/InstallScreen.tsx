import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  Popup,
  Page,
  Block,
  Icon,
  Navbar,
  NavRight,
  Link,
  Card,
  CardContent,
  CardFooter,
} from 'framework7-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallScreen: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIphone, setIsIphone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkIfIphone = () => {
      const isIphoneDevice = /iPhone/i.test(navigator.userAgent);
      setIsIphone(isIphoneDevice);
    };

    checkIfIphone();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const handleAppInstalled = () => {
      console.log('PWA установлено');
      setIsInstalled(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async (): Promise<void> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA установка принята');
      } else {
        console.log('PWA установка отклонена');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <Popup opened tabletFullscreen={isInstalled || isInstallable || isIphone}>
      <View>
        <Page>
          <Navbar title={`PWA «Радонеж»`}>
            {!(isInstalled || isInstallable || isIphone) && (
              <NavRight>
                <Link popupClose>
                  <Icon f7="xmark"></Icon>
                </Link>
              </NavRight>
            )}
          </Navbar>
          <Block>
            <Card>
              <CardContent>
                <p>
                  PWA «Радонеж» — это прогрессивное веб-приложение, которое может работать на
                  различных устройствах и не зависит от магазинов приложений.
                </p>
                {(isInstallable || isIphone) && (
                  <p>
                    Установите его на своё устройство, чтобы легко и удобно слушать любимые
                    передачи!
                  </p>
                )}
                {isIphone && (
                  <>
                    <br />
                    <ol>
                      <li>
                        <p>Нажмите кнопку «Поделиться»</p>
                        <Block className="display-flex justify-content-center">
                          <Icon f7="square_arrow_up" style={{ marginInlineEnd: '40px' }} />
                        </Block>
                      </li>
                      <li>
                        <p>Выберите «На экран “Домой”»</p>
                        <Block className="display-flex justify-content-center">
                          <Icon f7="plus_square" style={{ marginInlineEnd: '40px' }} />
                        </Block>
                      </li>
                      <li>
                        <p>Нажмите «Добавить» в правом верхнем углу</p>
                      </li>
                    </ol>
                    <br />
                    <p className="text-align-center">
                      Готово! Теперь PWA «Радонеж» установлено на главный экран.
                    </p>
                  </>
                )}
                {isInstalled && !isIphone && (
                  <p className="text-align-center">
                    Готово! Теперь PWA «Радонеж» установлено на главный экран.
                  </p>
                )}
              </CardContent>
              {isInstallable && !isIphone && !isInstalled && (
                <CardFooter className="justify-content-center">
                  <Button onClick={() => void handleInstallClick()} fill round>
                    Установить
                  </Button>
                </CardFooter>
              )}
              {isInstalled && window.matchMedia('(display-mode: standalone)').matches && (
                <CardFooter className="justify-content-center">
                  <Button popupClose fill round>
                    Начать
                  </Button>
                </CardFooter>
              )}
              {!(isInstalled || isInstallable || isIphone) && (
                <CardFooter className="justify-content-center">
                  <Button popupClose fill round>
                    Продолжить в браузере
                  </Button>
                </CardFooter>
              )}
            </Card>
          </Block>
        </Page>
      </View>
    </Popup>
  );
};

export default InstallScreen;
