import React, { useState, useEffect } from 'react';
import {
    Block,
    List,
    ListItem,
    Icon
} from 'framework7-react';

const More = () => {
    const [isShareSupported, setIsShareSupported] = useState(false);

    useEffect(() => {
        if (navigator.share) {
            setIsShareSupported(true);
        }
    }, []);

    const share = () => {
        if (navigator.share) {
            navigator.share({
                title: 'PWA «Радонеж»',
                text: 'Прогрессивное веб-приложение, которое может работать на различных устройствах и не зависит от магазинов приложений. \
                    Установите его на своё устройство, чтобы легко и удобно слушать любимые передачи!',
                url: window.location.href,
            })
                .then(() => {
                    f7.dialog.alert('Успешно поделились');
                })
                .catch((error) => {
                    f7.dialog.alert(`Ошибка при попытке поделиться: ${error}`);
                });
        }
    };

    return (
        <Block>
            <List strong inset>
                {isShareSupported && (
                    <ListItem title='Поделиться' onClick={share}>
                        <Icon slot='media' f7='arrowshape_turn_up_right' />
                    </ListItem>
                )}
                <ListItem title='Перейти на сайт' href='https://radonezh.ru' target='_blank' external>
                    <Icon slot="media" f7="globe" />
                </ListItem>
                <ListItem title='Настройки' link='/settings/'>
                    <Icon slot="media" f7="gear" />
                </ListItem>
                <ListItem title='О приложении' link='/about/'>
                    <Icon slot="media" f7="info_circle" />
                </ListItem>
            </List>
        </Block>
    );
};

export default More;
