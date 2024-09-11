import React, { useEffect, useState } from 'react';
import {
    View,
    Button,
    Popup,
    Page,
    Block
} from 'framework7-react';
import NavBar from './NavBar';

const InstallScreen = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIphone, setIsIphone] = useState(false);

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
        <Popup opened tabletFullscreen>
            <View>
                <Page>
                    <NavBar />
                    <Block>
                        {isInstallable ? (
                            <Button onClick={handleInstallClick} fill round>
                                Установить
                            </Button>
                        ) : (
                            isIphone ? (
                                <>
                                    <ol>
                                        <li>Нажмите кнопку «Поделиться» <Icon f7="square_arrow_up"></Icon></li>
                                        <li>Выберите «На экран “Домой”» <Icon f7="plus_square"></Icon></li>
                                        <li>Нажмите «Добавить» в правом верхнем углу</li>
                                    </ol>
                                    <p>Готово! Теперь приложение «Радонеж» установлено на главный экран.</p>
                                </>
                            ) : (
                                <>
                                    <p>Приложение уже установлено или установка недоступна</p>
                                </>
                            )
                        )}
                    </Block>
                </Page>
            </View>
        </Popup>
    );
};

export default InstallScreen;
