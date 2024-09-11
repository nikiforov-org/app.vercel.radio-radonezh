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
                            <p>Приложение уже установлено или установка недоступна</p>
                        )}
                    </Block>
                </Page>
            </View>
        </Popup>
    );
};

export default InstallScreen;
