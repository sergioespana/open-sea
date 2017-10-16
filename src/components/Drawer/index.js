import { h } from 'preact';
import DrawerDivider from '../DrawerDivider';
import DrawerItem from '../DrawerItem';
import DrawerContainer from '../DrawerContainer';

const Drawer = ({ isOpen, toggleDrawer }, { services: { AuthService } }) => (
	<DrawerContainer isOpen={isOpen} toggleDrawer={toggleDrawer}>
		<DrawerDivider />
		<DrawerItem href="/" icon="dashboard" label="Dashboard" />
		<DrawerDivider />
		<button onClick={AuthService.logout}>Logout</button>
	</DrawerContainer>
);

export default Drawer;
