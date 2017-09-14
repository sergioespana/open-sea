import { h } from 'preact';
import DrawerDivider from '../DrawerDivider';
import DrawerItem from '../DrawerItem';
import DrawerContainer from '../DrawerContainer';

const Drawer = ({ isOpen, toggleDrawer }) => (
	<DrawerContainer isOpen={isOpen} toggleDrawer={toggleDrawer}>
		<DrawerDivider />
		<DrawerItem href="/" icon="home" label="Home" />
	</DrawerContainer>
);

export default Drawer;
