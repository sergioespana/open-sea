import { h } from 'preact';
import DrawerDivider from '../DrawerDivider';
import DrawerItem from '../DrawerItem';
import DrawerContainer from '../DrawerContainer';

const Drawer = ({ isOpen, toggleDrawer }, { services: { AuthService } }) => (
	<DrawerContainer isOpen={isOpen} toggleDrawer={toggleDrawer}>
		<DrawerDivider />
		<DrawerItem href="/" icon="home" label="Home" />
		<DrawerItem href="/validator" icon="playlist_add_check" label="Validator" />
		<DrawerDivider />
		<button onClick={AuthService.logout}>Logout</button>
	</DrawerContainer>
);

export default Drawer;
