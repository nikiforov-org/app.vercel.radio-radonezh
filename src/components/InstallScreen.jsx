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
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const checkIfInstalled = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            setIsInstalled(isStandalone);
        };

        checkIfInstalled();

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', checkIfInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', checkIfInstalled);
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

    const openApp = () => {
        window.location.href = window.location.origin;
    };

    return (
        <Popup opened tabletFullscreen>
            <View>
                <Page>
                    <NavBar />
                    <Block>
                        {isInstalled ? (
                            <>
                                <p>Приложение уже установлено</p>
                                <Button onClick={openApp} fill round>
                                    Открыть
                                </Button>
                            </>

                        ) : (
                            <>
                                {isInstallable ? (
                                    <>
                                        <p>Установить приложение на главный экран</p>
                                        <Button onClick={handleInstallClick} fill round>
                                            Установить
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <p>Приложение уже установлено или установка недоступна</p>
                                    </>
                                )}
                            </>
                        )}
                    </Block>
                </Page>
            </View>
        </Popup>
    );
};

export default InstallScreen;
