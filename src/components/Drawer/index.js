import { h } from 'preact';
import DrawerItem from '../DrawerItem';
import DrawerContainer from '../DrawerContainer';

const Drawer = ({ isOpen, toggleDrawer }) => (
    <DrawerContainer isOpen={isOpen} toggleDrawer={toggleDrawer}>
        <DrawerItem href="/" icon="home" label="Home" />
    </DrawerContainer>
);

export default Drawer;
