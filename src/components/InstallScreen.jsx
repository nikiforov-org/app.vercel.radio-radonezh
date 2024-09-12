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
    CardFooter
} from 'framework7-react';

const InstallScreen = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIphone, setIsIphone] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const checkIfIphone = () => {
            const isIphoneDevice = /iPhone/i.test(navigator.userAgent) || /iPhone/i.test(navigator.platform);
            setIsIphone(isIphoneDevice);
        };

        checkIfIphone();
    }, []);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
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

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            const promptEvent = deferredPrompt;
            promptEvent.prompt();
            const choiceResult = await promptEvent.userChoice;
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
        <Popup opened tabletFullscreen={!(!isInstalled && !isInstallable && !isIphone)}>
            <View>
                <Page>
                    <Navbar title={`${(!isInstalled && !isInstallable && !isIphone) ? '' : 'Установка '}PWA «Радонеж»`}>
                        {!isInstallable && (
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
                                    PWA «Радонеж» — это прогрессивное веб-приложение, которое благодаря современным технологиям
                                    может работать на разных устройствах и не зависит от магазинов приложений.
                                </p>
                                {(isInstallable || isIphone) && (<p>Установите его на свой телефон, чтобы легко и удобно слушать любимые передачи!</p>)}
                                {isIphone && (
                                    <>
                                        <br />
                                        <ol>
                                            <li>
                                                <p>Нажмите кнопку «Поделиться»</p>
                                                <Block className='display-flex justify-content-center'>
                                                    <Icon f7="square_arrow_up" style={{ marginInlineEnd: '40px' }} />
                                                </Block>
                                            </li>
                                            <li>
                                                <p>Выберите «На экран “Домой”»</p>
                                                <Block className='display-flex justify-content-center'>
                                                    <Icon f7="plus_square" style={{ marginInlineEnd: '40px' }} />
                                                </Block>
                                            </li>
                                            <li>
                                                <p>Нажмите «Добавить» в правом верхнем углу</p>
                                            </li>
                                        </ol>
                                        <br />
                                        <p className='text-align-center'>Готово! Теперь приложение «Радонеж» установлено на главный экран.</p>
                                    </>
                                )}
                                {(isInstalled && !isIphone) && (
                                    <>
                                        <p>Поздравляем, приложение установлено на Ваше устройство!</p>
                                    </>
                                )}
                                {(!isInstalled && !isInstallable && !isIphone) && (
                                    <>
                                        <p>Нажмите «<Icon f7="xmark" size={16} />» в правом верхнем углу, чтобы продолжить в браузере.</p>
                                    </>
                                )}
                            </CardContent>
                            {(isInstallable && !isIphone && !isInstalled) && (
                                <CardFooter className='justify-content-center'>
                                    <Button onClick={handleInstallClick} fill round>Установить</Button>
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
