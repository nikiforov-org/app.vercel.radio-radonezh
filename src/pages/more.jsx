import React from 'react';
import {
    Block,
    List,
    ListItem,
    Icon
} from 'framework7-react';

const share = () => {
    return;
}

const More = () => {

    return (
        <Block>
            <List dividers outline strong inset>
                <ListItem title='Поделиться' click={share}>
                    <Icon slot='media' f7='arrowshape_turn_up_right' />
                </ListItem>
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
    )
};
export default More;