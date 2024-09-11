import React, { useEffect, useState } from 'react';

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
        <div id="InstallScreen">
            <h1>Добро пожаловать в наше приложение!</h1>
            {isInstallable && (
                <button onClick={handleInstallClick}>
                    Установить приложение на главный экран
                </button>
            )}
        </div>
    );
};

export default InstallScreen;
