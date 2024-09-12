import React from 'react';
import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    NavTitleLarge,
    NavRight,
    Link,
    Toolbar,
    Block,
    BlockTitle,
    List,
    ListItem,
    Button,
    Card
} from 'framework7-react';
import NavBar from '../components/NavBar';

const getData = () => {
    return;
}

const Radio = () => {

    return (
        <Page ptr ptrMousewheel={true} onPtrRefresh={getData}>
            <Card content="Radio" />
        </Page>
    )
};
export default Radio;