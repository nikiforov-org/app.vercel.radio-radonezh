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
        <Page name="radio" ptr ptrMousewheel={true} onPtrRefresh={getData}>
            <NavBar />
            <Card content="This is a simple card with plain text, but cards can also contain their own header, footer, list view, image, or any other element." />
        </Page>
    )
};
export default Radio;